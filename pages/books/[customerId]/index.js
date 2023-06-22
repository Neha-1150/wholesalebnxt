import { ArrowLeftIcon, DotsVerticalIcon, PhoneIcon, TrashIcon } from "@heroicons/react/solid";
import axios from "axios";
import moment from "moment";
import { getSession, useSession } from "next-auth/client";
import { useRouter } from "next/router";
import React from "react";
import Avatar from "react-avatar";
import toast from "react-hot-toast";
import withModal from "../../../hocs/withModal";

const paymentReminderTemplate = (amount, name) => {
  return `Dear Sir/Madam,%0aYour payment of ₹ ${amount} is pending at ${name}.`
}

function CustomerBook({ customerDetails, setPopup }) {
  console.log(customerDetails);
  const router = useRouter();
  const [session] = useSession();

  const handelRemind = () => {
    setPopup({
      popupShow: true,
      heading: "Confirmation",
      description: `Are you sure you want to sent an payment reminder to ${customerDetails.name}?`,
      primaryBtnText: "Yes",
      secondaryBtnText: "No",
      onPrimaryClick: () => {
        // checkoutHandler(values);
        window.open(`https://api.whatsapp.com/send/?phone=91${customerDetails.phoneNumber}&text=${paymentReminderTemplate(customerDetails.currentBalance, customerDetails.name)}`,'_blank');
        setPopup({ popupShow: false });
      },
      onSecondaryClick: () => setPopup({ popupShow: false }),
    });
  }

  const handelDeleteCx = () => {
    setPopup({
      popupShow: true,
      heading: "Confirmation",
      description: `Are you sure you want to delete ${customerDetails.name}?`,
      primaryBtnText: "Yes",
      secondaryBtnText: "No",
      onPrimaryClick: async() => {
        try {
          const res = await axios.delete(`${process.env.NEXT_PUBLIC_API_URL}/deleteBooksCustomer/${customerDetails.id}`, {
            headers: {
              Authorization: `Bearer ${session?.jwt}`,
            },
          });
          if (res?.status === 200) {
            toast.success(`Customer deleted successfully!`);
            setTimeout(() => {
              router.replace(`/books`);
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
    <main className="relative w-screen min-h-screen pt-16 pb-24 bg-gray-50">
      <div className="px-2 py-3 fixed top-0 z-10 w-screen bg-[#E64431] text-white nav-blur dark:nav-blur-dark">
        <div className="flex items-center gap-3">
          <button onClick={() => router.back()}>
            <ArrowLeftIcon className="w-5 h-5 ml-2 text-white" />
          </button>
          <div className="flex flex-1 w-100 items-center justify-between">
            <Avatar name={customerDetails.name} round size="30" textSizeRatio="2" />
            <div className="flex-1 ml-3">
              <h3 className="mt-1 font-medium capitalize">{customerDetails.name}</h3>
            </div>
            <div className="flex">
              <a href={`tel:${customerDetails.phoneNumber}`}>
                <PhoneIcon className="w-5 h-5 text-white" />
              </a>
              <TrashIcon onClick={() => handelDeleteCx()} className="w-5 h-5 ml-3 text-white" />
            </div>
          </div>
        </div>
      </div>

      <div className="bg-white mx-5 shadow flex flex-col mb-5">
        {customerDetails.currentBalance < 0 && (
          <div className="p-3 self-center text-center">
            <div className="text-[12px]">YOU'LL GET</div>
            <div className="text-[22px] font-bold text-red-700">₹ {Math.abs(customerDetails.currentBalance)}</div>
          </div>
        )}

        {customerDetails.currentBalance > 0 && (
          <div className="p-3 self-center text-center">
            <div className="text-[12px]">YOU'LL GIVE</div>
            <div className="text-[22px] font-bold text-green-700">₹ {Math.abs(customerDetails.currentBalance)}</div>
          </div>
        )}

        {customerDetails.books_transactions && customerDetails.books_transactions.length > 0 && customerDetails.currentBalance == 0 && (
          <div className="p-3 self-center text-center">
            <div className="text-[12px]">Account Settled</div>
            <div className="text-[22px] font-bold text-green-700">₹ 0</div>
          </div>
        )}

        {customerDetails.books_transactions && customerDetails.books_transactions.length > 0 && <div className="flex justify-between">
          <div className="flex-1 flex justify-center text-center border-t border-r p-2">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
            </svg>
            <div>Statement</div>
          </div>
          <div onClick={() => handelRemind()} className="flex-1 flex justify-center text-center border-t border-r p-2">
            <svg fill="#000000" xmlns="http://www.w3.org/2000/svg"  viewBox="0 0 24 24" className="h-5 w-5">    <path d="M 12.011719 2 C 6.5057187 2 2.0234844 6.478375 2.0214844 11.984375 C 2.0204844 13.744375 2.4814687 15.462563 3.3554688 16.976562 L 2 22 L 7.2324219 20.763672 C 8.6914219 21.559672 10.333859 21.977516 12.005859 21.978516 L 12.009766 21.978516 C 17.514766 21.978516 21.995047 17.499141 21.998047 11.994141 C 22.000047 9.3251406 20.962172 6.8157344 19.076172 4.9277344 C 17.190172 3.0407344 14.683719 2.001 12.011719 2 z M 12.009766 4 C 14.145766 4.001 16.153109 4.8337969 17.662109 6.3417969 C 19.171109 7.8517969 20.000047 9.8581875 19.998047 11.992188 C 19.996047 16.396187 16.413812 19.978516 12.007812 19.978516 C 10.674812 19.977516 9.3544062 19.642812 8.1914062 19.007812 L 7.5175781 18.640625 L 6.7734375 18.816406 L 4.8046875 19.28125 L 5.2851562 17.496094 L 5.5019531 16.695312 L 5.0878906 15.976562 C 4.3898906 14.768562 4.0204844 13.387375 4.0214844 11.984375 C 4.0234844 7.582375 7.6067656 4 12.009766 4 z M 8.4765625 7.375 C 8.3095625 7.375 8.0395469 7.4375 7.8105469 7.6875 C 7.5815469 7.9365 6.9355469 8.5395781 6.9355469 9.7675781 C 6.9355469 10.995578 7.8300781 12.182609 7.9550781 12.349609 C 8.0790781 12.515609 9.68175 15.115234 12.21875 16.115234 C 14.32675 16.946234 14.754891 16.782234 15.212891 16.740234 C 15.670891 16.699234 16.690438 16.137687 16.898438 15.554688 C 17.106437 14.971687 17.106922 14.470187 17.044922 14.367188 C 16.982922 14.263188 16.816406 14.201172 16.566406 14.076172 C 16.317406 13.951172 15.090328 13.348625 14.861328 13.265625 C 14.632328 13.182625 14.464828 13.140625 14.298828 13.390625 C 14.132828 13.640625 13.655766 14.201187 13.509766 14.367188 C 13.363766 14.534188 13.21875 14.556641 12.96875 14.431641 C 12.71875 14.305641 11.914938 14.041406 10.960938 13.191406 C 10.218937 12.530406 9.7182656 11.714844 9.5722656 11.464844 C 9.4272656 11.215844 9.5585938 11.079078 9.6835938 10.955078 C 9.7955938 10.843078 9.9316406 10.663578 10.056641 10.517578 C 10.180641 10.371578 10.223641 10.267562 10.306641 10.101562 C 10.389641 9.9355625 10.347156 9.7890625 10.285156 9.6640625 C 10.223156 9.5390625 9.737625 8.3065 9.515625 7.8125 C 9.328625 7.3975 9.131125 7.3878594 8.953125 7.3808594 C 8.808125 7.3748594 8.6425625 7.375 8.4765625 7.375 z"/></svg>
            <div>Remind</div>
          </div>
        </div>}
      </div>

      {customerDetails.books_transactions && customerDetails.books_transactions.length > 0 ? (
        <div>
          <div className="flex mx-5 my-2 text-[12px]">
            <div className="flex-1 ml-3">Transactions</div>
            <div className="flex-1 text-center">You Gave</div>
            <div className="flex-1 text-right mr-3">You Got</div>
          </div>

          {customerDetails.books_transactions
            .sort((a, b) => b.id > a.id)
            .map((t) => (
              <div onClick={() => router.push(`/books/transaction/${t.id}`)} className="flex mx-5 my-2 text-[12px] bg-white rounded-md shadow mb-3">
                <div className="flex-1 flex flex-col items-start justify-center pl-3 py-3">
                  <div className="font-medium">{moment(t.created_at).format("MMM DD[, ]YY")}</div>
                  <div>{moment(t.created_at).format("hh:mm a")}</div>
                </div>
                <div className="flex-1 flex items-center justify-center bg-red-100 text-red-700 font-medium text-[15px]">{t.youGave && "₹ " + t.youGave}</div>
                <div className="flex-1 flex items-center justify-end pr-3 bg-green-100 text-green-700 font-medium text-[15px]">{t.youGot && "₹ " + t.youGot}</div>
              </div>
            ))}
        </div>
      ) : (
        <div className="flex items-center justify-center" style={{ height: "calc(100vh - 180px)" }}>
          <div className="text-center text-gray-500">Add first transaction for {customerDetails.name}</div>
        </div>
      )}

      <div className="fixed flex w-full text-sm p-2 bottom-[0px] text-center">
        <button onClick={() => router.push(`/books/${customerDetails.id}/gave/${customerDetails.name}`)} className="flex-1 bg-red-700 m-2 text-white p-3 rounded-md font-medium">
          You Gave
        </button>
        <button onClick={() => router.push(`/books/${customerDetails.id}/got/${customerDetails.name}`)} className="flex-1 bg-green-700 m-2 text-white p-3 rounded-md font-medium">
          You Got
        </button>
      </div>
    </main>
  );
}

export default withModal(CustomerBook);

export const getServerSideProps = async (ctx) => {
  const { customerId } = ctx.params;
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
      const res = await axios.get(`${process.env.NEXT_PUBLIC_API_URL}/getBooksCustomerForUser/${customerId}`, {
        headers: { Authorization: "Bearer " + session.jwt },
      });
      if (res?.status === 200) {
        props = { customerDetails: res.data }
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
