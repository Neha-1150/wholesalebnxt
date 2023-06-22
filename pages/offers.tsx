import axios from "axios";
import { getSession } from "next-auth/client";
import React, { Children, useEffect, useState } from "react";
import ProductListItem2 from "../components/app/home/ProductListItem2";
import SearchLayout from "../components/app/layouts/SearchLayout";
import Skeleton from 'react-loading-skeleton'
import 'react-loading-skeleton/dist/skeleton.css'

function offers({ session }) {
  const [offers, setOffers] = useState([]);
  const [loading, setLoading] = useState(true)

  const getOffers = async () => {
    try {
      const res = await axios.get(`${process.env.NEXT_PUBLIC_API_URL}/bnxt-retail-offers`, {
        headers: { Authorization: "Bearer " + session.jwt },
      });
      if (res?.status === 200) {
        setOffers(res.data.filter(d => {
            if(d.servicableCites.findIndex(c => c.name == session.user.defaultCity) > -1){
                return true
            }
        }));
        setLoading(false)
      }
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    getOffers();
  }, []);

  if (loading) {
    return (
        <SearchLayout className={" "} title="Offers">
        <div className="m-3">
          <Skeleton height={150} />

        {new Array(3).fill(1).map(d => (<div className="mt-3">
            <div className="flex w-full">
              <div className="w-32 h-32 mr-2">
                <Skeleton className="w-32 h-32" />
              </div>
              <div className="w-full mt-1">
                <div className="flex flex-col h-full min-w-full mb-2">
                  <div className="max-w-[60vw] text-[14px] font-bold leading-snug text-[#595959] dark:text-darkColor-100">
                    <Skeleton />
                  </div>
                  <div className="max-w-[60vw] text-[14px] font-bold leading-snug text-[#595959] dark:text-darkColor-100">
                    <Skeleton />
                  </div>
                  <div className="mt-2 max-w-[40vw] text-[14px] font-bold leading-snug text-[#595959] dark:text-darkColor-100">
                    <Skeleton />
                  </div>
                </div>
              </div>
            </div>
          </div>))}
        </div>
      </SearchLayout>
    );
  }

  if(offers.length == 0){
      return (
        <SearchLayout className={" "} title="Offers">
            <div className="flex justify-center items-center h-[80vh]">
                <img className="w-[60%]" src="/assets/industry/noOffers.png"/>
            </div>
        </SearchLayout>
      )
  }

  return (
    <SearchLayout className={" "} title="Offers">
      {offers.map(o => {
          return (
              <div className="m-3">
                  <div>
                    <img src={o.offerBanner?.url}/>
                  </div>

                  <div className="mt-3">
                      {o.wnxt_products.map((p,i) => <ProductListItem2 key={p?.id} product={p} uid={i}/>)}
                  </div>
              </div>
          )
      })}
    </SearchLayout>
  );
}

export default offers;



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
    return { props: { session: session } };
};
  