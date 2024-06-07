import { getFrameMetadata } from '@coinbase/onchainkit/frame';
import type { Metadata } from 'next';

const generateFrameMetadata = (contractAddress: string) => {
  const frameMetdata = getFrameMetadata({
    buttons: [
      {
        label: 'Buy Now →',
        action: 'post',
        target: `${process.env.NEXT_PUBLIC_SITE_URL}/api/purchase?contractAddress=${contractAddress}`
      },
      {
        label: 'Create Your Own',
        action: 'link',
        target: "https://warpcast.com/thesoftdao/0x6499dc93"
      },
    ],
    image: {
      src: `${process.env.NEXT_PUBLIC_SITE_URL}/frames/images/announce?contractAddress=${contractAddress}`,
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
      images: [`${process.env.NEXT_PUBLIC_SITE_URL}/frames/images/announce?contractAddress=${params.contractAddress}`],
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