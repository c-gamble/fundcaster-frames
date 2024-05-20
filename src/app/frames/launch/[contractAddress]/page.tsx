import { getFrameMetadata } from '@coinbase/onchainkit/frame';
import type { Metadata } from 'next';
    
const generateFrameMetadata = (contractAddress: string) => {
    const frameMetdata = getFrameMetadata({
        buttons: [
            {
                label: 'Buy Now',
                action: 'link',
                target: "https://www.thesoftdao.com/"
            },
            {
                label: 'Create Your Own',
                action: 'post',
                target: `${process.env.NEXT_PUBLIC_SITE_URL}/frames/home`
            },
        ],
        image: {
            src: `${process.env.NEXT_PUBLIC_SITE_URL}/frames/images/launch?contractAddress=${contractAddress}`,
        },
    });
    return frameMetdata;
}

type Props = {
    params: { contractAddress: string };
};

export const generateMetadata = ({ params }: Props): Metadata => {
    return {
      title: `launch page`,
      description: 'launch your token here',
      openGraph: {
        title: `launch page`,
        description: 'launch your token here',
        images: [`${process.env.NEXT_PUBLIC_SITE_URL}/frames/images/launch?contractAddress=${params.contractAddress}`],
      },
      other: {
        ...generateFrameMetadata(params.contractAddress),
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