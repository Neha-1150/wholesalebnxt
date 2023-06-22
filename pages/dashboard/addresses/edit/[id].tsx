import axios from 'axios';
import Link from 'next/link';
import { useState, useEffect } from 'react';
import { getSession } from 'next-auth/client';
import { useTheme } from 'next-themes';
import { useForm, useWatch } from 'react-hook-form';
import { useRouter } from 'next/router';
import toast from 'react-hot-toast';
import { ExclamationCircleIcon } from '@heroicons/react/solid';
import AppLayout from '../../../../components/app/layouts/AppLayout';
import locationData from '../../../../public/json/location_data.json';
import { MOBILE_REGEX, PIN_REGEX } from '../../../../utilities/constants';
import ReactGA from 'react-ga4';

const AddAddress = ({ address, session }) => {
	const {
		register,
		handleSubmit,
		control,
		formState: { errors },
	} = useForm({
		defaultValues: {
			name: address?.name,
			phone: address?.phoneNumber,
			address1: address?.line1,
			address2: address?.line2,
			city: address?.city,
			state: address?.state,
			pinCode: address?.pincode,
		},
	});

	const router = useRouter();

	const { theme } = useTheme();

	const [cities, setCities] = useState([]);

	const statesWatch = useWatch({ control, name: 'state' });

	const updateViaApi = async data => {
		try {
			const res = await axios.put(`${process.env.NEXT_PUBLIC_API_URL}/addresses/${address.id}`, data, {
				headers: {
					Authorization: `Bearer ${session.jwt}`,
				},
			});
			if (res.status === 200) {
				toast.success('Updated successfully');
				setTimeout(() => {
					router.back();
				}, 800);
			}
		} catch (error) {
			console.error(error);
			toast.error('Something went wrong');
		}
	};

	const updateAddress = values => {
		const data = {
			name: values?.name,
			phoneNumber: values?.phone,
			line1: values?.address1,
			line2: values?.address2,
			city: values?.city,
			state: values?.state,
			pincode: values?.pinCode,
		};
		updateViaApi(data);
	};

	useEffect(() => {
		if (statesWatch) {
			const stateObj = locationData.states.find(state => state.name === statesWatch);
			stateObj?.districts && setCities(stateObj?.districts);
		}
	}, [statesWatch]);

	useEffect(() => {
		global.analytics.page('edit address');
		ReactGA.send({ hitType: 'pageview', page: '/edit-address' });
	}, []);

	return (
		<>
			<AppLayout>
				<form className="py-5 tracking-tight" onSubmit={handleSubmit(updateAddress)}>
					<div className="sticky z-10 flex items-center justify-between w-screen px-5 py-2 top-[3.2rem] nav-blur dark:nav-blur-dark">
						<h1 className="text-xl font-bold">Edit your address</h1>
						<button type="submit" className="text-sm font-bold tracking-wide uppercase dark:text-brand-400 text-brand-500">
							Update
						</button>
					</div>

					<div className="m-5 mb-10">
						<div className="space-y-6 sm:space-y-5">
							<div className="sm:grid sm:grid-cols-3 sm:gap-4 sm:items-start sm:border-t sm:border-gray-200 sm:pt-5">
								<label htmlFor="name" className="flex items-center text-sm font-medium text-gray-700 gap-x-2 dark:text-gray-200 sm:mt-px sm:pt-2">
									Name
								</label>
								<div className="relative mt-1 sm:mt-0 sm:col-span-2">
									<input
										id="name"
										name="name"
										type="text"
										autoComplete="name"
										className="block w-full max-w-lg border-gray-300 rounded-md shadow-sm dark:bg-gray-900 dark:border-transparent focus:ring-brand-500 focus:border-brand-500 sm:text-sm"
										{...register('name', {
											required: 'Name is required',
											minLength: {
												value: 3,
												message: 'Name must be at least 3 characters',
											},
										})}
									/>
									{errors?.name && (
										<small className="absolute bottom-[-22px] flex items-center text-red-500 gap-x-1">
											<ExclamationCircleIcon className="w-4 h-4" />
											{errors?.name?.message}
										</small>
									)}
								</div>
							</div>

							<div className="sm:grid sm:grid-cols-3 sm:gap-4 sm:items-start sm:border-t sm:border-gray-200 sm:pt-5">
								<label htmlFor="name" className="flex items-center text-sm font-medium text-gray-700 gap-x-2 dark:text-gray-200 sm:mt-px sm:pt-2">
									Phone Number
								</label>
								<div className="relative mt-1 sm:mt-0 sm:col-span-2">
									<input
										id="phone"
										name="phone"
										type="text"
										maxLength="10"
										autoComplete="tel"
										className="block w-full max-w-lg border-gray-300 rounded-md shadow-sm dark:bg-gray-900 dark:border-transparent focus:ring-brand-500 focus:border-brand-500 sm:text-sm"
										{...register('phone', {
											required: 'Phone Number is required',
											pattern: {
												value: MOBILE_REGEX,
												message: 'Phone number is not valid',
											},
										})}
									/>
									{errors?.phone && (
										<small className="absolute bottom-[-22px] flex items-center text-red-500 gap-x-1">
											<ExclamationCircleIcon className="w-4 h-4" />
											{errors?.phone?.message}
										</small>
									)}
								</div>
							</div>

							<div className="sm:grid sm:grid-cols-3 sm:gap-4 sm:items-start sm:border-t sm:border-gray-200 sm:pt-5">
								<label htmlFor="address1" className="block text-sm font-medium text-gray-700 dark:text-gray-200 sm:mt-px sm:pt-2">
									Address Line 1
								</label>
								<div className="relative mt-1 sm:mt-0 sm:col-span-2">
									<input
										id="address1"
										name="address1"
										type="text"
										autoComplete="address-line1"
										className="block w-full max-w-lg border-gray-300 rounded-md shadow-sm dark:bg-gray-900 dark:border-transparent focus:ring-brand-500 focus:border-brand-500 sm:text-sm"
										{...register('address1', { required: 'Address Line 1 is required' })}
									/>
									{errors?.address1 && (
										<small className="absolute bottom-[-22px] flex items-center text-red-500 gap-x-1">
											<ExclamationCircleIcon className="w-4 h-4" />
											{errors?.address1?.message}
										</small>
									)}
								</div>
							</div>

							<div className="sm:grid sm:grid-cols-3 sm:gap-4 sm:items-start sm:border-t sm:border-gray-200 sm:pt-5">
								<label htmlFor="address2" className="block text-sm font-medium text-gray-700 dark:text-gray-200 sm:mt-px sm:pt-2">
									Address Line 2
								</label>
								<div className="relative mt-1 sm:mt-0 sm:col-span-2">
									<input
										id="address2"
										name="address2"
										type="text"
										autoComplete="address-line2"
										className="block w-full max-w-lg border-gray-300 rounded-md shadow-sm dark:bg-gray-900 dark:border-transparent focus:ring-brand-500 focus:border-brand-500 sm:text-sm"
										{...register('address2', { required: 'Address Line 2 is required' })}
									/>
									{errors?.address2 && (
										<small className="absolute bottom-[-22px] flex items-center text-red-500 gap-x-1">
											<ExclamationCircleIcon className="w-4 h-4" />
											{errors?.address2?.message}
										</small>
									)}
								</div>
							</div>

							<div className="sm:grid sm:grid-cols-3 sm:gap-4 sm:items-start sm:border-t sm:border-gray-200 sm:pt-5">
								<label htmlFor="pinCode" className="block text-sm font-medium text-gray-700 dark:text-gray-200 sm:mt-px sm:pt-2">
									PIN Code
								</label>
								<div className="relative mt-1 sm:mt-0 sm:col-span-2">
									<input
										id="pinCode"
										name="pinCode"
										type="text"
										autoComplete="postal-code"
										maxLength="6"
										className="block w-full max-w-lg border-gray-300 rounded-md shadow-sm dark:bg-gray-900 dark:border-transparent focus:ring-brand-500 focus:border-brand-500 sm:text-sm"
										{...register('pinCode', {
											required: 'PIN Code is required',
											pattern: { value: PIN_REGEX, message: 'PIN Code must be numeric' },
											minLength: { value: 6, message: 'PIN Code must be 6 digits' },
										})}
									/>
									{errors?.pinCode && (
										<small className="absolute bottom-[-22px] flex items-center text-red-500 gap-x-1">
											<ExclamationCircleIcon className="w-4 h-4" />
											{errors?.pinCode?.message}
										</small>
									)}
								</div>
							</div>

							<div className="sm:grid sm:grid-cols-3 sm:gap-4 sm:items-start sm:border-t sm:border-gray-200 sm:pt-5">
								<label htmlFor="state" className="block text-sm font-medium text-gray-700 dark:text-gray-200 sm:mt-px sm:pt-2">
									State
								</label>
								<div className="relative mt-1 sm:mt-0 sm:col-span-2">
									<select
										id="state"
										name="state"
										autoComplete="address-level1"
										className="block w-full max-w-lg border-gray-300 rounded-md shadow-sm dark:bg-gray-900 dark:border-transparent focus:ring-brand-500 focus:border-brand-500 sm:max-w-xs sm:text-sm"
										{...register('state', {
											validate: value => value !== 'Select State' || 'State is required',
											required: 'Please select a State',
										})}>
										<option hidden value={null} unselectable="on">
											Select State
										</option>
										{locationData.states.map(state => {
											return (
												<option key={state.id} value={state.name}>
													{state.name}
												</option>
											);
										})}
									</select>
									{errors?.state && (
										<small className="absolute bottom-[-22px] flex items-center text-red-500 gap-x-1">
											<ExclamationCircleIcon className="w-4 h-4" />
											{errors?.state?.message}
										</small>
									)}
								</div>
							</div>

							<div className="sm:grid sm:grid-cols-3 sm:gap-4 sm:items-start sm:border-t sm:border-gray-200 sm:pt-5">
								<label htmlFor="city" className="block text-sm font-medium text-gray-700 dark:text-gray-200 sm:mt-px sm:pt-2">
									City
								</label>
								<div className="relative mt-1 sm:mt-0 sm:col-span-2">
									<select
										id="city"
										name="city"
										autoComplete="address-level2"
										disabled={cities?.length === 0}
										className="block w-full max-w-lg border-gray-300 rounded-md shadow-sm dark:bg-gray-900 dark:border-transparent focus:ring-brand-500 focus:border-brand-500 sm:max-w-xs sm:text-sm disabled:text-opacity-50 disabled:cursor-not-allowed"
										{...register('city', { validate: value => value !== 'Select City' || 'City is required', required: 'Please select a City' })}>
										<option value={null} hidden>
											Select City {cities?.length === 0 && `(Select State first)`}
										</option>
										{cities.map(city => {
											return (
												<option key={city.id} value={city.name}>
													{city.name}
												</option>
											);
										})}
									</select>
									{errors?.city && (
										<small className="absolute bottom-[-22px] flex items-center text-red-500 gap-x-1">
											<ExclamationCircleIcon className="w-4 h-4" />
											{errors?.city?.message}
										</small>
									)}
								</div>
							</div>
						</div>
					</div>
				</form>
			</AppLayout>
		</>
	);
};

export default AddAddress;

export const getServerSideProps = async ctx => {
	const { id } = ctx.params;

	if (id) {
		try {
			const session = await getSession(ctx);
			const res = await axios.get(`${process.env.NEXT_PUBLIC_API_URL}/addresses/${id}`, {
				headers: {
					Authorization: `Bearer ${session?.jwt}`,
				},
			});
			if (res?.status === 200) {
				return { props: { address: res?.data, session } };
			} else {
				return { props: {} };
			}
		} catch (error) {
			return {
				props: {},
			};
		}
	} else {
		return {
			props: {},
		};
	}
};
