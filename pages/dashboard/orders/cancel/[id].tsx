import { RadioGroup } from "@headlessui/react";
import axios from "axios";
import { getSession } from "next-auth/client";
import { useRouter } from "next/router";
import React from "react";
import { useState } from "react";
import toast from "react-hot-toast";
import AppLayout from "../../../../components/app/layouts/AppLayout";
import withModal from "../../../../hocs/withModal";
import { classNames } from "../../../../utilities";

const CancelOrder = ({ order, setPopup }) => {
  const CancellationReasons = ["Oops! I placed this order by mistake!", "My bad- Chosen a wrong product/s!", "I had wrongly chosen the delivery date/address", "Others- I just don't know!", "Other Reason"];

  const [cancel, setCancel] = useState(CancellationReasons[0]);
  const [otherReason, setOtherReason] = useState();
  const router = useRouter();

  const handelCancelOrder = async () => {
    if (cancel == "Other Reason" && !otherReason) {
      toast.error(`Please Provide valid reason for cancellation`);
    } else {
      try {
        const res = await axios.post(`${process.env.NEXT_PUBLIC_API_URL}/cancelOrder/${order?.id}`, {
          cancellationReason: cancel != "Other Reason" ? cancel : otherReason,
          isAdmin: false,
        });
        if (res.status === 200) {
          global.analytics.track("Order Cancelled", {
            order_id: order.id,
            subtotal: order.subTotal,
            total: order.orderTotal,
            tax: order.totalTax,
            products: order.line_items.map((li) => ({ ...li, itemId: li.id })),
          });

          toast.success("Order cancelled successfully");
          router.replace('/dashboard/orders/' + order.orderId)
        }
      } catch (error) {
        console.error(error);
        toast.error(`Something went wrong, try again later or Contact us`);
      }
    }
  };

  return (
    <AppLayout className={""} backTitle={""} barStyle={""}>
      <div className="pb-2 mx-3">
        <div className="sticky z-10 flex items-center justify-between w-screen py-2 top-[3.2rem] nav-blur dark:nav-blur-dark">
          <h1 className="flex items-center justify-between w-full text-xl font-bold">
            <span className="flex items-center gap-x-2">
              Cancel Order No. <span className="text-brand-500">#{order?.id}</span>
            </span>
          </h1>
        </div>

        <div className="mt-5">
          <h2>Choose Reason for Cancellation</h2>
          <RadioGroup value={cancel} onChange={setCancel}>
            <div className="-space-y-px bg-white rounded-md dark:bg-darkColor-900 mt-2">
              {CancellationReasons.map((reason, reasonIdx) => (
                <RadioGroup.Option key={reasonIdx} value={reason} className={({ checked }) => classNames(reasonIdx === 0 ? "rounded-tl-md rounded-tr-md" : "", reasonIdx === CancellationReasons.length - 1 ? "rounded-bl-md rounded-br-md" : "", checked ? "bg-brand-50 dark:bg-brand-900/40  border-brand-200 dark:border-brand-500 z-10" : "border-gray-200 dark:border-darkColor-600", "relative border p-4 flex cursor-pointer focus:outline-none")}>
                  {({ active, checked }) => (
                    <div className="flex justify-items-start">
                      <div>
                        <span className={classNames(checked ? "bg-brand-600 border-transparent" : "bg-white dark:bg-darkColor-600 border-gray-300 dark:border-darkColor-900", active ? "ring-2 ring-offset-2 ring-brand-500 dark:ring-offset-0" : "", "h-4 w-4 mt-0.5 cursor-pointer rounded-full border flex items-center justify-center")} aria-hidden="true">
                          <span className="rounded-full bg-white dark:bg-darkColor-900 w-1.5 h-1.5" />
                        </span>
                      </div>
                      <div className="ml-2">
                        <RadioGroup.Label as="span" className={classNames(checked ? "text-brand-900 dark:text-brand-50" : "text-gray-900 dark:text-darkColor-200", "text-sm font-medium flex")}>
                          {reason}
                        </RadioGroup.Label>
                      </div>
                    </div>
                  )}
                </RadioGroup.Option>
              ))}
            </div>
          </RadioGroup>
        </div>

        {cancel && cancel == "Other Reason" && (
          <div className="mt-5">
            <h2>Please tell us your reason for cancellation</h2>
            <div>
              <textarea onChange={(e: any) => setOtherReason(e.target.value)} value={otherReason} rows={5} name="customReason" className="block w-full max-w-lg border-gray-300 rounded-md shadow-sm dark:bg-gray-900 dark:border-transparent focus:ring-brand-500 focus:border-brand-500 sm:max-w-xs sm:text-sm" />
            </div>
          </div>
        )}

        <div className="fixed bottom-0 left-0 p-5 w-full nav-blur dark:nav-blur-dark">
          <button
            onClick={() =>
              setPopup({
                popupShow: true,
                heading: "Confirmation",
                description: "Are you sure you want to cancel this order?",
                primaryBtnText: "Yes",
                secondaryBtnText: "No",
                onPrimaryClick: () => {
                  handelCancelOrder();
                  setPopup({ popupShow: false });
                },
                onSecondaryClick: () => setPopup({ popupShow: false }),
              })
            }
            className="inline-flex items-center justify-center w-full px-6 py-3 text-base font-medium text-center text-white border border-transparent rounded-md shadow-sm ring-offset-0 bg-brand-600 hover:bg-brand-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-brand-500"
          >
            Submit
          </button>
        </div>
      </div>
    </AppLayout>
  );
};

export default withModal(CancelOrder);

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
