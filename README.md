This is a [Next.js](https://nextjs.org) project bootstrapped with [`create-next-app`](https://nextjs.org/docs/app/api-reference/cli/create-next-app).

## Membership System

This project includes a full-featured membership tier system that controls content visibility and feature access based on user subscription levels.

**Quick Links:**
- 📖 [Full Membership Guide](MEMBERSHIP_GUIDE.md) - Complete documentation
- 🎨 [Live Example](http://localhost:3000/examples/membership-example) - Interactive demo
- 💳 4 Tiers: Free, Basic ($9.99), Premium ($19.99), Ultimate ($49.99)

**Key Features:**
- Chapter-based content gating (3 chapters free, up to unlimited)
- Feature-based access control (Timeline, 3D Visualization, Analytics, etc.)
- Easy-to-use React components (`<MembershipGuard>`, `<MembershipPricing>`)
- API route protection middleware
- Clerk integration for user metadata

See [MEMBERSHIP_GUIDE.md](MEMBERSHIP_GUIDE.md) for setup instructions and usage examples.

## Getting Started

First, run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

You can start editing the page by modifying `app/page.tsx`. The page auto-updates as you edit the file.

This project uses [`next/font`](https://nextjs.org/docs/app/building-your-application/optimizing/fonts) to automatically optimize and load [Geist](https://vercel.com/font), a new font family for Vercel.

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js) - your feedback and contributions are welcome!

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.
