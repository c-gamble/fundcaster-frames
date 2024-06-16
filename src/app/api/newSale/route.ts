import { Abi, encodeFunctionData, parseEther } from "viem";
import {
  FrameRequest,
  FrameTransactionResponse,
} from "@coinbase/onchainkit/frame";
import { NextRequest, NextResponse } from "next/server";
import FlatPriceSaleFactory_v_2_1 from "@/constants/FlatPriceSaleFactory_v_2_1.json";
import axios from "axios";

async function getResponse(req: NextRequest): Promise<NextResponse> {
  const body: FrameRequest = await req.json();

  const state = JSON.parse(decodeURIComponent(body.untrustedData.state));

  const response = await axios.get(
    `https://api${
      process.env.CHAIN_ID == "84532" ? "-sepolia" : ""
    }.basescan.org/api?module=contract&action=getcontractcreation&contractaddresses=${
      state.contractAddress
    }&apikey=${process.env.BASE_SCAN_API_KEY}`
  );
  const userAddress = response.data.result[0].contractCreator;
  const data = encodeFunctionData({
    abi: FlatPriceSaleFactory_v_2_1.abi,
    functionName: "newSale",
    args: [
      userAddress,
      [
        "0xC4BFc1Ad6dbB85191867a6E0f9dA2EA1668B5a6F", // TODO: this should be a treasury
        "0x0000000000000000000000000000000000000000000000000000000000000000",
        // new Uint8Array([ 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, ]),
        BigInt(1000000000) * BigInt(10 ** 18),
        BigInt(1000000000) * BigInt(10 ** 18),
        BigInt(0),
        Math.floor(Date.now() / 1000),
        Math.floor(Date.now() / 1000) + 86400,
        0,
        "this should be a uri",
      ],
      "USD",
      true,
      // TODO: parameterize this by network
      "0x4aDC67696bA383F43DD60A9e78F2C97Fbbfc7cb1", // pulled from https://docs.chain.link/data-feeds/price-feeds/addresses?network=base&page=1
      [
        // TODO: parameterize this by network
        "0x036cbd53842c5426634e7929541ec2318f3dcf7e", // pulled from https://developers.circle.com/stablecoins/docs/usdc-on-test-networks
      ],
      // TODO: parameterize this by network
      ["0xd30e2101a97dcbAeBCBC04F14C3f624E67A35165"],
      [18],
      // state.name, state.ticker, BigInt(state.supply.toString()) * BigInt(10 ** 18), process.env.FEE_DEPOSIT_ADDRESS
    ],
  });

  const txData: FrameTransactionResponse = {
    chainId: `eip155:${process.env.CHAIN_ID}`,
    method: "eth_sendTransaction",
    params: {
      abi: FlatPriceSaleFactory_v_2_1.abi as Abi,
      data,
      to: process.env.FLAT_PRICE_SALE_FACTORY_ADDRESS as `0x${string}`,
      value: parseEther("0").toString(),
    },
  };

  return NextResponse.json(txData);
}

export async function POST(req: NextRequest): Promise<Response> {
  return getResponse(req);
}

export const dynamic = "force-dynamic";
