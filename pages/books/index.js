import { FilterIcon } from "@heroicons/react/outline";
import { SearchIcon } from "@heroicons/react/solid";
import axios from "axios";
import { getSession } from "next-auth/client";
import { useRouter } from "next/router";
import React, { useState, useEffect } from "react";
import BooksItems from "../../components/app/common/BooksItems";
import MainLayout from "../../components/app/layouts/MainLayout";
import { Popover } from 'react-tiny-popover'

function Books({ session }) {
  const [books, setBooks] = useState();
  const [customerList, setCustomerList] = useState([]);

  const getBooksDetails = async() => {
    try {
      const res = await axios.get(`${process.env.NEXT_PUBLIC_API_URL}/getAllBooksCustomerForUser`, {
        headers: { Authorization: "Bearer " + session.jwt },
      });
      if (res?.status === 200) {
        setBooks(res.data)
        setCustomerList(res.data.customers)
      }
    } catch (error) {
      console.log(error);
    }
  }

  useEffect(() => {
    getBooksDetails();
  }, [])
  

  const handleSearch = (query) => {
    let tempList = [...customerList];

    if(query && query.length > 2){
      let searchList = tempList.filter(c => {
        if(c.name.toUpperCase().includes(query.toUpperCase())){
          return true
        }else{
          return false
        }
      })
      console.log(searchList);
      setCustomerList(searchList)
    }else{
      setCustomerList(books.customers)
    }
  }

  const router = useRouter();
  return (
    <MainLayout>
      <div className="bg-gray-100 pb-2 min-h-screen">
        <div className="pt-16 pb-3">
          <h1 className="mx-5 text-md font-bold">My Books</h1>

          <div className="flex justify-between m-2 mx-5 rounded-md p-5 bg-white shadow">
            <div className="flex-1 border-r-2">
              <div className="text-[12px]">YOU'LL GET</div>
              <div className="text-[22px] font-bold text-red-700">{books?.books_youWillGet ? "₹" + Math.abs(books?.books_youWillGet) : "₹ 0"}</div>
            </div>
            <div className="flex-1 text-right">
              <div className="text-[12px]">YOU'LL GIVE</div>
              <div className="text-[22px] font-bold text-green-500">{books?.books_youWillGive ? "₹" + Math.abs(books?.books_youWillGive) : "₹ 0"}</div>
            </div>
          </div>

          <div className="flex bg-white mx-5 mt-5 rounded-full p-2 py-3 px-4 items-center shadow">
            <SearchIcon className="w-5 h-5 text-brand-500" />
            <input onChange={e => handleSearch(e.target.value)} className="ml-1 text-[14px] font-medium text-gray-600 w-100 flex-1 focus:outline-none" placeholder="Search your customer" />
          </div>
        </div>

        <div className="mx-5 my-3">
          {customerList && customerList.length > 0 ? (
            customerList && customerList.sort((a,b) => b.id > a.id).map(c => 
              <BooksItems customer={c} />
            )
          ) : (
            <div className="flex items-center justify-center" style={{ height: "calc(100vh - 350px)" }}>
              <div className="text-center text-gray-500">No customer found, Add your first customer</div>
            </div>
          )}
        </div>
      </div>

      <div className="fixed w-full text-sm p-2 bottom-[80px] text-center">
        <button onClick={() => router.push("/books/new")} class="rounded-full bg-[#6553e6] p-3 text-white font-bold">
          + Add Customer
        </button>
      </div>
    </MainLayout>
  );
}

export default Books;


export const getServerSideProps = async (ctx) => {
  const session = await getSession({ req: ctx.req });

  if (!session) {
    return {
      redirect: {
        destination: "/login",
        permanent: false,
      },
    };
  }

  // if(session){
  //   try {
  //     const res = await axios.get(`${process.env.NEXT_PUBLIC_API_URL}/getAllBooksCustomerForUser`, {
  //       headers: { Authorization: "Bearer " + session.jwt },
  //     });
  //     if (res?.status === 200) {
  //       props = { books: res.data }
  //     }
  //     else {
  //       return {
  //         redirect: {
  //           destination: "/books",
  //           permanent: false,
  //         },
  //       };
  //     }
  //   } catch (error) {
  //     return {
  //       notFound: true,
  //     };
  //   }
  // }

  return { props: { session: session } };
};
