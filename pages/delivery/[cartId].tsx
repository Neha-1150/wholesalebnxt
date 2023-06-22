import * as React from 'react';
import { RadioGroup } from "@headlessui/react";
import axios from "axios";
import moment from "moment";
import { getSession } from "next-auth/client";
import Link from "next/link";
import { memo, useEffect, useState } from "react";
import AppLayout from "../../components/app/layouts/AppLayout";
import AddressSelector from "../../components/app/modals/AddressSelector";
import withFullLoader from "../../hocs/withFullLoader";
import withModal from "../../hocs/withModal";
import { classNames } from "../../utilities";
import toast from "react-hot-toast";
import { useTheme } from "next-themes";
import { useRouter } from "next/router";
import { useDispatch, RootStateOrAny } from "react-redux";
import { SET_CART_ID } from "../../store/actions";
import { addBusinessDays } from "../../utilities/common";

const deliveryDates = [
  {
    day: addBusinessDays(moment(),1).format("dddd"),
    date: addBusinessDays(moment(),1).format("DD MMM YYYY"),
    value: addBusinessDays(moment(),1),
  },
  {
    day: addBusinessDays(moment(),2).format("dddd"),
    date: addBusinessDays(moment(),2).format("DD MMM YYYY"),
    value: addBusinessDays(moment(),2),
  },
  {
    day: addBusinessDays(moment(),3).format("dddd"),
    date: addBusinessDays(moment(),3).format("DD MMM YYYY"),
    value: addBusinessDays(moment(),3),
  },
];

function Delivery({ setLoading, checkoutData, setPopup, session: sessionServer, user }) {
  const [address, setAddress] = useState<any>();
  const [allAddresses, setAllAddresses] = useState([]);
  const [modalOpen, setModalOpen] = useState(false);
  const [preferredDeliveryDate, setPreferredDeliveryDate] = useState(deliveryDates[0]);
  const [checkoutLineItems, setCheckoutLineItems] = useState([]);
  const [inventoryProducts, setInventoryProducts] = useState([]);
  const [nonInventoryProducts, setNonInventoryProducts] = useState([]);
  const { theme }: any = useTheme;
  const router = useRouter();
  const dispatch = useDispatch();

  const getAllAddresses = async () => {
    try {
      const session = await getSession();
      const res = await axios.get(`${process.env.NEXT_PUBLIC_API_URL}/getUserDetails`, {
        headers: {
          Authorization: "Bearer " + session?.jwt,
        },
      });
      if (res?.status === 200) {
        return res?.data?.addresses.filter((a) => !a?.isBillingAddress);
      }
    } catch (error) {
      console.error(error);
      return false;
    }
  };

  useEffect(() => {
    const getCheckoutData = async () => {
      setCheckoutLineItems(checkoutData.lineItems);
      setInventoryProducts(checkoutData.lineItems.filter(item => item.productDetails.salesPricing.trackInventory));
      setNonInventoryProducts(checkoutData.lineItems.filter(item => !item.productDetails.salesPricing.trackInventory));
      const resAddr = await getAllAddresses();
      setAllAddresses(resAddr);
      if (resAddr && resAddr.length > 0) {
        setAddress(resAddr[0]);
      }
      setLoading(false);
    }
    getCheckoutData();
  }, [checkoutData]);

  const updateCart = async () => {
    const session = await getSession();    
    if (session) {
      try {
        setLoading(true);
        const resCart = await axios.post(
          `${process.env.NEXT_PUBLIC_API_URL}/updateCartWnxtAddress`,
          {
            cartId: checkoutData.cartId,
            expectedDeliveryDate: moment(preferredDeliveryDate.value).format("YYYY/MM/DD"),
            selectedShippingAddress: address.id,
          },
          {
            headers: {
              Authorization: `Bearer ${session?.jwt}`,
            },
          }
        );
        if (resCart?.status === 200) {
          const res = await axios.get(`${process.env.NEXT_PUBLIC_API_URL}/getCartByCartId/${resCart?.data?.cartId}`, {
            headers: {
              Authorization: "Bearer " + session.jwt,
            },
          });
          if (res.status === 200) {
            setLoading(false);
            dispatch({
              type: SET_CART_ID,
              payload: {
                cartId: res?.data?.cartId,
              },
            });
            console.log(res);
            router.push(`/checkout/${res?.data?.cartId}`);
          } else {
            setLoading(false);
          }
        }
      } catch (err) {
        console.error(err);
        toast.error(`Something went wrong.`, {
          style: {
            fontSize: "12px",
            borderRadius: "5px",
            background: theme === "light" ? "#f7f7f7" : "#1e1e1e",
            color: theme === "light" ? "#1e1e1e" : "#f7f7f7",
          },
        });
        setLoading(false);
      }
    } else {
      const url = process.env.NEXT_PUBLIC_URL + "/cart";
      toast.error(`Please login first.`, {
        style: {
          fontSize: "12px",
          borderRadius: "5px",
          background: theme === "light" ? "#f7f7f7" : "#1e1e1e",
          color: theme === "light" ? "#1e1e1e" : "#f7f7f7",
        },
      });
      router.replace(`/login?redirect=${encodeURIComponent(url)}`);
      setLoading(false);
    }
  };

  return (
    <AppLayout barStyle={" "} className={" "} backTitle={"Delivery Options"}>
      <div className="px-2 mx-2 my-5 text-sm bg-white rounded-lg dark:border-darkColor-900 dark:bg-darkColor-900/10 border-darkColor-200">
        <div className="pb-5 text-md text-darkColor-600 dark:text-darkColor-200">
          <div className="my-2 font-bold tracking-wide uppercase">Select Delivery Address</div>
          {address ? (
            <div className="text-black dark:text-darkColor-200">
              <div className="flex items-center gap-x-2">
                <p>{address?.name}</p>
                {address?.phoneNumber && <p>Mob: {address?.phoneNumber}</p>}
              </div>
              <p>{address?.line1},</p>
              <p>{address?.line2},</p>
              <p>
                {address?.city}, {address?.state}, {address?.pincode}
              </p>
            </div>
          ) : (
            <div className="text-black dark:text-darkColor-200">
              <p>No primary address found</p>
              <p>Select an address</p>
            </div>
          )}
          <div className="mt-2">
            <button type="button" className="py-2 text-sm font-bold tracking-wide underline uppercase text-brand-500" onClick={() => setModalOpen(true)}>
              {address ? `Change` : `Select`}
            </button>
            {!address && (
              <>
                &nbsp;or&nbsp;
                <Link href="/dashboard/addresses/add">
                  <a className="py-2 text-sm font-bold tracking-wide underline uppercase text-brand-500">Add a new one</a>
                </Link>
              </>
            )}
          </div>
        </div>

       
          {inventoryProducts.length > 0 && (
             <div className="relative pb-5 border-b-2 text-md text-darkColor-600 dark:text-darkColor-200">
            <div className="flex flex-col">
              <div className="my-2 font-bold tracking-wide uppercase">Shipment 1 {nonInventoryProducts.length > 0 && "of 2"}</div>
              <ul className="list-disc ml-[16px]">
                {inventoryProducts.map((item: any, index) => (
                  <li>{item.productName}</li>
                ))}
              </ul>

              <RadioGroup value={preferredDeliveryDate} onChange={setPreferredDeliveryDate}>
            <div className="my-2 tracking-wide">Preferred Delivery Date</div>
            <div className="flex items-center -space-y-px bg-white rounded-md dark:bg-darkColor-900">
              {deliveryDates.map((dateObj, dateObjIdx) => (
                <RadioGroup.Option key={dateObj.date} value={dateObj} className={({ checked }) => classNames(dateObjIdx != 0 && "ml-2", checked ? "bg-brand-50 dark:bg-brand-900/40  border-brand-200 dark:border-brand-500 z-10 " : "border-gray-200 dark:border-darkColor-600", "justify-center text-center relative border p-4 flex cursor-pointer focus:outline-none rounded-md flex-1")}>
                  {({ active, checked }) => (
                    <RadioGroup.Label as="span" className={classNames(checked ? "text-brand-900 dark:text-brand-50" : "text-gray-900 dark:text-darkColor-200", "text-sm font-medium flex")}>
                      <div className="flex flex-col justify-center items-center">
                        <div>{dateObj?.day}</div>
                        <div>{dateObj?.date}</div>
                      </div>
                    </RadioGroup.Label>
                  )}
                </RadioGroup.Option>
              ))}
            </div>
          </RadioGroup>

          <div className="flex text-[12px] mt-2">
            You have selected <span className="text-green-700 mx-1 font-semibold">{` ${moment(preferredDeliveryDate.value).format(" DD MMM YY, dddd ")} `}</span> for shipment 1
          </div>
            </div>
        </div>
          )}

          

          {nonInventoryProducts.length > 0 && (
           <div className="relative mt-3 pb-5 text-md text-darkColor-600 dark:text-darkColor-200">
              <div className="flex flex-col">
                <div className="my-2 font-bold tracking-wide uppercase">Shipment {inventoryProducts.length > 0 ? "2 of 2" : "1"}</div>
                <ul className="list-disc ml-[16px]">
                  {nonInventoryProducts.map((item: any, index) => (
                    <li>{item.productName}</li>
                  ))}
                </ul>
              </div>
              <div className="text-[12px] mt-2">
                Delivery between <span className="text-green-700 mx-1 font-semibold">{` ${moment().add(1, "week").format(" DD MMM YY, dddd ")} - ${moment().add(1, "week").add(4, "days").format(" DD MMM YY, dddd ")} `}</span> for Shipment {inventoryProducts.length > 0 ? "2 of 2" : "1"}
              </div>
            </div>
          )}
      </div>

      <div className="fixed bottom-0 w-full p-5 nav-blur dark:nav-blur-dark">
        <button type="button" onClick={updateCart} className="inline-flex items-center justify-center w-full px-6 py-3 text-base font-medium text-center text-white border border-transparent rounded-md shadow-sm ring-offset-0 bg-brand-600 hover:bg-brand-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-brand-500">
          Check Out
        </button>
      </div>

      <AddressSelector open={modalOpen} setOpen={setModalOpen} address={address} setAddress={setAddress} gotAddresses={allAddresses} />
    </AppLayout>
  );
}

export default memo(withModal(withFullLoader(Delivery)));

export const getServerSideProps = async (ctx) => {
  const { cartId } = ctx.query;
  const session = await getSession({ req: ctx.req });

  if (!session) {
    return {
      redirect: {
        destination: "/login",
        permanent: false,
      },
    };
  }

  let props = {};

  if (session) {
    try {
      const res = await axios.get(`${process.env.NEXT_PUBLIC_API_URL}/users/me`, {
        headers: { Authorization: "Bearer " + session.jwt },
      });
      if (res?.status === 200) {
        props = { user: res.data };
      } else {
        return {
          redirect: {
            destination: "/",
            permanent: false,
          },
        };
      }
    } catch (error) {
      return {
        notFound: true,
      };
    }
  }

  if (cartId) {
    try {
      const res = await axios.get(`${process.env.NEXT_PUBLIC_API_URL}/getCartByCartId/${cartId}`, {
        headers: { Authorization: "Bearer " + session.jwt },
      });
      if (res?.status === 200) {
        props = { ...props, checkoutData: res.data, session };
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
