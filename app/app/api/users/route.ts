import { CovalentClient } from "@covalenthq/client-sdk";
import { default as prisma } from "@/lib/prisma";
import { NextRequest, NextResponse } from "next/server";
import fetch from "node-fetch";

const client = new CovalentClient(
  process.env.COVALENT_KEY || "cqt_rQgT9BXRBDhgX9MFXWryww6Dfj8q"
);

export async function POST(request: NextRequest) {
  const { wallets } = await request.json();
  if (wallets) {
    const usersCreated: string[] = [];
    for (const wallet of wallets) {
      let user = await prisma.User.findUnique({
        where: {
          wallet: wallet,
        },
      });
      if (!user) {
        const user = await prisma.User.create({
          data: {
            wallet: wallet,
          },
        });
        usersCreated.push(user.uid);
      }
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

      // Fetch risk score and risk profile from Spectral Finance API
      const spectralResponse = await fetch(
        `https://api.spectral.finance/api/v1/addresses/${wallet}/calculate_score`,
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${process.env.SPECTRAL_API_KEY}`,
          },
          method: "POST",
        }
      );

      if (!spectralResponse.ok) {
        console.log(spectralResponse.statusText, {
          status: spectralResponse.status,
        });
      }
      const spectralScoreResponse = await fetch(
        `https://api.spectral.finance/api/v1/addresses/${wallet}`,
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${process.env.SPECTRAL_API_KEY}`,
          },
          method: "GET",
        }
      );

      if (!spectralScoreResponse.ok) {
        console.log(spectralResponse.statusText, {
          status: spectralResponse.status,
        });
      }

      const spectralData = await spectralScoreResponse.json();
      console.log(spectralData);

      if (!spectralData) {
        return new Response("Score could not be calculated", { status: 404 });
      }

      if (spectralData.score && spectralData.risk_level) {
        await prisma.User.update({
          where: { uid: user.uid },
          data: {
            riskScore: spectralData.score,
            riskLevel: spectralData.risk_level,
          },
        });
      }
    }
    return NextResponse.json(
      {
        status: "success",
        message: "Processed wallet data successfully",
        details: {
          usersCreated: usersCreated,
        },
      },
      { status: 201 }
    );
  }
  return NextResponse.json({ Status: "Failed. No wallets" }, { status: 400 });
}
