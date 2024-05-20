import { getFrameMetadata } from '@coinbase/onchainkit/frame';
import type { Metadata } from 'next';
    
const frameMetdata = getFrameMetadata({
    buttons: [
        {
            label: 'Learn More',
            action: 'link',
            target: "https://www.thesoftdao.com/"
        },
        {
            label: 'Begin →',
            action: 'post',
            target: `${process.env.NEXT_PUBLIC_SITE_URL}/api/data?field=name`
        },
    ],
    image: {
        src: `${process.env.NEXT_PUBLIC_SITE_URL}/frames/images/home`,
    },
    state: {
      name: process.env.DEFAULT_TOKEN_NAME,
      ticker: process.env.DEFAULT_TOKEN_TICKER,
      logo: process.env.DEFAULT_TOKEN_LOGO,
      description: process.env.DEFAULT_TOKEN_DESCRIPTION,
      supply: process.env.DEFAULT_INITIAL_SUPPLY,
    }
});

export const generateMetadata = (): Metadata => {
    console.log("metadata", frameMetdata)
    return {
      title: `home page`,
      description: 'first page of fundcaster',
      openGraph: {
        title: 'home page',
        description: 'first page of fundcaster',
        images: [`${process.env.NEXT_PUBLIC_SITE_URL}/frames/images/home`],
      },
      other: {
        ...frameMetdata
      },      
    };
  };

export default function Page() {
  return (
    <>
      <h1>Frame</h1>
    </>
  )
}