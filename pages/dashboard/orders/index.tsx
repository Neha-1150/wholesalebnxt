import axios from "axios";
import Link from "next/link";
import { getSession } from "next-auth/client";
import { BsCaretRightFill } from "react-icons/bs";
// import { AnnotationIcon, XIcon, ExclamationCircleIcon, CheckIcon } from '@heroicons/react/solid';
// import AppLayoutNav from '../../../components/app/layouts/AppLayoutNav';
import { formatDate, pluralize, toINR } from "../../../utilities";
import Topbar from "../../../components/app/common/Topbar";
import Navbar from "../../../components/app/common/Navbar2";
import { useEffect } from "react";
import ReactGA from "react-ga4";

const DashboardOrders = ({ orders }) => {

  useEffect(() => {
    global.analytics.page("orders");
    ReactGA.send({ hitType: "pageview", page: "/orders" });
  }, []);

  return (
    <>
      <Topbar />
      {orders?.length > 0 ? (
        <div className="py-5 mt-12 tracking-tight">
          <div className="sticky z-10 flex items-center justify-between w-screen py-2 top-[3rem] nav-blur dark:nav-blur-dark">
            <h1 className="mx-5 text-xl font-bold">Your Orders</h1>
          </div>

          <div className="mt-4 mb-10">
            <div className="flex flex-col gap-y-4">
              {orders
                ?.filter((order) => order?.status !== "draft")
                .map((order) => (
					
                  <div key={order?.id} className="p-3 mx-5 key={order?.id} text-base border rounded-md border-darkColor-300 dark:border-darkColor-900">
					<div className="flex flex-col text-sm">
                      <div className="relative pb-2 border-b text-darkColor-700 dark:text-darkColor-300 border-darkColor-300 dark:border-darkColor-900">
                        <div className="flex justify-between">
                          <p>
                            <strong>
                              #<span className="text-black dark:text-white">{order?.id}</span>
                            </strong>
                          </p>
                          <p>
                            Placed on: <strong>{formatDate(order?.created_at, false)}</strong>
                          </p>
                        </div>
                        <div className="flex justify-between mt-1">
                          <p>
                            Total: <strong>{toINR(order?.orderTotal?.toFixed(2))}</strong>
                          </p>

                          {order.paymentMode && (
                            <p>
                              Payment Mode: <strong className="uppercase">{order.paymentMode}</strong>
                            </p>
                          )}
                        </div>
                      </div>
                      <div className="mt-3">
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
                                    </div>
                                  </div>
                                </div>
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                      <div className="flex flex-row items-center justify-between pt-4 mt-4 mb-1 border-t border-darkColor-300 dark:border-darkColor-900">
                        <div>
                          {order?.status === "cancelled" || order?.status === "cancelledByAdmin" ? (
                            <span className="inline-flex items-center dark:bg-red-500/30 dark:text-red-200 uppercase tracking-wide px-2.5 py-0.5 rounded-full text-xs font-medium bg-red-100 text-red-800">{order?.status}</span>
                          ) : order?.status === "delivered" ? (
                            <span className="inline-flex items-center dark:bg-green-500/30 dark:text-green-200 uppercase tracking-wide px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">{order?.status}</span>
                          ) : order?.status === "outForDelivery" ? (
                            <span className="inline-flex items-center dark:bg-amber-500/30 dark:text-amber-200 uppercase tracking-wide px-2.5 py-0.5 rounded-full text-xs font-medium bg-amber-100 text-amber-800">in-transit</span>
                          ) : order?.status === "placed" && order.paymentMode == "online" && (order.paymentStatus == "init" || order.paymentStatus == "failed" || order.paymentStatus == null) ? (
                            <span className="inline-flex items-center dark:bg-red-500/30 dark:text-red-200 uppercase tracking-wide px-2.5 py-0.5 rounded-full text-xs font-medium bg-red-100 text-red-800">
                              {order.paymentStatus == "init" && "Payment Pending"}
                              {order.paymentStatus == "failed" && "Payment Failed"}
                              {order.paymentStatus == null && "Payment Failed"}
                            </span>
                          ) : (
                            <span className="inline-flex items-center dark:bg-blue-500/30 dark:text-blue-200 uppercase tracking-wide px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">Order Placed</span>
                          )}
                        </div>
                        {order?.status === "placed" && order.paymentMode == "online" && (order.paymentStatus == "init" || order.paymentStatus == "failed" || order.paymentStatus == null) ? (
                        //   <Link href={`/checkout/${order?.cart.cartId}`}>
                        //     <a className="flex items-center justify-center gap-1 text-xs font-bold tracking-wide uppercase text-brand-500">
                        //       {order.paymentStatus == "init" && (
                        //         <>
                        //           Complete Payment <BsCaretRightFill className="w-4 h-4" />
                        //         </>
                        //       )}
                        //       {(order.paymentStatus == "failed" || order.paymentStatus == null) && (
                        //         <>
                        //           Retry Payment <BsCaretRightFill className="w-4 h-4" />
                        //         </>
                        //       )}
                        //     </a>
                        //   </Link>
						<></>
                        ) : (
                          <Link href={`/dashboard/orders/${order?.orderId}`}>
                            <a className="flex items-center justify-center gap-1 text-xs font-bold tracking-wide uppercase text-brand-500">
                              View Details <BsCaretRightFill className="w-4 h-4" />
                            </a>
                          </Link>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
            </div>
          </div>
        </div>
      ) : (
        <div className="flex items-center justify-center py-5 mt-12" style={{ height: "95vh" }}>
          <div className="flex flex-col items-center justify-center gap-y-4">
            <p>No orders found.</p>
            <Link href="/">
              <a className="underline text-brand-500">Shop now</a>
            </Link>
          </div>
        </div>
      )}
      <Navbar />
    </>
  );
};

export default DashboardOrders;

export const getServerSideProps = async (ctx) => {
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
    const res = await axios.get(`${process.env.NEXT_PUBLIC_API_URL}/getAllOrdersByUser?_sort=id:DESC`, {
      headers: { Authorization: "Bearer " + session.jwt },
    });
    const orders = res?.data?.filter((order) => order?.platform === "WNXT");
    return { props: { orders } };
  } catch (err) {
    return {
      notFound: true,
    };
  }
};
