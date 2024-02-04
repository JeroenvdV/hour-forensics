# Hour Forensics

A member of your organisation is suddenly ill or leaves, and their time logs are not entirely up-to-date. Not being able to bill clients for their work would be a devastating issue on top of the loss of productivity you're already suffering. These tools aim to help you make a sensible estimation of time logs from sources such as Google Calendar.

## Prerequisites

- You have source data in one or more of the listed sources
- You want to submit the hour logs into one of the listed destinations
- Valid tasks exist or can be made in Jira

## Sources

- Google Calendar: [Supported] Via full export and subsequent manual analysis in a spreadsheet 
- Other calendars: if you can export into the right format, then you can use them.
- Google Docs history: [Future] intended for future version
- GitHub: [Future] intended for future version

## Destinations

- Everhour: [Supported]

# Development 

This is a [Next.js](https://nextjs.org/) project bootstrapped with [`create-next-app`](https://github.com/vercel/next.js/tree/canary/packages/create-next-app).

## Getting Started

First, run the development server:

```bash
pnpm dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

You can start editing the page by modifying `app/page.tsx`. The page auto-updates as you edit the file.

This project uses [`next/font`](https://nextjs.org/docs/basic-features/font-optimization) to automatically optimize and load Inter, a custom Google Font.

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js/) - your feedback and contributions are welcome!

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/deployment) for more details.
