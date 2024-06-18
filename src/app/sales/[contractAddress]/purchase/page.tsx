import { getFrameMetadata } from "frog/next";
import type { Metadata } from "next";
import Image from "next/image";

export async function Page() {
  return (
    <div className="h-screen w-screen bg-[url(https://soft-pump-assets.s3.amazonaws.com/background.jpg)] flex flex-col items-center justify-center">
      <div className="max-w-96 rounded bg-white p-5 gap-y-5 flex flex-col shadow">
        <div>Open this page within Farcaster to begin.</div>
      </div>

      <Image
        src="https://soft-pump-assets.s3.amazonaws.com/bg-blue_fg-white-removebg-preview.png"
        width="50"
        height="50"
        style={{ height: "50px" }}
        alt="SOFT logo"
      />
    </div>
  );
}

export default Page;

export async function generateMetadata({
  params,
}: {
  params: { contractAddress: string };
}): Promise<Metadata> {
  const { contractAddress } = params;
  const url =
    process.env.NEXT_PUBLIC_SITE_URL ||
    process.env.VERCEL_URL ||
    "http://localhost:3000";
  const frameMetadata = await getFrameMetadata(
    `${url}/api/frog/sales/${contractAddress}/purchase`
  );
  return {
    other: frameMetadata,
  };
}
