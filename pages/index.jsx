import axios from 'axios';
import store from 'store';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import { getSession, signOut } from 'next-auth/client';
import withFullLoader from '../hocs/withFullLoader';
import Navbar2 from '../components/app/common/Navbar2';
import SearchInput from '../components/app/common/SearchInput2';
import withAuth from '../hocs/withAuth';
import ContinueToCart from '../components/app/cart/ContinueToCart';
import ReactGA from 'react-ga4';
import { useLayoutBaker } from '../hooks/useLayoutBaker';


const MainAppHome = ({ setLoading, homepageData, session, sessionUndefined, onboardingCount }) => {

	console.log(homepageData);

	const [onBoardingCount, setOnBoardingCount] = useState(1111);
	
	if(sessionUndefined){
		(async () => {
			console.log(sessionUndefined);
			await signOut();
			store.remove('fcm_token');
			store.remove('cartId');
			store.remove('token_set'); 
			store.remove('wnxt-cart'); 
		})()
	}

	const router = useRouter();	

	const { renderedBlock } = useLayoutBaker(homepageData?.blocks, onboardingCount);

	useEffect(async() => {
		try {
			let res = await axios.get(`${process.env.NEXT_PUBLIC_API_URL}/getOnboardingsCount`,
				{
					headers: {
						Authorization: `Bearer ${session.jwt}`,
					},
				}
			);
			// console.log(res);
			setOnBoardingCount(parseInt(res.data.data.noOfCx))
		} catch (error) {
			console.error(error);
		}
	
	  return () => {
		setOnBoardingCount(1111)
	  }
	}, [])
	

	useEffect(async () => {
		ReactGA.send({ hitType: 'pageview', page: '/' });
		global.analytics.page('homepage');

		const fcmTokenSet = store.get('token_set');

		if (!session && !fcmTokenSet) {
			router.push('/login');
		} else {
			const token = store.get('fcm_token');

			if (token) {
				try {
					await axios.post(
						`${process.env.NEXT_PUBLIC_API_URL}/registerPushToken`,
						{ token },
						{
							headers: {
								Authorization: `Bearer ${session.jwt}`,
							},
						}
					);
					store.set('token_set', true);
					setLoading(false);
				} catch (error) {
					store.remove('token_set');
					console.error(error);
					setLoading(false);
					return false;
				}
				setLoading(false);
			}
		}
		console.log("ui-version ", homepageData?.id);
	}, []);
	
	
	return (
		<>
			<main className="relative w-screen pb-20">

				{/* Top Icon */}
				<div className="flex flex-col relative">
					{/* <div className="relative w-full bg-[#E64431] h-12">
						<LogoFullBnxt className="absolute h-12 text-white -translate-x-1/2 -translate-y-1/2 top-1/2 left-1/2" />
					</div> */}
					{/* <div className='w-full bg-[#E64431] h-6 text-center text-white text-[12px]'>
						Congrats! You are now part of Happy {onBoardingCount} Retailers
					</div>
					<Lottie animationData={Confetti} className="absolute" /> */}
				</div>

				<div className="flex flex-col">
					<div className="relative w-full">
						{/* <LogoFullBnxt className="absolute h-12 text-white -translate-x-1/2 -translate-y-1/2 top-1/2 left-1/2" /> */}
						<img src="/assets/animations/birthday.gif" className="object-cover w-full" />
					</div>
				</div>

				{/* Sticky Location header */}
				{/* <div className="flex items-center justify-center py-2">
					<p className="font-bold text-[#E64431]">Free Deliveries on all your orders*</p>
				</div> */}

				{/* Sticky Search */}
				{/* <div style={{ background: `url(${searchBarBgImage.src})`, width: '100%', height: '100%', backgroundRepeat: 'no-repeat', backgroundSize: 'cover', backgroundPosition: 'center' }} className="sticky top-0 left-0 right-0 z-10">
					<SearchInput />
				</div> */}

				<div className="sticky top-0 left-0 right-0 z-10">
					<SearchInput />
				</div>

				{renderedBlock}

				<ContinueToCart positionClass="bottom-[70px]" />
				<Navbar2 />
			</main>

		</>
	);
};


export default withAuth(withFullLoader(MainAppHome));
// export default withFullLoader(MainAppHome);

export const getServerSideProps = async ctx => {
	const session = await getSession(ctx);

	if(session && session?.user?.businessCategory == null || session && session?.user?.businessCategory == undefined){
		return { props: { sessionUndefined: true } }
	}

	let onboardingCount;
	try {
		onboardingCount = await axios.get(`${process.env.NEXT_PUBLIC_API_URL}/getOnboardingsCount`,
			{
				headers: {
					Authorization: `Bearer ${session.jwt}`,
				},
			}
		);
		
	} catch (error) {
		console.error(error);
	}

	try {
		const homepage = await axios.get(`${process.env.NEXT_PUBLIC_API_URL}/getHomepageLayoutByCity/${session?.user?.defaultCity}`, {
			headers: { Authorization: "Bearer " + session.jwt },
		});
		return {
			props: {
					session,
					homepageData: homepage?.data,
					onboardingCount:  onboardingCount.data.data.noOfCx
				},
		};
	} catch (error) {
		return {
			props: {
				session,
				homepageData: null,
			},
		};
	}
};




