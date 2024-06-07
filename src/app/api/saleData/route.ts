import { FrameRequest, getFrameHtmlResponse } from '@coinbase/onchainkit/frame';
import { NextRequest, NextResponse } from 'next/server';
import getSaleFieldInfo from "@/constants/getSaleFieldInfo";

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
//   else sanitizedInputText = sanitizedInputText.replace(/[^a-zA-Z0-9]/g, '');

  const state = JSON.parse(decodeURIComponent(currState));
  return {
    ...state,
    [field]: sanitizedInputText
  };
}

async function getResponse(req: NextRequest): Promise<NextResponse> {

    const field = req.nextUrl.searchParams.get('field') || '';
    const from = req.nextUrl.searchParams.get('from') || '';

    const body: FrameRequest = await req.json();
    const { inputText } = body.untrustedData;
    const state = JSON.parse(decodeURIComponent(body.untrustedData.state));
    const { prevURL, nextURL, placeholder } = getSaleFieldInfo(field);

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
                src: `${process.env.NEXT_PUBLIC_SITE_URL}/frames/images/saleData?field=${field}&gradientStart=${state.gradientStart}&gradientEnd=${state.gradientEnd}`,
            },
            input: {
                text: placeholder,
            },
            state: JSON.parse(decodeURIComponent(body.untrustedData.state)),
        })
    )
}

export async function POST(req: NextRequest): Promise<Response> {
  return getResponse(req);
}

export const dynamic = 'force-dynamic';