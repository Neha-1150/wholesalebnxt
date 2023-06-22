import * as cryptoJs from 'crypto-js';
import axios from 'axios';
import toast from 'react-hot-toast';
import Link from 'next/link';
import { useForm } from 'react-hook-form';
import { useTheme } from 'next-themes';
import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';
import { getProviders, getCsrfToken, signIn, getSession } from 'next-auth/client';
import OtpInput from 'react-otp-input';
import Countdown from 'react-countdown';
import LogoFullBnxt from '../components/app/common/LogoFullBnxt';
import { MOBILE_REGEX } from '../utilities/constants';
import ReactGA from 'react-ga4';

const RESEND_OTP_TIME = 30000; // 30 seconds

export default function LoginPage({ providers, csrfToken, signinParams }) {
	const router = useRouter();
	const {
		formState: { error },
		register,
		handleSubmit,
		getValues,
	} = useForm();

	const [mounted, setMounted] = useState(false);
	const [showPassword, setShowPassword] = useState(false);

	const [otp, setOtp] = useState('');
	const [otpCode, setOtpCode] = useState('');
	const [otpError, setOtpError] = useState(false);
	const { theme } = useTheme();

	const {
		query: { redirect },
	} = router;

	useEffect(() => {
		ReactGA.send({ hitType: 'pageview', page: '/login' });
	}, []);

	// useEffect(() => {
	// 	setMounted(true);
	// 	if (error) {
	// 		toast.error('Invalid Username/Password combination');
	// 		setTimeout(() => {
	// 			router.push('/login');
	// 		}, 1500);
	// 	}
	// }, []);

	const submitHandler = async values => {
		if (values?.mobile) {
			const toastId = toast.loading('Sending OTP');
			// console.log('values.mobile', values.mobile);
			try {
				const res = await axios.post(`${process.env.NEXT_PUBLIC_API_URL}/auth/generateOtp/91${values.mobile}`);
				if (res?.status === 200) {
					toast.dismiss(toastId);
					toast.success('OTP sent successfully');
					setOtpCode(res.data.otp_code);
					console.log(res?.data);
				}
			} catch (error) {
				toast.dismiss(toastId);
				toast.error(error?.response?.data && typeof error?.response?.data === 'string' ? error?.response?.data : `Something went wrong!`);
			}
		} else {
			toast.error('Please enter a mobile number');
		}
	};

	const validateOtp = async () => {
		const toastId = toast.loading('Validating OTP');
		try {
			const res = await signIn('credentials', {
				otp_code: otpCode,
				otp,
				callbackUrl: signinParams?.identifier && signinParams?.password ? `${process.env.NEXT_PUBLIC_URL}//set-password` : `${process.env.NEXT_PUBLIC_URL}/?newlogin=true`,
				redirect: false,
			});
			const { error: errorSignIn, url } = res;
			if (errorSignIn) {
				toast.dismiss(toastId);
				if (errorSignIn === 'AccessDenied') {
					toast.error('You do not have access to the app yet!');
				} else {
					toast.error('Please try again');
				}
				setOtpError(true);
			} else {
				toast.dismiss(toastId);
				toast.success('Logged in');			
				router.replace(url + '/?newlogin=true');
			}
		} catch (error) {
			toast.dismiss(toastId);
			toast.error('Something went wrong!');
		}
	};

	const resendOtp = async () => {
		const values = getValues();
		if (values?.mobile) {
			const toastId = toast.loading('Sending OTP');
			// console.log('values.mobile', values.mobile);
			try {
				const res = await axios.post(`${process.env.NEXT_PUBLIC_API_URL}/auth/generateOtp/91${values.mobile}`);
				if (res?.status === 200) {
					toast.dismiss(toastId);
					toast.success('OTP sent successfully');
					setOtpCode(res.data.otp_code);
					// console.log(res?.data);
				}
			} catch (error) {
				toast.dismiss(toastId);
				toast.error(error?.response?.data && typeof error?.response?.data === 'string' ? error?.response?.data : `Something went wrong!`);
			}
		} else {
			toast.error('Please try again');
		}
	};

	return (
		<>
			<div className="flex min-h-screen bg-white dark:bg-darkColor-900">
				<div className="flex flex-col justify-center flex-1 px-4 py-12 w-3/7 sm:px-6">
					{router.query.error && (
						<div className="flex justify-center w-full">{/* <AlertBanner message="Invlid username/email, password combination" /> */}</div>
					)}
					<div className="w-full max-w-sm mx-auto lg:w-96">
						<div>
							<Link href="/">
								<a className="flex items-center justify-left">
									<LogoFullBnxt className="w-auto h-5 text-black dark:text-white" />
								</a>
							</Link>
							<h2 className="mt-6 text-3xl font-extrabold text-gray-900 dark:text-darkColor-200">Sign in to your account</h2>
						</div>
						<div className="mt-8">
							<div className="mt-6">
								{otpCode?.length > 0 ? (
									<div className="space-y-6">
										<div>
											<div>
												<label htmlFor="otp" className="block text-lg font-medium text-center text-gray-700 dark:text-darkColor-400">
													Enter OTP
												</label>
												<div className="mt-4">
													<OtpInput
														value={otp}
														onChange={setOtp}
														numInputs={4}
														separator={<span>&nbsp;&nbsp;</span>}
														containerStyle={{
															color: 'black',
															width: '100%',
															justifyContent: 'center',
															textAlign: 'center',
														}}
														inputStyle={{
															color: theme === 'light' ? '#1a1a1a' : '#f0f0f0',
															width: '3rem',
															border: '1px solid transparent',
															backgroundColor: theme === 'light' ? '#f1f0ea' : '#403d39',
															fontSize: '1.5rem',
															textAlign: 'center',
															borderRadius: '0.5rem',
														}}
														focusStyle={{
															outline: 'none',
														}}
														isInputNum
														errorStyle={{
															color: theme === 'light' ? '#7F1C1D' : '#EF4444',
															backgroundColor: theme === 'light' ? '#FEE2E1' : '#7F1C1D50',
														}}
														hasErrored={otpError}
													/>
												</div>
											</div>
										</div>
										<div className="text-sm text-center">
											<p className="text-darkColor-500 dark:text-darkColor-200">
												<Countdown
													renderer={({ hours, minutes, seconds, completed }) => {
														if (completed) {
															return (
																<button type="button" className="underline uppercase text-brand-500" onClick={() => resendOtp()}>
																	Resend OTP Now
																</button>
															);
														} else {
															// Render a countdown
															return (
																<span>
																	Resend Password in{' '}
																	<span className="font-bold">
																		{minutes}:{seconds} seconds
																	</span>
																</span>
															);
														}
													}}
													date={new Date().getTime() + RESEND_OTP_TIME}
												/>
											</p>
										</div>
										<button
											type="button"
											onClick={validateOtp}
											className="flex justify-center w-full px-4 py-2 text-sm font-medium text-white border border-transparent rounded-md shadow-sm bg-brand-600 hover:bg-brand-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-brand-500">
											VERIFY & LOGIN
										</button>
									</div>
								) : (
									<form className="space-y-6" onSubmit={handleSubmit(submitHandler)}>
										<input name="csrfToken" type="hidden" defaultValue={csrfToken} />
										<div>
											<label htmlFor="mobile" className="block text-sm font-medium text-gray-700 dark:text-darkColor-400">
												Mobile Number
											</label>
											<div className="mt-1">
												<input
													id="mobile"
													name="mobile"
													type="text"
													autoComplete="tel"
													maxLength={10}
													inputMode="tel"
													placeholder="Your mobile number"
													required
													className="block w-full px-3 py-2 placeholder-gray-400 border border-gray-300 rounded-md shadow-sm appearance-none text-darkColor-900 dark:text-darkColor-200 dark:placeholder-darkColor-400 dark:bg-darkColor-900 dark:border-gray-800 dark:focus:text-darkColor-100 focus:outline-none focus:ring-brand-500 focus:border-brand-500 sm:text-sm"
													{...register('mobile', {
														required: 'Please enter your mobile number',
														pattern: {
															value: MOBILE_REGEX,
															message: 'Please enter a valid mobile number',
														},
													})}
												/>
											</div>
										</div>

										<div className="flex items-center justify-between">
											<div className="text-sm">
												<button type="button" onClick={() => router.replace('/login-pass')}>
													<span className="font-medium text-brand-600 hover:text-brand-500">Login using Password instead</span>
												</button>
											</div>
										</div>

										<div className="text-sm">
											<p className="text-darkColor-500 dark:text-darkColor-200">
												Don't have access yet?{' '}
												<Link href="/contact">
													<a className="font-medium underline text-brand-600 hover:text-brand-500">Contact us</a>
												</Link>
												.
											</p>
										</div>

										<div>
											<button
												type="submit"
												className="flex justify-center w-full px-4 py-2 text-sm font-medium text-white border border-transparent rounded-md shadow-sm bg-brand-600 hover:bg-brand-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-brand-500">
												SEND OTP
											</button>
										</div>
									</form>
								)}

								<div></div>
							</div>
						</div>
					</div>
				</div>
			</div>
		</>
	);
}

export async function getServerSideProps(context) {
	let {
		req,
		res,
		query: { redirect, qs },
	} = context;

	let signinParams = {};

	if (qs && qs.length > 0) {
		let bytes = cryptoJs.AES.decrypt(decodeURIComponent(qs), '1weoTmCVHJDoZG8CKNp6g16osjjSuRldlrAzxfjP');
		signinParams = JSON.parse(bytes.toString(cryptoJs.enc.Utf8));
	}
	const session = await getSession({ req });

	console.log('SESSION', session);

	if (session && session?.user?.canAccessWnxt) {
		if (session?.user?.isConfirmed) {
			return {
				redirect: {
					destination: '/',
				},
			};
		} else {
			return {
				redirect: {
					destination: '/set-password',
				},
			};
		}
	}

	const providers = await getProviders();
	const csrfToken = await getCsrfToken(context);
	return {
		props: { providers, csrfToken, signinParams },
	};
}
