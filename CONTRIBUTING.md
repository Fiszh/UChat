# Contributing

Contributions are welcome!
</br>If you have a feature suggestion or found a bug, feel free to open a pull request or issue.
</br>Not every contribution will be awarded the contributor role and badge.

> [!WARNING]
> This repo does not include a backend. If you need API functionality, build it using the [main site repo](https://github.com/Fiszh/uniiDev).  
> The backend/API used by this site is not for personal or public use.  
> Please do not ask for API code.

> [!NOTE]
> Including new UI text in the locale files (especially in `en.json`) helps get your pull request approved and merged much quicker.

## Guidelines

- Do not negatively impact performance. If your PR affects rendering, networking, or runtime behavior, explain why.
- Do not introduce any form of user tracking.
- Follow the existing code style and structure. Do not reformat unrelated code.
- Ideally, keep PRs focused on one feature or fix. If you include multiple, clearly state each one.
- Any new dependency must be justified. Explain why a native solution isn't sufficient.
- All new designs or UI modifications must be implemented under the `/design` route.
- Everyone is fully responsible for everything they submit. Bugs, regressions, and security issues are on you. This still applies if AI tools were used.
- PRs where the code is visibly AI-generated, or where crucial logic is clearly AI, will be closed. You must understand and own what you submit. Maintainers reserve the right to decline any PR that appears AI-generated, even partially.

## Developing

Make sure you have [Bun](https://bun.com/) installed, then run the following in the `app` folder:

```bash
bun install
bun run dev
```
