import { CovalentClient } from "@covalenthq/client-sdk";
import { default as prisma } from "@/lib/prisma";
import { NextRequest, NextResponse } from "next/server";

const client = new CovalentClient(
  process.env.COVALENT_KEY || "cqt_rQgT9BXRBDhgX9MFXWryww6Dfj8q"
);

export async function POST(request: NextRequest) {
  const { wallets } = await request.json();
  if (wallets) {
    const usersCreated: string[] = [];
    for (const wallet of wallets) {
      // todo: check if user exists

      // if not, create them
      const user = await prisma.User.create({
        data: {
          wallet: wallet,
        },
      });
      usersCreated.push(user.uid);
      const resp =
        await client.BalanceService.getHistoricalPortfolioForWalletAddress(
          "eth-mainnet",
          wallet,
          { quoteCurrency: "USD", days: 30 }
        );

      for (const token of resp.data.items) {
        if (
          token.holdings[0].close.quote ||
          token.holdings[7].close.quote ||
          token.holdings[30].close.quote
        ) {
          await prisma.Holdings.create({
            data: {
              userId: user.uid,
              ticker: token.contract_name,
              value0d: token.holdings[0].close.quote,
              value7d: token.holdings[7].close.quote,
              value30d: token.holdings[30].close.quote,
            },
          });
        }
      }
    }
    return NextResponse.json({
        "status": "success",
        "message": "Processed wallet data successfully",
        "details": {
          "usersCreated": usersCreated,
        }
      }, { status: 201 });
  }
  return NextResponse.json({ Status: "Failed. No wallets" }, { status: 400 });
}
