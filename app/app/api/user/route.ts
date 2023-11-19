import { getWalletTokenHoldings } from "@/lib/covalent";
import prisma from "@/lib/prisma";
import { getWalletRiskScores } from "@/lib/spectral";
import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
  const { wallet } = await request.json();
  if (!wallet) {
    return NextResponse.json(
      { message: "Missing wallet address" },
      { status: 400 }
    );
  }
  let user = await prisma.user.findUnique({
    where: {
      wallet: wallet,
    },
  });
  if (user) {
    return NextResponse.json(
      { message: "User already exists" },
      { status: 409 }
    );
  }
  const { riskScore, riskLevel } = await getWalletRiskScores(wallet);

  if (riskScore && riskLevel) {
    user = await prisma.user.create({
      data: {
        wallet: wallet,
      },
    });
  } else {
    user = await prisma.user.create({
      data: {
        wallet: wallet,
      },
    });
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
  return NextResponse.json(
    {
      status: "success",
      message: "User created successfully",
      details: {
        userCreated: user.uid,
      },
    },
    { status: 201 }
  );
}
