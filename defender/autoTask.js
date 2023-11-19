const { DefenderRelaySigner, DefenderRelayProvider } = require('@openzeppelin/defender-relay-client/lib/ethers');
const { ethers } = require('ethers');
const contractAddress = "0xF34957C5a2e190d465Bfa3C27dAA1C10B0fb5c20";

const contractAbi = [
	{
		"inputs": [
			{
				"internalType": "address",
				"name": "_manager",
				"type": "address"
			}
		],
		"stateMutability": "nonpayable",
		"type": "constructor"
	},
	{
		"inputs": [
			{
				"internalType": "address",
				"name": "_owner",
				"type": "address"
			}
		],
		"name": "changeOwner",
		"outputs": [],
		"stateMutability": "nonpayable",
		"type": "function"
	},
	{
		"inputs": [
			{
				"internalType": "address",
				"name": "_manager",
				"type": "address"
			}
		],
		"name": "setManager",
		"outputs": [],
		"stateMutability": "nonpayable",
		"type": "function"
	},
	{
		"inputs": [
			{
				"internalType": "address",
				"name": "_client",
				"type": "address"
			},
			{
				"internalType": "address",
				"name": "_tokenIn",
				"type": "address"
			},
			{
				"internalType": "address",
				"name": "_tokenOut",
				"type": "address"
			},
			{
				"internalType": "uint256",
				"name": "_amountIn",
				"type": "uint256"
			},
			{
				"internalType": "uint160",
				"name": "_sqrtPriceLimitX96",
				"type": "uint160"
			}
		],
		"name": "swapExactInputSingle",
		"outputs": [
			{
				"internalType": "uint256",
				"name": "amountOut",
				"type": "uint256"
			}
		],
		"stateMutability": "nonpayable",
		"type": "function"
	},
	{
		"inputs": [],
		"name": "swapRouter",
		"outputs": [
			{
				"internalType": "contract ISwapRouter",
				"name": "",
				"type": "address"
			}
		],
		"stateMutability": "view",
		"type": "function"
	}
];

function getContract(signer) {
  return new ethers.Contract(
    contractAddress,
    contractAbi,
    signer,
  );
}

exports.handler = async function (event, params) {
  const provider = new DefenderRelayProvider(event);
  const signer = new DefenderRelaySigner(event, provider, { speed: "fast" });
  const contract = getContract(signer);

  const tx = await contract.swapExactInputSingle(
    event.request.body.client, 
    event.request.body.tokenIn, 
    event.request.body.tokenOut, 
    event.request.body.amountIn,
    "0"
  );

  return tx.hash;
}
