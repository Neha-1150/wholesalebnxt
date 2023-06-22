import axios from 'axios';
import Link from 'next/link';
import { useTheme } from 'next-themes';
import { useState } from 'react';
import { useRouter } from 'next/router';
import { getSession } from 'next-auth/client';
import toast from 'react-hot-toast';
import { PencilIcon, XIcon, PhoneIcon, CheckIcon } from '@heroicons/react/solid';
import AppLayout from '../../../components/app/layouts/AppLayout';
import { useEffect } from 'react';
import ReactGA from 'react-ga4';

const DashboardAddresses = ({ data, session }) => {
	const [primaryAddress, _] = useState(data?.defaultAddress);
	const [otherAddresses, __] = useState(data?.addresses?.filter(address => address.id !== data?.defaultAddress?.id));

	const router = useRouter();
	const { theme } = useTheme();

	useEffect(() => {
		global.analytics.page('addresses');
		ReactGA.send({ hitType: 'pageview', page: '/addresses' });
	}, []);

	const removeAddress = async addressId => {
		try {
			const res = await axios.delete(`${process.env.NEXT_PUBLIC_API_URL}/addresses/${addressId}`, {
				headers: {
					Authorization: `Bearer ${session.jwt}`,
				},
			});
			if (res.status === 200) {
				toast.success('Address deleted');
				setTimeout(() => {
					router.reload();
				}, 800);
			}
		} catch (error) {
			console.error(error);
			toast.error('Something went wrong');
		}
	};

	const setPrimaryAddress = async addressId => {
		try {
			const res = await axios.put(
				`${process.env.NEXT_PUBLIC_API_URL}/setDefaultAddressForCx/${addressId}`,
				{},
				{
					headers: {
						Authorization: `Bearer ${session.jwt}`,
					},
				}
			);
			if (res.status === 200) {
				toast.success('Primary address updated');
				setTimeout(() => {
					router.reload();
				}, 800);
			}
		} catch (error) {
			console.error(error);
			toast.error('Something went wrong');
		}
	};

	return (
		<>
			<AppLayout className={" "} backTitle={" "} barStyle={" "}>
				<div className="py-5 tracking-tight">
					<div className="sticky z-10 flex items-center justify-between w-screen px-5 py-2 top-[3.2rem] nav-blur dark:nav-blur-dark">
						<h1 className="text-xl font-bold">Your Addresses</h1>
						<Link href="/dashboard/addresses/add">
							<a className="text-sm font-bold tracking-wide uppercase dark:text-brand-400 text-brand-500">Add new</a>
						</Link>
					</div>

					<div className="mt-4 mb-10">
						<h3 className="mx-5 my-2 text-sm font-bold tracking-wide text-gray-700 uppercase dark:text-darkColor-100">Primary Shipping Address</h3>

						<div className="p-3 mx-5 text-base border rounded-md border-darkColor-300 dark:border-darkColor-900">
							<div className="">
								{primaryAddress ? (
									<div className="relative mt-2 text-darkColor-700 dark:text-darkColor-300">
										{primaryAddress?.name && <p>{primaryAddress?.name}</p>}
										<p>{primaryAddress?.line1},</p>
										<p>{primaryAddress?.line2},</p>
										<p>
											{primaryAddress?.city}, {primaryAddress?.state}, {primaryAddress?.pincode}
										</p>
										{primaryAddress?.phoneNumber && (
											<p className="flex items-center mt-2">
												<PhoneIcon className="w-4 h-4 mr-1.5" /> +91-{primaryAddress?.phoneNumber}
											</p>
										)}
										<Link href={`/dashboard/addresses/edit/${primaryAddress?.id}`}>
											<a className="absolute bottom-0 right-0 flex flex-row-reverse items-center justify-center gap-1 text-xs font-bold tracking-wide uppercase text-amber-500">
												Edit <PencilIcon className="w-4 h-4" />
											</a>
										</Link>
									</div>
								) : (
									<div className="relative mt-2 text-sm text-center text-darkColor-700 dark:text-darkColor-300">
										<p>Select a primary address from below</p>
										<p>
											or{' '}
											<Link href="/dashboard/addresses/add">
												<a className="font-medium underline uppercase text-brand-600 dark:text-brand-400">add a new one</a>
											</Link>
											.
										</p>
									</div>
								)}
							</div>
						</div>
					</div>

					<div className="mt-4 mb-10">
						<h3 className="mx-5 my-2 text-sm font-bold tracking-wide text-gray-700 uppercase dark:text-darkColor-100">Other Addresses</h3>

						<div className="flex flex-col gap-y-4">
							{otherAddresses?.length > 0 ? (
								otherAddresses?.map((address, index) => (
									<div className="p-3 mx-5 text-base border rounded-md border-darkColor-300 dark:border-darkColor-900" key={index}>
										<div className="flex flex-col">
											<div className="relative text-darkColor-700 dark:text-darkColor-300">
												{address?.name && <p>{address?.name}</p>}
												<p>{address?.line1},</p>
												<p>{address?.line2},</p>
												<p>
													{address?.city}, {address?.state}, {address?.pincode}
												</p>
												{address?.phoneNumber && (
													<p className="flex items-center mt-2">
														<PhoneIcon className="w-4 h-4 mr-1.5" /> +91-{address?.phoneNumber}
													</p>
												)}
											</div>
											<div className="flex items-center justify-between pt-4 mt-4 mb-1 border-t border-darkColor-300 dark:border-darkColor-900">
												<Link href={`/dashboard/addresses/edit/${address?.id}`}>
													<a className="flex flex-row-reverse items-center justify-center gap-1 text-xs font-bold tracking-wide uppercase text-amber-500">
														Edit <PencilIcon className="w-4 h-4" />
													</a>
												</Link>

												<button
													onClick={() => removeAddress(address?.id)}
													className="flex flex-row-reverse items-center justify-center gap-1 text-xs font-bold tracking-wide text-red-500 uppercase">
													Remove <XIcon className="w-4 h-4" />
												</button>

												<button
													onClick={() => setPrimaryAddress(address?.id)}
													className="flex flex-row-reverse items-center justify-center gap-1 text-xs font-bold tracking-wide text-green-500 uppercase">
													Set Primary <CheckIcon className="w-4 h-4" />
												</button>
											</div>
										</div>
									</div>
								))
							) : (
								<div className="mx-5 text-xs">
									<p>No other addresses found.</p>{' '}
									<p>
										Please{' '}
										<Link href="/dashboard/addresses/add">
											<a className="font-medium underline text-brand-600 dark:text-brand-400">add an address</a>
										</Link>
										.
									</p>
								</div>
							)}
						</div>
					</div>
				</div>
			</AppLayout>
		</>
	);
};

export default DashboardAddresses;

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

		return { props: { data: res?.data, session } };
	} catch (error) {
		return { notFound: true };
	}
};
