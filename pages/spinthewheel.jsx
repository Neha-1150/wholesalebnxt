import ProductCarousel from '../components/app/common/ProductCarousel';
import { BottomSheet } from 'react-spring-bottom-sheet';
import { useState } from 'react';
import Wheel from '../components/app/wheel/wheel';
import { getSession } from 'next-auth/client';
import axios from 'axios';
import AppLayout from '../components/app/layouts/AppLayout';

const SpinTheWheel = ({ spinOffers }) => {
	return (
		<AppLayout className="pb-0" backTitle="Spin To Win | Offers & Discounts">
			<Wheel items={spinOffers} />
		</AppLayout>
	);
};

export default SpinTheWheel;

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
    
    let props = {}

    try {
        const res = await axios.get(`${process.env.NEXT_PUBLIC_API_URL}/getSpinOffers`, {
          headers: { Authorization: "Bearer " + session.jwt },
        });
        if (res?.status === 200) {
          props = { ...props, spinOffers: res.data, session }
        } else {
          return {
            redirect: {
              destination: "/",
              permanent: false,
            },
          };
        }
      } catch (err) {
        return {
          notFound: true,
        };
      }
  
    return { props: props };
  };
  