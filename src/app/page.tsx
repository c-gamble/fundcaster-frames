"use client";

import { useEffect, useState } from 'react';
import axios from 'axios';
import useWindowSize from '@/hooks/useWindowSize';

export default function Home() {
  const [tokens, setTokens] = useState([]);
  const [loading, setLoading] = useState(true);
  const size = useWindowSize();

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const response = await axios.get(`${process.env.NEXT_PUBLIC_SITE_URL}/api/home`);
        const sortedData = response.data.sort((a: { created_at: string }, b: { created_at: string }) => {
          return new Date(b.created_at).getTime() - new Date(a.created_at).getTime();
        });
        setTokens(sortedData);
        setLoading(false);
      } catch (error) {
        console.error('Error fetching data:', error);
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  return (
    size.width > 800 ? (
      <div className="h-screen w-screen bg-gradient-linear flex justify-center items-center">
        <div className="w-[50%] flex flex-col justify-center pl-[40px]">
          <h1 className="text-white font-normal text-6xl mb-[18px]">fundcaster by SOFT</h1>
          <p className="text-white text-3xl">create your own tokens in frames</p>
        </div>
        <div className={`w-[50%] flex items-center ${loading ? "justify-center" : "justify-start"} flex-col h-[50%] overflow-scroll`}>
          {loading ? <p className="text-white">loading...</p> : tokens.map((token: any) => (
            <div key={token.id} className="text-[#17101F] flex justify-between items-center bg-white rounded-md shadow-lg w-[80%] mt-10 p-6">
              <div className="h-full flex-col justify-center">
                <h1 className="text-4xl mb-4"><span className="font-bold">{token.tokenName}</span> (${token.tokenTicker})</h1>
                <h1 className="text-2xl">{token.description}</h1>
              </div>
              <img src={token.imageURL} alt="token logo" className="w-[100px]" />
            </div>
          ))}
        </div>
      </div>      
    ) : (
      <div className="h-screen w-screen bg-gradient-linear flex justify-center items-center">
        <div className="w-[50%] flex flex-col justify-center pl-[40px]">
          <h1 className="text-white font-normal text-4xl mb-[18px]">fundcaster by SOFT</h1>
          <p className="text-white text-xl">create your own tokens in frames</p>
        </div>
        <div className="w-[50%] flex items-center justify-center flex-col h-[50%] overflow-scroll p-4 py-10">
          {loading ? <p className="text-white">loading...</p> : tokens.map((token: any) => (
            <div key={token.id} className="text-[#17101F] flex flex-col bg-white justify-center items-center rounded-md shadow-lg w-[80%] mt-10 px-4 py-6">
              <img src={token.imageURL} alt="token logo" className="w-[100px]" />
              <p className="text-xl mt-4 font-bold">{token.tokenName}</p>
            </div>
          ))}
        </div>
      </div>
    )

  )
  }