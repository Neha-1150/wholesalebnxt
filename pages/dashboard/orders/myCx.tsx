import axios from "axios";
import moment from "moment";
import { getSession, useSession } from "next-auth/client";
import Link from "next/link";
import React, { useEffect, useState } from "react";
import AppLayout from "../../../components/app/layouts/AppLayout";

export default function MyCxOrders() {
  const [orders, setOrders] = useState([]);

  useEffect(async () => {
    const session = await getSession();
    const res = await axios.get(`${process.env.NEXT_PUBLIC_API_URL}/getOrdersByBde`, {
      headers: {
        Authorization: "Bearer " + session.jwt,
      },
    });

    if (res) {
        setOrders(res.data);
    }
  }, []);

  return (
    <AppLayout className={" "} backTitle={" "} barStyle={" "}>
      <div className="py-5 tracking-tight">
        <div className="sticky z-10 flex items-center justify-between w-screen px-5 py-2 top-[3.2rem] nav-blur dark:nav-blur-dark">
          <h1 className="text-xl font-bold">My Customers Orders</h1>
        </div>
      </div>
      <div className="px-5">
        {orders.sort((a,b) => b.id - a.id).map((order) => (
          <div className="text-base border rounded-md border-darkColor-300 dark:border-darkColor-900 mb-5 p-3">
            <div className="flex justify-between">
                <div className="text-sm">Order ID: {order.id}</div>
                <div className="text-sm">Date: {moment(order.created_at).format('DD/MM/YYYY hh:mm a')}</div>
            </div>
            <div className="font-semibold">{order.customer.username}</div>
            <div className="font-semibold">{order.customer?.companyName}</div>

            <div className="">Total: Rs.{order.orderTotal}/-</div>
            <div className="">Order Status: {order.status}</div>
            <div className="">Payment Mode: {order.paymentMode}</div>

          </div>
        ))}
      </div>
    </AppLayout>
  );
}
