import * as React from 'react';
import Link from 'next/link';
import axios from 'axios';
import toast from 'react-hot-toast';
import { useRouter } from 'next/router';
import { getSession } from 'next-auth/client';
import { useForm, useWatch } from 'react-hook-form';
import { useEffect, useState } from 'react';
import { ExclamationCircleIcon, XIcon } from '@heroicons/react/solid';
import LogoFullBnxt from '../../components/app/common/LogoFullBnxt';
import AppLayout from '../../components/app/layouts/AppLayout';
import locationData from '../../public/json/location_data.json';
import { classNames } from '../../utilities';
import { MOBILE_REGEX, EMAIL_REGEX, GST_REGEX, PIN_REGEX } from '../../utilities/constants';
import ReactGA from "react-ga4";

type FormInputs = {
	fullName: string;
	email: string;
	businessName: string;
	shippingAddress1: string;
	shippingAddress2: string;
	shippingState: string;
	shippingPinCode: string;
	sameAsShipping: boolean;
	billingState: string;
	shippingCity: string;
	billingAddress1: string;
	billingAddress2: string;
	mobileNumber: string;
	billingCity: string;
	billingPinCode: string;
	gstin: string;
	gst: string;
	gstPreference: string;
  };
  

export default function AppOnboarding({ session }) {
	const [shippingCities, setShippingCities] = useState([]);
	const [billingCities, setBillingCities] = useState([]);
	const [assets, setAssets] = useState([]);

	const {
		register,
		formState: { errors },
		handleSubmit,
		control,
	} = useForm<FormInputs>({
		defaultValues: {
			sameAsShipping: true,
			gstPreference: 'gst',
		},
	});

	const shippingStateWatch = useWatch({ control, name: 'shippingState' });
	const billingStateWatch = useWatch({ control, name: 'billingState' });
	const sameAsShippingWatch = useWatch({ control, name: 'sameAsShipping' });
	const gstPreferenceWatch = useWatch({ control, name: 'gstPreference' });
	const router = useRouter();

	useEffect(() => {global.analytics.page('onboard'); ReactGA.send({ hitType: "pageview", page: "/onboard" });},[])

	useEffect(() => {
		if (shippingStateWatch) {
			const stateObj = locationData.states.find(state => state.name === shippingStateWatch);
			stateObj?.districts && setShippingCities(stateObj?.districts);
		}
	}, [shippingStateWatch]);

	useEffect(() => {
		if (billingStateWatch) {
			const stateObj = locationData.states.find(state => state.name === billingStateWatch);
			stateObj?.districts && setBillingCities(stateObj?.districts);
		}
	}, [billingStateWatch]);

	const submitHandler = async (values: FormInputs) => {
		let apiDataShape = {};

		if (gstPreferenceWatch === 'gst') {
			apiDataShape = {
				gst: values?.gstin,
				username: values?.fullName,
				email: values?.email,
				phoneNumber: values?.mobileNumber,
				companyName: values?.businessName,
				shippingAddress: {
					line1: values?.shippingAddress1,
					line2: values?.shippingAddress2,
					city: values?.shippingCity,
					country: 'India',
					pincode: values?.shippingPinCode,
					state: values?.shippingState,
					name: values?.fullName,
					phoneNumber: values?.mobileNumber,
				},
				billingAddress: sameAsShippingWatch
					? {
							line1: values?.shippingAddress1,
							line2: values?.shippingAddress2,
							city: values?.shippingCity,
							country: 'India',
							pincode: values?.shippingPinCode,
							state: values?.shippingState,
							name: values?.fullName,
							phoneNumber: values?.mobileNumber,
					  }
					: {
							line1: values?.billingAddress1,
							line2: values?.billingAddress2,
							city: values?.billingCity,
							country: 'India',
							pincode: values?.billingPinCode,
							state: values?.billingPinCode,
							name: values?.fullName,
							phoneNumber: values?.mobileNumber,
					  },
			};
		} else {
			if (assets?.length > 0) {
				apiDataShape = {
					kyc: assets.map(a => a.id),
					username: values?.fullName,
					email: values?.email,
					phoneNumber: values?.mobileNumber,
					companyName: values?.businessName,
					shippingAddress: {
						line1: values?.shippingAddress1,
						line2: values?.shippingAddress2,
						city: values?.shippingCity,
						country: 'India',
						pincode: values?.shippingPinCode,
						state: values?.shippingState,
						name: values?.fullName,
						phoneNumber: values?.mobileNumber,
					},
					billingAddress: sameAsShippingWatch
						? {
								line1: values?.shippingAddress1,
								line2: values?.shippingAddress2,
								city: values?.shippingCity,
								country: 'India',
								pincode: values?.shippingPinCode,
								state: values?.shippingState,
								name: values?.fullName,
								phoneNumber: values?.mobileNumber,
						  }
						: {
								line1: values?.billingAddress1,
								line2: values?.billingAddress2,
								city: values?.billingCity,
								country: 'India',
								pincode: values?.billingPinCode,
								state: values?.billingState,
								name: values?.fullName,
								phoneNumber: values?.mobileNumber,
						  },
				};
			} else {
				toast.error('Please upload atleast one Shop photo for KYC');
				return;
			}
		}

		try {
			const res = await axios.post(
				`${process.env.NEXT_PUBLIC_API_URL}/onboardNewUserWnxt`,
				{
					...apiDataShape,
				},
				{
					headers: {
						Authorization: `Bearer ${session?.jwt}`,
					},
				}
			);
			if (res?.status === 200) {
				toast.success(`Submitted Successfully!`);
				setTimeout(() => {
					router.push('/');
				}, 1500);
			} else {
				console.error(res);
			}
		} catch (error) {
			console.error(error?.response?.data);
			toast.error(error?.response?.data && typeof error?.response?.data === 'string' ? error?.response?.data : `Something went wrong!`);
		}
	};

	const uploadImage = async e => {
		const toastId = toast.loading('Uploading...');
		const files = e?.target?.files;
		if (files?.[0]?.size > 5000000) {
			toast.dismiss(toastId);
			toast.error('Please upload files under 5MB');
		} else if (!['jpg', 'jpeg', 'png', 'svg', 'pdf'].includes(files?.[0]?.name.split('.').pop())) {
			toast.dismiss(toastId);
			toast.error('Please upload PNG/JPG only');
		} else {
			const fileFormData = new FormData();
			fileFormData.append('files', files[0]);
			try {
				const res = await axios.post(`${process.env.NEXT_PUBLIC_API_URL}/upload`, fileFormData);
				if (res?.data?.[0]?.url) {
					setAssets([...assets, res?.data?.[0]]);
					toast.dismiss(toastId);
					toast.success('Uploaded successfully');
				}
			} catch (err) {
				toast.dismiss(toastId);
				toast.error('Something went wrong');
			}
		}
	};

	const deleteImage = async fileId => {
		const toastId = toast.loading('Removing...');

		try {
			const res = await axios.delete(`${process.env.NEXT_PUBLIC_API_URL}/upload/files/${fileId}`, {
				headers: { Authorization: 'Bearer ' + session.jwt },
			});
			if (res?.data) {
				toast.dismiss(toastId);
				const temp = assets.filter(file => file.id !== fileId);
				setAssets(temp);
			}
		} catch (error) {
			toast.dismiss(toastId);
			toast.error('Please try again');
		}
	};

	return (
		<>
			<AppLayout backTitle={" "} barStyle={" "} className="min-h-screen">
				<div className="p-3">
					<div className="flex flex-col items-center justify-center mt-2 mb-3 space-y-3">
						<Link href="/">
							<a>
								<LogoFullBnxt className="w-auto h-4 text-black dark:text-white" />
							</a>
						</Link>
						<div>
							<h2 className="py-2 text-xl font-semibold">Fill the details below</h2>
						</div>
					</div>
					<form className="mt-1 space-y-8 divide-y divide-gray-200 relative0 dark:divide-gray-800" onSubmit={handleSubmit(submitHandler)}>
						<div className="space-y-8 divide-y divide-gray-200 dark:divide-gray-800 sm:space-y-5">
							<div>
								<div>
									<h3 className="text-lg font-medium leading-6 text-gray-900 dark:text-gray-50">Business Information</h3>
									<p className="relative max-w-2xl mt-1 text-sm text-gray-500">This information will used to create your business account on BazaarNXT.</p>
									<p className="relative max-w-2xl mt-1 text-sm text-gray-500">
										Make sure <strong>CONTACT NUMBER</strong> is unique.
									</p>
								</div>

								<div className="pt-8 space-y-6 sm:pt-10 sm:space-y-5">
									<div className="sm:grid sm:grid-cols-3 sm:gap-4 sm:items-start sm:border-t sm:border-gray-200 sm:pt-5">
										<label htmlFor="fullName" className="block text-sm font-medium text-gray-700 dark:text-gray-200 sm:mt-px sm:pt-2">
											Full Name
										</label>
										<div className="relative mt-1 sm:mt-0 sm:col-span-2">
											<input
												type="text"
												name="fullName"
												id="fullName"
												autoComplete="name"
												className="block w-full max-w-lg border-gray-300 rounded-md shadow-sm dark:bg-gray-900 dark:border-transparent focus:ring-brand-500 focus:border-brand-500 sm:max-w-xs sm:text-sm"
												{...register('fullName', {
													required: 'Full name is required',
													minLength: { value: 3, message: 'Full name must be at least 3 characters' },
												})}
											/>
											{errors?.fullName && (
												<small className="absolute bottom-[-22px] flex items-center text-red-500 gap-x-1">
													<ExclamationCircleIcon className="w-4 h-4" />
													{errors?.fullName?.message}
												</small>
											)}
										</div>
									</div>

									<div className="sm:grid sm:grid-cols-3 sm:gap-4 sm:items-start sm:border-t sm:border-gray-200 sm:pt-5">
										<label htmlFor="businessName" className="block text-sm font-medium text-gray-700 dark:text-gray-200 sm:mt-px sm:pt-2">
											Business Name
										</label>
										<div className="relative mt-1 sm:mt-0 sm:col-span-2">
											<input
												type="text"
												name="businessName"
												id="businessName"
												autoComplete="organization"
												className="block w-full max-w-lg border-gray-300 rounded-md shadow-sm dark:bg-gray-900 dark:border-transparent focus:ring-brand-500 focus:border-brand-500 sm:max-w-xs sm:text-sm"
												{...register('businessName', {
													required: 'Business name is required',
													minLength: { value: 3, message: 'Business name must be at least 3 characters' },
												})}
											/>
											{errors?.businessName && (
												<small className="absolute bottom-[-22px] flex items-center text-red-500 gap-x-1">
													<ExclamationCircleIcon className="w-4 h-4" />
													{errors?.businessName?.message}
												</small>
											)}
										</div>
									</div>

									<div className="sm:grid sm:grid-cols-3 sm:gap-4 sm:items-start sm:border-t sm:border-gray-200 sm:pt-5">
										<label htmlFor="email" className="flex text-sm font-medium text-gray-700 gap-x-2 dark:text-gray-200 sm:mt-px sm:pt-2">
											Email <small className="text-gray-500">(This can be used for login)</small>
										</label>
										<div className="relative mt-1 sm:mt-0 sm:col-span-2">
											<input
												type="email"
												name="email"
												id="email"
												autoComplete="email"
												className="block w-full max-w-lg lowercase border-gray-300 rounded-md shadow-sm dark:bg-gray-900 dark:border-transparent focus:ring-brand-500 focus:border-brand-500 sm:max-w-xs sm:text-sm"
												{...register('email', { pattern: { value: EMAIL_REGEX, message: 'Invalid email' } })}
											/>
											{errors?.email && (
												<small className="absolute bottom-[-22px] flex items-center text-red-500 gap-x-1">
													<ExclamationCircleIcon className="w-4 h-4" />
													{errors?.email?.message}
												</small>
											)}
										</div>
									</div>

									<div className="sm:grid sm:grid-cols-3 sm:gap-4 sm:items-start sm:border-t sm:border-gray-200 sm:pt-5">
										<label htmlFor="mobileNumber" className="block text-sm font-medium text-gray-700 dark:text-gray-200 sm:mt-px sm:pt-2">
											Contact Number <small className="text-gray-500">(Mandatory)</small>
										</label>
										<div className="relative mt-1 sm:mt-0 sm:col-span-2">
											<input
												type="text"
												name="mobileNumber"
												id="mobileNumber"
												autoComplete="phone"
												maxLength={10}
												className="block w-full max-w-lg border-gray-300 rounded-md shadow-sm dark:bg-gray-900 dark:border-transparent focus:ring-brand-500 focus:border-brand-500 sm:max-w-xs sm:text-sm"
												{...register('mobileNumber', {
													required: 'Contact number is required',
													pattern: { value: MOBILE_REGEX, message: 'Invalid contact number' },
													minLength: { value: 10, message: 'Contact number must be at least 10 characters' },
												})}
											/>
											{errors?.mobileNumber && (
												<small className="absolute bottom-[-22px] flex items-center text-red-500 gap-x-1">
													<ExclamationCircleIcon className="w-4 h-4" />
													{errors?.mobileNumber?.message}
												</small>
											)}
										</div>
									</div>

									<fieldset className="mt-4">
										<legend className="sr-only">GST Prferences</legend>
										<div className="flex flex-col gap-3">
											<div className="flex items-center">
												<input
													id="noGst"
													name="gstPreference"
													value="noGst"
													type="radio"
													className="w-4 h-4 border-gray-300 dark:bg-gray-600 dark:border-gray-600 focus:ring-offset-0 focus:ring-brand-500 text-brand-600"
													{...register('gstPreference', { required: 'GST Preference is required' })}
												/>
												<label htmlFor="noGst" className="block ml-3 text-sm font-medium text-gray-700 dark:text-darkColor-300">
													I don't have GST Number
												</label>
											</div>

											<div className="flex items-center">
												<input
													id="gst"
													name="gstPreference"
													value="gst"
													type="radio"
													defaultChecked
													className="w-4 h-4 border-gray-300 dark:bg-gray-600 dark:border-gray-600 focus:ring-offset-0 focus:ring-brand-500 text-brand-600"
													{...register('gstPreference', { required: 'GST Preference is required' })}
												/>
												<label htmlFor="gst" className="block ml-3 text-sm font-medium text-gray-700 dark:text-darkColor-300">
													I have GST Number
												</label>
											</div>
										</div>
									</fieldset>

									{gstPreferenceWatch === 'gst' && (
										<div className="sm:grid sm:grid-cols-3 sm:gap-4 sm:items-start sm:border-t sm:border-gray-200 sm:pt-5">
											<label htmlFor="gstin" className="flex text-sm font-medium text-gray-700 gap-x-2 dark:text-gray-200 sm:mt-px sm:pt-2">
												GST Number
											</label>
											<div className="relative mt-1 sm:mt-0 sm:col-span-2">
												<input
													type="text"
													name="gstin"
													id="gstin"
													maxLength={15}
													className="block w-full max-w-lg border-gray-300 rounded-md shadow-sm dark:bg-gray-900 dark:border-transparent focus:ring-brand-500 focus:border-brand-500 sm:max-w-xs sm:text-sm"
													{...register('gstin', { required: 'Please enter a GST Number', pattern: { value: GST_REGEX, message: 'Invalid GSTIN' } })}
												/>
												{errors?.gstin && (
													<small className="absolute bottom-[-22px] flex items-center text-red-500 gap-x-1">
														<ExclamationCircleIcon className="w-4 h-4" />
														{errors?.gstin?.message}
													</small>
												)}
											</div>
										</div>
									)}

									{gstPreferenceWatch === 'noGst' && (
										<>
											{assets?.length === 0 && (
												<div className="">
													<label className="block text-sm font-medium text-gray-700 dark:text-gray-200">Upload Shop Photos</label>
													<div className="flex justify-center px-6 pt-5 pb-6 mt-1 border-2 border-gray-300 border-dashed rounded-md dark:border-gray-900">
														<div className="space-y-1 text-center">
															<svg
																className="w-12 h-12 mx-auto text-gray-400 dark:text-brand-400"
																stroke="currentColor"
																fill="none"
																viewBox="0 0 48 48"
																aria-hidden="true">
																<path
																	d="M28 8H12a4 4 0 00-4 4v20m32-12v8m0 0v8a4 4 0 01-4 4H12a4 4 0 01-4-4v-4m32-4l-3.172-3.172a4 4 0 00-5.656 0L28 28M8 32l9.172-9.172a4 4 0 015.656 0L28 28m0 0l4 4m4-24h8m-4-4v8m-12 4h.02"
																	strokeWidth={2}
																	strokeLinecap="round"
																	strokeLinejoin="round"
																/>
															</svg>
															<div className="flex justify-center text-sm text-gray-600">
																<label
																	htmlFor="file-upload"
																	className="relative font-medium bg-white rounded-md cursor-pointer dark:bg-black text-brand-600 hover:text-brand-500 focus-within:outline-none focus-within:ring-2 focus-within:ring-offset-2 dark:ring-offset-0 focus-within:ring-brand-500">
																	<span className="text-center">Upload a file</span>
																	<input id="file-upload" name="file-upload" type="file" className="sr-only" onChange={uploadImage} />
																</label>
															</div>
															<p className="text-xs text-gray-500">Files up to 10MB</p>
														</div>
													</div>
												</div>
											)}

											{assets?.length > 0 && (
												<div className="grid grid-cols-3 gap-2">
													{assets.map((file, index) => (
														<div className="relative w-28 h-28" key={index}>
															<img
																src={file?.url}
																alt={file?.name}
																width={150}
																height={150}
																className="object-contain border rounded-md w-28 h-28 dark:border-darkColor-900"
															/>
															<button type="button" className="absolute text-red-500 top-1 right-1" onClick={() => deleteImage(file?.id)}>
																<XIcon className="w-4 h-4" />
															</button>
														</div>
													))}
													<div className="flex flex-col items-center justify-center border-2 border-gray-300 border-dashed rounded-md w-28 h-28 dark:border-gray-900">
														<svg
															className="w-12 h-12 mx-auto text-gray-400 dark:text-brand-400"
															stroke="currentColor"
															fill="none"
															viewBox="0 0 48 48"
															aria-hidden="true">
															<path
																d="M28 8H12a4 4 0 00-4 4v20m32-12v8m0 0v8a4 4 0 01-4 4H12a4 4 0 01-4-4v-4m32-4l-3.172-3.172a4 4 0 00-5.656 0L28 28M8 32l9.172-9.172a4 4 0 015.656 0L28 28m0 0l4 4m4-24h8m-4-4v8m-12 4h.02"
																strokeWidth={2}
																strokeLinecap="round"
																strokeLinejoin="round"
															/>
														</svg>
														<label
															htmlFor="file-upload"
															className="relative text-xs font-medium bg-white rounded-md cursor-pointer dark:bg-black text-brand-600 hover:text-brand-500 focus-within:outline-none focus-within:ring-2 focus-within:ring-offset-2 focus-within:ring-brand-500">
															<span className="text-center">Upload a file</span>
															<input id="file-upload" name="file-upload" type="file" className="sr-only" onChange={uploadImage} />
														</label>
													</div>
												</div>
											)}
										</>
									)}
								</div>
							</div>

							<div className="pt-8 space-y-6 sm:pt-10 sm:space-y-5">
								<div>
									<h3 className="text-lg font-medium leading-6 text-gray-900 dark:text-gray-50">Shipping Address</h3>
									{/* <p className="relative max-w-2xl mt-1 text-sm text-gray-500">Enter the address where you want to recieve your products.</p> */}
								</div>
								<div className="space-y-6 sm:space-y-5">
									<div className="sm:grid sm:grid-cols-3 sm:gap-4 sm:items-start sm:border-t sm:border-gray-200 sm:pt-5">
										<label htmlFor="shippingAddress1" className="block text-sm font-medium text-gray-700 dark:text-gray-200 sm:mt-px sm:pt-2">
											Address Line 1
										</label>
										<div className="relative mt-1 sm:mt-0 sm:col-span-2">
											<input
												id="shippingAddress1"
												name="shippingAddress1"
												type="text"
												autoComplete="address-line1"
												className="block w-full max-w-lg border-gray-300 rounded-md shadow-sm dark:bg-gray-900 dark:border-transparent focus:ring-brand-500 focus:border-brand-500 sm:text-sm"
												{...register('shippingAddress1', { required: 'Address Line 1 is required' })}
											/>
											{errors?.shippingAddress1 && (
												<small className="absolute bottom-[-22px] flex items-center text-red-500 gap-x-1">
													<ExclamationCircleIcon className="w-4 h-4" />
													{errors?.shippingAddress1?.message}
												</small>
											)}
										</div>
									</div>

									<div className="sm:grid sm:grid-cols-3 sm:gap-4 sm:items-start sm:border-t sm:border-gray-200 sm:pt-5">
										<label htmlFor="shippingAddress2" className="block text-sm font-medium text-gray-700 dark:text-gray-200 sm:mt-px sm:pt-2">
											Address Line 2
										</label>
										<div className="relative mt-1 sm:mt-0 sm:col-span-2">
											<input
												id="shippingAddress2"
												name="shippingAddress2"
												type="text"
												autoComplete="address-line2"
												className="block w-full max-w-lg border-gray-300 rounded-md shadow-sm dark:bg-gray-900 dark:border-transparent focus:ring-brand-500 focus:border-brand-500 sm:text-sm"
												{...register('shippingAddress2', { required: 'Address Line 2 is required' })}
											/>
											{errors?.shippingAddress2 && (
												<small className="absolute bottom-[-22px] flex items-center text-red-500 gap-x-1">
													<ExclamationCircleIcon className="w-4 h-4" />
													{errors?.shippingAddress2?.message}
												</small>
											)}
										</div>
									</div>

									<div className="sm:grid sm:grid-cols-3 sm:gap-4 sm:items-start sm:border-t sm:border-gray-200 sm:pt-5">
										<label htmlFor="shippingPinCode" className="block text-sm font-medium text-gray-700 dark:text-gray-200 sm:mt-px sm:pt-2">
											PIN Code
										</label>
										<div className="relative mt-1 sm:mt-0 sm:col-span-2">
											<input
												id="shippingPinCode"
												name="shippingPinCode"
												type="text"
												autoComplete="postal-code"
												maxLength={6}
												className="block w-full max-w-lg border-gray-300 rounded-md shadow-sm dark:bg-gray-900 dark:border-transparent focus:ring-brand-500 focus:border-brand-500 sm:text-sm"
												{...register('shippingPinCode', {
													required: 'PIN Code is required',
													pattern: { value: PIN_REGEX, message: 'PIN Code must be numeric' },
													minLength: { value: 6, message: 'PIN Code must be 6 digits' },
												})}
											/>
											{errors?.shippingPinCode && (
												<small className="absolute bottom-[-22px] flex items-center text-red-500 gap-x-1">
													<ExclamationCircleIcon className="w-4 h-4" />
													{errors?.shippingPinCode?.message}
												</small>
											)}
										</div>
									</div>

									<div className="sm:grid sm:grid-cols-3 sm:gap-4 sm:items-start sm:border-t sm:border-gray-200 sm:pt-5">
										<label htmlFor="shippingState" className="block text-sm font-medium text-gray-700 dark:text-gray-200 sm:mt-px sm:pt-2">
											State
										</label>
										<div className="relative mt-1 sm:mt-0 sm:col-span-2">
											<select
												id="shippingState"
												name="shippingState"
												autoComplete="address-level1"
												className="block w-full max-w-lg border-gray-300 rounded-md shadow-sm dark:bg-gray-900 dark:border-transparent focus:ring-brand-500 focus:border-brand-500 sm:max-w-xs sm:text-sm"
												{...register('shippingState', {
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
											{errors?.shippingState && (
												<small className="absolute bottom-[-22px] flex items-center text-red-500 gap-x-1">
													<ExclamationCircleIcon className="w-4 h-4" />
													{errors?.shippingState?.message}
												</small>
											)}
										</div>
									</div>

									<div className="sm:grid sm:grid-cols-3 sm:gap-4 sm:items-start sm:border-t sm:border-gray-200 sm:pt-5">
										<label htmlFor="shippingCity" className="block text-sm font-medium text-gray-700 dark:text-gray-200 sm:mt-px sm:pt-2">
											City
										</label>
										<div className="relative mt-1 sm:mt-0 sm:col-span-2">
											<select
												id="shippingCity"
												name="shippingCity"
												autoComplete="address-level2"
												disabled={shippingCities?.length === 0}
												className="block w-full max-w-lg border-gray-300 rounded-md shadow-sm dark:bg-gray-900 dark:border-transparent focus:ring-brand-500 focus:border-brand-500 sm:max-w-xs sm:text-sm disabled:text-opacity-50 disabled:cursor-not-allowed"
												{...register('shippingCity', { validate: value => value !== 'Select City' || 'City is required', required: 'Please select a City' })}>
												<option value={null} hidden>
													Select City {shippingCities?.length === 0 && `(Select State first)`}
												</option>
												{shippingCities.map(city => {
													return (
														<option key={city.id} value={city.name}>
															{city.name}
														</option>
													);
												})}
											</select>
											{errors?.shippingCity && (
												<small className="absolute bottom-[-22px] flex items-center text-red-500 gap-x-1">
													<ExclamationCircleIcon className="w-4 h-4" />
													{errors?.shippingCity?.message}
												</small>
											)}
										</div>
									</div>
								</div>
							</div>

							<div className="pt-8 space-y-6 sm:pt-10 sm:space-y-5">
								<div className="flex items-center justify-between">
									<h3 className="text-lg font-medium leading-6 text-gray-900 dark:text-gray-50">Billing Address</h3>

									<div className="relative flex items-start">
										<div className="flex items-center h-5">
											<input
												id="sameAsShipping"
												aria-describedby="same-as-shipping-address"
												name="sameAsShipping"
												type="checkbox"
												defaultChecked
												className={classNames(
													'w-4 h-4 border-gray-300 rounded dark:bg-gray-700 dark:border-transparent dark:ring-offset-0 text-brand-600 focus:ring-brand-500'
												)}
												{...register('sameAsShipping')}
											/>
										</div>
										<div className="ml-3 text-sm">
											<label htmlFor="sameAsShipping" className="font-medium text-gray-700 dark:text-gray-300">
												Same as Shipping Address
											</label>
										</div>
									</div>

									{/* <p className="relative max-w-2xl mt-1 text-sm text-gray-500">Enter the address where you want to recieve your products.</p> */}
								</div>
								{!sameAsShippingWatch && (
									<>
										<div className="space-y-6 sm:space-y-5">
											<div className="sm:grid sm:grid-cols-3 sm:gap-4 sm:items-start sm:border-t sm:border-gray-200 sm:pt-5">
												<label htmlFor="billingAddress1" className="block text-sm font-medium text-gray-700 dark:text-gray-200 sm:mt-px sm:pt-2">
													Address Line 1
												</label>
												<div className="relative mt-1 sm:mt-0 sm:col-span-2">
													<input
														id="billingAddress1"
														name="billingAddress1"
														type="text"
														autoComplete="address-line1"
														className="block w-full max-w-lg border-gray-300 rounded-md shadow-sm dark:bg-gray-900 dark:border-transparent focus:ring-brand-500 focus:border-brand-500 sm:text-sm"
														{...register('billingAddress1', { required: 'Address Line 1 is required' })}
													/>
													{errors?.billingAddress1 && (
														<small className="absolute bottom-[-22px] flex items-center text-red-500 gap-x-1">
															<ExclamationCircleIcon className="w-4 h-4" />
															{errors?.billingAddress1?.message}
														</small>
													)}
												</div>
											</div>

											<div className="sm:grid sm:grid-cols-3 sm:gap-4 sm:items-start sm:border-t sm:border-gray-200 sm:pt-5">
												<label htmlFor="billingAddress2" className="block text-sm font-medium text-gray-700 dark:text-gray-200 sm:mt-px sm:pt-2">
													Address Line 2
												</label>
												<div className="relative mt-1 sm:mt-0 sm:col-span-2">
													<input
														id="billingAddress2"
														name="billingAddress2"
														type="text"
														autoComplete="address-line2"
														className="block w-full max-w-lg border-gray-300 rounded-md shadow-sm dark:bg-gray-900 dark:border-transparent focus:ring-brand-500 focus:border-brand-500 sm:text-sm"
														{...register('billingAddress2', { required: 'Address Line 2 is required' })}
													/>
													{errors?.billingAddress2 && (
														<small className="absolute bottom-[-22px] flex items-center text-red-500 gap-x-1">
															<ExclamationCircleIcon className="w-4 h-4" />
															{errors?.billingAddress2?.message}
														</small>
													)}
												</div>
											</div>

											<div className="sm:grid sm:grid-cols-3 sm:gap-4 sm:items-start sm:border-t sm:border-gray-200 sm:pt-5">
												<label htmlFor="billingPinCode" className="block text-sm font-medium text-gray-700 dark:text-gray-200 sm:mt-px sm:pt-2">
													PIN Code
												</label>
												<div className="relative mt-1 sm:mt-0 sm:col-span-2">
													<input
														id="billingPinCode"
														name="billingPinCode"
														type="text"
														autoComplete="postal-code"
														maxLength={6}
														className="block w-full max-w-lg border-gray-300 rounded-md shadow-sm dark:bg-gray-900 dark:border-transparent focus:ring-brand-500 focus:border-brand-500 sm:text-sm"
														{...register('billingPinCode', {
															required: 'PIN Code is required',
															pattern: { value: PIN_REGEX, message: 'PIN Code must be numeric' },
															minLength: { value: 6, message: 'PIN Code must be 6 digits' },
														})}
													/>
													{errors?.billingPinCode && (
														<small className="absolute bottom-[-22px] flex items-center text-red-500 gap-x-1">
															<ExclamationCircleIcon className="w-4 h-4" />
															{errors?.billingPinCode?.message}
														</small>
													)}
												</div>
											</div>

											<div className="sm:grid sm:grid-cols-3 sm:gap-4 sm:items-start sm:border-t sm:border-gray-200 sm:pt-5">
												<label htmlFor="billingState" className="block text-sm font-medium text-gray-700 dark:text-gray-200 sm:mt-px sm:pt-2">
													State
												</label>
												<div className="relative mt-1 sm:mt-0 sm:col-span-2">
													<select
														id="billingState"
														name="billingState"
														autoComplete="address-level1"
														className="block w-full max-w-lg border-gray-300 rounded-md shadow-sm dark:bg-gray-900 dark:border-transparent focus:ring-brand-500 focus:border-brand-500 sm:max-w-xs sm:text-sm"
														{...register('billingState', {
															required: 'Please select a State',
															validate: value => value !== 'Select State' || 'State is required',
														})}>
														<option value={null} hidden>
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
													{errors?.billingState && (
														<small className="absolute bottom-[-22px] flex items-center text-red-500 gap-x-1">
															<ExclamationCircleIcon className="w-4 h-4" />
															{errors?.billingState?.message}
														</small>
													)}
												</div>
											</div>

											<div className="sm:grid sm:grid-cols-3 sm:gap-4 sm:items-start sm:border-t sm:border-gray-200 sm:pt-5">
												<label htmlFor="billingCity" className="block text-sm font-medium text-gray-700 dark:text-gray-200 sm:mt-px sm:pt-2">
													City
												</label>
												<div className="relative mt-1 sm:mt-0 sm:col-span-2">
													<select
														id="billingCity"
														name="billingCity"
														autoComplete="address-level2"
														disabled={billingCities?.length === 0}
														className="block w-full max-w-lg border-gray-300 rounded-md shadow-sm dark:bg-gray-900 dark:border-transparent focus:ring-brand-500 focus:border-brand-500 sm:max-w-xs sm:text-sm disabled:text-opacity-50 disabled:cursor-not-allowed"
														{...register('billingCity', {
															required: 'Please select a City',
															validate: value => value !== 'Select City' || 'City is required',
														})}>
														<option value={null} hidden>
															Select City {billingCities?.length === 0 && `(Select State first)`}
														</option>
														{billingCities.map(city => {
															return (
																<option key={city.id} value={city.name}>
																	{city.name}
																</option>
															);
														})}
													</select>
													{errors?.billingCity && (
														<small className="absolute bottom-[-22px] flex items-center text-red-500 gap-x-1">
															<ExclamationCircleIcon className="w-4 h-4" />
															{errors?.billingCity?.message}
														</small>
													)}
												</div>
											</div>
										</div>
									</>
								)}
							</div>
						</div>

						<div className="pt-5">
							<div className="flex justify-end">
								<button
									type="submit"
									className="inline-flex justify-center w-full px-4 py-2 text-sm font-medium tracking-wide text-white uppercase border border-transparent rounded-md shadow-sm bg-brand-600 hover:bg-brand-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-brand-500">
									Open Account
								</button>
							</div>
						</div>
					</form>
				</div>
			</AppLayout>
		</>
	);
}

export const getServerSideProps = async ctx => {
	const session = await getSession({ req: ctx.req });

	if (session?.user?.isBnxtAdmin) {
		return {
			props: {
				session,
			},
		};
	} else {
		return {
			redirect: {
				destination: '/login',
				permanent: false,
			},
		};
	}
};
