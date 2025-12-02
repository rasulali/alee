# Development & Deployment Workflow

Solo-friendly, trunk-based flow with Vercel and GitHub Actions.

- `main` is production. It must stay green and deploys automatically to the production domain via Vercel.
- Work in short-lived branches (e.g., `feat/login-copy`, `fix/nav-scroll`). Branch off `main`.
- Push branch → GitHub Actions runs lint/tests/tsc/build; Vercel creates a Preview deployment URL.
- Open a PR from your feature branch into `main` (even as a solo dev) to get the Preview link and CI status.
- Verify changes on the Vercel Preview URL; fix as needed.
- Merge PR into `main` once CI passes and you’re satisfied. Vercel auto-deploys `main` to production.
- Keep `main` protected: require the CI workflow to pass before merge. Only hotfix directly to `main` if urgent.
