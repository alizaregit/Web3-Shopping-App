import { ethers } from "ethers";
import { useState, useEffect } from "react";
import MINKabi from "../utils/MINKtoken.json";
import firstyfirst from "../assets/svg/achievement/ff.svg";
import brightway from "../assets/svg/achievement/bw.svg";
import ko from "../assets/svg/achievement/ko.svg";
import master from "../assets/svg/achievement/master.svg";
import legend from "../assets/svg/achievement/legend.svg";
import { useSelector } from "react-redux";
import NFTAbi from "../utils/MoonInkMedals.json";
import {
  useAccount,
  useContractReads,
  useContractWrite,
  usePrepareContractWrite,
  useWaitForTransaction,
  useContractEvent,
} from "wagmi";

const Bonus = () => {
  const account = useSelector((state) => state.Account);
  const disconnectStatus = useSelector((state) => state.Disconnect);

  const MINKTokenContractAddress = "0x2B8C1DCdc986e50e3Fb1c29F6c118535a5Cc4e42";
  const SoulBoundsContract = "0x748D5504958D86A0E18682aeED90f7EB45238B0F";
  const SoulBoundsContractAbi = NFTAbi.abi;

  const [totalPurchase, setTotalPurchase] = useState(0);
  const [minted, setMinted] = useState({});
  const [loading, setLoading] = useState([false, false, false, false, false]);

  const SoulBoundTokenContract = {
    address: SoulBoundsContract,
    abi: NFTAbi.abi,
  };

  const MINKTokenContract = {
    address: MINKTokenContractAddress,
    abi: MINKabi.abi,
  };

  const Account = useAccount();
  const ContractRead = useContractReads({
    contracts: [
      {
        ...MINKTokenContract,
        functionName: "getTotalPurchasePerUser",
        args: [Account.address],
      },
      {
        ...SoulBoundTokenContract,
        functionName: "getminted",
        args: [Account.address, 1],
      },
      {
        ...SoulBoundTokenContract,
        functionName: "getminted",
        args: [Account.address, 2],
      },
      {
        ...SoulBoundTokenContract,
        functionName: "getminted",
        args: [Account.address, 3],
      },
      {
        ...SoulBoundTokenContract,
        functionName: "getminted",
        args: [Account.address, 4],
      },
      {
        ...SoulBoundTokenContract,
        functionName: "getminted",
        args: [Account.address, 5],
      },
    ],
  });

  const { config } = usePrepareContractWrite({
    address: SoulBoundsContract,
    abi: NFTAbi.abi,
    functionName: "mintReward",
  });

  const ContractWrite = useContractWrite(config);

  const WaitForTransaction = useWaitForTransaction({
    hash: ContractWrite.data?.hash,
  });

  useContractEvent({
    address: SoulBoundsContract,
    abi: NFTAbi.abi,
    eventName: "TransferSingle",
    listener(operator, from, to, id, value) {
      console.log(operator, from, to, id, value);
    },
  });

  // const TotalPurchase = async () => {
  //   try {
  //     const { ethereum } = window;

  //     if (ethereum) {
  //       const provider = new ethers.providers.Web3Provider(ethereum);
  //       const signer = provider.getSigner();
  //       const minkToken = new ethers.Contract(
  //         MINKcontractAddress,
  //         contractABI,
  //         signer
  //       );

  //       const total = await minkToken.getTotalPurchasePerUser(
  //         ethereum.selectedAddress
  //       );

  //       return total;
  //     } else {
  //       console.log("Ethereum object does not found!");
  //       return null;
  //     }
  //   } catch (error) {
  //     console.error(error);
  //   }
  // };

  let SumofAllPurchaes = totalPurchase / 1000;

  const achievement = {
    FirstyFirst: 0,
    BrightWay: 100,
    KO: 500,
    Master: 1000,
    Legend: 1700,
  };

  const Mint = async (id) => {
    try {
      const { ethereum } = window;
      if (ethereum && ethereum.networkVersion === "5") {
        if (id === 5) {
          setLoading([false, false, false, false, true]);
        } else if (id === 4) {
          setLoading([false, false, false, true, false]);
        } else if (id === 3) {
          setLoading([false, false, true, false, false]);
        } else if (id === 2) {
          setLoading([false, true, false, false, false]);
        } else if (id === 1) {
          setLoading([true, false, false, false, false]);
        }
        const provider = new ethers.providers.Web3Provider(ethereum);
        const signer = provider.getSigner();
        const SoulBound = new ethers.Contract(
          SoulBoundsContract,
          SoulBoundsContractAbi,
          signer
        );

        const mint = await SoulBound.mintReward();
        console.log("minting...");
        await mint.wait();
        console.log("minted--");

        setLoading([false, false, false, false, false]);

        let mintStatus;
        let mintedResults = [];

        for (let i = 1; i <= 5; i++) {
          mintStatus = await SoulBound.getminted(ethereum.selectedAddress, i);
          mintedResults.push(mintStatus);
        }

        const mintedStatus = {
          ff: mintedResults[0],
          bw: mintedResults[1],
          ko: mintedResults[2],
          mr: mintedResults[3],
          ld: mintedResults[4],
        };

        if (
          mintedResults[0] ||
          mintedResults[1] ||
          mintedResults[2] ||
          mintedResults[3] ||
          mintedResults[4] !== null
        ) {
          setMinted((minted) => ({
            ...minted,
            ...mintedStatus,
          }));
        }
      } else {
        console.error(
          "Ethereum object does not found! or the test network you are connected with is not goerli!"
        );
      }
    } catch (error) {
      setLoading([false, false, false, false, false]);
      console.error(error);
    }
  };

  const MintSoulBound = async (id) => {
    if (id === 5) {
      setLoading([false, false, false, false, true]);
    } else if (id === 4) {
      setLoading([false, false, false, true, false]);
    } else if (id === 3) {
      setLoading([false, false, true, false, false]);
    } else if (id === 2) {
      setLoading([false, true, false, false, false]);
    } else if (id === 1) {
      setLoading([true, false, false, false, false]);
    }

    ContractWrite.writeAsync()
      .then(() => {
        console.log(ContractWrite.data.hash + ContractWrite.isSuccess);
      })
      .catch(() => {
        setLoading([false, false, false, false, false]);
      });
  };

  // const getMinted = async () => {
  //   try {
  //     const { ethereum } = window;
  //     if (ethereum) {
  //       const provider = new ethers.providers.Web3Provider(ethereum);
  //       const signer = provider.getSigner();
  //       const SoulBound = new ethers.Contract(
  //         SoulBoundsContract,
  //         SoulBoundsContractAbi,
  //         signer
  //       );

  //       let mintStatus;
  //       let mintedResults = [];

  //       for (let i = 1; i <= 5; i++) {
  //         mintStatus = await SoulBound.getminted(ethereum.selectedAddress, i);
  //         mintedResults.push(mintStatus);
  //       }

  //       return mintedResults;
  //     } else {
  //       console.log("Ethereum object does not found!");
  //       return null;
  //     }
  //   } catch (error) {
  //     console.error(error);
  //   }
  // };

  useEffect(() => {
    // const gettotal = async () => {
    //   const total = await TotalPurchase();
    //   if (total !== null) {
    //     setTotalPurchase(total);
    //   }
    // };

    setTotalPurchase(ContractRead.data[0]);

    const updateminted = async () => {
      const Minted = ContractRead.data;

      const mintedStatus = {
        ff: Minted[1],
        bw: Minted[2],
        ko: Minted[3],
        mr: Minted[4],
        ld: Minted[5],
      };

      if (
        Minted[1] ||
        Minted[2] ||
        Minted[3] ||
        Minted[4] ||
        Minted[5] !== null
      ) {
        setMinted((minted) => ({
          ...minted,
          ...mintedStatus,
        }));
      }
    };

    updateminted().catch(console.error);
    // gettotal().catch(console.error);
  }, []);

  console.log(minted);

  if (account && !disconnectStatus && SumofAllPurchaes === 0) {
    return (
      <div className="h-full bg-gradient-to-b from-maindarkpurple/20 to-maindarkpurple p-5">
        <h1 className="font-bold text-4xl">Achievements</h1>
        <hr className="border-0 h-0.5 bg-violet-500/20 mt-5" />
        <section className="flex capitalize text-center h-full text-3xl items-center justify-center">
          You're not eligible yet!
        </section>
      </div>
    );
  } else if (account && !disconnectStatus) {
    return (
      <main className="p-5 flex flex-col bg-gradient-to-b from-maindarkpurple/20 to-maindarkpurple gap-7">
        <h1 className="font-bold text-4xl">Achievements</h1>
        <hr className="border-0 h-0.5 bg-violet-500/20" />
        <div className="flex justify-between">
          <span className="text-xl">{`Total Purchases`}</span>
          <span className="text-xl">{`${SumofAllPurchaes} MINK`}</span>
        </div>
        <hr className="border-0 h-0.5 bg-violet-500/20" />
        <div className="grid p-5 sm:p-0 grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-10">
          {SumofAllPurchaes >= achievement.Legend && (
            <div className="flex flex-col gap-5 ">
              <img src={legend} className="w-full" />
              {(() => {
                if (!minted.ld) {
                  if (!loading[4]) {
                    return (
                      <button
                        onClick={() => Mint(5)}
                        className="px-4 w-full uppercase font-semibold  py-3 bg-achgold rounded-full ring-4 ring-achgold/50 text-xl hover:ring-0 duration-200 "
                      >
                        free MINT Legend
                      </button>
                    );
                  } else {
                    return (
                      <button className="px-4 w-full font-semibold flex items-center justify-center gap-3 py-3 bg-achgold rounded-full ring-4 ring-achgold/50 text-xl hover:ring-0 duration-200 ">
                        MINTING
                        <span className="loader"></span>
                      </button>
                    );
                  }
                } else {
                  return (
                    <button
                      disabled
                      className="px-4 font-semibold w-full py-3 bg-gray-600 text-black rounded-full ring-4 ring-gray-500/50 text-xl cursor-notring-0 "
                    >
                      {" "}
                      You've Claimed it!
                    </button>
                  );
                }
              })()}
            </div>
          )}

          {SumofAllPurchaes >= achievement.Master && (
            <div className="flex flex-col gap-5 ">
              <img src={master} alt="FIRSTYFIRST" className="w-full" />
              {(() => {
                if (!minted.mr) {
                  if (!loading[3]) {
                    return (
                      <button
                        onClick={() => Mint(4)}
                        className="px-4 w-full uppercase font-semibold  py-3 bg-achred rounded-full ring-4 ring-achred/50 text-xl hover:ring-0 duration-200 "
                      >
                        free MINT master
                      </button>
                    );
                  } else {
                    return (
                      <button className="px-4 w-full font-semibold flex items-center justify-center gap-3 py-3 bg-achred rounded-full ring-4 ring-achred/50 text-xl hover:ring-0 duration-200 ">
                        MINTING
                        <span className="loader"></span>
                      </button>
                    );
                  }
                } else {
                  return (
                    <button
                      disabled
                      className="px-4 font-semibold w-full py-3 bg-gray-600 text-black rounded-full ring-4 ring-gray-500/50 text-xl cursor-notring-0 "
                    >
                      {" "}
                      You've Claimed it!
                    </button>
                  );
                }
              })()}
            </div>
          )}

          {SumofAllPurchaes >= achievement.KO && (
            <div className="flex flex-col gap-5 ">
              <img src={ko} alt="FIRSTYFIRST" className="w-full" />
              {(() => {
                if (!minted.ko) {
                  if (!loading[2]) {
                    return (
                      <button
                        onClick={() => Mint(3)}
                        className="px-4 w-full uppercase font-semibold  py-3 bg-achpink rounded-full ring-4 ring-achpink/50 text-xl hover:ring-0 duration-200 "
                      >
                        free MINT KO!
                      </button>
                    );
                  } else {
                    return (
                      <button className="px-4 w-full font-semibold flex items-center justify-center gap-3 py-3 bg-achpink rounded-full ring-4 ring-achpink/50 text-xl hover:ring-0 duration-200 ">
                        MINTING
                        <span className="loader"></span>
                      </button>
                    );
                  }
                } else {
                  return (
                    <button
                      disabled
                      className="px-4 font-semibold w-full py-3 bg-gray-600 text-black rounded-full ring-4 ring-gray-500/50 text-xl cursor-notring-0 "
                    >
                      {" "}
                      You've Claimed it!
                    </button>
                  );
                }
              })()}
            </div>
          )}

          {SumofAllPurchaes >= achievement.BrightWay && (
            <div className="flex flex-col gap-5">
              <img src={brightway} alt="FIRSTYFIRST" className="w-full" />
              {(() => {
                if (!minted.bw) {
                  if (!loading[1]) {
                    return (
                      <button
                        onClick={() => Mint(2)}
                        className="px-4 font-semibold uppercase py-3 bg-achblue rounded-full ring-4 ring-achblue/50 text-xl hover:ring-0 duration-200 "
                      >
                        free MINT BRIGHTWAY
                      </button>
                    );
                  } else {
                    return (
                      <button className="px-4 font-semibold flex items-center justify-center gap-3 py-3 bg-achblue rounded-full ring-4 ring-achblue/50 text-xl hover:ring-0 duration-200 ">
                        MINTING
                        <span className="loader"></span>
                      </button>
                    );
                  }
                } else {
                  return (
                    <button
                      disabled
                      className="px-4 font-semibold  py-3 bg-gray-600 text-black rounded-full ring-4 ring-gray-500/50 text-xl cursor-notring-0 "
                    >
                      {" "}
                      You've Claimed it!
                    </button>
                  );
                }
              })()}
            </div>
          )}

          {SumofAllPurchaes > achievement.FirstyFirst && (
            <div className="flex flex-col items-center gap-5">
              <img src={firstyfirst} alt="FIRSTYFIRST" className="w-full" />
              {(() => {
                if (!minted.ff) {
                  if (!loading[0]) {
                    return (
                      <button
                        onClick={() => MintSoulBound(1)}
                        className="px-4 w-full uppercase font-semibold  py-3 bg-achpurple rounded-full ring-4 ring-achpurple/50 text-xl hover:ring-0 duration-200 "
                      >
                        free MINT FirstyFirst
                      </button>
                    );
                  } else {
                    return (
                      <button className="px-4 w-full font-semibold flex items-center justify-center gap-3 py-3 bg-achpurple rounded-full ring-4 ring-achpurple/50 text-xl hover:ring-0 duration-200 ">
                        MINTING
                        <span className="loader"></span>
                      </button>
                    );
                  }
                } else {
                  return (
                    <button
                      disabled
                      className="px-4 font-semibold w-full py-3 bg-gray-600 text-black rounded-full ring-4 ring-gray-500/50 text-xl cursor-notring-0 "
                    >
                      {" "}
                      You've Claimed it!
                    </button>
                  );
                }
              })()}
            </div>
          )}
        </div>
      </main>
    );
  } else {
    return (
      <div className="h-full p-5 bg-gradient-to-b from-maindarkpurple/20 to-maindarkpurple">
        <h1 className="font-bold text-4xl">Achievements</h1>
        <hr className="border-0 h-0.5 bg-violet-500/20 mt-5" />
        <section className="flex capitalize text-center h-full text-3xl items-center justify-center">
          connect your Wallet
        </section>
      </div>
    );
  }
};

export default Bonus;
