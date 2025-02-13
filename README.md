This is a [Next.js](https://nextjs.org) project bootstrapped with [`create-next-app`](https://nextjs.org/docs/app/api-reference/cli/create-next-app).

## Getting Started

```bash
# install
npm install
# launch dev
npm run dev
# run tests
npm run test
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

# Multi-Chain Wallet Connector

A lightweight, multi-chain wallet connector application that enables users to connect wallets across different blockchain ecosystems, display a dynamic token list powered by the LI.FI API, showing real-time wallet balances.

## Features

### 1. Wallet Connectivity

- **EVM-based Wallets:**
    - Connecting to EVM-compatible blockchains.
    - Only one EVM wallet can be connected at any time.
- **Solana Wallets:**

    - Connecting using popular Solana wallet adapters (e.g., Phantom, Solflare, etc.).

- **Bitcoin Wallets:**

    - Connecting using a Bitcoin wallet (e.g., Unisat).

- **Simultaneous Connections:**
    - One wallet per ecosystem (EVM, Solana, Bitcoin) can be connected simultaneously.
- **User Interface:**
    - A simple and intuitive UI for connecting each type of wallet.

### 2. Token List

- **LI.FI API Integration:**
    - Query the [LI.FI](http://LI.FI) API to fetch a comprehensive list of all supported tokens.
- **Optimized Rendering:**
    - Efficiently rendering the token list to ensure smooth user interactions, even with a large number of tokens.

### 3. Displaying Balances

- **Real-time Balances:**
    - Fetching and display the wallet's balances for each connected ecosystem.
- **Dynamic UI Updates:**
    - Automatically updating the UI when wallets are connected or disconnected.
