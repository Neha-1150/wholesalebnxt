import { useSession } from "next-auth/client";
import React, { useState, useEffect } from "react";
import axios from "axios";
import Image from "next/image";
import CopyToClipboard from "react-copy-to-clipboard";
import { useRouter } from "next/router";

function wheel({ items, onSelectItem }) {
  const [noOfAttemptsLeft, setNoOfAttemptsLeft] = useState(0);
  const [selectedItem, setSelectedItem] = useState(null);
  const [spining, setSpining] = useState(false);
  const [codeCopied, setCodeCopied] = useState(false);
  const [wonCoupon, setWonCoupon] = useState()
  const [loseCoupon, setLoseCoupon] = useState()

  const [session] = useSession();
  const router = useRouter()

  useEffect(() => {
    if (session) checkSpinsLeftToday();
  }, [session]);

  const checkSpinsLeftToday = async () => {
    const res = await axios.get(`${process.env.NEXT_PUBLIC_API_URL}/checkTodaysAttemptLeft`, { headers: { Authorization: `Bearer ${session?.jwt}` } });
    if (res.status == 200) {
      setNoOfAttemptsLeft(res.data.attemptsLeft);
    }
  };

  const wheelVars = {
    "--nb-item": items.length,
    "--selected-item": selectedItem,
  };

  const selectItem = async () => {
    if (noOfAttemptsLeft != 0) {
      setSpining(true);
      try {
        const res = await axios.post(
          `${process.env.NEXT_PUBLIC_API_URL}/registerTurn`,
          {},
          {
            headers: {
              Authorization: `Bearer ${session?.jwt}`,
            },
          }
        );
        if (res.status == 200) {
          setSelectedItem(res.data.option);
          checkSpinsLeftToday();

          setTimeout(() => {
            setSpining(false);
            if(res.data.discountCode){
              setWonCoupon(res.data.discountCode)
            }else{
              setLoseCoupon(true)
            }
          }, 5000);

          if (onSelectItem) {
            onSelectItem(res.data.option);
          }
        } else {
          setSelectedItem(null);
          setSpining(false);
        }
      } catch (error) {
        setSelectedItem(null);
        setSpining(false);
      }
    }
  };

  return (
    <div className="wheel-page">
      <div className="flex flex-col items-center justify-center mt-[50px] mb-[30px]">
        <div className="text-3xl font-bold text-white">Spin To Win</div>
        <div className="text-lg text-white">Spin the wheel to win exciting discounts</div>
      </div>

      <div className="wheel-container">
        <div className={`wheel ${spining ? "spinning" : ""}`} style={wheelVars}>
          {items.map((item, index) => (
            <div className="wheel-item" key={index} style={{ "--item-nb": index + 1 }}>
              {item}
            </div>
          ))}
        </div>
      </div>

      <div className="flex justify-center mt-[60px]">
        <button onClick={selectItem} className="bg-amber-400 px-6 py-3 drop-shadow-lg rounded text-lg text-white text-2xl font-bold">
          {noOfAttemptsLeft == 0 ? 'More Spins Coming Tomorrow' : `Spin left : ${noOfAttemptsLeft}`}
        </button>
      </div>


      {wonCoupon && (
        <div className="absolute top-0 left-0 w-screen h-screen bg-black/25 z-10">
          <div className="pyro absolute top-[25%] left-0 w-screen">
            <div className="before"></div>
            <div className="after"></div>

            <div className="w-screen flex justify-center mt-[20%]">
              <div className="bg-white w-[60%] p-3 py-5 flex flex-col items-center rounded shadow">
                <div className="mt-5">You Won Discount Coupon</div>
                <div className="flex items-center m-3">
                  <div className="py-2 px-4 border-2 border-orange-300 border-dashed bg-orange-100">{wonCoupon.discountCode}</div>
                  <div className="border-2 border-l-0 py-2 px-3">
                    <CopyToClipboard text="TEST_1" onCopy={() => setCodeCopied(true)}>
                      {codeCopied ? (
                        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-6 h-6">
                          <path fillRule="evenodd" d="M10.5 3A1.501 1.501 0 009 4.5h6A1.5 1.5 0 0013.5 3h-3zm-2.693.178A3 3 0 0110.5 1.5h3a3 3 0 012.694 1.678c.497.042.992.092 1.486.15 1.497.173 2.57 1.46 2.57 2.929V19.5a3 3 0 01-3 3H6.75a3 3 0 01-3-3V6.257c0-1.47 1.073-2.756 2.57-2.93.493-.057.989-.107 1.487-.15z" clipRule="evenodd" />
                        </svg>
                      ) : (
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
                          <path strokeLinecap="round" strokeLinejoin="round" d="M15.666 3.888A2.25 2.25 0 0013.5 2.25h-3c-1.03 0-1.9.693-2.166 1.638m7.332 0c.055.194.084.4.084.612v0a.75.75 0 01-.75.75H9a.75.75 0 01-.75-.75v0c0-.212.03-.418.084-.612m7.332 0c.646.049 1.288.11 1.927.184 1.1.128 1.907 1.077 1.907 2.185V19.5a2.25 2.25 0 01-2.25 2.25H6.75A2.25 2.25 0 014.5 19.5V6.257c0-1.108.806-2.057 1.907-2.185a48.208 48.208 0 011.927-.184" />
                        </svg>
                      )}
                    </CopyToClipboard>
                  </div>
                </div>
                <div className="text-center text-sm text-green-800 font-bold">{wonCoupon.description}</div>
                <div className="text-center text-sm text-gray-500 mt-1">Coupon Code has been sent to your registered email ID and Whatsapp</div>

                <button onClick={() => router.reload()} className="bg-amber-400 px-4 py-2 rounded text-white font-bold mt-6">Claim</button>
                <button className="px-4 py-3 rounded text-sm underline">How to Use?</button>
              </div>
            </div>
          </div>
        </div>
      )}

      {loseCoupon && (
        <div className="absolute top-0 left-0 w-screen h-screen bg-black/25 z-10">
          <div className="w-screen flex justify-center mt-[60%]">
            <div className="bg-white w-[60%] p-3 py-5 flex flex-col items-center rounded shadow">
              <div className="mt-5">Sorry!! Better Luck Next Time</div>
              <button onClick={() => router.reload()} className="bg-amber-400 px-4 py-3 rounded text-white font-bold mt-3">Close</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default wheel;
