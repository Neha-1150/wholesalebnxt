import * as React from 'react';
import axios from "axios";
import { getSession } from "next-auth/client";
import { useEffect, useState } from "react";
import AppLayout from "../../../../../components/app/layouts/AppLayout";
import { RadioGroup } from "@headlessui/react";
import { classNames, pluralize, toINR } from "../../../../../utilities";
import toast from 'react-hot-toast';
import { XIcon } from "@heroicons/react/solid";
import { useRouter } from "next/router";

const CancellationReasons = ["I have received a damaged product", "I have received different product", "I have quality related Issues"];
const QualityIssues = ["Box Damage", "Wrong fitment"];

function items({ order, session }) {
  const [returnQty, setReturnQty] = useState(order?.line_items[0].quantity);
  const [cancel, setCancel] = useState(CancellationReasons[0]);
  const [qualityIssue, setQualityIssue] = useState(QualityIssues[0]);
  const [assets, setAssets] = useState([]);
  const router = useRouter();

  useEffect(() => {
    let returnOrderFromStorage: any = window.localStorage.getItem('returnOrder')
    if(returnOrderFromStorage){
      returnOrderFromStorage = JSON.parse(returnOrderFromStorage);
      console.log(returnOrderFromStorage);
      setReturnQty(returnOrderFromStorage?.returnQty);
      if(returnOrderFromStorage.returnReason.indexOf('Quality Issue: ') > -1){
        setCancel('I have quality related Issues');
        setQualityIssue(returnOrderFromStorage.returnReason.split('Quality Issue: ')[1])
      }else{
        setCancel(returnOrderFromStorage.returnReason);
      }
      setAssets(returnOrderFromStorage.returnImages);
    }
  }, [])
  

	const uploadImage = async e => {
		const toastId = toast.loading('Uploading...');
		const files = e?.target?.files;
		if (files?.[0]?.size > 5000000) {
			toast.dismiss(toastId);
			toast.error('Please upload files under 5MB');
		} else if (!['jpg', 'jpeg', 'png', 'svg', 'pdf'].includes(files?.[0]?.name.split('.').pop())) {
			toast.dismiss(toastId);
			toast.error('Please upload PNG/JPG only');
		} else {
			const fileFormData = new FormData();
			fileFormData.append('files', files[0]);
			try {
				const res = await axios.post(`${process.env.NEXT_PUBLIC_API_URL}/upload`, fileFormData);
				if (res?.data?.[0]?.url) {
					setAssets([...assets, res?.data?.[0]]);
					toast.dismiss(toastId);
					toast.success('Uploaded successfully');
				}
			} catch (err) {
				toast.dismiss(toastId);
				toast.error('Something went wrong');
			}
		}
	};

	const deleteImage = async fileId => {
		const toastId = toast.loading('Removing...');

		try {
			const res = await axios.delete(`${process.env.NEXT_PUBLIC_API_URL}/upload/files/${fileId}`, {
				headers: { Authorization: 'Bearer ' + session.jwt },
			});
			if (res?.data) {
				toast.dismiss(toastId);
				const temp = assets.filter(file => file.id !== fileId);
				setAssets(temp);
			}
		} catch (error) {
            console.log(error);
			toast.dismiss(toastId);
			toast.error('Please try again');
		}
	};

  const handelSubmit = () => {

    if(assets.length == 0){
      toast.error(`Please Upload photos of item and QR Code`);
      return;
    }

    let temp = {
      id: order.id,
      orderId: order.orderId,
      returnQty: returnQty,
      returnReason: cancel == 'I have quality related Issues' ? 'Quality Issue: ' +qualityIssue : cancel,
      returnImages: assets.map(a => a.id)
    }

    console.log(temp);
    try {
      window.localStorage.setItem('returnOrder', JSON.stringify(temp));
      router.push("/dashboard/orders/return/" + order.orderId + "/refund")
    } catch (error) {
      console.log(error);
      toast.error('Something went wrong, Please Try Again')
    }
  }

  return (
    <AppLayout className={" "} barStyle={" "} backTitle={" "}>
      <div className="pb-2 mx-3">
        <div className="sticky z-10 flex items-center justify-between w-screen py-2 top-[3.2rem] nav-blur dark:nav-blur-dark">
          <h1 className="flex items-center justify-between w-full text-xl font-bold">
            <span className="flex items-center gap-x-2">
              Return Order No. <span className="text-brand-500">#{order?.id}</span>
            </span>
          </h1>
        </div>

        <h4 className="py-2 text-sm font-bold tracking-wide uppercase">Return Items</h4>
        <div className="flex flex-col gap-y-2">
          {order?.line_items?.map((item) => (
            <div key={item?.id} className="flex gap-3">
              <div className="">
                <img src={item?.productDetails?.media?.[0]?.url} alt={item?.productName} width={200} height={200} className="object-contain w-24 h-full border rounded-md dark:border-darkColor-900" />
              </div>
              <div className="w-full">
                <div className="flex flex-col space-y-2">
                  <div>
                    <div className="text-sm">{item?.productName}</div>
                    <div className="flex my-1 text-xs text-gray-700 gap-x-2 dark:text-gray-400">
                      <select value={returnQty} onChange={(e) => setReturnQty(e.target.value)}>
                        {Array.from({ length: item.quantity }, (_, i) => i + 1).map((q) => (
                          <option value={q}>Qty: {q}</option>
                        ))}
                      </select>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className="mt-5">
          <h2>Choose reason for Return</h2>
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

        {cancel && cancel == "I have quality related Issues" && (
          <div className="mt-5">
            <h2>Describe quality issue</h2>
            <RadioGroup value={qualityIssue} onChange={setQualityIssue}>
            <div className="-space-y-px bg-white rounded-md dark:bg-darkColor-900 mt-2">
              {QualityIssues.map((q, qIdx) => (
                <RadioGroup.Option key={qIdx} value={q} className={({ checked }) => classNames(qIdx === 0 ? "rounded-tl-md rounded-tr-md" : "", qIdx === QualityIssues.length - 1 ? "rounded-bl-md rounded-br-md" : "", checked ? "bg-brand-50 dark:bg-brand-900/40  border-brand-200 dark:border-brand-500 z-10" : "border-gray-200 dark:border-darkColor-600", "relative border p-4 flex cursor-pointer focus:outline-none")}>
                  {({ active, checked }) => (
                    <div className="flex justify-items-start">
                      <div>
                        <span className={classNames(checked ? "bg-brand-600 border-transparent" : "bg-white dark:bg-darkColor-600 border-gray-300 dark:border-darkColor-900", active ? "ring-2 ring-offset-2 ring-brand-500 dark:ring-offset-0" : "", "h-4 w-4 mt-0.5 cursor-pointer rounded-full border flex items-center justify-center")} aria-hidden="true">
                          <span className="rounded-full bg-white dark:bg-darkColor-900 w-1.5 h-1.5" />
                        </span>
                      </div>
                      <div className="ml-2">
                        <RadioGroup.Label as="span" className={classNames(checked ? "text-brand-900 dark:text-brand-50" : "text-gray-900 dark:text-darkColor-200", "text-sm font-medium flex")}>
                          {q}
                        </RadioGroup.Label>
                      </div>
                    </div>
                  )}
                </RadioGroup.Option>
              ))}
            </div>
          </RadioGroup>
          </div>
        )}

        <div className="mt-5">
          <h2>Please upload photos of Items and QR Code</h2>
          <div>
            {assets?.length === 0 && (
              <div className="">
                {/* <label className="block text-sm font-medium text-gray-700 dark:text-gray-200">Upload Shop Photos</label> */}
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
          </div>
        </div>

        <div className="fixed bottom-0 left-0 p-5 w-full nav-blur dark:nav-blur-dark">
          <button onClick={() => handelSubmit()} className="inline-flex items-center justify-center w-full px-6 py-3 text-base font-medium text-center text-white border border-transparent rounded-md shadow-sm ring-offset-0 bg-brand-600 hover:bg-brand-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-brand-500">
            Select Payment Options
          </button>
        </div>
        
      </div>
    </AppLayout>
  );
}

export default items;

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
