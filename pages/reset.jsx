import axios from 'axios';
import { signIn } from 'next-auth/client';
import { getSession } from 'next-auth/client';
import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import toast from 'react-hot-toast';
import { useTheme } from 'next-themes';
import { EyeIcon, EyeOffIcon, ExclamationCircleIcon } from '@heroicons/react/solid';
import withModal from '../hocs/withModal';

const ResetPassword = ({ setPopup }) => {
	const {
		register,
		handleSubmit,
		formState: { errors },
	} = useForm();

	const router = useRouter();
	const { theme } = useTheme();

	const { code } = router.query;

	const [showPassword, setShowPassword] = useState(false);
	const [showConfirmPassword, setShowConfirmPassword] = useState(false);

	useEffect(async () => {
		const session = await getSession();
		if (session && session?.user?.isConfirmed) {
			router.replace('/');
		}
	}, []);

	const submitHandler = async values => {
		if (values?.password !== values?.confirmPassword) {
			toast.error(`Passwords do not match!`, {
				style: {
					fontSize: '12px',
					borderRadius: '5px',
					background: theme === 'light' ? '#f7f7f7' : '#1e1e1e',
					color: theme === 'light' ? '#1e1e1e' : '#f7f7f7',
				},
			});
		} else {
			try {
				if (code) {
					try {
						const res = await axios.post(`${process.env.NEXT_PUBLIC_API_URL}/auth/reset-password`, {
							code,
							password: values?.password,
							passwordConfirmation: values?.confirmPassword,
						});
						if (res.status === 200) {
							setPopup({
								popupShow: true,
								heading: 'Password reset successful',
								description: `
          <p>Your password has been reset successfully!</p>
          <p>Please login with your new password.</p>
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
				} else {
					router.replace('/');
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
		}
	};

	return (
		<>
			<main className="flex items-center justify-center w-screen h-screen">
				<form className="flex flex-col items-center justify-center w-full px-5 gap-y-2" onSubmit={handleSubmit(submitHandler)}>
					<h3 className="py-2 font-bold tracking-tight text-center">Reset your password</h3>
					<div className="flex flex-col w-full gap-y-5">
						<div className="sm:grid sm:grid-cols-3 sm:gap-4 sm:items-start sm:border-t sm:border-gray-200 sm:pt-5">
							<label htmlFor="fullName" className="block text-sm font-medium text-gray-700 dark:text-gray-200 sm:mt-px sm:pt-2">
								Password
							</label>
							<div className="relative mt-1 sm:mt-0 sm:col-span-2">
								<input
									type={showPassword ? 'text' : 'password'}
									name="password"
									id="password"
									autoComplete="current-password"
									className="block w-full max-w-lg pr-8 border-gray-300 rounded-md shadow-sm dark:bg-gray-900 dark:border-transparent focus:ring-brand-500 focus:border-brand-500 sm:max-w-xs sm:text-sm"
									{...register('password', {
										required: 'Full name is required',
										minLength: { value: 3, message: 'Full name must be at least 3 characters' },
									})}
								/>
								{errors?.password && (
									<small className="absolute bottom-[-22px] flex items-center text-red-500 gap-x-1">
										<ExclamationCircleIcon className="w-4 h-4" />
										{errors?.password?.message}
									</small>
								)}

								<button type="button" className="absolute inset-y-0 right-2" onClick={() => setShowPassword(!showPassword)}>
									{showPassword ? <EyeIcon className="w-5 h-5 text-gray-500 " /> : <EyeOffIcon className="w-5 h-5 text-gray-500 " />}
								</button>
							</div>
						</div>

						<div className="sm:grid sm:grid-cols-3 sm:gap-4 sm:items-start sm:border-t sm:border-gray-200 sm:pt-5">
							<label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700 dark:text-gray-200 sm:mt-px sm:pt-2">
								Confirm password
							</label>
							<div className="relative mt-1 sm:mt-0 sm:col-span-2">
								<input
									type={showConfirmPassword ? 'text' : 'password'}
									name="confirmPassword"
									id="confirmPassword"
									autoComplete="off"
									className="block w-full max-w-lg pr-8 border-gray-300 rounded-md shadow-sm dark:bg-gray-900 dark:border-transparent focus:ring-brand-500 focus:border-brand-500 sm:max-w-xs sm:text-sm"
									{...register('confirmPassword', {
										required: 'Business name is required',
										minLength: { value: 3, message: 'Business name must be at least 3 characters' },
									})}
								/>
								{errors?.confirmPassword && (
									<small className="absolute bottom-[-22px] flex items-center text-red-500 gap-x-1">
										<ExclamationCircleIcon className="w-4 h-4" />
										{errors?.confirmPassword?.message}
									</small>
								)}

								<button type="button" className="absolute inset-y-0 right-2" onClick={() => setShowConfirmPassword(!showConfirmPassword)}>
									{showConfirmPassword ? <EyeIcon className="w-5 h-5 text-gray-500 " /> : <EyeOffIcon className="w-5 h-5 text-gray-500 " />}
								</button>
							</div>
						</div>
					</div>

					<button type="submit" className="px-4 py-2 mt-2 text-sm tracking-wide text-center uppercase rounded-md bg-brand-500">
						Reset
					</button>
				</form>
			</main>
		</>
	);
};

export default withModal(ResetPassword);
