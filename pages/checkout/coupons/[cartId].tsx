import axios from "axios";
import { getSession } from "next-auth/client";
import { useRouter } from "next/router";
import React, { useEffect, useState } from "react";
import AppLayout from "../../../components/app/layouts/AppLayout";
import withFullLoader from "../../../hocs/withFullLoader";
import { classNames } from "../../../utilities";

function coupons({ checkoutData, setLoading }) {
  const [coupons, setCoupons] = useState([]);
  const [selectedCoupon, setSelectedCoupon] = useState()
  const router = useRouter();

  useEffect(() => getUserCopouns(), []);

  const getUserCopouns = async () => {
    setLoading(true)
    try {
      const session = await getSession();
      const res = await axios.get(`${process.env.NEXT_PUBLIC_API_URL}/getDiscountCodesForUserByCartId/${checkoutData.id}`, {
        headers: {
          Authorization: "Bearer " + session.jwt,
        },
      });
      if (res?.status === 200) {
        setLoading(false)
        console.log(res.data);
        setCoupons(res.data.coupons);
      }
    } catch (error) {
      setLoading(false)
      console.error(error);
      return false;
    }
  };

  const selectCoupon = (couponIndex) => {
    setSelectedCoupon(coupons[couponIndex])
    applyDiscountCouponToCart(coupons[couponIndex].discountCode)
  }


  const applyDiscountCouponToCart = async (discountCode) => {
      setLoading(true)
      try {
        const session = await getSession();
        const res = await axios.post(`${process.env.NEXT_PUBLIC_API_URL}/applyDiscountCouponToCart/${checkoutData.id}/${discountCode}`, {}, {
          headers: {
            Authorization: "Bearer " + session.jwt,
          },
        });
        if (res?.status === 200) {
          setLoading(false)
          router.back();
          console.log(res.data);
        }
      } catch (error) {
        setLoading(false)
        console.log(error);
      }
  }

  return (
    <AppLayout backTitle="Apply Coupon">
      <div className="p-3 text-md text-darkColor-600 dark:text-darkColor-200">
        <div className="mt-2 flex">
          <input placeholder="Enter Coupon Code" type="text" className="w-full border-r-0 rounded-r-none uppercase border-gray-300 rounded-lg dark:bg-gray-900 dark:border-none placeholder-shown:capitalize focus:border-brand-500 focus:ring-1 ring-offset-0 ring-brand-500" />
          <div className="w-32 text-center border border-l-0 rounded-r-lg text-brand-500 font-bold p-2 flex flex-col justify-center cursor-pointer">APPLY</div>
        </div>

        <div className="mt-5">
          <div className="my-2 font-medium tracking-wide">Your Coupons</div>

          {coupons && coupons.length == 0 && <div>No Coupons Found</div>}

          {coupons &&
            coupons.length > 0 &&
            coupons.map((c,i) => (
              <div key={c.id} className="flex mb-5 w-100 border rounded items-center justify-between p-3 drop-shadow-md">
                <div>
                  <div className="font-bold text-md tracking-widest">{c.discountCode}</div>
                  <div className="text-sm font-light mt-2">{c.description}</div>
                </div>
                <button disabled={!c.applicable} onClick={() => selectCoupon(i)} className={classNames('p-3 font-bold', c.applicable ? 'text-brand-500' : 'text-brand-100')}>APPLY</button>
              </div>
            ))}
        </div>
      </div>
    </AppLayout>
  );
}

export default withFullLoader(coupons);

export const getServerSideProps = async (ctx) => {
    const { cartId } = ctx.query;
    console.log('herere');
    const session = await getSession({ req: ctx.req });
  
    if (!session) {
      return {
        redirect: {
          destination: "/login",
          permanent: false,
        },
      };
    }
    
    let props = {}

    if (cartId) {
      try {
        const res = await axios.get(`${process.env.NEXT_PUBLIC_API_URL}/getCartByCartId/${cartId}`, {
          headers: { Authorization: "Bearer " + session.jwt },
        });
        if (res?.status === 200) {
          props = { ...props, checkoutData: res.data, session }
        } else {
          return {
            redirect: {
              destination: "/",
              permanent: false,
            },
          };
        }
      } catch (err) {
        return {
          notFound: true,
        };
      }
    }
  
    return { props: props };
  };