import pytest
from httpx import AsyncClient


@pytest.mark.asyncio
async def test_create_transaction(client: AsyncClient):
    await client.post("/api/v1/auth/signup", json={
        "email": "txn@example.com",
        "password": "TestPass123",
        "full_name": "Txn User",
    })
    login_resp = await client.post("/api/v1/auth/login", json={
        "email": "txn@example.com",
        "password": "TestPass123",
    })
    token = login_resp.json()["access_token"]
    client.headers["Authorization"] = f"Bearer {token}"

    response = await client.post("/api/v1/transactions", json={
        "transaction_ref": "TXN-TEST-001",
        "amount": 1000.0,
        "currency": "INR",
        "description": "Test payment",
    })
    assert response.status_code == 201
    data = response.json()
    assert data["transaction_ref"] == "TXN-TEST-001"
    assert data["status"] == "created"


@pytest.mark.asyncio
async def test_list_transactions(client: AsyncClient):
    await client.post("/api/v1/auth/signup", json={
        "email": "list@example.com",
        "password": "TestPass123",
        "full_name": "List User",
    })
    login_resp = await client.post("/api/v1/auth/login", json={
        "email": "list@example.com",
        "password": "TestPass123",
    })
    token = login_resp.json()["access_token"]
    client.headers["Authorization"] = f"Bearer {token}"

    await client.post("/api/v1/transactions", json={
        "transaction_ref": "TXN-TEST-002",
        "amount": 500.0,
        "currency": "INR",
    })
    response = await client.get("/api/v1/transactions")
    assert response.status_code == 200
    data = response.json()
    assert "items" in data
    assert data["total"] >= 1
