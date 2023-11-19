import { CovalentClient } from "@covalenthq/client-sdk";

const client = new CovalentClient(
  process.env.COVALENT_KEY || "cqt_rQgT9BXRBDhgX9MFXWryww6Dfj8q"
);


export async function getWalletTokenHoldings(walletAddress: string) {
  const response = await client.BalanceService.getHistoricalPortfolioForWalletAddress(
    "eth-mainnet",
    walletAddress,
    { quoteCurrency: "USD", days: 30 }
  );

  return response.data.items;
}
