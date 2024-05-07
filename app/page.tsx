import { getFrameMetadata } from 'frog/next'
import type { Metadata } from 'next'

export async function generateMetadata(): Promise<Metadata> {
  const frameTags = await getFrameMetadata(
    `${process.env.VERCEL_URL || 'http://localhost:3000'}/api`,
  )
  return {
    other: frameTags,
  }
}

export default function Home() {
  return (
    <div style={{height: '100vh', width: '100vw', backgroundImage: 'linear-gradient(to right, #014bad, #17101F)', paddingLeft: '40px', justifyContent: 'center', flexDirection: 'column', display: 'flex'}}>
      <h1 style={{color: 'white', fontWeight: 'normal', margin: '0px', fontSize: '60px'}}>fundcaster by SOFT</h1>
      <p style={{fontSize: '30px', color: 'white'}}>create your own tokens in frames</p>
    </div>
  )
}
