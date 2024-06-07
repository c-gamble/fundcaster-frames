## Debugger

To locally develop in Frames, you will need a debugger. There are three primary options, of which the best (for our use case) is the Frames.js debugger. To install, run 
```bash
npm install -g @frames.js/debugger
```
Once installed, you can launch the debugger by running 
```bash
frames
```

## Environment Configuration

You must create a ```.env``` file with the following fields in order for the application to be fully functional. Please request these credentials from one of the developers or admin if you do not already have them.
```bash
NEXT_PUBLIC_SITE_URL=http://localhost:3000

DEFAULT_TOKEN_NAME=Token
DEFAULT_TOKEN_TICKER=TOK
DEFAULT_TOKEN_LOGO=https://soft-pump-assets.s3.amazonaws.com/token.png
DEFAULT_GRADIENT_START=014bad
DEFAULT_GRADIENT_END=17101F
DEFAULT_TOKEN_DESCRIPTION=This is a token
DEFAULT_INITIAL_SUPPLY=1000000000

TOKEN_FACTORY_ADDRESS=
FEE_DEPOSIT_ADDRESS=
CHAIN_ID=
BASE_SCAN_API_KEY=
NEYNAR_API_KEY=

MONGO_URI=
MONGO_DB_NAME=
```

## Launching the Application

After cloning this repository, you must install all necessary dependencies by running
```bash
npm install
```

Once dependencies are installed, you can run ```npm run dev``` to start the application locally on port 3000. To access the application, navigate to the Frames.js debugger (usually available at ```http://localhost:3010```) and enter the url ```http://localhost:3000/frames/home```. This is the landing page for the frames application.

If you wish to work on the web app, navigate to ```http://localhost:3000/``` in your browser.