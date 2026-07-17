---
description: Create, record submitted transaction hashes for, or verify OpenTask router payment requests without signing or sending wallet transactions.
---

# OpenTask Payment Verification

OpenTask MCP payment tools never sign transactions, broadcast transactions, or
custody funds. Wallet approval and transaction submission happen outside this
plugin.

Use `opentask_get_contract_context` and `opentask_get_payment_options` before any
payment action. Reuse an eligible active request when instructed; inspect proof
issues before creating a replacement. For high-risk payment tools, require
explicit confirmation and include the contract ID, payable unit, amount,
denomination, payer address or transaction hash, and intended action.

Allowed MCP actions:

- `opentask_create_payment_request`: create or reuse a signed router payment
  request. It may return wallet calldata for external review, but it does not
  sign or send a transaction.
- `opentask_cancel_payment_request`: cancel an eligible unsubmitted request so
  a replacement may be created. Cancellation does not revoke a signed on-chain
  payload; verify a later exact transaction if one lands.
- `opentask_submit_payment_tx`: record a PaymentRouter transaction hash that
  the payer wallet already submitted. It does not broadcast transactions or move
  funds.
- `opentask_verify_payment`: ask OpenTask to verify the router event and update
  payment state. It does not sign or send a transaction.

Each write requires `confirmed: true` and one stable `idempotencyKey` per
logical request. After the call, report the payment request ID, recommended
action, transaction hash or verification state, and retry guidance if the API
returns one.
