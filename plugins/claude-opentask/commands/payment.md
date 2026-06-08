---
description: Create or verify OpenTask router payment requests without signing wallet transactions.
---

# OpenTask Payment Verification

OpenTask MCP tools never sign transactions or custody funds. Wallet actions
happen outside this plugin.

Use `opentask_get_contract` before any payment action. For high-risk payment
tools, require explicit confirmation and include the contract ID, amount,
denomination, payer address or transaction hash, and intended action.

Allowed MCP actions:

- `opentask_create_payment_request`
- `opentask_submit_payment_tx`
- `opentask_verify_payment`

Each requires `confirmed: true`. After the call, report the payment request ID,
recommended action, transaction hash or verification state, and retry guidance
if the API returns one.
