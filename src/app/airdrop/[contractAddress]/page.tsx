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

    const [csvData, setCSVData]: any = useState([]);
    const [customNow, setCustomNow]: any = useState(true);
    const [customDelay, setCustomDelay]: any = useState(null);

    const [followers, setFollowers]: any = useState('soft');
    const [defaultNow, setDefaultNow]: any = useState(true);
    const [defaultDelay, setDefaultDelay]: any = useState(null);
    const [warpcastUsername, setWarpcastUsername]: any = useState(null);

    useEffect(() => {
        setIsAuthenticated(false);
    }, []);

    useEffect(() => {
        axios.get(`/api/airdrop?contractAddress=${params.contractAddress}`).then((res) => {
            setToken(res.data);
            setLoading(false);
        }).catch((err) => {
            console.log(err);
            setLoading(false);
        });
    }, [isAuthenticated]);

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
                return alert('authentication failed');
            }
        }
    }

    const handleCSVUpload = async (e: any) => {
        e.preventDefault();
        const file = e.target.files[0];

        const parsedData = await new Promise((resolve, reject) => {
            const reader = new FileReader();
            reader.onload = (e) => {
                const text = e.target?.result as string;
                const rows = text.split('\n');

                if (rows[0].split(',')[0] !== 'address' || rows[0].split(',')[1].split('\r')[0] !== 'allocation') {
                    alert('invalid csv format');
                    const csvInput = document.getElementById('csv-input') as HTMLInputElement;
                    csvInput.value = '';
                    return;
                }

                const data = rows.map((row: any) => {
                    const columns = row.split(',');
                    return {
                        address: columns[0],
                        allocation: columns[1]
                    };
                });
                resolve(data);
            };
            reader.readAsText(file);
        });

        setCSVData(parsedData);
    };

    // const handleSubmit = async (e: any) => {
    //     e.preventDefault();

    //     try {

    //         const response = await axios.get(`/api/airdrop`, {
    //             contractAddress: params.contractAddress,
    //             csvData,
    //             customNow,
    //             customDelay,
    //             followers,
    //             defaultNow,
    //             defaultDelay,
    //             warpcastUsername
    //         });

    //         if (response.data.success) {

    //             if (customDelay || defaultDelay) {
    //                 return alert('airdrop scheduled!');
    //             } else {
    //                 return alert('airdrop successful!');
    //             }

    //         } else {
    //             return alert('airdrop failed');
    //         }

    //     } catch (e: any) {
    //         console.log(e);
    //         return alert('airdrop failed');
    //     }

    // };

    const handleSubmit = (e: any) => {
        e.preventDefault();
    }
    
    const handleClear = async (e: any) => {
        e.preventDefault();
        setCSVData([]);
        const csvInput = document.getElementById('csv-input') as HTMLInputElement;
        csvInput.value = '';
        setCustomNow(true);
        setCustomDelay(null);
        setFollowers('soft');
        setDefaultNow(true);
        setDefaultDelay(null);
        setWarpcastUsername(null);
        alert('configuration cleared!');
    };

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
                            <Image src="https://soft-pump-assets.s3.amazonaws.com/warpcast.png" height={25} width={25} alt="Warpcast logo" style={{ marginRight: '20px' }} />
                        </a>
                        <a href="https://twitter.com/thesoftdao" target="_blank" style={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
                            <Image src="https://soft-pump-assets.s3.amazonaws.com/x.png" height={23} width={23} alt="Twitter logo" style={{ marginRight: '20px' }} />
                        </a>
                        <a href="https://discord.com/invite/thesoftdao" target="_blank" style={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
                            <Image src="https://soft-pump-assets.s3.amazonaws.com/discord.png" height={23} width={23} alt="Discord logo" />
                        </a>
                        </div>
                    </div>
                ) : (
                    token ? (
                        <div style={{ background: `linear-gradient(to right, #${token.gradientStart}, #${token.gradientEnd})`, color: token.textColor }} className="h-screen w-screen p-20 flex flex-col justify-center items-center">
                            <h1 className="text-[40px]">configure an airdrop for <span className="font-bold">{token.tokenTicker}</span></h1>
                            {/* button to copy token address w/ styling */}
                            <h1 className="mt-4 mb-2">upload a .csv of wallets and allocations or choose from the default settings</h1>
                            <h1 className="mb-8 text-xs">if you upload a .csv, the first column must be &quot;address&quot; and the second must be &quot;allocation&quot;</h1>
                            <div className="w-full flex items-start justify-center">
                                <div className="w-[40%] flex flex-col items-center justify-center border-2 border-white p-4 rounded-md">
                                    <h1 className="text-lg mb-2 font-bold">upload a .csv</h1>
                                    <input
                                        type="file"
                                        id="csv-input"
                                        accept=".csv"
                                        className="p-2 rounded-md w-[300px]"
                                        placeholder="upload a .csv"
                                        onChange={handleCSVUpload}
                                    />
                                    <div className="w-full flex items-center justify-evenly mt-4">
                                        <div className="flex items-center justify-center">
                                            <input
                                                type="radio"
                                                id="customNow"
                                                name="customNow"
                                                value="customNow"
                                                checked={customNow}
                                                onChange={() => setCustomNow(true)}
                                            />
                                            <label htmlFor="customNow" className="ml-2 mr-2">send now</label>
                                        </div>
                                        <div className="flex items-center justify-center">
                                            <input
                                                type="radio"
                                                id="customDelay"
                                                name="customDelay"
                                                value="customDelay"
                                                checked={!customNow}
                                                onChange={() => setCustomNow(false)}
                                            />
                                            <label htmlFor="customDelay" className="ml-2 mr-2">enter custom delay</label>
                                        </div>
                                    </div>
                                    {
                                        !customNow && (
                                            <input
                                                type="text"
                                                className="p-2 rounded-md w-[300px] mt-4"
                                                style={{ color: `#${token.gradientStart}` }}
                                                placeholder="enter delay in hours"
                                                value={customDelay}
                                                onChange={(e) => setCustomDelay(e.target.value)}
                                            />
                                        )
                                    }
                                </div>

                                <div className="w-[20%] flex h-[1px]" />

                                <div className="w-[40%] flex flex-col items-center justify-center border-2 border-white p-4 rounded-md">
                                    <h1 className="text-lg mb-2 font-bold">choose from default settings</h1>
                                    <div className="w-full flex items-center justify-evenly mt-4">
                                        <div className="flex items-center justify-center">
                                            <input
                                                type="radio"
                                                id="ownFollowers"
                                                name="ownFollowers"
                                                value="ownFollowers"
                                                checked={followers == 'own'}
                                                onChange={() => setFollowers('own')}
                                            />
                                            <label htmlFor="ownFollowers" className="ml-2 mr-2">reward your followers</label>
                                        </div>
                                        <div className="flex items-center justify-center">
                                            <input
                                                type="radio"
                                                id="softFollowers"
                                                name="softFollowers"
                                                value="softFollowers"
                                                checked={followers == 'soft'}
                                                onChange={() => setFollowers('soft')}
                                            />
                                            <label htmlFor="softFollowers" className="ml-2 mr-2">reward SOFT&apos;s followers</label>
                                        </div>
                                    </div>
                                    {
                                        followers == "own" && (
                                            <input
                                                type="text"
                                                className="p-2 rounded-md w-[300px] mt-4"
                                                style={{ color: `#${token.gradientStart}` }}
                                                placeholder="enter your warpcast username"
                                                value={warpcastUsername}
                                                onChange={(e) => setWarpcastUsername(e.target.value)}
                                            />
                                        )
                                    }
                                    <div className="w-full flex items-center justify-evenly mt-4">
                                        <div className="flex items-center justify-center">
                                            <input
                                                type="radio"
                                                id="defaultNow"
                                                name="defaultNow"
                                                value="defaultNow"
                                                checked={defaultNow}
                                                onChange={() => setDefaultNow(true)}
                                            />
                                            <label htmlFor="defaultNow" className="ml-2 mr-2">send now</label>
                                        </div>
                                        <div className="flex items-center justify-center">
                                            <input
                                                type="radio"
                                                id="defaultDelay"
                                                name="defaultDelay"
                                                value="defaultDelay"
                                                checked={!defaultNow}
                                                onChange={() => setDefaultNow(false)}
                                            />
                                            <label htmlFor="defaultDelay" className="ml-2 mr-2">enter custom delay</label>
                                        </div>
                                    </div>
                                    {
                                        !defaultNow && (
                                            <input
                                                type="text"
                                                className="p-2 rounded-md w-[300px] mt-4"
                                                style={{ color: `#${token.gradientStart}` }}
                                                placeholder="enter delay in hours"
                                                value={defaultDelay}
                                                onChange={(e) => setDefaultDelay(e.target.value)}
                                            />
                                        )
                                    }
                                </div>
                            </div>

                            <div className="w-full flex items-center justify-center mt-8">
                                <button style={{ color: `#${token.gradientStart}` }} onClick={handleSubmit} className="bg-white font-bold ml-4 p-2 rounded-md">launch airdrop</button>
                            </div>

                            <div className="w-full flex items-center justify-center mt-4">
                                <button onClick={handleClear} className="bg-gray-700 text-white font-bold ml-4 p-2 text-xs rounded-md">clear</button>
                            </div>
                            <div style={{ position: 'absolute', display: 'flex', bottom: '0', left: '0', padding: '10px' }}>
                            <a href="https://www.thesoftdao.com/" target="_blank" style={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
                                <Image src="https://soft-pump-assets.s3.amazonaws.com/bg-blue_fg-white-removebg-preview.png" height={50} width={50} alt="SOFT logo" />
                            </a>
                            </div>
                            <div style={{ position: 'absolute', display: 'flex', bottom: '0', right: '0', padding: '10px' }}>
                            <a href="https://warpcast.com/thesoftdao" target="_blank" style={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
                                <Image src="https://soft-pump-assets.s3.amazonaws.com/warpcast.png" height={25} width={25} alt="Warpcast logo" style={{ marginRight: '20px' }} />
                            </a>
                            <a href="https://twitter.com/thesoftdao" target="_blank" style={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
                                <Image src="https://soft-pump-assets.s3.amazonaws.com/x.png" height={23} width={23} alt="Twitter logo" style={{ marginRight: '20px' }} />
                            </a>
                            <a href="https://discord.com/invite/thesoftdao" target="_blank" style={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
                                <Image src="https://soft-pump-assets.s3.amazonaws.com/discord.png" height={23} width={23} alt="Discord logo" />
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
                                <Image src="https://soft-pump-assets.s3.amazonaws.com/warpcast.png" height={25} width={25} alt="Warpcast logo" style={{ marginRight: '20px' }} />
                            </a>
                            <a href="https://twitter.com/thesoftdao" target="_blank" style={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
                                <Image src="https://soft-pump-assets.s3.amazonaws.com/x.png" height={23} width={23} alt="Twitter logo" style={{ marginRight: '20px' }} />
                            </a>
                            <a href="https://discord.com/invite/thesoftdao" target="_blank" style={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
                                <Image src="https://soft-pump-assets.s3.amazonaws.com/discord.png" height={23} width={23} alt="Discord logo" />
                            </a>
                            </div>
                        </div>
                    )
                )
            ) : (
                <div className="h-screen w-screen bg-gradient-linear p-20 flex flex-col justify-center items-center">
                    <h1 className="text-white text-xl mb-6">please authenticate to access airdrop tooling</h1>
                    <input placeholder="enter your wallet address" className="bg-white text-black p-2 rounded-md mb-2 w-[20%]" type="text" value={walletAddress} onChange={(e) => setWalletAddress(e.target.value)} />
                    <input placeholder="enter your passphrase" className="bg-white text-black p-2 rounded-md mt-2 w-[20%]" type="text" value={passphrase} onChange={(e) => setPassphrase(e.target.value)} />
                    <button style={{ color: '#17101F' }} className="bg-white font-bold p-2 rounded-md mt-4" onClick={handleAuthentication}>authenticate</button>
                    <div style={{ position: 'absolute', display: 'flex', bottom: '0', left: '0', padding: '10px' }}>
                    <a href="https://www.thesoftdao.com/" target="_blank" style={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
                        <Image src="https://soft-pump-assets.s3.amazonaws.com/bg-blue_fg-white-removebg-preview.png" height={50} width={50} alt="SOFT logo" />
                    </a>
                    </div>
                    <div style={{ position: 'absolute', display: 'flex', bottom: '0', right: '0', padding: '10px' }}>
                    <a href="https://warpcast.com/thesoftdao" target="_blank" style={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
                        <Image src="https://soft-pump-assets.s3.amazonaws.com/warpcast.png" height={25} width={25} alt="Warpcast logo" style={{ marginRight: '20px' }} />
                    </a>
                    <a href="https://twitter.com/thesoftdao" target="_blank" style={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
                        <Image src="https://soft-pump-assets.s3.amazonaws.com/x.png" height={23} width={23} alt="Twitter logo" style={{ marginRight: '20px' }} />
                    </a>
                    <a href="https://discord.com/invite/thesoftdao" target="_blank" style={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
                        <Image src="https://soft-pump-assets.s3.amazonaws.com/discord.png" height={23} width={23} alt="Discord logo" />
                    </a>
                    </div>
                </div>
            )}
        </>
    );
}


