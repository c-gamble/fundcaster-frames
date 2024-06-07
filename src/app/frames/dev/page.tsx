import { getFrameMetadata } from '@coinbase/onchainkit/frame';
import type { Metadata } from 'next';

const frameMetdata = getFrameMetadata({
  buttons: [
    {
      label: 'Go 🟢',
      action: 'post',
      target: `${process.env.NEXT_PUBLIC_SITE_URL}/api/saleData?field=price`
    },
  ],
  image: {
    src: `${process.env.NEXT_PUBLIC_SITE_URL}/frames/images/dev`,
  }
});

export const generateMetadata = (): Metadata => {

  return {
    title: `dev page`,
    description: 'dev page of fundcaster',
    openGraph: {
      title: 'dev page',
      description: 'dev page of fundcaster',
      images: [`${process.env.NEXT_PUBLIC_SITE_URL}/frames/images/dev`],
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