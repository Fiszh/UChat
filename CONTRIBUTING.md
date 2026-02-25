# Contributing

Contributions are welcome! If you have a feature suggestion or found a bug, feel free to create a pull request or an issue.

⚠️ Note

> The core API is **not open source yet**, so you won’t have access to it.  
> If your contribution relates to adding a bot to the bot list, please check that your bot isn’t already detected.  
> I reserve the right to not accept any pull request without explanation.

## Guidelines

Changes must not negatively impact performance. If a PR affects rendering, networking, or runtime behavior, explain why and provide reasoning.

Do not introduce anything that slows down or breaks the overlay.

Do not introduce any form of user tracking.

Follow the existing code style and structure. Do not reformat unrelated code in your PR.

Keep pull requests focused. One feature or fix per PR.

Any new dependency must be justified. Explain why it’s necessary and why a native solution isn’t sufficient.

Keep the code clean and focused. No bloat.

## Developing

Make sure you have [bun](https://bun.com/).

To install all dependencies, run `bun install` in the app folder.

To start the development server:

```bash
bun run dev
```
