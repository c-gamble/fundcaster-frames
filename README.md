This is a [Next.js](https://nextjs.org/) project bootstrapped with [`create-next-app`](https://github.com/vercel/next.js/tree/canary/packages/create-next-app).

## Debugger

To locally develop in Frames, you will need a debugger. There are three primary options, of which the best (for our use case) is the Frames.js debugger. To install, run 
```bash
npm install -g @frames.js/debugger
```
Once installed, you can launch the debugger by running 
```bash
frames
```

## Launching the Application

After cloning this repository, you must install all necessary dependencies by running
```bash
npm install
```

Once dependencies are installed, you can run ```npm run dev``` to start the application locally on port 3000. To access the application, navigate to the Frames.js debugger (usually available at ```http://localhost:3010```) and enter the url ```http://localhost:3000/frames/home```. This is the landing page for the frames application.

If you wish to work on the web app, navigate to ```http://localhost:3000/``` in your browser.