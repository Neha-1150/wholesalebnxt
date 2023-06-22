import { RadioGroup } from "@headlessui/react";
import { BadgeCheckIcon, ExclamationCircleIcon } from "@heroicons/react/solid";
import axios from "axios";
import { getSession } from "next-auth/client";
import { useRouter } from "next/router";
import React, { useState, useEffect } from "react";
import toast from "react-hot-toast";
import AppLayout from "../../../../../components/app/layouts/AppLayout";
import { classNames } from "../../../../../utilities";

const CancellationReasons = ["Refund to UPI account", "Refund to Bank Account"];

function refund({ order }) {
  const [refundOption, setRefundOption] = useState(CancellationReasons[0]);
  const [returnOrderFromStorage, setReturnOrderFromStorage] = useState();
  const [ifscCode, setIfscCode] = useState();
  const [ifscCodeError, setIfscCodeError] = useState();
  const [ifscData, setIfscData] = useState();
  const [accountHolderName, setAccountHolderName] = useState();
  const [accountNumber, setAccountNumber] = useState();
  const [accountNumberVerify, setAccountNumberVerify] = useState();
  const [accountNumberError, setAccountNumberError] = useState();
  const [accountNumberVerifyError, setAccountNumberVerifyError] = useState();
  const [vpa, setVpa] = useState();
  const [vpaData, setVpaData] = useState();
  const [vpaError, setVpaError] = useState();
  const [vpaLoader, setVpaLoader] = useState(false);

  const router = useRouter();

  useEffect(() => {
    let returnOrderFromStorage = window.localStorage.getItem('returnOrder')
    if(returnOrderFromStorage){
      returnOrderFromStorage = JSON.parse(returnOrderFromStorage);
      console.log(returnOrderFromStorage);
      setReturnOrderFromStorage(returnOrderFromStorage);
    }
  }, [])

  const handelSubmit = () => {

    let temp = {
      ...returnOrderFromStorage,
      refundOption: refundOption == 'Refund to UPI account' ? 'UPI' : 'Bank Account',
    }

    if(refundOption == 'Refund to UPI account'){
      temp = {
        ...temp,
        refundDetails: {
          vpaAddress: vpa
        }
      }
    }else{
      if(!accountHolderName){
        toast.error(`Please Fill Account Holder Name`);
        return
      }
  
      if(accountNumberError){
        toast.error(`Please check Account Number`);
        return
      }
  
      if(!accountNumber){
        toast.error(`Please Fill Account Number`);
        return
      }
  
      if(accountNumberVerifyError){
        toast.error(`Please check Account Number`);
        return
      }
  
      if(!ifscCode || !ifscData){
        toast.error(`Please check IFSC Code`);
        return
      }

      temp = {
        ...temp,
        refundDetails: {
          accountHolderName,
          accountNumber,
          ifscCode
        }
      }
    }

    
    try {
      window.localStorage.setItem('returnOrder', JSON.stringify(temp));
      router.push("/dashboard/orders/return/" + order.orderId + "/pickup")
    } catch (error) {
      console.log(error);
      toast.error('Something went wrong, Please Try Again')
    }
  }

  const checkIfscCode = async(ifscCode) => {
    try {
      const res = await axios.get(`https://ifsc.razorpay.com/${ifscCode}`);
      if (res?.status === 200) {
        setIfscData(res.data.BRANCH + ', ' + res.data.CENTRE);
      }
    } catch (error) {
      console.log(error);
    }
  }

  const validateVpa = async() => {
    setVpaLoader(true);
    try {
      const res = await axios.put(`${process.env.NEXT_PUBLIC_API_URL}/validateVpa/${vpa}`);
      if (res?.status === 200) {
        setVpaData(res.data);
        setVpaLoader(false);
      }
    } catch (error) {
      console.log(error.response.data);
      setVpaError(error.response.data.description)
      setVpaLoader(false);
    }
  }

  return (
    <AppLayout>
      <div className="pb-2 mx-3">
        <div className="sticky z-10 flex items-center justify-between w-screen py-2 top-[3.2rem] nav-blur dark:nav-blur-dark">
          <h1 className="flex items-center justify-between w-full text-xl font-bold">
            <span className="flex items-center gap-x-2">
              Return Order No. <span className="text-brand-500">#{order?.id}</span>
            </span>
          </h1>
        </div>

        <div className="mt-2">
          <h2>Select Refund Option</h2>
          <RadioGroup value={refundOption} onChange={setRefundOption}>
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

        {refundOption && refundOption == "Refund to UPI account" && (
          <div className="mt-5">
            <div className="sm:grid sm:grid-cols-3 sm:gap-4 sm:items-start sm:border-t sm:border-gray-200 sm:pt-5">
              <label htmlFor="fullName" className="block text-sm font-medium text-gray-700 dark:text-gray-200 sm:mt-px sm:pt-2">
                Enter your UPI ID
              </label>
              <div className="relative mt-1 sm:mt-0 sm:col-span-2">
                <div className="flex justify-between items-center">
                    <input onChange={e => {setVpa(e.target.value); setVpaData(null); setVpaError(null)}} value={vpa} type="text" name="upi" id="upi" placeholder="mobileNumber@upi" className="block w-full max-w-lg border-gray-300 rounded-md shadow-sm dark:bg-gray-900 dark:border-transparent focus:ring-brand-500 focus:border-brand-500 sm:max-w-xs sm:text-sm" />
                    {!vpaLoader ? 
                    <button onClick={() => validateVpa()} className="text-brand-700 ml-3">Verify</button>
                    :
                    <span
                      style={{ margin: '0 0.75rem', width: '24px', height: '24px', border: '5px solid #ffdfd3',
                        borderBottomColor: '#EC4201',
                        borderRadius: '50%',
                        display: 'inline-block',
                        boxSizing: 'border-box',
                        animation: 'rotation 1s linear infinite',
                      }}
								    />}
                </div>
                {vpaData && (
                    <small className="absolute bottom-[-25px] flex items-center text-green-700 gap-x-1">
                      <BadgeCheckIcon className="w-4 h-4" />
                      {vpaData.customer_name}
                    </small>
                  )}
                {vpaError && (
                    <small className="absolute bottom-[-25px] flex items-center text-red-500 gap-x-1">
                      <ExclamationCircleIcon className="w-4 h-4" />
                      {vpaError}
                    </small>
                  )}
              </div>
            </div>
          </div>
        )}

        {refundOption && refundOption == "Refund to Bank Account" && (
          <div className="mt-5">
            <div className="mb-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:items-start sm:border-t sm:border-gray-200 sm:pt-5">
              <label htmlFor="fullName" className="block text-sm font-medium text-gray-700 dark:text-gray-200 sm:mt-px sm:pt-2">
                Enter Account holder’s name
              </label>
              <div className="relative mt-1 sm:mt-0 sm:col-span-2">
                <input onChange={e => setAccountHolderName(e.target.value)} value={accountHolderName} type="text" name="upi" id="upi" className="block w-full max-w-lg border-gray-300 rounded-md shadow-sm dark:bg-gray-900 dark:border-transparent focus:ring-brand-500 focus:border-brand-500 sm:max-w-xs sm:text-sm" />
              </div>
            </div>
            <div className="mb-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:items-start sm:border-t sm:border-gray-200 sm:pt-5">
              <label htmlFor="fullName" className="block text-sm font-medium text-gray-700 dark:text-gray-200 sm:mt-px sm:pt-2">
                Account number
              </label>
              <div className="relative mt-1 sm:mt-0 sm:col-span-2">
                <input onChange={e => {
                  setAccountNumber(e.target.value);
                  if(!parseInt(e.target.value)){
                    setAccountNumberError('Account Number Should only be Numbers')
                  }else{
                    setAccountNumberError(null)
                  }
                }} value={accountNumber} type="text" name="upi" id="upi" className="block w-full max-w-lg border-gray-300 rounded-md shadow-sm dark:bg-gray-900 dark:border-transparent focus:ring-brand-500 focus:border-brand-500 sm:max-w-xs sm:text-sm" />
                {accountNumberError && (
                    <small className="absolute bottom-[-20px] flex items-center text-red-500 gap-x-1">
                      <ExclamationCircleIcon className="w-4 h-4" />
                      {accountNumberError}
                    </small>
                  )}
              </div>
            </div>
            <div className="mb-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:items-start sm:border-t sm:border-gray-200 sm:pt-5">
              <label htmlFor="fullName" className="block text-sm font-medium text-gray-700 dark:text-gray-200 sm:mt-px sm:pt-2">
                Confirm account number
              </label>
              <div className="relative mt-1 sm:mt-0 sm:col-span-2">
                <input onChange={e => {
                  setAccountNumberVerify(e.target.value);
                  if(!parseInt(e.target.value)){
                    setAccountNumberVerifyError('Account Number Should only be Numbers')
                  }else{
                    console.log(e.target.value != accountNumber);
                    if(e.target.value != accountNumber){
                      setAccountNumberVerifyError('Account Number doesnt match');
                    }else{
                      setAccountNumberVerifyError(null)
                    }
                  }
                }} value={accountNumberVerify} type="text" name="upi" id="upi" className="block w-full max-w-lg border-gray-300 rounded-md shadow-sm dark:bg-gray-900 dark:border-transparent focus:ring-brand-500 focus:border-brand-500 sm:max-w-xs sm:text-sm" />
                {accountNumberVerifyError && (
                  <small className="absolute bottom-[-20px] flex items-center text-red-500 gap-x-1">
                    <ExclamationCircleIcon className="w-4 h-4" />
                    {accountNumberVerifyError}
                  </small>
                )}
              </div>
            </div>
            <div className="sm:grid sm:grid-cols-3 sm:gap-4 sm:items-start sm:border-t sm:border-gray-200 sm:pt-5">
              <label htmlFor="fullName" className="block text-sm font-medium text-gray-700 dark:text-gray-200 sm:mt-px sm:pt-2">
                IFSC code
              </label>
              <div className="relative mt-1 sm:mt-0 sm:col-span-2">
                <input value={ifscCode} onChange={(e) => {
                  setIfscCode(e.target.value.toUpperCase())
                  if(e.target.value.match(/^[A-Za-z]{4}\d{7}$/) == null){
                    setIfscCodeError('IFSC should be 4 letters, followed by 7 letters or digits')
                    setIfscData(null);
                  }else{
                    setIfscData('Validating..')
                    checkIfscCode(e.target.value)
                    setIfscCodeError(null)
                  }
                }}  type="text" name="upi" id="upi" className="block w-full max-w-lg border-gray-300 rounded-md shadow-sm dark:bg-gray-900 dark:border-transparent focus:ring-brand-500 focus:border-brand-500 sm:max-w-xs sm:text-sm" />
                {ifscCodeError && (
                  <small className="absolute bottom-[-20px] flex items-center text-red-500 gap-x-1">
                    <ExclamationCircleIcon className="w-4 h-4" />
                    {ifscCodeError}
                  </small>
                )}
                {ifscData && (
                  <small className="absolute bottom-[-20px] flex items-cente gap-x-1">
                    {ifscData}
                  </small>
                )}
              </div>
            </div>
          </div>
        )}

        <div className="fixed bottom-0 left-0 p-5 w-full nav-blur dark:nav-blur-dark">
          <button onClick={() => handelSubmit()} className="inline-flex items-center justify-center w-full px-6 py-3 text-base font-medium text-center text-white border border-transparent rounded-md shadow-sm ring-offset-0 bg-brand-600 hover:bg-brand-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-brand-500">
            Submit and Select Pickup Address
          </button>
        </div>

      </div>
    </AppLayout>
  );
}

export default refund;

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
    return { props: { order: res?.data, session } };
  } catch (err) {
    return {
      notFound: true,
    };
  }
};
