import Link from "next/link";
import axios from "axios";
import toast from "react-hot-toast";
import Calendar from "react-calendar";
import { useRouter } from "next/router";
import { getSession } from "next-auth/client";
import { useDispatch } from "react-redux";
import { memo, useEffect, useState } from "react";
import { useForm, useWatch } from "react-hook-form";
import { RadioGroup } from "@headlessui/react";
import { ExclamationCircleIcon } from "@heroicons/react/solid";
import AppLayout from "../../components/app/layouts/AppLayout";
import AddressSelector from "../../components/app/modals/AddressSelector";
import withModal from "../../hocs/withModal";
import withFullLoader from "../../hocs/withFullLoader";
import { classNames, toINR } from "../../utilities";
import { CLEAR_CART } from "../../store/actions";
import { GST_REGEX } from "../../utilities/constants";
import "react-calendar/dist/Calendar.css";
import moment from "moment";
import ReactGA from "react-ga4";
import recombee from "recombee-js-api-client/src";


const recombeeDb = "bnxt-new";
const recombeeApiKey = "66Aa0NmUR7Ek9vQyaAWN7nKKtfZej93q2B3CMkuniHFEKckeonTpqxkKKtmN08CI";
const recombeeClient = new recombee.ApiClient(recombeeDb, recombeeApiKey, { region: "ca-east" });

const paymentOptions = [
  {
    type: "cod",
    title: "Cash on Delivery",
    description: "Available in your region ⚡️",
  },
  {
  	type: 'online',
  	title: 'Pay Now',
  	description: 'Full payment now',
  }
];

const deliveryDates = [
  {
    day: moment().add(2, "d").format("dddd"),
    date: moment().add(2, "d").format("DD MMM YYYY"),
    value: moment().add(2, "d"),
  },
  {
    day: moment().add(3, "d").format("dddd"),
    date: moment().add(3, "d").format("DD MMM YYYY"),
    value: moment().add(3, "d"),
  },
  {
    day: moment().add(4, "d").format("dddd"),
    date: moment().add(4, "d").format("DD MMM YYYY"),
    value: moment().add(4, "d"),
  },
];

const CheckoutPage = ({ setLoading, checkoutData, setPopup, session: sessionServer, user }) => {
  const { featureFlags } = user;
  
  if(featureFlags?.payments?.blockOnline && paymentOptions.findIndex(d => d.type == 'online') > -1){
    let index = paymentOptions.findIndex(d => d.type == 'online')
    paymentOptions.splice(index,1)
  }

  if(featureFlags?.payments?.blockPod && paymentOptions.findIndex(d => d.type == 'cod') > -1){
    let index = paymentOptions.findIndex(d => d.type == 'cod')
    paymentOptions.splice(index,1)
  }

  const dispatch = useDispatch();
  const [selectedPayment, setSelectedPayment] = useState(paymentOptions[0]);
  const [preferredDeliveryDate, setPreferredDeliveryDate] = useState(deliveryDates[0]);
  const [allAddresses, setAllAddresses] = useState([]);
  const [address, setAddress] = useState<any>();
  const [modalOpen, setModalOpen] = useState(false);
  const [showCalender, setShowCalender] = useState(false);
  const router = useRouter();
  const [enteredCouponCode, setEnteredCouponCode] = useState();

  const {
    register,
    handleSubmit,
    formState: { errors },
    control,
  } = useForm({
    defaultValues: {
      gstPreference: "gst",
      gstNumber: checkoutData?.user?.gst,
    },
  });

  const getAllAddresses = async () => {
    try {
      const session = await getSession();
      const res = await axios.get(`${process.env.NEXT_PUBLIC_API_URL}/getUserDetails`, {
        headers: {
          Authorization: "Bearer " + session.jwt,
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
    ReactGA.send({ hitType: "pageview", page: "/checkout" });

    global.analytics.page("checkout", {
      checkoutId: checkoutData.id || null,
      checkoutTotal: checkoutData?.cartTotal?.toFixed(2),
      lineItems: checkoutData?.lineItems,
      totalLineItemsInCheckout: checkoutData?.lineItems.length,
    });

    global.analytics.track("Checkout Started", {
      checkout_id: checkoutData.id || null,
      value: checkoutData?.cartTotal?.toFixed(2),
      products: checkoutData.lineItems.map((li) => ({ ...li, itemId: li.id })),
    });

  }, []);

  useEffect(async () => {
    setLoading(false);
    const resAddr = await getAllAddresses();
    setAllAddresses(resAddr);
    if (resAddr && resAddr.length > 0) {
      setAddress(resAddr.find(add => add.id == checkoutData.selectedShippingAddress));
    }
  }, [checkoutData]);

  useEffect(() => {
    allAddresses && setAddress(allAddresses?.filter((a) => a?.id === checkoutData?.user?.defaultAddress)?.[0]);
  }, [allAddresses, checkoutData]);

  const gstWatch = useWatch({ control, name: "gstPreference" });

  function loadScript(src) {
    return new Promise((resolve) => {
      const script = document.createElement("script");
      script.src = src;
      script.onload = () => {
        resolve(true);
      };
      script.onerror = () => {
        resolve(false);
      };
      document.body.appendChild(script);
    });
  }

  const openCalender = () => {
    setShowCalender(!showCalender);
  };

  async function displayRazorpay(orderId, order) {
    const res = await loadScript("https://checkout.razorpay.com/v1/checkout.js");

    if (!res) {
      toast.error(`Razorpay SDK failed to load!`);
      return;
    }

    const options = {
      key: process.env.NEXT_PUBLIC_RAZORPAY_ID,
      currency: "INR",
      order_id: orderId,
      name: `BazaarNXT`,
      description: `Payment for Order #${checkoutData?.cartId}`,
      image: `https://bnxtcdn.sgp1.digitaloceanspaces.com//bnxt_sm_logo_b31544197d.png`,
      notes: {},
      modal: {
        escape: false,
      },
      prefill: {
        name: checkoutData?.user?.username,
        email: checkoutData?.user?.email,
        contact: checkoutData?.user?.phoneNumber,
      },
      theme: {
        color: "#EC4201",
      },
      // Success Handler
      handler: function (response) {
        global.analytics.track("Purchased", {
          ...res?.data?.[0],
        });

        ReactGA.event({
          category: "purchases",
          action: "purchase",
          ...res?.data?.[0],
        });

        toast.success(`Thank you for ordering with BazaarNXT!`);
        dispatch({
          type: CLEAR_CART,
        });
        setTimeout(() => {
          router.replace(`/dashboard/orders`);
        }, 1000);
      },
    };

    const paymentObject = new window.Razorpay(options);

    // Failed Handler
    paymentObject.on("payment.failed", (error) => {
      toast.error(`Something went wrong!`);
    });

    paymentObject.open();
  }

  const orderPlaceAPI = async ({ shippingId, paymentMode, companyName, gstin }) => {
    const session = await getSession();
    try {
      setLoading(true);
      const res = await axios.post(
        `${process.env.NEXT_PUBLIC_API_URL}/placeOrderForWnxt/${checkoutData?.cartId}`,
        {
          shippingAddress: address.id,
          paymentMode: paymentMode ? paymentMode : "",
          companyName: companyName ? companyName : "",
          gstin: gstin ? gstin : "",
          expectedDeliveryDate: moment(checkoutData.expectedDeliveryDate).format("YYYY/MM/DD"),
        },
        {
          headers: { Authorization: "Bearer " + session.jwt },
        }
      );

      if (res?.status === 200) {
        setLoading(false);
        if(res.data == 'Order Items went out of stock'){
          toast.error(`Order Failed!. one or more products went out of stock or not enough stock to statisfy the order`);
          setTimeout(() => {
            router.replace(`/cart`);
          }, 500);
        }else{
          return res;
        }
      } else {
        console.log(res.data);
        setLoading(false);
        return false;
      }
    } catch (error) {
      setLoading(false);
      return false;
    }
  };

  const checkoutHandler = async (values) => {
    const session = await getSession();
    setLoading(true);
    if (address) {
      if (selectedPayment?.type === "cod") {
        const res = await orderPlaceAPI({
          shippingId: address?.id,
          paymentMode: selectedPayment?.type,
          gstin: values.gstNumber,
        });

        if (res?.status === 200) {
          res.data.map((order) => {
            global.analytics.track("Order Completed", {
              checkout_id: checkoutData.id || null,
              order_id: order.id,
              subtotal: order.subTotal,
              total: order.orderTotal,
              tax: order.totalTax,
              products: order.line_items.map((li) => ({ ...li, itemId: li.id })),
            });

            order.line_items.map((li) => {
              recombeeClient.send(new recombee.AddPurchase(session.user.id, li?.productDetails.sku, { cascadeCreate: true }));
            });
          });

          ReactGA.event({
            category: "purchases",
            action: "purchase",
            ...res?.data?.[0],
          });

          setLoading(false);
          toast.success(`Thank you for ordering with BazaarNXT!`);
          dispatch({
            type: CLEAR_CART,
          });

          setTimeout(() => {
            router.replace(`/dashboard/orders`);
          }, 500);
          
        }
        setLoading(false);
      } else if (selectedPayment?.type === "online") {
        const res = await orderPlaceAPI({
          shippingId: address?.id,
          paymentMode: selectedPayment?.type,
          gstin: values.gstNumber,
        });
        if (res && res?.data?.[0]?.paymentOrderId) {
          displayRazorpay(res?.data?.[0]?.paymentOrderId, res?.data);
          setLoading(false);
        }
      } else {
        setLoading(false);
        console.error("No payment mode selected");
      }
    } else {
      setLoading(false);
      toast.error(`Please add a shipping address!`);
      console.error("No shipping address selected");
    }
  };

  const checkoutInitiate = (values) => {
    if (address) {
      setPopup({
        popupShow: true,
        heading: "Confirmation",
        description: "Are you sure you want to place this order?",
        primaryBtnText: "Yes",
        secondaryBtnText: "No",
        onPrimaryClick: () => {
          checkoutHandler(values);
          setPopup({ popupShow: false });
        },
        onSecondaryClick: () => setPopup({ popupShow: false }),
      });
    } else {
      toast.error(`Please add a shipping address!`);
    }
  };

  const applyCouponCode = async() => {
    if(enteredCouponCode == null || enteredCouponCode == ''){
      toast.error(`Please Enter Coupon Code`);
      return;
    }
    setLoading(true)
      try {
        const session = await getSession();
        const res = await axios.post(`${process.env.NEXT_PUBLIC_API_URL}/applyDiscountCouponToCart/${checkoutData.id}/${enteredCouponCode}`, {}, {
          headers: {
            Authorization: "Bearer " + session.jwt,
          },
        });
        if (res?.status === 200) {
          setLoading(false)
          router.reload();
          // console.log(res.data);
        }
      } catch (error) {
        setLoading(false)
        // console.log(error.response.data);
        toast.error(error.response.data);
      }
  }

  const removeCoupon = async() => {
    setLoading(true)
      try {
        const session = await getSession();
        const res = await axios.post(`${process.env.NEXT_PUBLIC_API_URL}/removeDiscountFromCart/${checkoutData.id}`, {}, {
          headers: {
            Authorization: "Bearer " + session.jwt,
          },
        });
        if (res?.status === 200) {
          setLoading(false)
          router.reload();
          // console.log(res.data);
        }
      } catch (error) {
        setLoading(false)
        console.log(error);
      }
  }

  return (
    <>
      <AppLayout backTitle="Checkout" className={" "} barStyle={" "}>
        <form className="" onSubmit={handleSubmit(checkoutInitiate)}>
          <div className="px-2 mx-2 my-5 text-sm bg-white rounded-lg dark:border-darkColor-900 dark:bg-darkColor-900/10 border-darkColor-200">
            <div className="pb-5 text-md text-darkColor-600 dark:text-darkColor-200">
              <div className="my-2 font-bold tracking-wide uppercase">Delivery Address</div>
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
            </div>

            <div className="pb-5 text-md text-darkColor-600 dark:text-darkColor-200">
              <div className="my-2 font-bold tracking-wide uppercase">Payment Options</div>
              <RadioGroup value={selectedPayment} onChange={setSelectedPayment}>
                <RadioGroup.Label className="sr-only">Payment Options</RadioGroup.Label>
                <div className="-space-y-px bg-white rounded-md dark:bg-darkColor-900">
                  {paymentOptions.map((paymentMode, paymentModeIdx) => {
                    return (
                      <RadioGroup.Option key={paymentMode.type} value={paymentMode} className={({ checked }) => classNames(paymentModeIdx === 0 ? "rounded-tl-md rounded-tr-md" : "", paymentModeIdx === paymentOptions.length - 1 ? "rounded-bl-md rounded-br-md" : "", checked ? "bg-brand-50 dark:bg-brand-900/40  border-brand-200 dark:border-brand-500 z-10" : "border-gray-200 dark:border-darkColor-600", "relative border p-4 flex cursor-pointer focus:outline-none")}>
                        {({ active, checked }) => (
                          <>
                            <span className={classNames(checked ? "bg-brand-600 border-transparent" : "bg-white dark:bg-darkColor-600 border-gray-300 dark:border-darkColor-900", active ? "ring-2 ring-offset-2 ring-brand-500 dark:ring-offset-0" : "", "h-4 w-4 mt-0.5 cursor-pointer rounded-full border flex items-center justify-center")} aria-hidden="true">
                              <span className="rounded-full bg-white dark:bg-darkColor-900 w-1.5 h-1.5" />
                            </span>
                            <div className="flex flex-col ml-3">
                              <RadioGroup.Label as="span" className={classNames(checked ? "text-brand-900 dark:text-brand-50" : "text-gray-900 dark:text-darkColor-200", "text-sm font-medium flex")}>
                                {paymentMode?.title}{" "}
                              </RadioGroup.Label>
                            </div>
                          </>
                        )}
                      </RadioGroup.Option>
                    );
                  })}
                </div>
              </RadioGroup>
            </div>

            <div className="pb-5 text-md text-darkColor-600 dark:text-darkColor-200">
              <div className="my-2 font-bold tracking-wide uppercase">GST Preferences</div>
              <fieldset className="mt-4">
                <legend className="sr-only">GST Prferences</legend>
                <div className="flex">
                  <div className="flex items-center">
                    <input id="noGst" name="gstPreference" value="noGst" type="radio" className="w-4 h-4 border-gray-300 dark:bg-gray-600 dark:border-gray-600 focus:ring-offset-0 focus:ring-brand-500 text-brand-600" {...register("gstPreference", { required: "GST Preference is required" })} />
                    <label htmlFor="noGst" className="block ml-1 text-sm font-medium text-gray-700 dark:text-darkColor-300">
                      I don't have GST
                    </label>
                  </div>

                  <div className="flex items-center ml-5">
                    <input id="gst" name="gstPreference" value="gst" type="radio" defaultChecked className="w-4 h-4 border-gray-300 dark:bg-gray-600 dark:border-gray-600 focus:ring-offset-0 focus:ring-brand-500 text-brand-600" {...register("gstPreference", { required: "GST Preference is required" })} />
                    <label htmlFor="gst" className="block ml-1 text-sm font-medium text-gray-700 dark:text-darkColor-300">
                      I want GST bill
                    </label>
                  </div>
                </div>
              </fieldset>
              {gstWatch === "gst" && (
                <>
                  <div className="mt-4">
                    <input
                      type="text"
                      className="w-full uppercase border-gray-300 rounded-lg dark:bg-gray-900 dark:border-none placeholder-shown:capitalize focus:border-brand-500 focus:ring-1 ring-offset-0 ring-brand-500"
                      placeholder="Enter 15 character GST Number"
                      maxLength={15}
                      {...register("gstNumber", {
                        required: "GST Number is required",
                        // pattern: {
                        // 	value: GST_REGEX,
                        // 	message: 'Please enter a valid GST Number',
                        // },
                        maxLength: { value: 15, message: "GST Number must be 15 characters" },
                        minLength: { value: 15, message: "GST Number must be 15 characters" },
                      })}
                    />
                  </div>

                  {errors?.gstNumber && (
                    <small className="flex items-center mt-2 text-red-500 gap-x-1">
                      <ExclamationCircleIcon className="w-4 h-4" />
                      {errors?.gstNumber?.message}
                    </small>
                  )}
                </>
              )}
            </div>

            <div className="pb-5 text-md text-darkColor-600 dark:text-darkColor-200">
              <div className="my-2 font-bold tracking-wide uppercase">Coupons & Offers</div>
              {checkoutData.promoDiscountCode != null ? 
              <div>
                <div className="mt-2 border rounded p-3 flex justify-between items-center">
                  <div>
                    <div className="text-lg font-bold">'{checkoutData && checkoutData.promoDiscountCode}' applied</div>
                    <div className="text-md font-bold text-green-500">₹{checkoutData && checkoutData.discount} savings</div>
                  </div>
                  <div onClick={() => removeCoupon()} className="text-brand-500 text-md p-3">Remove</div>
                </div>
              </div>
              :
              <div className="mt-2 flex">
                <input onChange={(v: any) => setEnteredCouponCode(v.target.value)} placeholder="Enter Coupon Code" type="text" className="w-full uppercase border-r-0 rounded-r-none uppercase border-gray-300 rounded-lg dark:bg-gray-900 dark:border-none placeholder-shown:capitalize focus:border-brand-500 focus:ring-1 ring-offset-0 ring-brand-500" />
                <div onClick={() => applyCouponCode()} className="w-32 text-center border border-l-0 border-r-0 text-brand-500 font-bold p-2 flex flex-col justify-center cursor-pointer">APPLY</div>
                <div onClick={()=> router.push(`/checkout/coupons/${checkoutData.cartId}`)} className="w-48 underline text-center border rounded-r-lg p-2 flex flex-col justify-center cursor-pointer">Show List</div>
              </div>
            }
            </div>

            <div className="mt-3 pb-5 text-md text-darkColor-600 dark:text-darkColor-200">
              <div className="flex items-center justify-between py-2">
                <p>Total Item(s)</p>
                <p className="font-medium">{checkoutData?.lineItems?.length}</p>
              </div>

              <div className="flex items-center justify-between py-2">
                <p>Sub Total</p>
                <p className="font-medium">{toINR((checkoutData?.subTotal + checkoutData?.discount).toFixed(2))}</p>
              </div>

              <div className="flex items-center justify-between py-2">
                <p>Discounts</p>
                <p className="font-medium text-green-500">{toINR(checkoutData?.discount?.toFixed(2))}</p>
              </div>

              <div className="flex items-center justify-between py-2">
                <p>Shipping</p>
                <p className="font-medium text-green-500">FREE</p>
              </div>

              <div className="flex items-center justify-between py-2">
                <p>Taxes</p>
                <p className="font-medium">{toINR(checkoutData?.totalTax?.toFixed(2))}</p>
              </div>

              <div className="flex items-center justify-between py-2">
                <p>Rounding</p>
                <p className="font-medium">{toINR(checkoutData?.roundOff?.toFixed(2))}</p>
              </div>

              <div className="flex items-center justify-between py-4 mt-2 text-lg border-t border-darkColor-200 dark:border-darkColor-800">
                <p>Total</p>
                <p className="font-bold text-green-500">{toINR(checkoutData?.cartTotal?.toFixed(2))}</p>
              </div>
            </div>
          </div>
          <div className="fixed bottom-0 w-full p-5 nav-blur dark:nav-blur-dark">
            {selectedPayment?.type === "cod" ? (
              <button type="submit" className="inline-flex items-center justify-center w-full px-6 py-3 text-base font-medium text-center text-white border border-transparent rounded-md shadow-sm ring-offset-0 bg-brand-600 hover:bg-brand-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-brand-500">
                Place Order
              </button>
            ) : (
              <button type="submit" className="inline-flex items-center justify-between w-full px-6 py-3 text-base font-medium text-center text-white border border-transparent rounded-md shadow-sm ring-offset-0 bg-brand-600 hover:bg-brand-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-brand-500">
                <span>Confirm & Pay</span>
                <span className="flex gap-x-2">
                  <span className="">{toINR(checkoutData?.cartTotal?.toFixed(2))}</span>
                  {/* {toINR((checkoutData?.cartTotal - checkoutData?.cartTotal * 0.02)?.toFixed(2))} */}
                </span>
              </button>
            )}
          </div>
        </form>
      </AppLayout>
      <AddressSelector open={modalOpen} setOpen={setModalOpen} address={address} setAddress={setAddress} gotAddresses={allAddresses} />
    </>
  );
};

export default memo(withModal(withFullLoader(CheckoutPage)));

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
  
  let props = {}

  if(session){
    try {
      const res = await axios.get(`${process.env.NEXT_PUBLIC_API_URL}/users/me`, {
        headers: { Authorization: "Bearer " + session.jwt },
      });
      if (res?.status === 200) {
        props = { user: res.data }
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
