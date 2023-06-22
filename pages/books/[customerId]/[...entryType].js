import { ArrowLeftIcon, ExclamationCircleIcon, XIcon } from "@heroicons/react/solid";
import axios from "axios";
import { getSession, useSession } from "next-auth/client";
import { useRouter } from "next/router";
import React, { useEffect, useState } from "react";
import { useForm, useWatch } from "react-hook-form";
import toast from "react-hot-toast";
import withFullLoader from "../../../hocs/withFullLoader";
import { MOBILE_REGEX } from "../../../utilities/constants";

function Entry({ entryType, setLoading, customerId, customerName, transactionDetails }) {
  console.log(transactionDetails);
  const [assets, setAssets] = useState(transactionDetails && transactionDetails.attachments && transactionDetails.attachments.length > 0 ? transactionDetails.attachments : []);

  const {
    register,
    handleSubmit,
    watch,
    setFocus,
    control,
    formState: { errors },
  } = useForm({ defaultValues: transactionDetails ? {
    amount: transactionDetails.transType == 'got' ? transactionDetails.youGot : transactionDetails.youGave,
    notes: transactionDetails.notes
  } : {}});

  const router = useRouter();
  const [session] = useSession();

  const amount = useWatch({ control, name: "amount" });

  useEffect(() => {
    setFocus("amount");
  }, [setFocus]);

  const onSubmit = async (data) => {
    setLoading(true);

    let body = {
      amount: parseFloat(data.amount),
      booksCustomer: customerId,
      notes: data.notes,
      attachments: assets
    };

    if(transactionDetails){
      body.transType = transactionDetails.transType
      try {
        const res = await axios.post(`${process.env.NEXT_PUBLIC_API_URL}/editEntry/${transactionDetails.id}`, body, {
          headers: {
            Authorization: `Bearer ${session?.jwt}`,
          },
        });
        if (res?.status === 200) {
          toast.success(`Entry edited successfully!`);
          setLoading(false);
          setTimeout(() => {
            router.replace(`/books/${customerId}`);
          }, 500);
        } else {
          console.error(res.response.message);
          toast.error(res.response.message);
          setLoading(false);
        }
      } catch (error) {
        
      }
    }else{
      try {
        const res = await axios.post(`${process.env.NEXT_PUBLIC_API_URL}/addEntry/${entryType}`, body, {
          headers: {
            Authorization: `Bearer ${session?.jwt}`,
          },
        });
        if (res?.status === 200) {
          toast.success(`Entry created successfully!`);
          setLoading(false);
          setTimeout(() => {
            router.replace(`/books/${customerId}`);
          }, 500);
        } else {
          console.error(res.response.message);
          toast.error(res.response.message);
          setLoading(false);
        }
      } catch (error) {
        setLoading(false);
        console.error(error);
        toast.error(error);
      }
    }

   
  };

  const uploadImage = async (e) => {
    const toastId = toast.loading("Uploading...");
    const files = e?.target?.files;
    if (files?.[0]?.size > 5000000) {
      toast.dismiss(toastId);
      toast.error("Please upload files under 5MB");
    } else if (!["jpg", "jpeg", "png", "svg", "pdf"].includes(files?.[0]?.name.split(".").pop())) {
      toast.dismiss(toastId);
      toast.error("Please upload PNG/JPG only");
    } else {
      const fileFormData = new FormData();
      fileFormData.append("files", files[0]);
      try {
        const res = await axios.post(`${process.env.NEXT_PUBLIC_API_URL}/upload`, fileFormData);
        if (res?.data?.[0]?.url) {
          setAssets([...assets, res?.data?.[0]]);
          toast.dismiss(toastId);
          toast.success("Uploaded successfully");
        }
      } catch (err) {
        toast.dismiss(toastId);
        toast.error("Something went wrong");
      }
    }
  };

  return (
    <main className="relative w-screen min-h-screen pt-16 pb-24 bg-gray-50">
      <div className="px-2 py-3 fixed top-0 z-10 w-screen bg-[#E64431] text-white nav-blur dark:nav-blur-dark">
        <div className="flex items-center gap-3">
          <button onClick={() => router.back()}>
            <ArrowLeftIcon className="w-5 h-5 ml-2 text-white" />
          </button>
          <div className="flex flex-1 w-100 items-center justify-between">{entryType == "gave" ? `You gave ${customerName} Rs. ${amount ? amount : 0} ` : `${customerName} gave you Rs. ${amount ? amount : 0} `}</div>
        </div>
      </div>

      <div className="p-3 mt-5">
        <form onSubmit={handleSubmit(onSubmit)}>
          <div className="sm:grid sm:grid-cols-3 sm:gap-4 sm:items-start sm:border-t sm:border-gray-200 sm:pt-5 mb-10">
            <label htmlFor="businessName" className="block text-sm font-medium text-gray-700 dark:text-gray-200 sm:mt-px sm:pt-2">
              Enter Amount
            </label>
            <div className="relative mt-1 sm:mt-0 sm:col-span-2">
              <input {...register("amount", { required: "Amount is required", min: { value: 1, message: "Amount Should be greater than 0" } })} type="number" inputMode="numeric" placeholder="Rs. " className="block w-full max-w-lg border-gray-300 rounded-md shadow-sm dark:bg-gray-900 dark:border-transparent focus:ring-brand-500 focus:border-brand-500 sm:max-w-xs sm:text-sm" />
              {errors?.amount && (
                <small className="absolute bottom-[-22px] flex items-center text-red-500 gap-x-1">
                  <ExclamationCircleIcon className="w-4 h-4" />
                  {errors?.amount?.message}
                </small>
              )}
            </div>
          </div>

          <div className="sm:grid sm:grid-cols-3 sm:gap-4 sm:items-start sm:border-t sm:border-gray-200 sm:pt-5 mb-10">
            <label htmlFor="businessName" className="block text-sm font-medium text-gray-700 dark:text-gray-200 sm:mt-px sm:pt-2">
              Add Notes
            </label>
            <div className="relative mt-1 sm:mt-0 sm:col-span-2">
              <textarea {...register("notes")} placeholder="Add Bill Number/Notes/Item Name" className="block w-full max-w-lg border-gray-300 rounded-md shadow-sm dark:bg-gray-900 dark:border-transparent focus:ring-brand-500 focus:border-brand-500 sm:max-w-xs sm:text-sm" />
              {errors?.notes && (
                <small className="absolute bottom-[-22px] flex items-center text-red-500 gap-x-1">
                  <ExclamationCircleIcon className="w-4 h-4" />
                  {errors?.amount?.message}
                </small>
              )}
            </div>
          </div>

          {assets?.length === 0 && (
            <div className="">
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-200">Attach Bill/Invoice</label>
              <div className="flex justify-center px-6 pt-5 pb-6 mt-1 border-2 border-gray-300 border-dashed rounded-md dark:border-gray-900">
                <div className="space-y-1 text-center">
                  <svg className="w-12 h-12 mx-auto text-gray-400 dark:text-brand-400" stroke="currentColor" fill="none" viewBox="0 0 48 48" aria-hidden="true">
                    <path d="M28 8H12a4 4 0 00-4 4v20m32-12v8m0 0v8a4 4 0 01-4 4H12a4 4 0 01-4-4v-4m32-4l-3.172-3.172a4 4 0 00-5.656 0L28 28M8 32l9.172-9.172a4 4 0 015.656 0L28 28m0 0l4 4m4-24h8m-4-4v8m-12 4h.02" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                  <div className="flex justify-center text-sm text-gray-600">
                    <label htmlFor="file-upload" className="relative font-medium bg-white rounded-md cursor-pointer dark:bg-black text-brand-600 hover:text-brand-500 focus-within:outline-none focus-within:ring-2 focus-within:ring-offset-2 dark:ring-offset-0 focus-within:ring-brand-500">
                      <span className="text-center">Upload a file</span>
                      <input id="file-upload" name="file-upload" type="file" className="sr-only" onChange={uploadImage} />
                    </label>
                  </div>
                  <p className="text-xs text-gray-500">Files up to 10MB</p>
                </div>
              </div>
            </div>
          )}

          {assets?.length > 0 && (
            <div className="grid grid-cols-3 gap-2">
              {assets.map((file, index) => (
                <div className="relative w-28 h-28" key={index}>
                  <img src={file?.url} alt={file?.name} width={150} height={150} className="object-contain border rounded-md w-28 h-28 dark:border-darkColor-900" />
                  <button type="button" className="absolute text-red-500 top-1 right-1" onClick={() => deleteImage(file?.id)}>
                    <XIcon className="w-4 h-4" />
                  </button>
                </div>
              ))}
              <div className="flex flex-col items-center justify-center border-2 border-gray-300 border-dashed rounded-md w-28 h-28 dark:border-gray-900">
                <svg className="w-12 h-12 mx-auto text-gray-400 dark:text-brand-400" stroke="currentColor" fill="none" viewBox="0 0 48 48" aria-hidden="true">
                  <path d="M28 8H12a4 4 0 00-4 4v20m32-12v8m0 0v8a4 4 0 01-4 4H12a4 4 0 01-4-4v-4m32-4l-3.172-3.172a4 4 0 00-5.656 0L28 28M8 32l9.172-9.172a4 4 0 015.656 0L28 28m0 0l4 4m4-24h8m-4-4v8m-12 4h.02" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" />
                </svg>
                <label htmlFor="file-upload" className="relative text-xs font-medium bg-white rounded-md cursor-pointer dark:bg-black text-brand-600 hover:text-brand-500 focus-within:outline-none focus-within:ring-2 focus-within:ring-offset-2 focus-within:ring-brand-500">
                  <span className="text-center">Upload a file</span>
                  <input id="file-upload" name="file-upload" type="file" className="sr-only" onChange={uploadImage} />
                </label>
              </div>
            </div>
          )}

          {!transactionDetails && <div className="fixed flex w-full text-sm bottom-0 left-0 text-center">{entryType == "gave" ? <button class="flex-1 rounded-md bg-red-700 p-3 m-3 text-white font-medium">Save Entry</button> : <button class="flex-1 rounded-md bg-green-700 p-3 m-3 text-white font-medium">Save Entry</button>}</div>}
          {transactionDetails && <div className="fixed flex w-full text-sm bottom-0 left-0 text-center"><button class="flex-1 rounded-md bg-gray-700 p-3 m-3 text-white font-medium">Edit Entry</button></div>}
        </form>
      </div>
    </main>
  );
}

export default withFullLoader(Entry);

export const getServerSideProps = async (ctx) => {
  const session = await getSession({ req: ctx.req });
  const { entryType, customerId } = ctx.params;

  if (!session) {
    return {
      redirect: {
        destination: "/login",
        permanent: false,
      },
    };
  }
  let props = { entryType: entryType[0], customerId, customerName: entryType[1] }

  if(entryType[2] && session){
    try {
      const res = await axios.get(`${process.env.NEXT_PUBLIC_API_URL}/books-transactions/${entryType[2]}`, {
        headers: { Authorization: "Bearer " + session.jwt },
      });
      if (res?.status === 200) {
        props = {...props, transactionDetails: res.data }
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

