import Link from 'next/link';
import store from 'store';
import axios from 'axios';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import { getSession, signOut } from 'next-auth/client';
import { PencilIcon, LogoutIcon, PhoneIcon } from '@heroicons/react/solid';
import Avatar from '../../components/app/common/Avatar';
import MainLayout from '../../components/app/layouts/MainLayout';
import withModal from '../../hocs/withModal';
import ReactGA from "react-ga4";

const DashboardPage = ({ userData, setPopup }) => {
	const router = useRouter();
	const [userSession, setUserSession] = useState<any>(false);
	const [_, setMounted] = useState(false);

	useEffect(async () => {
		global.analytics.page('dashboard')
		ReactGA.send({ hitType: "pageview", page: "/dashboard" });
		setMounted(true);
		const session = await getSession();
		if (session) {
			setUserSession(session);
		} else {
			router.replace('/login');
		}
	}, []);

	const logOut = async () => {
		await signOut();
		store.remove('fcm_token');
		store.remove('cartId');
		store.remove('token_set');
		store.remove('wnxt-cart');
	};

	const logOutInitiate = () => {
		setPopup({
			popupShow: true,
			heading: 'Confirmation',
			description: 'Are you sure you want to log out?',
			primaryBtnText: 'Yes',
			secondaryBtnText: 'No',
			onPrimaryClick: logOut,
			onSecondaryClick: () => setPopup({ popupShow: false }),
		});
	};

	return (
		<MainLayout backTitle={" "}>
			<div className="py-20">
				<div className="flex flex-col items-center justify-center">
					<Avatar name={userSession?.user?.name} className="!w-24 !h-24 !text-3xl" />
					<div className="flex flex-col items-center justify-center mt-4">
						<h1 className="text-2xl font-bold">{userSession?.user?.name}</h1>
						<h2 className="text-lg text-darkColor-500">{userSession?.user?.email}</h2>
						{userData?.companyName && <p className="font-semibold uppercase text-brand-500">{userData?.companyName}</p>}
					</div>
				</div>

				<div className="p-3 m-5 mt-10 text-base border rounded-md border-darkColor-300 dark:border-darkColor-900">
					<div className="">
						<h3 className="text-sm font-bold text-gray-500 uppercase dark:text-darkColor-100">Primary Shipping Address</h3>
						{userData?.defaultAddress ? (
							<div className="relative mt-2 text-darkColor-700 dark:text-darkColor-300">
								{userData?.defaultAddress?.name && <p>{userData?.defaultAddress?.name}</p>}
								<p>{userData?.defaultAddress?.line1},</p>
								<p>{userData?.defaultAddress?.line2},</p>
								<p>
									{userData?.defaultAddress?.city}, {userData?.defaultAddress?.state}, {userData?.defaultAddress?.pincode}
								</p>
								{userData?.defaultAddress?.phoneNumber && (
									<p className="flex items-center mt-2">
										<PhoneIcon className="w-4 h-4 mr-1.5" /> +91-{userData?.defaultAddress?.phoneNumber}
									</p>
								)}
								<Link href={`/dashboard/addresses/edit/${userData?.defaultAddress?.id}`}>
									<a className="absolute bottom-0 right-0 flex flex-row-reverse items-center justify-center gap-1 text-xs font-bold tracking-wide uppercase text-brand-500">
										Edit <PencilIcon className="w-4 h-4" />
									</a>
								</Link>
							</div>
						) : (
							<div className="relative mt-2 text-darkColor-700 dark:text-darkColor-300">
								<p>No primary address selected.</p>
								<p>
									Choose from{' '}
									<Link href="/dashboard/addresses">
										<a className="font-medium underline text-brand-600 dark:text-brand-400">addresses</a>
									</Link>{' '}
									or{' '}
									<Link href="/dashboard/addresses/add">
										<a className="font-medium underline text-brand-600 dark:text-brand-400">add a new one.</a>
									</Link>
								</p>
							</div>
						)}
					</div>
				</div>

				{/* {userSession?.user?.isBnxtAdmin && (
					<div className="m-5 mt-10 border rounded-md border-darkColor-300 dark:border-darkColor-900">
						<ul className="flex flex-col justify-center divide-y divide-darkColor-300 dark:divide-darkColor-900">
							<li className="">
								<Link href="/onboard">
									<a className="inline-flex w-full p-3 font-medium text-green-500">Onboard Customer</a>
								</Link>
							</li>
							<li className="">
								<Link href="/onboard/list">
									<a className="inline-flex w-full p-3 font-medium text-green-500">My Onboarded Customers</a>
								</Link>
							</li>
							<li className="">
								<Link href="/dashboard/orders/myCx">
									<a className="inline-flex w-full p-3 font-medium text-green-500">My Customers Orders</a>
								</Link>
							</li>
							<li className="">
								<Link href="/books">
									<a className="inline-flex w-full p-3 font-medium text-green-500">My Books</a>
								</Link>
							</li>
						</ul>
					</div>
				)} */}

				<div className="m-5 mt-10 border rounded-md border-darkColor-300 dark:border-darkColor-900">
					<ul className="flex flex-col justify-center divide-y divide-darkColor-300 dark:divide-darkColor-900">
						<li className="">
							<Link href="/dashboard/addresses">
								<a className="inline-flex w-full p-3">Addresses</a>
							</Link>
						</li>
						{userData.isBnxtAdmin && 
						<li className="">
							<Link href="/dashboard/BusinessCategory">
								<a className="inline-flex w-full p-3">Change Business Category</a>
							</Link>
						</li>}
						<li className="">
							<Link href="/dashboard/orders">
								<a className="inline-flex w-full p-3">Orders</a>
							</Link>
						</li>
						<li className="">
							<Link href="/faqs">
								<a className="inline-flex w-full p-3">FAQ's: Payment Terms and Conditions</a>
							</Link>
						</li>
						<li className="">
							<Link href="/refunds-policy">
								<a className="inline-flex w-full p-3">Refunds & Returns Policy</a>
							</Link>
						</li>
						<li className="">
							<a href="tel:9738168131" className="inline-flex w-full p-3">
								<span className="flex items-center justify-center">
									Helpline <small className="mt-1 ml-2">(+91-9738168131)</small>
								</span>
							</a>
						</li>
					</ul>
				</div>

				<div className="m-5 mt-10 border rounded-md border-darkColor-300 dark:border-darkColor-900">
					<div className="flex flex-col justify-center divide-y divide-darkColor-300 dark:divide-darkColor-900">
						<button className="flex items-center w-full p-3 text-red-500 gap-x-2" onClick={() => logOutInitiate()}>
							Log out <LogoutIcon className="w-5 h-5" />
						</button>
					</div>
				</div>

				<div className="flex flex-col items-center justify-center m-5 mt-10 gap-y-3">
					<Link href="/privacy">
						<a className="text-xs text-center">Privacy Policy</a>
					</Link>
					<Link href="/terms">
						<a className="text-xs text-center">Terms of Service</a>
					</Link>
				</div>
			</div>
		</MainLayout>
	);
};

export default withModal(DashboardPage);

export const getServerSideProps = async ctx => {
	const session = await getSession({ req: ctx.req });

	if (!session) {
		return {
			redirect: {
				destination: '/login',
				permanent: false,
			},
		};
	}

	try {
		const res = await axios.get(`${process.env.NEXT_PUBLIC_API_URL}/getUserDetails`, {
			headers: {
				Authorization: 'Bearer ' + session.jwt,
			},
		});

		return { props: { addresses: res?.data?.addresses, userData: res?.data } };
	} catch (error) {
		return { notFound: true };
	}
};
