import { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import Link from 'next/link';
import { useRouter } from 'next/router';
import * as cryptoJs from 'crypto-js';
import toast from 'react-hot-toast';
import { getProviders, getCsrfToken, signIn, getSession } from 'next-auth/client';
import { EyeIcon, EyeOffIcon } from '@heroicons/react/solid';
import LogoFullBnxt from '../components/app/common/LogoFullBnxt';

export default function LoginPage({ providers, csrfToken, signinParams }) {

	const router = useRouter();
	const {
		formState: { error: formError },
		register,
		handleSubmit,
	} = useForm({
		defaultValues: {
			identifier: signinParams?.identifier || '',
			password: signinParams?.password || '',
		},
	});
	const [mounted, setMounted] = useState(false);
	const [showPassword, setShowPassword] = useState(false);

	const {
		query: { redirect, error },
	} = router;

	useEffect(() => {
		setMounted(true);
		if (error) {
			toast.error('Invalid Username/Password combination');
			setTimeout(() => {
				router.push('/login' );
			}, 1500);
		}
	}, []);

	const submitHandler = async values => {
		const toastId = toast.loading('Signing you in');
		try {
			const res = await signIn('credentials', {
				identifier: values.identifier.toLowerCase(),
				password: values.password,
				callbackUrl: signinParams?.identifier && signinParams?.password ? `${process.env.NEXT_PUBLIC_URL}//set-password` : `${process.env.NEXT_PUBLIC_URL}/?newlogin=true`,
				redirect: false,
			});
			const { error: errorSignIn, url } = res;
			// console.log(res);
			if (errorSignIn) {
				toast.dismiss(toastId);
				if (errorSignIn === 'AccessDenied') {
					toast.error('You do not have access to the app yet!');
				} else {
					toast.error('Invalid Credentials');
				}
				setOtpError(true);
			} else {
				toast.dismiss(toastId);
				toast.success('Logged in');
				router.replace(url + '/?newlogin=true');
			}
		} catch (error) {
			toast.dismiss(toastId);
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
								<form className="space-y-6" onSubmit={handleSubmit(submitHandler)}>
									<input name="csrfToken" type="hidden" defaultValue={csrfToken} />
									<div>
										<label htmlFor="email" className="block text-sm font-medium text-gray-700 dark:text-darkColor-400">
											Email address / Mobile
										</label>
										<div className="mt-1">
											<input
												id="identifier"
												name="identifier"
												type="text"
												autoComplete="email"
												required
												className="block w-full px-3 py-2 placeholder-gray-400 lowercase border border-gray-300 rounded-md shadow-sm appearance-none text-darkColor-900 dark:text-darkColor-200 dark:placeholder-darkColor-400 dark:bg-darkColor-900 dark:border-gray-800 dark:focus:text-darkColor-100 focus:outline-none focus:ring-brand-500 focus:border-brand-500 sm:text-sm"
												{...register('identifier', {
													required: 'Please enter your email address or mobile number',
												})}
											/>
										</div>
									</div>

									<div className="space-y-1">
										<label htmlFor="password" className="block text-sm font-medium text-gray-700 dark:text-darkColor-400">
											Password
										</label>
										<div className="relative mt-1">
											<input
												id="password"
												name="password"
												type={showPassword ? 'text' : 'password'}
												autoComplete="current-password"
												required
												defaultValue={signinParams ? signinParams.password : ''}
												className="block w-full py-2 pl-3 pr-10 placeholder-gray-400 border border-gray-300 rounded-md shadow-sm appearance-none text-darkColor-900 dark:text-darkColor-200 dark:placeholder-darkColor-400 dark:bg-darkColor-900 dark:border-gray-800 dark:focus:text-darkColor-100 focus:outline-none focus:ring-brand-500 focus:border-brand-500 sm:text-sm"
												{...register('password', {
													required: 'Please enter your password',
												})}
											/>

											<button type="button" className="absolute inset-y-0 right-2" onClick={() => setShowPassword(!showPassword)}>
												{showPassword ? <EyeIcon className="w-5 h-5 text-gray-500 " /> : <EyeOffIcon className="w-5 h-5 text-gray-500 " />}
											</button>
										</div>
									</div>

									<div className="flex items-center justify-between">
										{/* <div className="flex items-center">
											<input
												id="remember_me"
												name="remember_me"
												type="checkbox"
												className="w-4 h-4 border-gray-300 rounded disabled:bg-gray-300 dark:disabled:bg-darkColor-600 dark:placeholder-darkColor-400 dark:bg-darkColor-900 dark:border-none dark:ring-offset-0 text-brand-600 focus:ring-brand-500"
											/>
											<label htmlFor="remember_me" className="block ml-2 text-sm text-gray-900 dark:text-darkColor-400">
												Remember me
											</label>
										</div> */}

										<div className="text-sm">
											<Link href="/forgot-password">
												<a className="font-medium text-brand-600 hover:text-brand-500">Forgot password?</a>
											</Link>
										</div>
									</div>

									<div className="flex items-center justify-between">
										<div className="text-sm">
											<button type="button" onClick={() => router.replace('/login')}>
												<span className="font-medium text-brand-600 hover:text-brand-500">Login with OTP instead</span>
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
											Sign in
										</button>
									</div>
								</form>
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
