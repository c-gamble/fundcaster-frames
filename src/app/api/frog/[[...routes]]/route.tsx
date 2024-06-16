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

const delay = (ms: number) => new Promise((res) => setTimeout(res, ms));

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
        name: 'Montserrat',
        weight: 400,
        source: 'google',
      },
      {
        name: 'Montserrat',
        weight: 700,
        source: 'google'
      }
    ]
  },
});

const TextCard = (props: {
  ui: ReturnType<typeof getUI>;
  title: string;
  description: string;
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
        <Text color="text200" size="20">
          {props.description}
        </Text>
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
      s.tokenCapture = initialState.tokenCapture
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
  console.log(c.previousState);
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

app.frame("/end", async (c) => {
  const ui = getUI();

  let state: State;

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

      const dbClient = new MongoClient(process.env.MONGO_URI || "", {
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
        .find({ contractAddress: contractAddress })
        .toArray();
      if (result && result.length > 0) {
        throw new Error(
          `contract already registered: ${contractAddress} chain=${process.env.CHAIN_ID}`
        );
      }

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

      const details = {
        tokenName: s.tokenCapture.fields.name,
        tokenTicker: s.tokenCapture.fields.symbol,
        imageURL: s.tokenCapture.fields.logo,
        gradientStart: s.tokenCapture.fields.primaryColor,
        gradientEnd: s.tokenCapture.fields.secondaryColor,
        textColor: getTextColor(
          s.tokenCapture.fields.primaryColor,
          s.tokenCapture.fields.secondaryColor
        ),
        description: s.tokenCapture.fields.description,
        contractAddress: contractAddress,
        initialSupply: s.tokenCapture.fields.totalSupply,
        userAddress: userAddress,
        txHash: c.transactionId,
        chainId: process.env.CHAIN_ID,
        passphrase: passphrase,
      };
      result = await tokensDb.insertOne(details);

      await dbClient.close();

      if (!result.insertedId) {
        console.error("row details", details);
        throw new Error(`failed to insert row for contract ${contractAddress}`);
      }

      s.tokenCapture = initialState.tokenCapture;

      /*
      s.tokenCapture.fields.name = process.env.DEFAULT_TOKEN_NAME,
      s.tokenCapture.fields.ticker = process.env.DEFAULT_TOKEN_TICKER,
      s.tokenCapture.fields.logo = process.env.DEFAULT_TOKEN_LOGO,
      s.tokenCapture.fields.primaryColor = process.env.DEFAULT_GRADIENT_START,
      s.tokenCapture.fields.secondaryColor = process.env.DEFAULT_GRADIENT_END,
      s.tokenCapture.fields.description = process.env.DEFAULT_TOKEN_DESCRIPTION,
      s.tokenCapture.fields.totalSupply = process.env.DEFAULT_INITIAL_SUPPLY,                    
       */

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
      <Button.Link
        href={`https://basescan.org/token/${state.latestToken.address}`}
      >
        View On-Chain
      </Button.Link>,
    ],
  });
});

const somethingWentWrong = (c: FrameContext<{State: State}>) => {
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
