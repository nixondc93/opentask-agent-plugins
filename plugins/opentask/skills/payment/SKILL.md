---
name: payment
description: Create or verify router payments, execute purchases under reusable owner-approved consent, and recover exact payments without duplicate charges.
---

# OpenTask Payments

Load and follow the sibling [`opentask-agent` skill](../opentask-agent/SKILL.md)
before taking any action. Its hosted-MCP, authentication, confirmation,
idempotency, and safety rules govern this workflow.

For contracts, read `opentask_get_contract_context` and
`opentask_get_payment_options` first. Reuse an eligible immutable request;
inspect proof issues before replacement. Hosted OAuth/API-token credentials
cannot exercise human-owned DPoP spending authority. On
`delegation_dpop_credential_required`, use the installed helper or a compatible
DPoP client; do not elevate the hosted token or repeat routine login.

Router request/external-wallet tools:

- `opentask_create_payment_request` creates/reuses a signed request, without submitting a transaction.
- `opentask_cancel_payment_request` cancels an eligible unsubmitted request; signed payloads can still land and need verification.
- `opentask_submit_payment_tx` records a hash already submitted by the payer wallet.
- `opentask_verify_payment` verifies the exact router event and updates state.

For these tools, follow confirmation metadata with `confirmed: true` and each
write schema's stable `idempotencyKey`. Confirm contract, payable unit, gross
amount including fee, denomination, payer/hash, and intended action.

Managed purchases use reusable `managed_spending` consent for the exact wallet,
human-owned grant and owner buyer profile, finite sellers, shared daily/lifetime
USDC caps, bounded gas, expiry, and optional native policy hashes. Read
`opentask_list_wallet_delegations` and `opentask_get_wallet_delegation_readiness`
with the exact `paymentRequestId`. Agents cannot enlarge consent, approve more
allowance, or refill funding. A paid hire uses `walletDelegationId` plus a stable
request key and reserves full seller-plus-fee liability; it does not fund escrow.

Use `opentask_execute_delegated_payment`, `opentask_get_delegated_payment`, and
`opentask_recover_delegated_payment` with the bound DPoP credential.
`prior_owner_mandate` authorizes ordinary purchases without a fresh human prompt;
owner-selected thresholds and `owner_action` exceptions stop the workflow.

Prefer the installed plugin's `scripts/opentask-agent-auth.mjs`, Node 22.18+.
Resolve its path through `references/protocol.md#installed-dpop-helper`; optional
`scripts/opentask-managed-mcp.mjs` setup is in `#optional-managed-mcp`. Preserve the owner-only
journal plus stable operation/key across timeout, restart, and recovery:

```bash
node "$OPENTASK_AGENT_AUTH" pay-contract --account buyer-worker --operation-id feature-001-payment --idempotency-key feature-001-payment --contract-id <contractId> --delegation-id <delegationId>
node "$OPENTASK_AGENT_AUTH" get-purchase --account buyer-worker --operation-id feature-001-payment
node "$OPENTASK_AGENT_AUTH" resume-purchase --account buyer-worker --operation-id feature-001-payment
```

Add `--milestone-id <milestoneId>` for an eligible accepted milestone and a distinct
stable operation/key. The helper does not accept delivery or approve consent.
Programmatic clients use `OpenTaskPayments` and `FilePaymentJournal`; external
wallets require an explicit implementation that durably recovers the original nonce.

Read canonical state before recovery; use its latest `stateRevision`, re-read on
`state_changed`, honor `nextCheckAt`/`Retry-After`, and stop on `owner_action`.
Unknown outcomes retain reservations; elapsed time or absent proof never permits
a replacement charge. A hash/HTTP `202` is not settlement. Exact canonical
`verified: true` with `proofAuthority: "router_payment"` authorizes contract credit;
`accountingComplete` separately reports USDC/gas reconciliation. Follow its next
action until complete. The runtime's router proof label is `router_event`.

Native x402 purchases need owner-approved policy hashes and share Base USDC
budgets. Tempo MPP needs a separate `tempo_native` permission for one network
and six-decimal TIP20 asset; charge and ceiling fee reserve that token budget.
Base consent cannot authorize Tempo; neither rail permits conversion or sponsorship.
Use native readiness and create/read/recover/output tools under prior consent.
`buy-native --input-file <privateRequestJson>` requires a regular owner-only JSON
file, mode `0600`, at most 72 KiB, with exact policy/hash, request and operation/key.
Resume that file; keep merchant bodies out of arguments, logs and journals. See
canonical `references/api-recipes.md` for complete recipes.

Native settlement and delivery are separate; adapter evidence never credits contracts.
Fetch private bytes with the same DPoP grant; output URLs are not bearer links. Keep bytes out of MCP text.
Report exact IDs, proof/accounting state, next action, and bounded retry or owner guidance.
