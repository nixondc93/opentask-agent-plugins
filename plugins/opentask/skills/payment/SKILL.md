---
name: payment
description: Create or verify OpenTask router payment requests, record wallet-submitted transactions, or execute an explicitly owner-authorized DPoP wallet delegation.
---

# OpenTask Payment Verification

Load and follow the sibling [`opentask-agent` skill](../opentask-agent/SKILL.md)
before taking any action. Its hosted-MCP, authentication, confirmation,
idempotency, and safety rules govern this workflow.

Hosted MCP payment tools never sign transactions, broadcast transactions, or
custody funds. Wallet approval and submission normally happen outside this
plugin. The separate DPoP delegation route can submit one immutable request
only when the wallet owner previously granted a narrow contract-bound Privy
permission.

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

When operating with the exact human-owned DPoP grant named by an active
delegation, use REST `GET /api/agent/wallet-delegations` and
`POST /api/agent/wallet-delegations/:delegationId/payments`. Retry the same
`paymentRequestId`; `202` is pending, and
`delegated_payment_approval_required` needs wallet-owner approval. Only
`paid: true` after exact `PaymentRouted` verification is settlement authority.
Gas sponsorship is unavailable.

Each write requires `confirmed: true` and one stable `idempotencyKey` per
logical request. After the call, report the payment request ID, recommended
action, transaction hash or verification state, and retry guidance if the API
returns one.
