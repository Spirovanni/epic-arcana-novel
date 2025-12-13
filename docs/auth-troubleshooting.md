## Clerk Auth Troubleshooting

- We use Clerk with the default CDN. Do **not** set `proxyUrl`, `domain`, `isSatellite`, `clerkJSUrl`, or `frontendApi` in `ClerkProvider`.
- Required env vars: `NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY`, `CLERK_SECRET_KEY`, `CLERK_WEBHOOK_SECRET` (for webhooks only).
- Do **not** set or deploy these env vars: `NEXT_PUBLIC_CLERK_FRONTEND_API`, `CLERK_FRONTEND_API`, `NEXT_PUBLIC_CLERK_PROXY_URL`, `CLERK_PROXY_URL`, `NEXT_PUBLIC_CLERK_JS_URL`, `NEXT_PUBLIC_CLERK_DOMAIN`.
- If you see requests to `clerk.<yourdomain>.com` or CORS errors loading Clerk JS, remove any custom Clerk domain overrides and redeploy.
