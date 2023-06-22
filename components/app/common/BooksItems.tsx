import moment from "moment";
import { useRouter } from "next/router";
import React from "react";
import Avatar from "react-avatar";
import TimeAgo from "javascript-time-ago";
import ReactTimeAgo from "react-time-ago";
import en from "javascript-time-ago/locale/en.json";
TimeAgo.addDefaultLocale(en);

function BooksItems({ customer }) {
  const router = useRouter();
  return (
    <div onClick={() => router.push(`/books/${customer.id}`)} className="flex rounder-lg justify-between bg-white shadow mb-4 rounded-md p-2 px-3 items-center">
      <Avatar name={customer.name} round size="40" textSizeRatio={2} />
      <div className="flex-1 ml-3">
        <div className="text-[16px] font-medium">{customer.name}</div>
        <div className="text-[12px]">
          <ReactTimeAgo date={customer.updated_at} locale="en-US" />
        </div>
      </div>
      {customer.currentBalance > 0 && <div className="text-green-700 font-medium">You'll Give ₹ {Math.abs(customer.currentBalance)}</div>}

      {customer.currentBalance < 0 && <div className="text-red-500 font-medium">You'll Get ₹ {Math.abs(customer.currentBalance)}</div>}

      {customer.currentBalance == 0 && <div className="font-medium">₹ 0</div>}
    </div>
  );
}

export default BooksItems;
