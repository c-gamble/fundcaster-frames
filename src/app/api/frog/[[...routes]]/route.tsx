/** @jsxImportSource frog/jsx */
/* eslint-disable @next/next/no-img-element */
import { Button, FrameContext, Frog, TextInput, parseEther } from "frog";
import { handle } from "frog/next";
import { devtools } from "frog/dev";
import { MongoClient, ServerApiVersion } from "mongodb";
import axios from "axios";
import { getUI } from "./ui";
import { ABI as FACTORY_ABI } from "@/constants/factoryABI";
import { NOUNS } from "../../end/constants/nouns";
import { ADJECTIVES } from "../../end/constants/adjectives";
import { getTextColor } from "@/utils/textColor";
import FlatPriceSaleFactory_v_2_1 from "@/constants/FlatPriceSaleFactory_v_2_1.json";

const delay = (ms: number) => new Promise((res) => setTimeout(res, ms));

const jsxExpression = <></>;

type State = {
  tokenCapture: {
    stepIndex: number;
    fields: {
      name: string;
      symbol: string;
      logo: string;
      primaryColor: string;
      secondaryColor: string;
      description: string;
      totalSupply: string;
    };
  };
  saleCapture: {
    stepIndex: number;
    fields: {
      saleMax: string;
      userMax: string;
      minPurchase: string;
      openIn: string;
      duration: string;
      maxQueue: string;
      uri: string;
    };
  };
  latestToken?: {
    address: string;
  };
};

const initialState: State = {
  tokenCapture: {
    stepIndex: 0,
    fields: {
      name: "",
      symbol: "",
      logo: "",
      primaryColor: "",
      secondaryColor: "",
      description: "",
      totalSupply: "",
    },
  },
  saleCapture: {
    stepIndex: 0,
    fields: {
      saleMax: "",
      userMax: "",
      minPurchase: "",
      openIn: "",
      duration: "",
      maxQueue: "",
      uri: "",
    },
  },
  latestToken: undefined,
};

const app = new Frog<{ State: State }>({
  initialState,
  basePath: "/api/frog",
  ui: { vars: getUI().vars },
  imageOptions: {
    width: 1200,
    height: 630,
    fonts: [
      {
        name: "Montserrat",
        weight: 400,
        source: "google",
      },
      {
        name: "Montserrat",
        weight: 700,
        source: "google",
      },
    ],
  },
});

const TextCard = (props: {
  ui: ReturnType<typeof getUI>;
  title: string;
  description: string;
  addendum?: typeof jsxExpression;
}) => {
  const { Box, Heading, Text } = props.ui;

  return (
    <Box
      grow
      alignHorizontal="left"
      backgroundColor="background"
      backgroundImage="url(https://soft-pump-assets.s3.amazonaws.com/background.jpg)"
      padding="32"
      justifyContent="space-between"
      flexDirection="row"
      gap="8"
    >
      <Box flexDirection="column" gap="4" grow>
        <Heading>{props.title}</Heading>
        {props.description && (
          <Text color="text200" size="20">
            {props.description}
          </Text>
        )}
        {props.addendum}
      </Box>

      <Box grow alignVertical="bottom" alignHorizontal="right">
        <img
          src="https://soft-pump-assets.s3.amazonaws.com/bg-blue_fg-white-removebg-preview.png"
          style={{ height: "50px" }}
          alt="SOFT logo"
        />
      </Box>
    </Box>
  );
};

app.frame("/", (c) => {
  const ui = getUI();

  return c.res({
    action: "/begin",
    image: TextCard({
      ui,
      title: "Welcome to Fundcaster!",
      description: "Token creation simplified",
    }),
    intents: [
      <Button.Link href="https://warpcast.com/thesoftdao/0x6499dc93">
        Learn More
      </Button.Link>,
      <Button>Begin →</Button>,
    ],
  });
});

const steps = [
  {
    field: "name",
    title: "Name your token",
    description: "be creative— clever names often attract more attention",
    inputPlaceholder: "Name your token",
  },
  {
    field: "symbol",
    title: "What’s the ticker?",
    description: "choose a unique ticker to stand out",
    inputPlaceholder: "Enter the ticker here",
  },
  {
    field: "logo",
    title: "Pick a logo",
    description: "or click ‘Next’ to use the default image",
    inputPlaceholder: "paste URL here (max. 100KB)",
  },
  {
    field: "primaryColor",
    title: "Choose a primary color",
    description: "optionally add branding with a gradient",
    inputPlaceholder: "enter a hex color code",
  },
  {
    field: "secondaryColor",
    title: "Choose a secondary color",
    description: "optionally add branding with a gradient",
    inputPlaceholder: "enter a hex color code",
  },
  {
    field: "description",
    title: "Describe your token",
    description: "tell your holders what they’re holding",
    inputPlaceholder: "type the description here",
  },
  {
    field: "totalSupply",
    title: "Choose a total supply",
    description: "how many tokens will be minted?",
    inputPlaceholder: "(max. 10 billion)",
  },
];

app.frame("/begin", (c) => {
  const ui = getUI();

  const state = c.deriveState((s) => {
    if (c.buttonValue === "restart") {
      s.tokenCapture = initialState.tokenCapture;
    } else if (c.buttonValue === "goBack") {
      s.tokenCapture.stepIndex--;
    } else if (c.buttonValue === "proceed") {
      const prevStep = steps[s.tokenCapture.stepIndex];
      if (prevStep) {
        const field = prevStep.field as keyof State["tokenCapture"]["fields"];
        const { inputText } = c;
        if (inputText !== undefined && field !== undefined) {
          s.tokenCapture.fields[field] = inputText;
        }
      }
      s.tokenCapture.stepIndex++;
    }
  });
  const { stepIndex } = state.tokenCapture;
  const step = steps[stepIndex];

  const isFinalStep = stepIndex === steps.length - 1;

  return c.res({
    action: "/begin",
    image: TextCard({ ui, title: step.title, description: step.description }),
    intents: [
      <TextInput placeholder={step.inputPlaceholder} />,
      stepIndex > 0 && <Button value="goBack">← Back</Button>,
      isFinalStep ? (
        <Button action="/preview">Preview</Button>
      ) : (
        <Button value="proceed">Next →</Button>
      ),
    ],
  });
});

app.frame("/preview", (c) => {
  const ui = getUI();

  return c.res({
    action: "/end",
    image: TextCard({ ui, title: "Review details", description: "foo" }), // TODO: include details and logo here
    intents: [
      <Button action="/begin">← Back</Button>,
      <Button.Transaction target="/submit">Submit</Button.Transaction>,
    ],
  });
});

app.transaction("/submit", (c) => {
  const {
    name = process.env.DEFAULT_TOKEN_NAME || "Default Token Name",
    symbol = process.env.DEFAULT_TOKEN_TICKER || "Default token ticker",
    totalSupply = process.env.DEFAULT_INITIAL_SUPPLY || "1000000000",
  } = c.previousState.tokenCapture.fields;

  return c.contract({
    abi: FACTORY_ABI,
    functionName: "CreateNewCustomToken",
    args: [
      name,
      symbol,
      BigInt(totalSupply.toString()) * BigInt(10 ** 18),
      process.env.FEE_DEPOSIT_ADDRESS,
    ],
    chainId: `eip155:${process.env.CHAIN_ID}` as "eip155:1",
    to: process.env.TOKEN_FACTORY_ADDRESS as `0x${string}`,
    value: parseEther("0"),
  });
});

app.transaction("/submitSale", async (c) => {
  if (c.previousState.latestToken === undefined) {
    throw new Error("cannot submit sale without a token");
  }

  const response = await axios.get(
    `https://api${
      process.env.CHAIN_ID == "84532" ? "-sepolia" : ""
    }.basescan.org/api?module=contract&action=getcontractcreation&contractaddresses=${
      c.previousState.latestToken.address
    }&apikey=${process.env.BASE_SCAN_API_KEY}`
  );
  const userAddress = response.data.result[0].contractCreator;

  // TODO: pull token details from mongo

  const args = [
    userAddress,
    [
      "0xC4BFc1Ad6dbB85191867a6E0f9dA2EA1668B5a6F", // TODO: this should be a treasury
      "0x0000000000000000000000000000000000000000000000000000000000000000",
      // new Uint8Array([ 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, ]),
      BigInt(1000000000) * BigInt(10 ** 18), // TODO: use c.previousState.saleCapture.fields
      BigInt(1000000000) * BigInt(10 ** 18),
      BigInt(0),
      Math.floor(Date.now() / 1000),
      Math.floor(Date.now() / 1000) + 86400,
      0,
      "this should be a uri",
    ],
    "USD",
    true,
    // TODO: parameterize this by network
    "0x4aDC67696bA383F43DD60A9e78F2C97Fbbfc7cb1", // pulled from https://docs.chain.link/data-feeds/price-feeds/addresses?network=base&page=1
    [
      // TODO: parameterize this by network
      "0x036cbd53842c5426634e7929541ec2318f3dcf7e", // pulled from https://developers.circle.com/stablecoins/docs/usdc-on-test-networks
    ],
    // TODO: parameterize this by network
    ["0xd30e2101a97dcbAeBCBC04F14C3f624E67A35165"],
    [18],
  ];

  return c.contract({
    abi: FlatPriceSaleFactory_v_2_1.abi,
    functionName: "newSale",
    args,
    chainId: `eip155:${process.env.CHAIN_ID}` as "eip155:1",
    to: process.env.FLAT_PRICE_SALE_FACTORY_ADDRESS as `0x${string}`,
    value: parseEther("0"),
  });
});

app.frame("/end", async (c) => {
  const ui = getUI();

  let state: State;
  let dbClient: MongoClient | undefined;

  try {
    try {
      state = await c.deriveState(async (s) => {
        let contractAddress = "";

        await delay(3000);

        const response = await axios.get(
          `https://api${
            process.env.CHAIN_ID == "84532" ? "-sepolia" : ""
          }.basescan.org/api?module=proxy&action=eth_getTransactionReceipt&txhash=${
            c.transactionId
          }&apikey=${process.env.BASE_SCAN_API_KEY}`
        );
        contractAddress = response.data.result.logs[0].address;
        const userAddress = response.data.result.from;

        if (process.env.MONGO_URI === undefined) {
          throw new Error("missing MONGO_URI");
        }

        dbClient = new MongoClient(process.env.MONGO_URI, {
          serverApi: {
            version: ServerApiVersion.v1,
            strict: true,
            deprecationErrors: true,
          },
        });

        await dbClient.connect();
        const tokensDb = dbClient
          .db(process.env.MONGO_DB_NAME)
          .collection("tokens");
        let result: any = await tokensDb
          .findOne({ contractAddress: contractAddress });

        if (result == null) {
          let selectedNoun = NOUNS[Math.floor(Math.random() * NOUNS.length)];
          let selectedAdjective =
            ADJECTIVES[Math.floor(Math.random() * ADJECTIVES.length)];
          let passphrase = `${selectedAdjective} ${selectedNoun}`;

          result = await tokensDb.find({ passphrase: passphrase }).toArray();
          if (result && result.length > 0) {
            while (
              result.map((token: any) => token.passphrase).includes(passphrase)
            ) {
              selectedNoun = NOUNS[Math.floor(Math.random() * NOUNS.length)];
              selectedAdjective =
                ADJECTIVES[Math.floor(Math.random() * ADJECTIVES.length)];
              passphrase = `${selectedAdjective} ${selectedNoun}`;
            }
          }

          const name =
            s.tokenCapture.fields.name ||
            process.env.DEFAULT_TOKEN_NAME ||
            "Default Token Name";
          const ticker =
            s.tokenCapture.fields.symbol ||
            process.env.DEFAULT_TOKEN_TICKER ||
            "DEFAULTTOKENTICKER";
          const totalSupply =
            s.tokenCapture.fields.totalSupply ||
            process.env.DEFAULT_INITIAL_SUPPLY ||
            "1000000000";

          const details = {
            tokenName: name,
            tokenTicker: ticker,
            imageURL: s.tokenCapture.fields.logo,
            gradientStart: s.tokenCapture.fields.primaryColor,
            gradientEnd: s.tokenCapture.fields.secondaryColor,
            textColor: getTextColor(
              s.tokenCapture.fields.primaryColor,
              s.tokenCapture.fields.secondaryColor
            ),
            description: s.tokenCapture.fields.description,
            contractAddress: contractAddress,
            initialSupply: totalSupply,
            userAddress: userAddress,
            txHash: c.transactionId,
            chainId: process.env.CHAIN_ID,
            passphrase: passphrase,
          };
          result = await tokensDb.insertOne(details);

          if (!result.insertedId) {
            console.error("row details", details);
            throw new Error(
              `failed to insert row for contract ${contractAddress}`
            );
          }
        }

        s.tokenCapture = initialState.tokenCapture;

        s.latestToken = { address: contractAddress };
      });
    } catch (error) {
      console.error(error);
      return somethingWentWrong(c);
    }

    if (state.latestToken === undefined) {
      return somethingWentWrong(c);
    }

    return c.res({
      image: TextCard({
        ui,
        title: "Token created!",
        description: `contract available at ${state.latestToken.address}`,
      }),
      intents: [
        <Button action="/">Home</Button>,
        <Button action="/launch">Launch</Button>,
        // TODO: dynamically configure ether scan URL based on chain
        <Button.Link
          href={`https://${
            process.env.CHAIN_ID == "84532" ? "sepolia." : ""
          }.org/token/${state.latestToken.address}`}
        >
          View On-Chain
        </Button.Link>,
      ],
    });
  } finally {
    if (dbClient) {
      await dbClient.close();
    }
  }
});

app.frame("/launch", async (c) => {
  const ui = getUI();
  const { Box, Heading, Text } = ui;

  if (c.previousState.latestToken === undefined) {
    return somethingWentWrong(c);
  }

  const dbClient = new MongoClient(process.env.MONGO_URI || "", {
    serverApi: {
      version: ServerApiVersion.v1,
      strict: true,
      deprecationErrors: true,
    },
  });

  await dbClient.connect();
  const tokensDb = dbClient.db(process.env.MONGO_DB_NAME).collection("tokens");
  let token: any = await tokensDb.findOne({
    contractAddress: c.previousState.latestToken.address,
  });

  return c.res({
    image: TextCard({
      ui,
      title: `Ready to launch ${token.tokenTicker}?`,
      description: "start a sale or open an airdrop now",
      addendum: (
        <Box flexDirection="column" gap="4" grow paddingTop="32">
          <Heading size="24">
            store your passphrase to use SOFT’s tooling:
          </Heading>
          <Text weight="700">{token.passphrase}</Text>
        </Box>
      ),
    }),
    intents: [
      <Button action="/beginSale">Start Sale 💰</Button>,
      <Button.Link
        href={`${process.env.NEXT_PUBLIC_SITE_URL}/airdrop/${c.previousState.latestToken.address}`}
      >
        Open Airdrop
      </Button.Link>,
    ],
  });
});

const saleSteps = [
  {
    field: "saleMax",
    inputPlaceholder: "enter the amount in USD",
    title: "max. sale amount",
    description: "cannot exceed your total supply times your price",
  },
  {
    field: "userMax",
    inputPlaceholder: "enter the amount in USD",
    title: "max. amount per user",
    description: "cannot exceed your total supply times your price",
  },
  {
    field: "purchaseMin",
    inputPlaceholder: "enter the amount in USD",
    title: "min. purchase amount",
    description: "leave blank for no minimum",
  },
  {
    field: "openIn",
    inputPlaceholder: "leave blank for immediate sale",
    title: "set sale open time",
    description: "choose a number of hours from now",
  },
  {
    field: "duration",
    inputPlaceholder: "enter a number of hours",
    title: "how long is the sale?",
    description: "choose a total duration in hours",
  },
  {
    field: "maxQueue",
    inputPlaceholder: "leave blank for no limit",
    title: "max. queue time",
    description: "choose a max queue per user time in hours",
  },
  {
    field: "infoURL",
    inputPlaceholder: "leave blank for no link",
    title: "is there more?",
    description: "enter a URL with more information",
  },
];

app.frame("/beginSale", (c) => {
  const ui = getUI();

  const state = c.deriveState((s) => {
    if (c.buttonValue === "restart") {
      s.saleCapture = initialState.saleCapture;
    } else if (c.buttonValue === "goBack") {
      s.saleCapture.stepIndex--;
    } else if (c.buttonValue === "proceed") {
      const prevStep = saleSteps[s.saleCapture.stepIndex];
      if (prevStep) {
        const field = prevStep.field as keyof State["saleCapture"]["fields"];
        const { inputText } = c;
        if (inputText !== undefined && field !== undefined) {
          s.saleCapture.fields[field] = inputText;
        }
      }
      s.saleCapture.stepIndex++;
    }
  });
  const { stepIndex } = state.saleCapture;
  const step = saleSteps[stepIndex];

  const isFinalStep = stepIndex === saleSteps.length - 1;

  return c.res({
    action: "/beginSale",
    image: TextCard({ ui, title: step.title, description: step.description }),
    intents: [
      <TextInput placeholder={step.inputPlaceholder} />,
      stepIndex > 0 && <Button value="goBack">← Back</Button>,
      isFinalStep ? (
        <Button action="/salePreview">Preview</Button>
      ) : (
        <Button value="proceed">Next →</Button>
      ),
    ],
  });
});

app.frame("/salePreview", (c) => {
  const ui = getUI();

  return c.res({
    action: "/viewSale",
    image: TextCard({
      ui,
      title: "Review sale details",
      description: JSON.stringify(c.previousState.saleCapture.fields, null, 2), // TODO: include sale details
    }),
    intents: [
      <Button.Transaction target="/submitSale">Submit</Button.Transaction>,
    ],
  });
});

app.frame("/viewSale", async (c) => {
  const ui = getUI();
  const { Box, Text } = ui;

  await delay(5000);

  const response = await axios.get(
    `https://api${
      process.env.CHAIN_ID == "84532" ? "-sepolia" : ""
    }.basescan.org/api?module=proxy&action=eth_getTransactionReceipt&txhash=${
      c.transactionId
    }&apikey=${process.env.BASE_SCAN_API_KEY}`
  );

  const [saleEvent] = response.data.result.logs;
  const [, , saleAddress] = saleEvent.topics;
  const truncatedAddress = `0x${saleAddress.slice(26)}`;

  // TODO: pull sale owner address from transaction ID
  // TODO: check if the address of the owner matches the owner of the latest token
  // TODO: store transactionId & sale contract address with upsert

  if (process.env.MONGO_URI === undefined) {
    throw Error("missing MONGO_URI");
  }

  const dbClient = new MongoClient(process.env.MONGO_URI, {
    serverApi: {
      version: ServerApiVersion.v1,
      strict: true,
      deprecationErrors: true,
    },
  });
  await dbClient.connect();

  try {
    const salesDb = dbClient.db(process.env.MONGO_DB_NAME).collection("sales");
    let result: any = await salesDb
      .findOne({ contractAddress: truncatedAddress });

    if (result == null) {
      await salesDb.insertOne({
        contractAddress: truncatedAddress.toLowerCase(),
        chainId: process.env.CHAIN_ID,
        transactionId: c.transactionId?.toLowerCase(),
        saleCapture: c.previousState.saleCapture,
      });
    }

    return c.res({
      image: TextCard({
        ui,
        title: "Your sale is live!",
        description: "",
        addendum: (
          <>
            <Box flexDirection="column" gap="4" grow paddingTop="32">
              <Text size="12" wrap="balance">
                transaction hash: {c.transactionId}
              </Text>
              <Text size="12" wrap="balance">
                address: {truncatedAddress}
              </Text>
            </Box>
          </>
        ),
      }),
      intents: [
        <Button.Link
          href={`${process.env.NEXT_PUBLIC_SITE_URL}/sales/${truncatedAddress}/announce`}
        >
          Open Announcement Portal
        </Button.Link>,
        <Button.Link
          href={`https://${
            process.env.CHAIN_ID == "84532" ? "sepolia." : ""
          }basescan.org/address/${truncatedAddress}`}
        >
          View On-Chain
        </Button.Link>,
      ],
    });
  } finally {
    await dbClient.close();
  }
});

app.frame("/sales/:contractAddress/purchase", async (c) => {
  const ui = getUI();

  const contractAddress = c.req.param("contractAddress");

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

  try {
    const salesDb = dbClient.db(process.env.MONGO_DB_NAME).collection("sales");
    let result: any = await salesDb.findOne({
      contractAddress: contractAddress,
    });

    return c.res({
      image: TextCard({
        ui,
        title: `Purchase from this sale!`,
        description: "This seller is holding a sale",
        // TODO: include sale details like opening time, closing time
      }),
      intents: [
        <Button.Link href={result.saleCapture.fields.uri}>
          More Info
        </Button.Link>,
        <Button>Proceed</Button>,
        // TODO: implement multi-step process
        // TODO: have the user decide payment method in step 2
        // <Button value="buyWithUSDC">Buy with USDC</Button>,
        // <Button value="buyWithNative">Buy with Base ETH</Button>,
      ],
    });
  } finally {
    await dbClient.close();
  }
});

const somethingWentWrong = (c: FrameContext<{ State: State }>) => {
  const ui = getUI();

  return c.res({
    image: TextCard({
      ui,
      title: "Please try again!",
      description: "or contact SOFT for assistance",
    }),
    intents: [
      <Button action="/begin" value="restart">
        Restart
      </Button>,
      <Button.Link href="https://warpcast.com/thesoftdao">
        Contact SOFT
      </Button.Link>,
    ],
  });
};

devtools(app);
export const GET = handle(app);
export const POST = handle(app);
