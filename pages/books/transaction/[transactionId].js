import axios from "axios";
import { getSession, useSession } from "next-auth/client";
import React from "react";
import Avatar from "react-avatar";
import AppLayout from "../../../components/app/layouts/AppLayout";
import TimeAgo from "javascript-time-ago";
import ReactTimeAgo from "react-time-ago";
import en from "javascript-time-ago/locale/en.json";
import { DownloadIcon, XIcon } from "@heroicons/react/outline";
TimeAgo.addDefaultLocale(en);
import { saveAs } from 'file-saver';
import { useRouter } from "next/router";
import toast from "react-hot-toast";
import withModal from "../../../hocs/withModal";

function TransactionDetails({ transactionDetails, setPopup }) {

  console.log(transactionDetails);
  const router = useRouter();
  const [session] = useSession();

  const deleteEntry = async() => {
    setPopup({
      popupShow: true,
      heading: "Confirmation",
      description: "Are you sure you want to delte this transaction?",
      primaryBtnText: "Yes",
      secondaryBtnText: "No",
      onPrimaryClick: async() => {
        try {
          const res = await axios.delete(`${process.env.NEXT_PUBLIC_API_URL}/deleteEntry/${transactionDetails.id}`, {
            headers: {
              Authorization: `Bearer ${session?.jwt}`,
            },
          });
          if (res?.status === 200) {
            toast.success(`Entry deleted successfully!`);
            console.log(`/books/${transactionDetails.books_customer.id}`);
            setTimeout(() => {
              router.replace(`/books/${transactionDetails.books_customer.id}`);
            }, 500);
          } else {
            console.error(res.response.message);
            toast.error(res.response.message);
          }
        } catch (error) {
          console.log(error);
        }
        setPopup({ popupShow: false });
      },
      onSecondaryClick: () => setPopup({ popupShow: false }),
    });
  }

  return (
    <AppLayout backTitle="Transaction Details">
      <div className="p-3 mt-3">
        <div></div>
        <div className="flex rounder-lg justify-between bg-white shadow mb-4 rounded-md p-3 px-3 items-center">
          <Avatar name={transactionDetails.books_customer.name} round size="40" textSizeRatio="2" />
          <div className="flex-1 ml-3">
            <div className="text-[16px] font-medium">{transactionDetails.books_customer.name}</div>
            <div className="text-[12px]">
              <ReactTimeAgo date={transactionDetails.created_at} locale="en-US" />
            </div>
          </div>

          {transactionDetails.transType == "got" && <div className="text-green-700 font-medium">You Got ₹ {Math.abs(transactionDetails.youGot)}</div>}

          {transactionDetails.transType == "gave" && <div className="text-red-500 font-medium">You Gave ₹ {Math.abs(transactionDetails.youGave)}</div>}
        </div>
        <div className="flex justify-between mb-8">
          <div>Running Balance</div>
          <div>₹ {transactionDetails.runningBalance}</div>
        </div>

        <div className="sm:grid sm:grid-cols-3 sm:gap-4 sm:items-start sm:border-t sm:border-gray-200 sm:pt-5 mb-8">
          <label htmlFor="businessName" className="block text-sm font-medium text-gray-700 dark:text-gray-200 sm:mt-px sm:pt-2">
            Notes
          </label>
          <div className="relative mt-1 sm:mt-0 sm:col-span-2">
            <textarea value={transactionDetails.notes} disabled className="block w-full max-w-lg border-gray-300 rounded-md shadow-sm dark:bg-gray-900 dark:border-transparent focus:ring-brand-500 focus:border-brand-500 sm:max-w-xs sm:text-sm" />
          </div>
        </div>

        <div>
          <label htmlFor="businessName" className="block text-sm font-medium text-gray-700 dark:text-gray-200 sm:mt-px sm:pt-2">
            Attachments
          </label>
          {transactionDetails.attachments?.length > 0 ? (
            <div className="grid grid-cols-3 gap-2">
              {transactionDetails.attachments.map((file, index) => (
                <div className="relative w-28 h-28" key={index} onClick={() => saveAs(file?.url, `${file.name}${file.ext}`)}>
                  <img src={file?.url} alt={file?.name} width={150} height={150} className="object-contain border rounded-md w-28 h-28 dark:border-darkColor-900" />
                  <div className="absolute text-red-500 top-[37%] right-[37%]">
                    <DownloadIcon className="w-8 h-8" />
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div>No Attachments</div>
          )}
        </div>
      </div>

      <div className="fixed flex w-full text-sm p-2 bottom-[0px] text-center">
        <button onClick={() => deleteEntry()} className="flex-1 bg-red-700 m-2 text-white p-3 rounded-md font-medium">
          Delete
        </button>
        <button onClick={() => router.push(`/books/${transactionDetails.books_customer.id}/got/${transactionDetails.books_customer.name}/${transactionDetails.id}`)} className="flex-1 bg-gray-700 m-2 text-white p-3 rounded-md font-medium">
          Edit
        </button>
      </div>

    </AppLayout>
  );
}

export default withModal(TransactionDetails);


export const getServerSideProps = async (ctx) => {
  const session = await getSession({ req: ctx.req });
  const { transactionId } = ctx.params;

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
      const res = await axios.get(`${process.env.NEXT_PUBLIC_API_URL}/books-transactions/${transactionId}`, {
        headers: { Authorization: "Bearer " + session.jwt },
      });
      if (res?.status === 200) {
        props = { transactionDetails: res.data }
      }
      else {
        return {
          redirect: {
            destination: "/books",
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

  return { props: props };
};
