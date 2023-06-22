import { RadioGroup } from "@headlessui/react";
import axios from "axios";
import moment from "moment";
import { getSession } from "next-auth/client";
import { useRouter } from "next/router";
import React, { useEffect, useState } from "react";
import AppLayout from "../../../../../components/app/layouts/AppLayout";
import AddressSelector from "../../../../../components/app/modals/AddressSelector";
import withModal from "../../../../../hocs/withModal";
import { classNames } from "../../../../../utilities";
import { addBusinessDays } from "../../../../../utilities/common";

const deliveryDates = [
  {
    day: addBusinessDays(moment(), 1).format("dddd"),
    date: addBusinessDays(moment(), 1).format("DD MMM YYYY"),
    value: addBusinessDays(moment(), 1),
  },
  {
    day: addBusinessDays(moment(), 2).format("dddd"),
    date: addBusinessDays(moment(), 2).format("DD MMM YYYY"),
    value: addBusinessDays(moment(), 2),
  },
  {
    day: addBusinessDays(moment(), 3).format("dddd"),
    date: addBusinessDays(moment(), 3).format("DD MMM YYYY"),
    value: addBusinessDays(moment(), 3),
  },
];

function pickup({ order, setPopup }) {
  const [preferredDeliveryDate, setPreferredDeliveryDate] = useState(deliveryDates[0]);
  const [address, setAddress] = useState<any>();
  const [modalOpen, setModalOpen] = useState(false);
  const [allAddresses, setAllAddresses] = useState([]);
  const router = useRouter();
  const [returnOrderFromStorage, setReturnOrderFromStorage] = useState<any>();

  const getAllAddresses = async () => {
    try {
      const session = await getSession();
      const res = await axios.get(`${process.env.NEXT_PUBLIC_API_URL}/getUserDetails`, {
        headers: {
          Authorization: "Bearer " + session.jwt,
        },
      });
      if (res?.status === 200) {
        return res?.data?.addresses.filter((a) => !a?.isBillingAddress);
      }
    } catch (error) {
      console.error(error);
      return false;
    }
  };

  useEffect(async () => {
    let returnOrderFromStorage = window.localStorage.getItem('returnOrder')
    if(returnOrderFromStorage){
      returnOrderFromStorage = JSON.parse(returnOrderFromStorage);
      console.log(returnOrderFromStorage);
      setReturnOrderFromStorage(returnOrderFromStorage);
    }
    
    const resAddr = await getAllAddresses();
    setAllAddresses(resAddr);
    if (resAddr && resAddr.length > 0) {
      setAddress(resAddr[0]);
    }
  }, []);

  const handelSubmit = () => {
    let temp = {
      ...(returnOrderFromStorage as object),
      preferredPickupDate: preferredDeliveryDate.value.format('YYYY-MM-DD'),
      pickupAddress: address.id
    }

    console.log(JSON.stringify(temp));

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

        <div className="mt-2">
          <h2>Select Pickup Date</h2>
          <RadioGroup value={preferredDeliveryDate} onChange={setPreferredDeliveryDate}>
            <div className="mt-3 flex items-center -space-y-px bg-white rounded-md dark:bg-darkColor-900">
              {deliveryDates.map((dateObj, dateObjIdx) => (
                <RadioGroup.Option key={dateObj.date} value={dateObj} className={({ checked }) => classNames(dateObjIdx != 0 && "ml-2", checked ? "bg-brand-50 dark:bg-brand-900/40  border-brand-200 dark:border-brand-500 z-10 " : "border-gray-200 dark:border-darkColor-600", "justify-center text-center relative border p-4 flex cursor-pointer focus:outline-none rounded-md flex-1")}>
                  {({ active, checked }) => (
                    <RadioGroup.Label as="span" className={classNames(checked ? "text-brand-900 dark:text-brand-50" : "text-gray-900 dark:text-darkColor-200", "text-sm font-medium flex")}>
                      <div className="flex flex-col justify-center items-center">
                        <div>{dateObj?.day}</div>
                        <div>{dateObj?.date}</div>
                      </div>
                    </RadioGroup.Label>
                  )}
                </RadioGroup.Option>
              ))}
            </div>
          </RadioGroup>
        </div>

        <div className="mt-5 pb-5">
          <h2>Select Pickup Address</h2>
          {address ? (
            <div className="text-black dark:text-darkColor-200">
              <div className="flex items-center gap-x-2">
                <p>{address?.name}</p>
                {address?.phoneNumber && <p>Mob: {address?.phoneNumber}</p>}
              </div>
              <p>{address?.line1},</p>
              <p>{address?.line2},</p>
              <p>
                {address?.city}, {address?.state}, {address?.pincode}
              </p>
            </div>
          ) : (
            <div className="text-black dark:text-darkColor-200">
              <p>No primary address found</p>
              <p>Select an address</p>
            </div>
          )}
          <div className="mt-2">
            <button type="button" className="py-2 text-sm font-bold tracking-wide underline uppercase text-brand-500" onClick={() => setModalOpen(true)}>
              {address ? `Change` : `Select`}
            </button>
          </div>
        </div>

        <div className="fixed bottom-0 left-0 p-5 w-full nav-blur dark:nav-blur-dark">
          <button onClick={() => handelSubmit()} className="inline-flex items-center justify-center w-full px-6 py-3 text-base font-medium text-center text-white border border-transparent rounded-md shadow-sm ring-offset-0 bg-brand-600 hover:bg-brand-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-brand-500">
            Confirm Return
          </button>
        </div>
      </div>

      <AddressSelector open={modalOpen} setOpen={setModalOpen} address={address} setAddress={setAddress} gotAddresses={allAddresses} />
    </AppLayout>
  );
}

export default withModal(pickup);

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
