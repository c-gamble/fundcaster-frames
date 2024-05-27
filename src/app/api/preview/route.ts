import { FrameRequest, getFrameHtmlResponse } from '@coinbase/onchainkit/frame';
import { NextRequest, NextResponse } from 'next/server';

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
    sanitizedInputText = inputText.replace(/[^a-fA-F0-9]/g, '');
    if (sanitizedInputText.length != 6) sanitizedInputText = process.env.DEFAULT_GRADIENT_START || "000000";
  } else if (field == "gradientEnd") {
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

  const body: FrameRequest = await req.json();
  const { inputText } = body.untrustedData;

  const from = req.nextUrl.searchParams.get('from') || '';

  const prevURL = `${process.env.NEXT_PUBLIC_SITE_URL}/api/data?field=supply`;
  const nextURL = `${process.env.NEXT_PUBLIC_SITE_URL}/api/submit`;

  return new NextResponse(
    getFrameHtmlResponse({
      buttons: [
        {
          label: '← Back',
          action: 'post',
          target: prevURL
        },
        {
          label: 'Submit',
          action: 'tx',
          target: nextURL,
          postUrl: `${process.env.NEXT_PUBLIC_SITE_URL}/api/end`
        },
      ],
      image: {
        src: `${process.env.NEXT_PUBLIC_SITE_URL}/frames/images/preview?state=${encodeURIComponent(JSON.stringify((inputText && inputText.length > 0) ? updateState(body.untrustedData.state, from, inputText) : JSON.parse(decodeURIComponent(body.untrustedData.state))))}`,
      },
      state: (inputText && inputText.length > 0) ? updateState(body.untrustedData.state, from, inputText) : JSON.parse(decodeURIComponent(body.untrustedData.state)),
    })
  )

}

export async function POST(req: NextRequest): Promise<Response> {
  return getResponse(req);
}

export const dynamic = 'force-dynamic';