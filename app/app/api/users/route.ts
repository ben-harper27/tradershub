import { type NextRequest } from 'next/server'
import { CovalentClient } from "@covalenthq/client-sdk";
import {default as prisma} from '@/lib/prisma';
 
export async function POST(request: Request) {
    const res = await request.json()
    const data = JSON.parse(JSON.stringify(res));
    if(data) {        
        for (const wallet of data.wallets) {
            if(process.env.COVALENT_KEY) {
                // todo: check if user exists
                            
                // if not, create them
                const user = await prisma.User.create({
                    data: {
                        wallet: wallet
                    }
                });
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
            }
        }
        return Response.json({ 'Status': 'success' })
    }

    return Response.json({ 'Status': 'Failed. No wallets' })
  }