"""Infrastructure layer — external integrations, gateways, metrics, WebSocket.

Contains adapters for external systems and infrastructure concerns:

- gateways: Payment gateway simulators (Stripe, Razorpay, PayPal, UPI, Bank)
- metrics: Prometheus counters, histograms, and gauges
- realtime: WebSocket ConnectionManager with channel-based pub/sub
- webhooks: Gateway-specific webhook payload parsers
"""
