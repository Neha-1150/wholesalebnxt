import axios from 'axios';
import { getSession } from 'next-auth/client';
import { useState, useEffect } from 'react';
import { useTheme } from 'next-themes';
import { useForm, useWatch } from 'react-hook-form';
import { useRouter } from 'next/router';
import toast from 'react-hot-toast';
import { ExclamationCircleIcon } from '@heroicons/react/solid';
import AppLayout from '../../../components/app/layouts/AppLayout';
import locationData from '../../../public/json/location_data.json';
import { MOBILE_REGEX, PIN_REGEX } from '../../../utilities/constants';
import ReactGA from 'react-ga4';

// !city: "cegice"
// country: "euheivo"
// created_at: "2021-08-24T15:10:18.362Z"
// created_by: null
// default: true
// id: 73
// !line1: "crcbhiruvbiurbhv"
// !line2: "eeevv"
// !name: "duceiuviurbhvoirv"
// !phoneNumber: null
// !pincode: "560102"
// !state: "rjvbnornvoinrv"
// updated_at: "2021-11-26T10:02:43.291Z"
// updated_by: null
// user: 43

type FormInputs = {
	name: string;
	phone: string;
	address1: string;
	address2: string;
	pinCode: string;
	state: string;
	city: string;
  };

const AddAddress = ({ session }) => {
	const {
		register,
		handleSubmit,
		control,
		formState: { errors },
	} = useForm<FormInputs>({
		defaultValues: {
			name: session?.user?.name,
			phone: session?.user?.phoneNumber,
		},
	});

	const router = useRouter();

	const { theme } = useTheme();

	const [cities, setCities] = useState([]);

	const statesWatch = useWatch({ control, name: 'state' });

	const saveViaApi = async data => {
		try {
			const res = await axios.post(`${process.env.NEXT_PUBLIC_API_URL}/addresses`, data, {
				headers: {
					Authorization: `Bearer ${session.jwt}`,
				},
			});
			if (res.status === 200) {
				toast.success('Saved successfully');
				setTimeout(() => {
					router.back();
				}, 800);
			}
		} catch (error) {
			console.error(error);
			toast.error('Something went wrong');
		}
	};

	const saveAddress = values => {
		const data = {
			name: values?.name,
			phoneNumber: values?.phone,
			line1: values?.address1,
			line2: values?.address2,
			city: values?.city,
			state: values?.state,
			pincode: values?.pinCode,
			country: 'India',
			user: session?.user?.id,
		};
		saveViaApi(data);
	};

	useEffect(() => {
		if (statesWatch) {
			const stateObj = locationData.states.find(state => state.name === statesWatch);
			stateObj?.districts && setCities(stateObj?.districts);
		}
	}, [statesWatch]);

	useEffect(() => {
		global.analytics.page('add address');
		ReactGA.send({ hitType: 'pageview', page: '/addaddress' });
	}, []);

	return (
		<>
			<AppLayout className={" "} backTitle={" "} barStyle={" "}>
				<form className="py-5 tracking-tight" onSubmit={handleSubmit(saveAddress)}>
					<div className="sticky z-10 flex items-center justify-between w-screen px-5 py-2 top-[3.6rem] nav-blur dark:nav-blur-dark">
						<h1 className="text-xl font-bold">Add new Address</h1>
						<button type="submit" className="text-sm font-bold tracking-wide uppercase dark:text-brand-400 text-brand-500">
							Save
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
										maxLength={10}
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
										maxLength={6}
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

export async function getServerSideProps(ctx) {
	return {
		props: {
			session: await getSession(ctx),
		},
	};
}
