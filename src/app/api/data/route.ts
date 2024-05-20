import { FrameRequest, getFrameHtmlResponse } from '@coinbase/onchainkit/frame';
import { NextRequest, NextResponse } from 'next/server';
import getFieldInfo from "@/constants/getFieldInfo";

const updateState = (currState: any, field: string, inputText: string) => {
  
  var sanitizedInputText = inputText;
  if (field == "ticker") sanitizedInputText = sanitizedInputText.replace(/[^a-zA-Z0-9]/g, '').toUpperCase();
  else if (field == "name" || field == "description") sanitizedInputText = inputText.replace(/[^a-zA-Z0-9\s]/g, '');
  else sanitizedInputText = sanitizedInputText.replace(/[^a-zA-Z0-9]/g, '');
  
  const state = JSON.parse(decodeURIComponent(currState));
  return {
      ...state,
      [field]: sanitizedInputText
  };
}

async function getResponse(req: NextRequest): Promise<NextResponse> {
    
    let body;
    if (!req.body) {
      console.log(req)
    } else {
      body = await req.json();
    }
    
    const { inputText } = body.untrustedData;
    console.log("state", body.untrustedData.state)
    const field = req.nextUrl.searchParams.get('field') || '';
    const from = req.nextUrl.searchParams.get('from') || '';
    
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

export async function POST(req: NextRequest): Promise<Response> {
    return getResponse(req);
}

export const dynamic = 'force-dynamic';