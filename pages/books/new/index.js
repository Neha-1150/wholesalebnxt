import { ExclamationCircleIcon } from "@heroicons/react/solid";
import { useSession } from "next-auth/client";
import React, { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import AppLayout from "../../../components/app/layouts/AppLayout";
import { MOBILE_REGEX } from "../../../utilities/constants";
import toast from 'react-hot-toast';
import axios from "axios";
import withFullLoader from "../../../hocs/withFullLoader";
import { useRouter } from "next/router";

function NewCustomer({ setLoading }) {
  const {
    register,
    handleSubmit,
    watch,
    setFocus,
    formState: { errors },
  } = useForm();

  const [session] = useSession();
  const router = useRouter()

  useEffect(() => {
    setFocus("cxName");
  }, [setFocus]);
  
  const onSubmit = async(data) => {

    setLoading(true)

    let body = {
      name: data.cxName,
      phoneNumber: data.cxPhoneNumber
    }

    try {
			const res = await axios.post(`${process.env.NEXT_PUBLIC_API_URL}/createBooksCustomerForUser`, body,
				{
					headers: {
						Authorization: `Bearer ${session?.jwt}`,
					},
				}
			);
			if (res?.status === 200) {
				toast.success(`Customer created successfully!`);
        setLoading(false);
        setTimeout(() => {
          router.replace(`/books/${res.data.id}`)
        }, 500);
			} else {
				console.error(res.response.message);
        toast.error(res.response.message);
        setLoading(false)
			}
		} catch (error) {
      setLoading(false)
			console.error(error?.response?.data, "her");
			toast.error(error?.response?.data.response.message);
		}
  };


  return (
    <AppLayout backTitle="Add New Customer">
      <div className="p-3 mt-5">
        <form onSubmit={handleSubmit(onSubmit)}>

          <div className="sm:grid sm:grid-cols-3 sm:gap-4 sm:items-start sm:border-t sm:border-gray-200 sm:pt-5 mb-10">
            <label htmlFor="businessName" className="block text-sm font-medium text-gray-700 dark:text-gray-200 sm:mt-px sm:pt-2">
              Customer Name
            </label>
            <div className="relative mt-1 sm:mt-0 sm:col-span-2">
              <input {...register("cxName", { required: "Customer Name is required" })} type="text" placeholder="Ram Kishore" className="block w-full max-w-lg border-gray-300 rounded-md shadow-sm dark:bg-gray-900 dark:border-transparent focus:ring-brand-500 focus:border-brand-500 sm:max-w-xs sm:text-sm" />
              {errors?.cxName && (
                <small className="absolute bottom-[-22px] flex items-center text-red-500 gap-x-1">
                  <ExclamationCircleIcon className="w-4 h-4" />
                  {errors?.cxName?.message}
                </small>
              )}
            </div>
          </div>
          
          <div className="sm:grid sm:grid-cols-3 sm:gap-4 sm:items-start sm:border-t sm:border-gray-200 sm:pt-5">
            <label htmlFor="businessName" className="block text-sm font-medium text-gray-700 dark:text-gray-200 sm:mt-px sm:pt-2">
              Customer Phone Number
            </label>
            <div className="relative mt-1 sm:mt-0 sm:col-span-2">
              <input
                type="number"
                maxLength={10}
                className="block w-full max-w-lg border-gray-300 rounded-md shadow-sm dark:bg-gray-900 dark:border-transparent focus:ring-brand-500 focus:border-brand-500 sm:max-w-xs sm:text-sm"
                placeholder="7276250662"
                inputMode="tel"
                {...register("cxPhoneNumber", {
                  required: " Customer Phone Number is required",
                  pattern: { value: MOBILE_REGEX, message: "Invalid  Customer Phone Number" },
                  minLength: { value: 10, message: "Customer Phone Number must be 10 characters" },
                  maxLength: { value: 10, message: "Customer Phone Number must be 10 characters" },
                })}
              />
              {errors?.cxPhoneNumber && (
                <small className="absolute bottom-[-22px] flex items-center text-red-500 gap-x-1">
                  <ExclamationCircleIcon className="w-4 h-4" />
                  {errors?.cxPhoneNumber?.message}
                </small>
              )}
            </div>
          </div>
          <div className="fixed flex w-full text-sm bottom-0 left-0 text-center">
            <button class="flex-1 rounded-md bg-[#6553e6] p-3 m-3 text-white font-medium">+ Add Customer</button>
        </div>
        </form>
      </div>
    </AppLayout>
  );
}

export default withFullLoader(NewCustomer);
