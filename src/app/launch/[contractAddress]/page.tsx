"use client";
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import axios from 'axios';

export default function Page({ params }: { params: { contractAddress: string } }) {

    const router = useRouter();

    const [contract, setContract] : any = useState(null);
    const [loading, setLoading] : any = useState(true);

    useEffect(() => {
        axios.get(`/api/launch?contractAddress=${params.contractAddress}`).then((res) => {
            setContract(res.data);
            setLoading(false);
        }).catch((err) => {
            console.log(err);
            setLoading(false);
        });
    }, []);

    const handleCopy = async () => {
        await navigator.clipboard.writeText(`${process.env.NEXT_PUBLIC_SITE_URL}/frames/launch/${contract.contractAddress}`);
        alert('copied to clipboard!');
    }

    return (
        <>
            {loading ? (
                <div className="h-screen w-screen bg-gradient-linear p-20 flex flex-col items-center justify-center">
                    <h1 className="text-white text-xl">loading...</h1>
                    <div style={{position: 'absolute', display: 'flex', bottom: '0', right: '0', padding: '10px'}}>
                        <img src="https://soft-pump-assets.s3.amazonaws.com/bg-blue_fg-white-removebg-preview.png" style={{height: '50px'}} alt="SOFT logo" />
                    </div>                    
                </div>
            ) : ( 
                contract ? (
                    <div className="text-center h-screen w-screen bg-gradient-linear p-20 flex flex-col items-center justify-center text-white">
                        <h1 className="text-[40px]">congratulations on creating <span className="font-bold">${contract.tokenTicker}</span> with fundcaster!</h1>
                        {/* button to copy contract address w/ styling */}
                        <h1 className="mt-4 mb-10">to launch your token, copy the frame URL below and cast to your feed</h1>
                        <div className="w-full flex items-center justify-center">
                            <button onClick={handleCopy} className="bg-white text-[#014bad] font-bold p-2 rounded-md mr-4">get launch link</button>
                            <button onClick={() => window.open('https://warpcast.com/')} className="bg-white text-[#014bad] font-bold ml-4 p-2 rounded-md">open warpcast</button>
                        </div>
                        <div style={{position: 'absolute', display: 'flex', bottom: '0', right: '0', padding: '10px'}}>
                            <img src="https://soft-pump-assets.s3.amazonaws.com/bg-blue_fg-white-removebg-preview.png" style={{height: '50px'}} alt="SOFT logo" />
                        </div>
                    </div>
                ) : (
                    <div className="h-screen w-screen bg-gradient-linear p-20 flex flex-col items-center align-center">
                        <h1 className="text-white text-xl">token not found :(</h1>
                        <div style={{position: 'absolute', display: 'flex', bottom: '0', right: '0', padding: '10px'}}>
                            <img src="https://soft-pump-assets.s3.amazonaws.com/bg-blue_fg-white-removebg-preview.png" style={{height: '50px'}} alt="SOFT logo" />
                        </div>                        
                    </div>
                )
            )}
        </>
    );
}