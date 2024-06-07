import { FrameRequest, getFrameHtmlResponse } from '@coinbase/onchainkit/frame';
import { NextRequest, NextResponse } from 'next/server';
import { MongoClient, ServerApiVersion } from 'mongodb';
import axios from 'axios';
import { NOUNS } from './constants/nouns';
import { ADJECTIVES } from './constants/adjectives';
import { getTextColor } from '@/utils/textColor';

const delay = (ms: number) => new Promise(res => setTimeout(res, ms));

const generateResponse = (state: any, success: boolean, contractAddress: string, passphrase: string) => {

    if (success) {
        return new NextResponse(
            getFrameHtmlResponse({
                buttons: [
                    {
                        label: 'Home',
                        action: 'post',
                        target: `${process.env.NEXT_PUBLIC_SITE_URL}/api/restart`,
                    },                              
                    {
                        label: `Launch `,
                        action: 'post',
                        target: `${process.env.NEXT_PUBLIC_SITE_URL}/api/launch`,
                    },
                    {
                        label: "View On-Chain",
                        action: "link",
                        target: `https://basescan.org/token/${contractAddress}`
                    }
                ],
                image: {
                    src: `${process.env.NEXT_PUBLIC_SITE_URL}/frames/images/end?contractAddress=${contractAddress}&gradientStart=${state.gradientStart}&gradientEnd=${state.gradientEnd}`
                },
                state: {
                    ...state,
                    contractAddress: contractAddress,
                    passphrase: passphrase
                }
            })
        )
    } else {
        return new NextResponse(
            getFrameHtmlResponse({
                buttons: [
                    {
                        label: 'Restart',
                        action: 'post',
                        target: `${process.env.NEXT_PUBLIC_SITE_URL}/api/restart`,
                    },
                    {
                        label: 'Contact SOFT',
                        action: 'link',
                        target: `https://warpcast.com/thesoftdao`,
                    }                         
                ],
                image: {
                    src: `${process.env.NEXT_PUBLIC_SITE_URL}/frames/images/errors/creationError`
                },
                state: {
                    name: process.env.DEFAULT_TOKEN_NAME,
                    ticker: process.env.DEFAULT_TOKEN_TICKER,
                    logo: process.env.DEFAULT_TOKEN_LOGO,
                    gradientStart: process.env.DEFAULT_GRADIENT_START,
                    gradientEnd: process.env.DEFAULT_GRADIENT_END,
                    description: process.env.DEFAULT_TOKEN_DESCRIPTION,
                    supply: process.env.DEFAULT_INITIAL_SUPPLY,                    
                }                
            })
        )
    }

}

async function getResponse(req: NextRequest): Promise<NextResponse> {

    const body: FrameRequest = await req.json();
    const { transactionId } = body.untrustedData;
    const state = JSON.parse(decodeURIComponent(body.untrustedData.state));

    let contractAddress = "";
    let success = false;

    try {

        await delay(3000);

        const response = await axios.get(`https://api${process.env.CHAIN_ID == "84532" ? "-sepolia" : ""}.basescan.org/api?module=proxy&action=eth_getTransactionReceipt&txhash=${transactionId}&apikey=${process.env.BASE_SCAN_API_KEY}`)
        contractAddress = response.data.result.logs[0].address;
        const userAddress = response.data.result.from;

        const dbClient = new MongoClient(process.env.MONGO_URI || '',  {
                serverApi: {
                    version: ServerApiVersion.v1,
                    strict: true,
                    deprecationErrors: true,
                }
            }
        );

        await dbClient.connect();
        const tokensDb = dbClient.db(process.env.MONGO_DB_NAME).collection('tokens');
        let result: any = await tokensDb.find({ contractAddress: contractAddress }).toArray();
        if (result && result.length > 0) {
            success = false;
            return generateResponse(state, success, contractAddress, "");
        }

        let selectedNoun = NOUNS[Math.floor(Math.random() * NOUNS.length)];
        let selectedAdjective = ADJECTIVES[Math.floor(Math.random() * ADJECTIVES.length)];
        let passphrase = `${selectedAdjective} ${selectedNoun}`;


        result = await tokensDb.find({ passphrase: passphrase }).toArray(); 
        if (result && result.length > 0) {
            while (result.map((token: any) => token.passphrase).includes(passphrase)) {
                selectedNoun = NOUNS[Math.floor(Math.random() * NOUNS.length)];
                selectedAdjective = ADJECTIVES[Math.floor(Math.random() * ADJECTIVES.length)];
                passphrase = `${selectedAdjective} ${selectedNoun}`;
            }
        }

        result = await tokensDb.insertOne({
            tokenName: state.name,
            tokenTicker: state.ticker,
            imageURL: state.logo,
            gradientStart: state.gradientStart,
            gradientEnd: state.gradientEnd,
            textColor: getTextColor(state.gradientStart, state.gradientEnd),
            description: state.description,
            contractAddress: contractAddress,
            initialSupply: state.supply,
            userAddress: userAddress,
            txHash: transactionId,
            chainId: process.env.CHAIN_ID,
            passphrase: passphrase
        });

        await dbClient.close();
        
        if (!result.insertedId) {
            success = false;
            return generateResponse(state, success, contractAddress, "");
        } else {
            success = true;
            return generateResponse(state, success, contractAddress, passphrase);
        }

    } catch (e: any) {
        console.log(e);
        success = false;
        return generateResponse(state, success, contractAddress, "");
    }

}

export async function POST(req: NextRequest): Promise<Response> {
    return getResponse(req);
}

export const dynamic = 'force-dynamic';