# wtf.tez Rework Stub (Post-Sync)

Date: 2026-04-27
Status: Synced and pushed. Items below are explicitly deferred rework.

## Deferred Rework Items

- [ ] Validate onboarding/wiki moderation UX regressions across updated admin/editor panels.
- [ ] Re-verify Tezos signing flow changes in `src/lib/signing.ts` with hardware wallet and injected provider variants.
- [ ] Confirm deploy scripts (`scripts/deploy-mainnet.ts`, `scripts/redeploy-ghostnet.ts`, `scripts/test-ghostnet.ts`) still map to current contract addresses/config.
- [ ] Re-run subdomain/domain tile behavior QA after current component updates.
- [ ] Add explicit release notes entry for profile/home/hackers page behavior changes.

## Operational Follow-ups

- [ ] Ensure `.env.example` updates are mirrored to secret manager runbooks.
- [ ] Verify wiki loader (`scripts/wiki/loader.mts`) idempotency against current content snapshots.

