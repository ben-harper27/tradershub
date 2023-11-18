import { default as prisma } from "@/lib/prisma";
import { NextRequest, NextResponse } from "next/server";
import { getWalletTokenHoldings } from "@/lib/covalent";
import { getWalletRiskScores } from "@/lib/spectral";

export async function POST(request: NextRequest) {
  const { wallets } = await request.json();
  if (!wallets) {
    return NextResponse.json(
      { Status: "Missing wallet addresses" },
      { status: 400 }
    );
  }
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
    const tokenHoldings = await getWalletTokenHoldings(wallet);

    for (const token of tokenHoldings) {
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

    const { riskScore, riskLevel } = await getWalletRiskScores(wallet);

    if (riskScore && riskLevel) {
      await prisma.User.update({
        where: { uid: user.uid },
        data: {
          riskScore,
          riskLevel,
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
