# Everyday Banking Demo (Vercel-ready)

A front-end-only mobile banking prototype inspired by the supplied screen references. It is deliberately branded as a fictional demo and marks all screens/receipts as **DEMO — NOT A REAL PAYMENT**. It does not connect to a bank, move money, or generate proof of an actual transaction.

## Run locally
1. Install Node.js 18+.
2. In this folder run `npm install`.
3. Run `npm run dev`.
4. Open the local URL on your phone or use your computer's responsive preview.

## Deploy to Vercel
1. Extract the ZIP and push the folder to a Git repository.
2. In Vercel, choose **Add New → Project** and import the repository.
3. Framework preset: **Vite**. Build command: `npm run build`. Output directory: `dist`.
4. Deploy. No environment variables or backend are required.

## Demo flow
- PIN: `1234`
- Login → Home → Pay → Pay someone → PayID
- Enter mobile/email/other PayID, recipient name and amount.
- Review the details, then show a clearly labelled demo receipt.
- Use the back button on screens to return. All state stays in the browser session.

## Customisation
- `src/App.jsx`: screen flow and demo data.
- `src/styles.css`: mobile-first styling and spacing.
- The status bar is simulated HTML; it is not the device's real system status bar.
