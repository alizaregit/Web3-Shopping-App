import { useSelector, useDispatch } from "react-redux";
import { useState } from "react";
import abi from "../utils/MINKtoken.json";
import {
  RemoveAllCart,
  RemoveFromCart,
} from "../ReduxStore/features/CartSlicer";
import {
  CleanCart,
  CartDecremented,
} from "../ReduxStore/features/CartCounterSlicer";
import {
  useContractWrite,
  usePrepareContractWrite,
  useWaitForTransaction,
  useContractEvent,
  useBalance,
  useAccount,
} from "wagmi";
import { useEffect } from "react";
import { Link } from "react-router-dom";
import EtherscanIcon from "../assets/svg/etherscan-logo-light-circle.svg";

const Cart = () => {
  const AddedProducts = useSelector((state) => state.Cart);
  const account = useSelector((state) => state.Account);
  const DisconnectStatus = useSelector((state) => state.Disconnect);

  const dispatch = useDispatch();

  const [success, setSuccess] = useState(false);
  const [lastPurchaseDetails, setLastPurchaseDetails] = useState({});

  let TotalPrice = 0;
  let AllItems = "";
  let TotalNumOfProducts = 0;

  AddedProducts.map((item) => {
    TotalPrice += parseInt(item.price * item.count);
    AllItems += ` (${item.category} : ${item.name} × ${item.count} = ${
      item.price * item.count
    }MINK) , `;
    TotalNumOfProducts += item.count;
  });

  AllItems = AllItems.slice(0, AllItems.length - 3);

  const contractAddress = "0x2B8C1DCdc986e50e3Fb1c29F6c118535a5Cc4e42";
  const contractABI = abi.abi;
  const to = "0x465DEA85d09025A97a44eCd49e5DcA469c0ef723";

  const Account = useAccount();
  const Balance = useBalance({
    address: Account.address,
    token: contractAddress,
  });

  const { config } = usePrepareContractWrite({
    address: contractAddress,
    abi: contractABI,
    functionName: "purchase",
    args: [to, AllItems, TotalPrice * 1000],
  });
  const contractWrite = useContractWrite(config);

  const WaitForTransaction = useWaitForTransaction({
    hash: contractWrite.data?.hash,
  });

  useContractEvent({
    address: contractAddress,
    abi: contractABI,
    eventName: "purchaseDetails",
    listener(purchases, from, to, purchaseStatus) {
      const details = {
        Purchases: purchases,
        From: from,
        To: to,
        PurchaseStatus: purchaseStatus,
      };
      setLastPurchaseDetails((lastPurchaseDetails) => ({
        ...lastPurchaseDetails,
        ...details,
      }));
    },
  });

  useEffect(() => {
    checkResults();
  }, [lastPurchaseDetails]);

  const checkResults = () => {
    if (Object.keys(lastPurchaseDetails).length === 0) {
      window.setTimeout(checkResults, 1000);
    } else {
      dispatch(RemoveAllCart());
      dispatch(CleanCart());
    }
  };

  const checkOut = async () => {
    contractWrite
      .writeAsync()
      .then(() => {
        testSleep();
      })
      .catch(() => {
        if (contractWrite.isError) {
          console.error(contractWrite.error);
        }
      });
  };

  const removeItem = (ItemName) => {
    dispatch(CartDecremented(1));
    dispatch(RemoveFromCart({ name: ItemName }));
  };

  const mooninkprice = 0.328;

  const sleep = async (milliseconds) => {
    await new Promise((resolve) => {
      return setTimeout(resolve, milliseconds);
    });
  };

  const testSleep = async () => {
    setSuccess(true);

    for (let i = 1; i <= 12; i++) {
      await sleep(1000);
    }
    setSuccess(false);
  };

  let mainbodyClass = "";
  if (TotalPrice === 0) {
    mainbodyClass =
      "p-5 flex h-full bg-gradient-to-b from-maindarkpurple/20 to-maindarkpurple flex-col";
  } else {
    mainbodyClass =
      "p-5 flex bg-gradient-to-b from-maindarkpurple/20 to-maindarkpurple flex-col";
  }

  let successcontainer;
  let successmessage;
  let trxhash = "#";

  if (!success) {
    successcontainer =
      "fixed w-0 h-0 delay-300 overflow-hidden bottom-5 right-5";
    successmessage =
      "translate-x-full w-full capitalize font-semibold cursor-default tracking-wide h-full flex flex-col gap-1 items-center justify-center text-lg bg-white/10 backdrop-blur-lg rounded duration-300";
  } else {
    successcontainer = "fixed z-50 w-72 h-24 overflow-hidden bottom-5 right-5";
    successmessage =
      "translate-x-0 w-full px-2 capitalize font-semibold cursor-default tracking-wide h-full flex flex-col gap-1 items-center justify-center text-lg bg-white/10 backdrop-blur-lg rounded-md duration-300";
    trxhash = `https://goerli.etherscan.io/tx/${contractWrite.data?.hash}`;
  }

  return (
    <div className={mainbodyClass}>
      <div className="flex ease-in drop justify-between items-center gap-5  pb-5 font-semibold text-lg md:text-2xl">
        <h2>YOUR SHOPPING BAG</h2>
        <span className="bg-violet-500/70 rounded-lg py-0.5 px-2.5 text-base">{`${TotalNumOfProducts}`}</span>
      </div>

      <section className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-5 w-full">
        <div className={successcontainer}>
          <div className={successmessage}>
            <span className="mt-2">Transaction Submitted!</span>
            <a
              target="_blank"
              href={trxhash}
              className="flex items-center justify-center py-2 gap-x-2 w-full bg-violet-600 mb-1 font-medium mt-1.5 rounded-md hover:bg-violet-500 duration-200"
            >
              <img src={EtherscanIcon} className="w-5" />
              Etherscan
            </a>
          </div>
        </div>

        {TotalPrice === 0 && (
          <div className="flex flex-col gap-5 mt-5">
            <div className="flex items-center justify-start">
              <p className="text-base">Your Shopping bag is empty</p>
            </div>
            <Link to="../../Tshirts" className="w-max">
              <button className="rounded-lg font-semibold tracking-wide text-sm p-2.5 bg-violet-500">
                Continue Shopping
              </button>
            </Link>
          </div>
        )}
        {AddedProducts.map((item, index) => {
          return (
            <div key={index} className="w-full flex flex-col overflow-hidden">
              <img
                src={item.image}
                alt={item.name}
                className="h-full rounded-xl"
              />
              <div className="py-5 font-semibold flex flex-col gap-3">
                <div className="bg-violet-500/30 py-1 px-1 rounded-lg flex justify-between">
                  <div className="w-full flex justify-between items-center pr-1">
                    <Link
                      className="bg-violet-600/50 py-0.5 px-1.5 rounded-md hover:underline underline-offset-2"
                      to={`../${item.category}/${item.name}`}
                    >
                      <p>{item.name}</p>
                    </Link>
                    <span className="">{item.count}×</span>
                  </div>
                </div>
                <p className="flex items-center gap-2 font-medium">
                  {item.price} MINK
                  <span className="text-slate-300">{`≈ $${Math.floor(
                    item.price * mooninkprice
                  )}`}</span>
                </p>

                <span
                  className="cursor-pointer font-normal underline w-min underline-offset-2 text-base hover:no-underline"
                  onClick={() => removeItem(item.name)}
                >
                  remove
                </span>
              </div>
            </div>
          );
        })}
      </section>
      <hr className="border-0 h-0.5 bg-white/10 mt-5" />
      {TotalPrice > 0 && (
        <section className="flex gap-9 pt-10 flex-col">
          <p className="text-xl font-semibold">YOUR ORDER SUMMARY</p>

          <section className="flex flex-col tracking-wide gap-2.5 text-sm">
            <div className="flex justify-between">
              <p>SUBTOTAL</p>
              <p>{`${TotalPrice} MINK ≈ $${Math.floor(
                TotalPrice * mooninkprice
              )}`}</p>
            </div>
            <div className="flex justify-between">
              <p>SHIPPING</p>
              <p>FREE</p>
            </div>
            <div className="flex justify-between">
              <p>TOTAL (VAT INCLUDED)</p>
              <p>{`${TotalPrice - 0} MINK ≈ $${Math.floor(
                TotalPrice * mooninkprice - 0
              )}`}</p>
            </div>
          </section>

          {(() => {
            if (!DisconnectStatus && account) {
              if (TotalPrice === 0) {
                return (
                  <button
                    disabled
                    className="px-7 text-xl py-3 capitalize rounded-xl text-gray-800 bg-gray-600 cursor-not-allowed"
                  >
                    Your Shopping Bag is Empty!
                  </button>
                );
              }
              if (Balance.data) {
                if (Balance.data.value / 1000 < TotalPrice) {
                  return (
                    <button
                      disabled
                      className="px-7 py-3 flex justify-center items-center gap-3 capitalize rounded-xl text-xl text-center font-semibold text-gray-800 bg-gray-600 cursor-not-allowed"
                    >
                      {`you need ${
                        TotalPrice - Balance.data?.value / 1000
                      } more MINKs`}
                    </button>
                  );
                }
              }
              if (contractWrite.isLoading) {
                return (
                  <button
                    disabled
                    className="px-7 py-3 flex justify-center items-center gap-3 capitalize rounded-xl text-xl text-center font-semibold text-white bg-violet-600 ring-4 ring-violet-500/40"
                  >
                    Confirm the Transaction
                    <span className="loader"></span>
                  </button>
                );
              } else if (WaitForTransaction.isLoading) {
                return (
                  <button
                    disabled
                    className="px-7 py-3 flex justify-center items-center gap-3 capitalize rounded-xl text-xl text-center font-semibold text-white bg-violet-600 ring-4 ring-violet-500/40"
                  >
                    Wait for Transaction
                    <span className="loader"></span>
                  </button>
                );
              } else if (WaitForTransaction.isSuccess) {
                return (
                  <button
                    disabled
                    className="px-7 py-3 flex justify-center items-center gap-3 capitalize rounded-xl text-xl text-center font-semibold text-white bg-green-500 ring-4 ring-green-500/50"
                  >
                    success!
                  </button>
                );
              } else {
                return (
                  <button
                    onClick={checkOut}
                    className="px-7 py-3 capitalize rounded-xl text-xl text-center font-semibold text-white bg-violet-600 ring-4 ring-violet-500/40 hover:bg-violet-500 active:ring-0 duration-200"
                  >
                    Checkout with Your Wallet
                  </button>
                );
              }
            } else {
              return (
                <button
                  disabled
                  className="px-7 text-xl py-3 font-semibold capitalize rounded-xl text-black/80 bg-gray-600 cursor-not-allowed"
                >
                  Connect Your Wallet
                </button>
              );
            }
          })()}
        </section>
      )}
    </div>
  );
};

export default Cart;
