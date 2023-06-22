import axios from 'axios';
import { useRouter } from 'next/router';
import { useTheme } from 'next-themes';
import { getSession } from 'next-auth/client';
import { useForm } from 'react-hook-form';
import toast from 'react-hot-toast';
import { EMAIL_REGEX, MOBILE_REGEX } from '../utilities/constants';
import AppLayout from '../components/app/layouts/AppLayout';
import { ExclamationCircleIcon } from '@heroicons/react/solid';
import { useEffect } from 'react';
import ReactGA from 'react-ga4';

const ContactPage = ({ session }) => {
	const {
		register,
		handleSubmit,
		formState: { errors },
	} = useForm({
		defaultValues: {
			name: session?.user?.name || '',
			email: session?.user?.email || '',
			phone: session?.user?.phoneNumber || '',
		},
	});
	const { theme } = useTheme();
	const router = useRouter();

	useEffect(() => {
		global.analytics.page('contact');
		ReactGA.send({ hitType: 'pageview', page: '/contact' });
	}, []);

	const submitHandler = async values => {
		const apiDataShape = {
			firstName: values?.name?.split(' ')[0],
			lastName: values?.name?.split(' ')[1],
			email: values?.email,
			phoneNumber: values?.phone,
			message: values?.message,
			subject: 'Contact form submission from WNXT',
		};

		try {
			const res = await axios({
				url: `${process.env.NEXT_PUBLIC_API_URL}/contact-forms`,
				method: 'POST',
				data: {
					...apiDataShape,
				},
			});
			if (res?.status === 200) {
				toast.success(`Your contact request has been submitted!`);
				router.push('/');
			}
		} catch (error) {
			console.error(error);
			toast.error(`Something went wrong, Please try again!`);
		}
	};

	return (
		<>
			<AppLayout>
				<h1 className="pb-2 pl-5 text-xl font-bold tracking-tight">Contact us</h1>
				<form className="flex flex-col px-5 gap-y-8" onSubmit={handleSubmit(submitHandler)}>
					<div className="sm:grid sm:grid-cols-3 sm:gap-4 sm:items-start sm:border-t sm:border-gray-200 sm:pt-5">
						<label htmlFor="name" className="block text-sm font-medium text-gray-700 dark:text-gray-200 sm:mt-px sm:pt-2">
							Full Name
						</label>
						<div className="relative mt-1 sm:mt-0 sm:col-span-2">
							<input
								type="text"
								name="name"
								id="name"
								autoComplete="name"
								className="block w-full max-w-lg border-gray-300 rounded-md shadow-sm dark:bg-gray-900 dark:border-transparent focus:ring-brand-500 focus:border-brand-500 sm:max-w-xs sm:text-sm"
								{...register('name', {
									required: 'Full name is required',
									minLength: { value: 3, message: 'Full name must be at least 3 characters' },
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
						<label htmlFor="email" className="block text-sm font-medium text-gray-700 dark:text-gray-200 sm:mt-px sm:pt-2">
							Email
						</label>
						<div className="relative mt-1 sm:mt-0 sm:col-span-2">
							<input
								type="email"
								name="email"
								id="email"
								autoComplete="email"
								className="block w-full max-w-lg border-gray-300 rounded-md shadow-sm dark:bg-gray-900 dark:border-transparent focus:ring-brand-500 focus:border-brand-500 sm:max-w-xs sm:text-sm"
								{...register('email', {
									required: 'Email is required',
									pattern: { value: EMAIL_REGEX, message: 'Please enter a valid email' },
								})}
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
						<label htmlFor="phone" className="block text-sm font-medium text-gray-700 dark:text-gray-200 sm:mt-px sm:pt-2">
							Mobile Number
						</label>
						<div className="relative mt-1 sm:mt-0 sm:col-span-2">
							<input
								type="text"
								name="phone"
								id="phone"
								autoComplete="tel"
								maxLength="10"
								className="block w-full max-w-lg border-gray-300 rounded-md shadow-sm dark:bg-gray-900 dark:border-transparent focus:ring-brand-500 focus:border-brand-500 sm:max-w-xs sm:text-sm"
								{...register('phone', {
									required: 'Full name is required',
									pattern: { value: MOBILE_REGEX, message: 'Please enter a valid mobile number' },
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
						<label htmlFor="message" className="block text-sm font-medium text-gray-700 dark:text-gray-200 sm:mt-px sm:pt-2">
							Message
						</label>
						<div className="relative mt-1 sm:mt-0 sm:col-span-2">
							<textarea
								type="text"
								name="message"
								id="message"
								className="block w-full max-w-lg border-gray-300 rounded-md shadow-sm dark:bg-gray-900 dark:border-transparent focus:ring-brand-500 focus:border-brand-500 sm:max-w-xs sm:text-sm"
								{...register('message', {
									required: 'Message is required',
								})}
							/>
							{errors?.message && (
								<small className="absolute bottom-[-22px] flex items-center text-red-500 gap-x-1">
									<ExclamationCircleIcon className="w-4 h-4" />
									{errors?.message?.message}
								</small>
							)}
						</div>
					</div>

					<div>
						<button type="submit" className="w-full px-4 py-2 font-bold text-white rounded-md bg-brand-500">
							Submit
						</button>
					</div>
				</form>
			</AppLayout>
		</>
	);
};

export default ContactPage;

export const getServerSideProps = async ctx => {
	const session = await getSession(ctx);

	if (session) {
		return {
			props: {
				session,
			},
		};
	} else {
		return {
			props: {
				session: null,
			},
		};
	}
};
