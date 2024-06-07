"use client";

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import axios from 'axios';

export default function Page({ params }: { params: { contractAddress: string } }) {

    const router = useRouter();

    const [walletAddress, setWalletAddress]: any = useState('');
    const [passphrase, setPassphrase]: any = useState('');

    const [isAuthenticated, setIsAuthenticated]: any = useState(false);

    const [token, setToken]: any = useState(null);
    const [loading, setLoading]: any = useState(true);

    useEffect(() => {
        setIsAuthenticated(false);
    }, []);

    useEffect(() => {
        axios.get(`/api/launch?contractAddress=${params.contractAddress}`).then((res) => {
            setToken(res.data);
            setLoading(false);
        }).catch((err) => {
            console.log(err);
            setLoading(false);
        });
    }, [isAuthenticated]);

    const handleCopy = async () => {
        await navigator.clipboard.writeText(`${process.env.NEXT_PUBLIC_SITE_URL}/frames/announce/${token.contractAddress}`);
        alert('copied to clipboard!');
    }

    const handleAuthentication = async (e: any) => {
        e.preventDefault();

        if (!walletAddress || !passphrase) {
            return alert('please fill out all fields');
        } else {

            try {
                const response = await axios.post(`/api/auth`, {
                    walletAddress,
                    passphrase,
                    contractAddress: params.contractAddress
                });

                if (response.data.success) {
                    setIsAuthenticated(true);
                } else {
                    return alert('authentication failed');
                }
            } catch (e) {
                console.log(e);
                return alert('authentication failed');
            }
        }
    }

    return (
        <>
            {isAuthenticated ? (
                loading ? (
                    <div className={`h-screen w-screen bg-white p-20 flex flex-col items-center justify-center`}>
                        <h1 className="text-white text-xl">loading...</h1>
                        <div style={{ position: 'absolute', display: 'flex', bottom: '0', left: '0', padding: '10px' }}>
                            <a href="https://www.thesoftdao.com/" target="_blank" style={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
                                <Image src="https://soft-pump-assets.s3.amazonaws.com/bg-blue_fg-white-removebg-preview.png" height={50} width={50} alt="SOFT logo" />
                            </a>
                        </div>
                        <div style={{ position: 'absolute', display: 'flex', bottom: '0', right: '0', padding: '10px' }}>
                            <a href="https://warpcast.com/thesoftdao" target="_blank" style={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
                                <Image src="https://soft-pump-assets.s3.amazonaws.com/warpcast.png" height={25} width={25} alt="SOFT logo" style={{ marginRight: '20px' }} />
                            </a>
                            <a href="https://twitter.com/thesoftdao" target="_blank" style={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
                                <Image src="https://soft-pump-assets.s3.amazonaws.com/x.png" height={23} width={23} alt="SOFT logo" style={{ marginRight: '20px' }} />
                            </a>
                            <a href="https://discord.com/invite/thesoftdao" target="_blank" style={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
                                <Image src="https://soft-pump-assets.s3.amazonaws.com/discord.png" height={23} width={23} alt="SOFT logo" />
                            </a>
                        </div>
                    </div>
                ) : (
                    token ? (
                        <div style={{ background: `linear-gradient(to right, #${token.gradientStart}, #${token.gradientEnd})`, color: token.textColor }} className="h-screen w-screen p-20 flex flex-col justify-center items-center">
                            <h1 className="text-[40px]">congratulations on creating <span className="font-bold">{token.tokenTicker}</span> with fundcaster!</h1>
                            {/* button to copy token address w/ styling */}
                            <h1 className="mt-4 mb-10">to launch your token, copy the frame URL below and cast to your feed</h1>
                            <div className="w-full flex items-center justify-center">
                                <button style={{ color: `#${token.gradientStart}` }} onClick={handleCopy} className="bg-white font-bold p-2 rounded-md mr-4">get launch link</button>
                                <button style={{ color: `#${token.gradientStart}` }} onClick={() => window.open('https://warpcast.com/')} className="bg-white font-bold ml-4 p-2 rounded-md">open warpcast</button>
                            </div>
                            <div className="w-full flex items-center justify-center mt-8">
                                <button style={{ color: `#${token.gradientStart}` }} onClick={() => window.open(`${process.env.NEXT_PUBLIC_SITE_URL}/airdrop/${token.contractAddress}`)} className="bg-white font-bold ml-4 p-2 rounded-md">start an airdrop</button>
                            </div>
                            <div style={{ position: 'absolute', display: 'flex', bottom: '0', left: '0', padding: '10px' }}>
                                <a href="https://www.thesoftdao.com/" target="_blank" style={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
                                    <Image src="https://soft-pump-assets.s3.amazonaws.com/bg-blue_fg-white-removebg-preview.png" height={50} width={50} alt="SOFT logo" />
                                </a>
                            </div>
                            <div style={{ position: 'absolute', display: 'flex', bottom: '0', right: '0', padding: '10px' }}>
                                <a href="https://warpcast.com/thesoftdao" target="_blank" style={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
                                    <Image src="https://soft-pump-assets.s3.amazonaws.com/warpcast.png" height={25} width={25} alt="SOFT logo" style={{ marginRight: '20px' }} />
                                </a>
                                <a href="https://twitter.com/thesoftdao" target="_blank" style={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
                                    <Image src="https://soft-pump-assets.s3.amazonaws.com/x.png" height={23} width={23} alt="SOFT logo" style={{ marginRight: '20px' }} />
                                </a>
                                <a href="https://discord.com/invite/thesoftdao" target="_blank" style={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
                                    <Image src="https://soft-pump-assets.s3.amazonaws.com/discord.png" height={23} width={23} alt="SOFT logo" />
                                </a>
                            </div>
                        </div>
                    ) : (
                        <div className="h-screen w-screen bg-gradient-linear p-20 flex flex-col justify-center items-center">
                            <h1 className="text-white text-xl">token not found :(</h1>
                            <div style={{ position: 'absolute', display: 'flex', bottom: '0', left: '0', padding: '10px' }}>
                                <a href="https://www.thesoftdao.com/" target="_blank" style={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
                                    <Image src="https://soft-pump-assets.s3.amazonaws.com/bg-blue_fg-white-removebg-preview.png" height={50} width={50} alt="SOFT logo" />
                                </a>
                            </div>
                            <div style={{ position: 'absolute', display: 'flex', bottom: '0', right: '0', padding: '10px' }}>
                                <a href="https://warpcast.com/thesoftdao" target="_blank" style={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
                                    <Image src="https://soft-pump-assets.s3.amazonaws.com/warpcast.png" height={25} width={25} alt="SOFT logo" style={{ marginRight: '20px' }} />
                                </a>
                                <a href="https://twitter.com/thesoftdao" target="_blank" style={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
                                    <Image src="https://soft-pump-assets.s3.amazonaws.com/x.png" height={23} width={23} alt="SOFT logo" style={{ marginRight: '20px' }} />
                                </a>
                                <a href="https://discord.com/invite/thesoftdao" target="_blank" style={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
                                    <Image src="https://soft-pump-assets.s3.amazonaws.com/discord.png" height={23} width={23} alt="SOFT logo" />
                                </a>
                            </div>
                        </div>
                    )
                )
            ) : (
                <div className="h-screen w-screen bg-gradient-linear p-20 flex flex-col justify-center items-center">
                    <h1 className="text-white text-xl mb-6">please authenticate to access launch tooling</h1>
                    <input placeholder="enter your wallet address" className="bg-white text-black p-2 rounded-md mb-2 w-[20%]" type="text" value={walletAddress} onChange={(e) => setWalletAddress(e.target.value)} />
                    <input placeholder="enter your passphrase" className="bg-white text-black p-2 rounded-md mt-2 w-[20%]" type="password" value={passphrase} onChange={(e) => setPassphrase(e.target.value)} />
                    <button style={{ color: '#17101F' }} className="bg-white font-bold p-2 rounded-md mt-4" onClick={handleAuthentication}>authenticate</button>
                    <div style={{ position: 'absolute', display: 'flex', bottom: '0', left: '0', padding: '10px' }}>
                        <a href="https://www.thesoftdao.com/" target="_blank" style={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
                            <Image src="https://soft-pump-assets.s3.amazonaws.com/bg-blue_fg-white-removebg-preview.png" height={50} width={50} alt="SOFT logo" />
                        </a>
                    </div>
                    <div style={{ position: 'absolute', display: 'flex', bottom: '0', right: '0', padding: '10px' }}>
                        <a href="https://warpcast.com/thesoftdao" target="_blank" style={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
                            <Image src="https://soft-pump-assets.s3.amazonaws.com/warpcast.png" height={25} width={25} alt="SOFT logo" style={{ marginRight: '20px' }} />
                        </a>
                        <a href="https://twitter.com/thesoftdao" target="_blank" style={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
                            <Image src="https://soft-pump-assets.s3.amazonaws.com/x.png" height={23} width={23} alt="SOFT logo" style={{ marginRight: '20px' }} />
                        </a>
                        <a href="https://discord.com/invite/thesoftdao" target="_blank" style={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
                            <Image src="https://soft-pump-assets.s3.amazonaws.com/discord.png" height={23} width={23} alt="SOFT logo" />
                        </a>
                    </div>
                </div>
            )}
        </>
    );
}


