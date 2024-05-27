import { getFrameMetadata } from '@coinbase/onchainkit/frame';
import type { Metadata } from 'next';

const frameMetdata = getFrameMetadata({
  buttons: [
    {
      label: 'Learn More',
      action: 'link',
      target: "https://warpcast.com/thesoftdao/0x6499dc93"
    },
    {
      label: 'Begin →',
      action: 'post',
      target: `${process.env.NEXT_PUBLIC_SITE_URL}/api/data?field=name`
    },
  ],
  image: {
    src: `${process.env.NEXT_PUBLIC_SITE_URL}/frames/images/home`,
  }
});

export const generateMetadata = (): Metadata => {

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