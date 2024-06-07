import { FrameRequest, getFrameHtmlResponse } from '@coinbase/onchainkit/frame';
import { NextRequest, NextResponse } from 'next/server';
import getFieldInfo from "@/constants/getFieldInfo";

const updateState = (currState: any, field: string, inputText: string) => {

  var sanitizedInputText = inputText;
  if (field == "ticker") sanitizedInputText = sanitizedInputText.replace(/[^a-zA-Z0-9]/g, '').toUpperCase();
  else if (field == "name" || field == "description") sanitizedInputText = inputText.replace(/[^a-zA-Z0-9\s]/g, '');
  else if (field == "logo") {
    try {
      const logoURL = new URL(inputText);
      sanitizedInputText = logoURL.href;
    } catch (e: any) {
      sanitizedInputText = process.env.DEFAULT_TOKEN_LOGO || "";
    }
  } else if (field == "gradientStart") {
    inputText = inputText.replace("#", "");
    sanitizedInputText = inputText.replace(/[^a-fA-F0-9]/g, '');
    if (sanitizedInputText.length != 6) sanitizedInputText = process.env.DEFAULT_GRADIENT_START || "000000";
  } else if (field == "gradientEnd") {
    inputText = inputText.replace("#", "");
    sanitizedInputText = inputText.replace(/[^a-fA-F0-9]/g, '');
    if (sanitizedInputText.length != 6) sanitizedInputText = process.env.DEFAULT_GRADIENT_END || "000000";
  } else if (field == "supply") sanitizedInputText = parseInt(inputText.replace(/[^0-9]/g, ''), 10).toString();
  else sanitizedInputText = sanitizedInputText.replace(/[^a-zA-Z0-9]/g, '');

  const state = JSON.parse(decodeURIComponent(currState));
  return {
    ...state,
    [field]: sanitizedInputText
  };
}

async function getResponse(req: NextRequest): Promise<NextResponse> {

  const field = req.nextUrl.searchParams.get('field') || '';
  const from = req.nextUrl.searchParams.get('from') || '';

  if (field == "name" && from == "") { // this is the first data entry frame 
    return new NextResponse( // this needs to return the next frame
      getFrameHtmlResponse({
        buttons: [
          {
            label: 'Next →',
            action: 'post',
            target: `${process.env.NEXT_PUBLIC_SITE_URL}/api/data?field=ticker&from=name`,
          },
        ],
        image: {
          src: `${process.env.NEXT_PUBLIC_SITE_URL}/frames/images/data?field=name`,
        },
        input: {
          text: 'Enter token name',
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
  } else {
    const body: FrameRequest = await req.json();
    const { inputText } = body.untrustedData;
    const { prevURL, nextURL, placeholder } = getFieldInfo(field);

    return new NextResponse( // this needs to return the next frame
      getFrameHtmlResponse({
        buttons: [
          {
            label: '← Back',
            action: 'post',
            target: prevURL
          },
          {
            label: field != 'supply' ? 'Next →' : 'Preview',
            action: 'post',
            target: nextURL,
          },
        ],
        image: {
          src: `${process.env.NEXT_PUBLIC_SITE_URL}/frames/images/data?field=${field}`,
        },
        input: {
          text: placeholder,
        },
        state: (inputText && inputText.length > 0) ? updateState(body.untrustedData.state, from, inputText) : JSON.parse(decodeURIComponent(body.untrustedData.state)),
      })
    )
  }
}

export async function POST(req: NextRequest): Promise<Response> {
  return getResponse(req);
}

export const dynamic = 'force-dynamic';