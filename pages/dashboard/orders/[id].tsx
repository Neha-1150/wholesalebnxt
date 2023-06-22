import { useState, useEffect } from "react";
import axios from "axios";
import moment from "moment";
import useCopyClipboard from "react-use-clipboard";
import toast from "react-hot-toast";
import Countdown from "react-countdown";
import { getSession } from "next-auth/client";
import { useRouter } from "next/router";
import { useTheme } from "next-themes";
import AppLayoutNav from "../../../components/app/layouts/AppLayoutNav";
import OrderStatus from "../../../components/app/common/OrderStatus";
import { pluralize, toINR } from "../../../utilities";
import withModal from "../../../hocs/withModal";
import CancelSuccessModal from "../../../components/app/modals/CancelSuccessModal";
import { ClipboardCheckIcon, ClipboardIcon } from "@heroicons/react/solid";
import ReactGA from "react-ga4";

const CANCEL_WINDOW_TIME = 600000; // 10 minutes
const RETURN_WINDOW_TIME = 604800000; // 7 Days

const OrderDetailPage = ({ order, setPopup }) => {
  const { theme } = useTheme();
  const router = useRouter();
  const [cancelModal, setCancelModal] = useState(false);
  const [returnModal, setReturnModal] = useState(false);
  const [isCopied, setCopied] = useCopyClipboard(`#${order?.orderId?.slice(-6)?.toUpperCase()}`);

  useEffect(() => {
    global.analytics.page("order details");
    ReactGA.send({ hitType: "pageview", page: "/order-details" });
  }, []);

  const returnOrder = async () => {
    setPopup({ popupShow: false });
    console.log("REFUND INITIATED");
    setReturnModal(true);
  };

  const cancelInitiate = () => {
    router.push("/dashboard/orders/cancel/" + order.orderId);
  };

  const returnInitiate = () => {
    setPopup({
      popupShow: true,
      heading: "Are you sure you want to return this order",
      description: `<div>
        <h1 style="text-align: left">Product Return Instructions</h1>
        <ul style="list-style: disc; padding: 5px 20px !important; text-align: left;">
          <li style="margin-bottom: 5px">Open order at the time of delivery to book in case of returns or refund.</li>
          <li style="margin-bottom: 5px">While booking return, select the issue as mentioned and upload clear picture of the products.</li>
          <li style="margin-bottom: 5px">Products cannot be utilized, it has to be returned the way its been delivered.</li>
          <li style="margin-bottom: 5px">Pickup attempt will be done twice only, failing to return on two attempts would result in no refund of the payment made.</li>
        </ul>

        <hr></hr>
        <h1 style="text-align: left; margin-top: 8px">समान वापसी के लिए निर्देश</h1>
        <ul style="list-style: disc; padding: 5px 20px !important; text-align: left;">
          <li style="margin-bottom: 5px">रिटर्न या रीफ़ंड बुक करने के लिए डिलिव्री के समय ऑर्डर खोलकर चेक करे।</li>
          <li style="margin-bottom: 5px">रिटर्न या रीफ़ंड बुक करने के लिए, दिए गए कारणों में से चुने और प्रोडक्ट की क्लीर फ़ोटो अपलोड करे।</li>
          <li style="margin-bottom: 5px">प्रोडक्ट बिना इस्तेमाल किया हुआ ही वापस लिया जाएगा।</li>
          <li style="margin-bottom: 5px">रिटर्न की कोशिश २ बार की जयगी, उसके बाद किया हुआ पेमेंट वापस नहीं  होगा।</li>
        </ul>
      </div>`,
      primaryBtnText: "Yes",
      secondaryBtnText: "No",
      onPrimaryClick: () => router.push("/dashboard/orders/return/" + order.orderId + "/items"),
      onSecondaryClick: () => {
        setPopup({ popupShow: false });
        router.reload();
      },
    });
  };

  return (
    <>
      <AppLayoutNav className={""} backTitle={""}>
        <div className="pb-2 tracking-tight">
          <div className="sticky z-10 flex items-center justify-between w-screen  py-2 top-[3.2rem] nav-blur dark:nav-blur-dark">
            <h1 className="flex items-center justify-between w-full mx-5 text-xl font-bold">
              <span className="flex items-center gap-x-2">
                Order No. <span className="text-brand-500">#{order?.id}</span>
                <button onClick={setCopied}>
                  {isCopied ? (
                    <span className="flex items-center text-sm gap-x-1">
                      <ClipboardCheckIcon className="w-4 h-4 text-green-500" />
                      Copied!
                    </span>
                  ) : (
                    <span className="flex items-center text-sm gap-x-1">
                      <ClipboardIcon className="w-4 h-4" /> Copy ID
                    </span>
                  )}
                </button>
              </span>
              {order?.invoiceUrl && (
                <a className="text-xs font-semibold tracking-wide text-green-500 uppercase" href={order?.invoiceUrl} download>
                  Download Invoice
                </a>
              )}
            </h1>
          </div>
          <div className="mx-5 mt-2 mb-10">
            <h4 className="py-2 text-sm font-bold tracking-wide uppercase">Order Items</h4>
            <div className="flex flex-col gap-y-2">
              {order?.line_items?.map((item) => (
                <div key={item?.id} className="flex gap-3">
                  <div className="">
                  {item?.productDetails?.thumbnail && item?.productDetails?.thumbnail != "" ? 
                                  <img src={item?.productDetails?.thumbnail} alt={item?.productName} width={200} height={200} className="object-contain w-24 h-full border rounded-md dark:border-darkColor-900" />
                                  :
                                <img src={item?.productDetails?.media?.[0]?.url} alt={item?.productName} width={200} height={200} className="object-contain w-24 h-full border rounded-md dark:border-darkColor-900" />
                                }
                  </div>
                  <div className="w-full">
                    <div className="flex flex-col space-y-2">
                      <div>
                        {/* <div className="mr-2 text-xs uppercase text-amber-600">₹235.00 Discount Applied</div> */}
                        <div className="text-sm">{item?.productName}</div>
                        <div className="my-1 text-xs dark:text-gray-300">
                          <span className="font-medium">
                            {toINR(item?.rate?.toFixed(2))}/{item?.productDetails?.unit}
                          </span>
                          &nbsp;✕&nbsp;
                          <span className="font-medium">
                            {item?.quantity} {pluralize(item?.productDetails?.unit)}
                          </span>
                        </div>
                        <div className="flex my-1 text-xs text-gray-700 gap-x-2 dark:text-gray-400">
                          Price: <span className="font-medium">{toINR(item?.itemTotal?.toFixed(2))}</span>
                          <small>(inclusive of Taxes)</small>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            <div className="my-4 border-t border-gray-100 dark:border-gray-900">
              <h4 className="py-2 text-sm font-bold tracking-wide uppercase">Shipping Address</h4>
              <div className="text-xs">
                {order?.shippingAddress?.name && (
                  <p className="text-sm">
                    <strong>{order?.shippingAddress?.name}</strong>
                  </p>
                )}
                <p>{order?.shippingAddress?.line1},</p>
                <p>{order?.shippingAddress?.line2},</p>
                <p>
                  {order?.shippingAddress?.city}, {order?.shippingAddress?.state}, {order?.shippingAddress?.pincode}
                </p>
                {order?.shippingAddress?.phoneNumber && (
                  <p className="py-1">
                    <em>+91-{order?.shippingAddress?.phoneNumber}</em>
                  </p>
                )}
              </div>
              {order?.gstin && <div className="py-2">GSTIN: {order?.gstin}</div>}
            </div>

            <div className="my-4 border-t border-gray-100 dark:border-gray-900">
              <h4 className="py-2 text-sm font-bold tracking-wide uppercase">order Status</h4>
              <div className="my-4">
                {order?.status === "cancelled" ? (
                  <div>
                    <p className="text-sm text-red-600">Order Cancelled</p>
                  </div>
                ) : (
                  <OrderStatus status={order?.status} deliveredDate={order?.meta?.deliveredDate} placedAt={moment(order?.created_at).format("Do MMM YYYY, h:mm a")} outForDeliveryDate={order?.meta?.outForDeliveryDate} />
                )}
              </div>
            </div>

            {order?.status === "cancelled" ? (
              <></>
            ) : (
              <div className="my-4 border-t border-gray-100 dark:border-gray-900">
                <h4 className="py-2 text-sm font-bold tracking-wide uppercase">Payment Details</h4>
                <div className="flex justify-between mb-2">
                  <p className="">Payment Mode</p>
                  <p className="uppercase">{order?.paymentStatus === "captured" || order?.paymentStatus === "init" ? "online" : order?.paymentStatus}</p>
                </div>

                {order?.paymentOrderId != null && (
                  <div className="flex justify-between mb-2">
                    <p className="">Payment Status</p>
                    <p className="uppercase">{order?.paymentStatus === "captured" ? "PAID" : "Failed"}</p>
                  </div>
                )}

                <div className="flex justify-between my-2">
                  <p className="">Subtotal</p>
                  <p>{toINR(order?.subTotal.toFixed(2))}</p>
                </div>
                <div className="flex justify-between my-2">
                  <p className="">Shipping</p>
                  <p>{toINR(order?.totalShipping.toFixed(2))}</p>
                </div>
                <div className="flex justify-between my-2">
                  <p className="">Tax</p>
                  <p>{toINR(order?.totalTax.toFixed(2))}</p>
                </div>
                <div className="flex justify-between my-2">
                  <p className="font-bold">Total</p>
                  <p className="font-bold">{toINR(order?.orderTotal.toFixed(2))}</p>
                </div>
              </div>
            )}

            {order?.status != "delivered" && order?.status != "cancelled" && order?.status != "cancelledByAdmin" && order?.staus != "returnInitiated" && order?.staus != "returnCompleted" && (
              <div className="my-4 border-t border-gray-100 dark:border-gray-900">
                <h4 className="py-2 text-sm font-bold tracking-wide uppercase">Order Actions</h4>
                <div className="flex items-center justify-between mb-2">
                  <div>
                    <button className="mt-2 text-sm font-bold tracking-wide text-red-500 uppercase" onClick={() => cancelInitiate()}>
                      Cancel Order
                    </button>
                    {/* <button className="mt-2 text-sm font-bold tracking-wide text-red-500 uppercase" onClick={() => returnInitiate()()}>
                      Return Order
                    </button> */}
                  </div>
                </div>
              </div>
            )}

            {order?.status === 'delivered' && (
              <div className="my-4 border-t border-gray-100 dark:border-gray-900">
              <h4 className="py-2 text-sm font-bold tracking-wide uppercase">Order Actions</h4>
									<div className="flex items-center justify-between mb-2">
										<Countdown
											renderer={({ hours, minutes, seconds, completed }) => {
												if (completed) {
													// Render a completed state
													return <div onClick={() => returnInitiate()} className="text-amber-600 dark:text-amber-400">Return Window Expired</div>;
												} else {
													// Render a countdown
													return (
														<div>
															<div>
																Return Window Expires in: &nbsp;
																<span className="text-amber-600 dark:text-amber-400">
																	{hours} hours {minutes} mins {seconds} s
																</span>
															</div>
															<button className="mt-2 text-sm font-bold tracking-wide text-red-500 uppercase" onClick={() => returnInitiate()}>
																Return Order
															</button>
														</div>
													);
												}
											}}
											date={moment(order?.meta?.deliveredDate, 'Do MMM YYYY hh:mm a').add(30,'day').format('YYYY-MM-DD')}
										/>
									</div>
                  </div>
								)}
          </div>
        </div>
      </AppLayoutNav>
      <CancelSuccessModal open={cancelModal} setOpen={setCancelModal} />
    </>
  );
};

export default withModal(OrderDetailPage);

export const getServerSideProps = async (ctx) => {
  const { id } = ctx.params;
  const session = await getSession({ req: ctx.req });

  if (!session) {
    return {
      redirect: {
        destination: "/login",
        permanent: false,
      },
    };
  }

  try {
    const res = await axios.get(`${process.env.NEXT_PUBLIC_API_URL}/getOrderByOrderId/${id}`, {
      headers: {
        Authorization: `Bearer ${session.jwt}`,
      },
    });
    return { props: { order: res?.data } };
  } catch (err) {
    return {
      notFound: true,
    };
  }
};
