import axios from 'axios';
import { useRouter } from 'next/router';
import { useForm } from 'react-hook-form';
import toast from 'react-hot-toast';
import { useTheme } from 'next-themes';
import { EMAIL_REGEX } from '../utilities/constants';
import AppLayout from '../components/app/layouts/AppLayout';
import withModal from '../hocs/withModal';
import { useEffect } from 'react';
import ReactGA from "react-ga4";

const ForgotPassword = ({ setPopup }) => {
	const router = useRouter();
	const {
		register,
		handleSubmit,
		formState: { errors },
	} = useForm();

	const { theme } = useTheme();

	useEffect(() => {global.analytics.page('forgot password'); ReactGA.send({ hitType: "pageview", page: "/forgot-password" }); },[])

	const submitHandler = async values => {
		try {
			const res = await axios.post(`${process.env.NEXT_PUBLIC_API_URL}/newForgotPassword`, {
				email: values.email,
				platform: 'WholesaleNXT',
			});
			if (res?.status === 200) {
				setPopup({
					popupShow: true,
					heading: 'Reset link sent!',
					description: `
          <p>Your password has been reset successfully!</p>
          <p>Please check your email for link.</p>
          `,
					primaryBtnText: 'Login',
					secondaryBtnText: 'Cancel',
					onPrimaryClick: () => router.replace('/login'),
					onSecondaryClick: () => router.replace('/login'),
					onClose: () => router.replace('/login'),
				});
			}
		} catch (error) {
			toast.error(`Something went wrong, Please try again!`, {
				style: {
					fontSize: '12px',
					borderRadius: '5px',
					background: theme === 'light' ? '#f7f7f7' : '#1e1e1e',
					color: theme === 'light' ? '#1e1e1e' : '#f7f7f7',
				},
			});
		}
	};

	return (
		<>
			<AppLayout>
				<form className="flex flex-col items-center justify-center w-full px-5 gap-y-2" onSubmit={handleSubmit(submitHandler)}>
					<h3 className="py-2 text-center">Forgot your password?</h3>
					<p className="my-2 text-xs text-center">Just enter your email and we will send you a reset password link.</p>
					<input
						type="email"
						placeholder="Your email"
						className="w-full rounded-md outline-none dark:bg-gray-900"
						{...register('email', {
							required: 'Email is required',
							pattern: {
								value: EMAIL_REGEX,
								message: 'Invalid email address',
							},
						})}
					/>
					<button type="submit" className="px-4 py-2 mt-2 text-sm tracking-wide text-center uppercase rounded-md bg-brand-500">
						Send
					</button>
				</form>
			</AppLayout>
		</>
	);
};

export default withModal(ForgotPassword);
