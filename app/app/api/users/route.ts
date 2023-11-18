import { type NextRequest } from 'next/server'
import { CovalentClient } from "@covalenthq/client-sdk";
import {default as prisma} from '@/lib/prisma';
import fetch from 'node-fetch';

 
export async function POST(request: Request) {
    const res = await request.json()
    const data = JSON.parse(JSON.stringify(res));
    if(data) {        
        for (const wallet of data.wallets) {
            if(process.env.COVALENT_KEY) {
                // todo: check if user exists
                let user = await prisma.User.findUnique({
                    where: {
                        wallet: wallet
                    }
                });
                // if not, create them
                if (!user) {
                    user = await prisma.User.create({
                        data: {
                            wallet: wallet
                        }
                    });
                }
                const client = new CovalentClient(process.env.COVALENT_KEY);
                const resp = await client.BalanceService.getHistoricalPortfolioForWalletAddress("eth-mainnet", wallet, {"quoteCurrency": "USD","days": 30});
                
                for (const token of resp.data.items) {
                    if(token.holdings[0].close.quote || token.holdings[7].close.quote || token.holdings[30].close.quote) {
                        await prisma.Holdings.create({
                            data: {
                                userId: user.uid,
                                ticker: token.contract_name,
                                value0d: token.holdings[0].close.quote,
                                value7d: token.holdings[7].close.quote,
                                value30d: token.holdings[30].close.quote
                            }
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
                    },
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
                    },
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

                  // Assuming the risk score and risk profile are stored in the user model
                 if(spectralData.score && spectralData.risk_level) {
                    await prisma.User.update({
                        where: { uid: user.uid },
                        data: {
                            riskScore: spectralData.score,
                            riskLevel: spectralData.risk_level
                        }
                    });
                }

                  
            }
        }
        return Response.json({ 'Status': 'success' })
    }

    return Response.json({ 'Status': 'Failed. No wallets' })
  }