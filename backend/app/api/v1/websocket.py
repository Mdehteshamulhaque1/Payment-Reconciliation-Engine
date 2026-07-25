"""WebSocket endpoint — channel-based pub/sub using ConnectionManager."""

import json

from fastapi import APIRouter, WebSocket, WebSocketDisconnect, Query

from app.infrastructure.realtime.broadcaster import ws_manager, CHANNELS

router = APIRouter(prefix="/ws", tags=["WebSocket"])


@router.websocket("/realtime")
async def websocket_endpoint(
    ws: WebSocket,
    token: str | None = Query(default=None),
    channels: str | None = Query(default=None),
):
    channel_list = [c.strip() for c in channels.split(",")] if channels else ["transactions"]
    channel_list = [c for c in channel_list if c in CHANNELS] or ["transactions"]

    user_id = None
    if token:
        try:
            from app.core.security import decode_access_token
            payload = decode_access_token(token)
            user_id = payload.get("sub")
            if user_id is not None:
                user_id = int(user_id)
        except Exception:
            pass

    conn_id = await ws_manager.connect(ws, user_id=user_id, channels=channel_list)
    try:
        while True:
            data = await ws.receive_text()
            msg = json.loads(data) if data else {}
            event_type = msg.get("type", "ping")

            if event_type == "ping":
                await ws.send_text(json.dumps({"type": "pong"}))
            elif event_type == "subscribe":
                new_channels = msg.get("channels", [])
                new_channels = [c for c in new_channels if c in CHANNELS]
                await ws_manager.subscribe(conn_id, new_channels)
                await ws.send_text(json.dumps({"type": "subscribed", "channels": new_channels}))
            elif event_type == "unsubscribe":
                remove = msg.get("channels", [])
                await ws_manager.unsubscribe(conn_id, remove)
                await ws.send_text(json.dumps({"type": "unsubscribed", "channels": remove}))
            elif event_type == "stats":
                stats = await ws_manager.get_stats()
                await ws.send_text(json.dumps({"type": "stats", "data": stats}))
            else:
                await ws.send_text(json.dumps({"type": "ack", "original": event_type}))
    except WebSocketDisconnect:
        await ws_manager.disconnect(conn_id)


async def broadcast_event(event_type: str, data: dict):
    """Legacy compatibility — routes events into the channel-based broadcaster."""
    channel_map = {
        "transaction": "transactions",
        "fraud": "fraud_alerts",
        "settlement": "settlements",
        "gateway": "gateway_status",
        "dashboard": "dashboard",
    }
    prefix = event_type.split(".")[0] if "." in event_type else event_type
    channel = channel_map.get(prefix, "transactions")
    await ws_manager.broadcast(channel, event_type, data)
