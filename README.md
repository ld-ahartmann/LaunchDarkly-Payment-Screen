# LaunchDarkly Payment Screen Demo

A Next.js 15 application that demonstrates how LaunchDarkly feature flags can toggle a **new payment experience** on or off.

---

## Features

- **Feature flag:** `new-payment-screen` (controlled client-side).
- **LaunchDarkly SDK:** [launchdarkly-js-client-sdk](https://docs.launchdarkly.com/sdk/client-side/javascript/react/options).
- **UI components:** Tailwind CSS and shadcn/ui.
- **Simulated fallback:** If LaunchDarkly credentials are missing, the flag toggles automatically for demonstration purposes.

---

## Prerequisites

1. **Node.js ≥ 18** (18 LTS recommended). You can check with:
   ```bash
   node -v
   ```
2. **npm** (comes with Node) or **pnpm** if you prefer. All commands below use `npm`—swap for `pnpm` if needed.
3. A **LaunchDarkly account** (free trial is fine) with a *client-side ID* for your environment.

---

## Quick Start

```bash
# 1. Clone the repo
$ git clone https://github.com/your-org/LaunchDarkly-Payment-Screen.git
$ cd LaunchDarkly-Payment-Screen

# 2. Install dependencies
$ npm install            # or: pnpm install

# 3. Configure LaunchDarkly (see next section)

# 4. Run the dev server
$ npm run dev            # http://localhost:3000

# 5. Toggle the flag in LaunchDarkly
#    Navigate to your project → Flags → new-payment-screen → turn on/off
```

---

## Configuration

The project expects a **client-side environment key** at runtime. To keep secrets out of version control we use a small TypeScript config file that’s listed in `.gitignore`.

1. **Create the folder & file** (if it doesn’t exist):
   ```bash
   mkdir -p config
   touch config/launchdarkly.ts
   ```

2. **Add your key** to `config/launchdarkly.ts`:
   ```ts
   // config/launchdarkly.ts
   export const LD_CLIENT_ID = "YOUR_CLIENT_SIDE_ID_HERE";
   ```
   - Find the key in **LaunchDarkly → Account settings → Projects → Environments**.
   - It is *not* an SDK key. Look for **Client-side ID**.

3. **Verify `.gitignore`** already contains:
   ```text
   config/launchdarkly.ts
   ```
   This prevents you from accidentally committing the credential.

> **No key yet?** The app will fall back to a simulated flag that flips every 10 seconds so you can observe both UI states.

---

## Building for Production

```bash
# Ensure deps are installed
npm install

# Create an optimized Next.js build
npm run build

# Start the production server on port 3000
npm run start
```

---

## Tech Stack

- **Next.js 15** / React 18
- **LaunchDarkly JS Client SDK**
- **Tailwind CSS** & **shadcn/ui**
- **TypeScript** (strict mode)

---

## Further Reading

- LaunchDarkly docs: <https://docs.launchdarkly.com>
- JS Client SDK guide: <https://docs.launchdarkly.com/sdk/client-side/javascript>
- Feature flag best practices: <https://docs.launchdarkly.com/home/best-practices>

---

## © License

MIT – Use this demo freely and modify as you wish.
