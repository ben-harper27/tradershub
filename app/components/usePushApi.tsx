// Import Push SDK & Ethers
import { PushAPI, CONSTANTS } from "@pushprotocol/restapi";
import { ethers } from "ethers";
import { useWalletClient } from "wagmi";

export async function initPush(signer : ethers.providers.JsonRpcSigner) {

  // Initialize wallet user
  // 'CONSTANTS.ENV.PROD' -> mainnet apps | 'CONSTANTS.ENV.STAGING' -> testnet apps

  const userAlice =  await PushAPI.initialize(signer as any, { env: CONSTANTS.ENV.STAGING });

  // To listen to real time notifications
  //const stream = await userAlice.initStream([CONSTANTS.STREAM.NOTIF]);
  const chainID = process.env.NEXT_PUBLIC_CHAIN_ID || "11155111";
  const pushChannelAdress = process.env.NEXT_PUBLIC_CHANNEL_ADDRESS || "0x342E8bf072327708009FAa2E9045D9B1F6deC2b8";

  const response = await userAlice.notification.subscribe(
    `eip155:${chainID}:${pushChannelAdress}`,
  );

  // // Set stream event handling
  // stream.on(CONSTANTS.STREAM.NOTIF, (data) => {
  //   console.log(data);
  // });

  // Connect to stream
  //stream.connect();

  return userAlice;
}