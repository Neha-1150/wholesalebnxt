import React from "react";
import AppLayout from "../../components/app/layouts/AppLayout";
import { useForm, useWatch } from "react-hook-form";
import toast from 'react-hot-toast';
import axios from 'axios';
import { getSession } from 'next-auth/client';
import { useRouter } from 'next/router';


export default function BusinessCategory({ session }) {
    console.log(session);
  const {
    register,
    handleSubmit,
    control,
    formState: { errors },
  } = useForm({
    defaultValues: {
      businessCategory: session.user.businessCategory,
    },
  });
  const router = useRouter();

  const updateUser = async(values) => {
    console.log(values);
    try {
        const res = await axios.put(`${process.env.NEXT_PUBLIC_API_URL}/users/${session.id}`, values, {
            headers: {
                Authorization: `Bearer ${session.jwt}`,
            },
        });
        if (res.status === 200) {
            toast.success('Updated successfully, Please Login Again to see the changes');
            setTimeout(() => {
                router.back();
            }, 1000);
        }
    } catch (error) {
        console.error(error);
        toast.error('Something went wrong');
    }
  };

  return (
    <AppLayout>
      <form className="py-5 tracking-tight" onSubmit={handleSubmit(updateUser)}>
        <div className="sticky z-10 flex items-center justify-between w-screen px-5 py-2 top-[3.2rem] nav-blur dark:nav-blur-dark">
          <h1 className="text-xl font-bold">Change Business Category</h1>
          <button type="submit" className="text-sm font-bold tracking-wide uppercase dark:text-brand-400 text-brand-500">
            Update
          </button>
        </div>

        <div className="m-5 mb-10">
          <div className="space-y-6 sm:space-y-5">
            <div className="sm:grid sm:grid-cols-3 sm:gap-4 sm:items-start sm:border-t sm:border-gray-200 sm:pt-5">
              <label htmlFor="name" className="flex items-center text-sm font-medium text-gray-700 gap-x-2 dark:text-gray-200 sm:mt-px sm:pt-2">
                Select Category
              </label>
              <div className="relative mt-1 sm:mt-0 sm:col-span-2">
                <select
                  {...register("businessCategory", {
                    required: "BusinessCategory is required"
                  })}
                  id="businessCategory"
                  name="businessCategory"
                  className="block w-full max-w-lg border-gray-300 rounded-md shadow-sm dark:bg-gray-900 dark:border-transparent focus:ring-brand-500 focus:border-brand-500 sm:max-w-xs sm:text-sm"
                >
                  <option value={"Packaging"}>Packaging</option>
                  <option value={"Stationary"}>Stationary</option>
                  <option value={"Housekeeping"}>Housekeeping</option>
                  <option value={"SuperMarkets"}>SuperMarkets</option>
                  <option value={"GroceryStore"}>GroceryStore</option>
                  <option value={"FruitsStore"}>FruitsStore</option>
                  <option value={"ProvisionalStores"}>ProvisionalStores</option>
                </select>
              </div>
            </div>
          </div>
        </div>
      </form>
    </AppLayout>
  );
}


export const getServerSideProps = async ctx => {
    const session = await getSession(ctx);

	return {
        props: { session },
    };
};