import { MongoClient, ServerApiVersion } from "mongodb";

export async function Page({
  params,
}: {
  params: { contractAddress: string };
}) {
  if (process.env.MONGO_URI === undefined) {
    throw new Error("missing MONGO_URI");
  }

  const dbClient = new MongoClient(process.env.MONGO_URI, {
    serverApi: {
      version: ServerApiVersion.v1,
      strict: true,
      deprecationErrors: true,
    },
  });
  await dbClient.connect();
  const salesDb = dbClient.db(process.env.MONGO_DB_NAME).collection("sales");

  let result: any = await salesDb.findOne({
    contractAddress: params.contractAddress,
  });

  const framesURL = `${process.env.NEXT_PUBLIC_SITE_URL}/sales/${result.contractAddress}/purchase`;

  return (
    <div className="h-screen w-screen bg-[url(https://soft-pump-assets.s3.amazonaws.com/background.jpg)] flex flex-col items-center justify-center">
      <div className="max-w-96 rounded bg-white p-5 gap-y-5 flex flex-col shadow">
        <h1 className="text-center font-bold text-xl">Announce your sale!</h1>
        <div>
          Let your customers purchase with Fundcaster! Share the links below to
          get started.
        </div>

        <div>
          <div className="text-sm">
            Warpcast URL (use this link to share an interactive app):
          </div>
          <div className="flex flex-col gap-2">
            <div className="max-w-auto flex rounded-md shadow-sm ring-1 ring-inset ring-gray-300 focus-within:ring-2 focus-within:ring-inset focus-within:ring-indigo-600 shrink">
              <span className="flex items-center px-3 py-1 text-gray-500 text-xs overflow-x-scroll">
                {framesURL}
              </span>
            </div>
          </div>
        </div>
      </div>

      <img
        src="https://soft-pump-assets.s3.amazonaws.com/bg-blue_fg-white-removebg-preview.png"
        style={{ height: "50px" }}
        alt="SOFT logo"
      />
    </div>
  );
}

export default Page;
