import Link from 'next/link';
import { useRouter } from 'next/router';
import { Fragment, useState } from 'react';
import { Dialog, Transition } from '@headlessui/react';
import { CheckIcon } from '@heroicons/react/outline';

export default function CancelSuccessModal({ open, setOpen }) {
	const router = useRouter();

	const closeModal = () => {
		setOpen(false);
		router.push('/');
	};

	const onClose = () => {
		setOpen(false);
		router.reload();
	};

	return (
		<Transition.Root show={open} as={Fragment}>
			<Dialog as="div" className="fixed inset-0 z-10 overflow-y-auto" onClose={setOpen}>
				<div className="flex items-end justify-center min-h-screen px-4 pt-4 pb-20 text-center sm:block sm:p-0">
					<Transition.Child
						as={Fragment}
						enter="ease-out duration-300"
						enterFrom="opacity-0"
						enterTo="opacity-100"
						leave="ease-in duration-200"
						leaveFrom="opacity-100"
						leaveTo="opacity-0">
						<Dialog.Overlay className="fixed inset-0 transition-opacity bg-gray-500 bg-opacity-75 dark:bg-opacity-30 dark:bg-gray-900" />
					</Transition.Child>

					{/* This element is to trick the browser into centering the modal contents. */}
					<span className="hidden sm:inline-block sm:align-middle sm:h-screen" aria-hidden="true">
						&#8203;
					</span>
					<Transition.Child
						as={Fragment}
						enter="ease-out duration-300"
						enterFrom="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
						enterTo="opacity-100 translate-y-0 sm:scale-100"
						leave="ease-in duration-200"
						leaveFrom="opacity-100 translate-y-0 sm:scale-100"
						leaveTo="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95">
						<div className="inline-block px-4 pt-5 pb-4 overflow-hidden text-left align-bottom transition-all transform bg-white rounded-lg shadow-xl dark:bg-gray-800 sm:my-8 sm:align-middle sm:max-w-sm sm:w-full sm:p-6">
							<div>
								<div className="flex items-center justify-center w-12 h-12 mx-auto bg-green-100 rounded-full dark:bg-green-500/30">
									<CheckIcon className="w-6 h-6 text-green-600 dark:text-green-100" aria-hidden="true" />
								</div>
								<div className="mt-3 text-center sm:mt-5">
									<Dialog.Title as="h3" className="text-lg font-medium leading-6 text-gray-900 dark:text-gray-50">
										Order Cancelled
									</Dialog.Title>
									<div className="mt-2">
										<p className="text-sm text-gray-500 dark:text-gray-300">Your order has been cancelled.</p>
										<p className="text-sm text-gray-500 dark:text-gray-300">
											Any money deducted from your account will be refunded as per our{' '}
											<Link href="/refunds-policy">
												<a className="underline text-brand-600 dark:text-brand-400">refund policies</a>
											</Link>
											.
										</p>
										<p className="text-sm text-gray-500 dark:text-gray-300">
											In case of any queries, please{' '}
											<Link href="/contact">
												<a className="underline text-brand-600 dark:text-brand-400">contact us</a>
											</Link>
											.
										</p>
									</div>
								</div>
							</div>
							<div className="mt-5 sm:mt-6">
								<button
									type="button"
									className="inline-flex justify-center w-full px-4 py-2 text-base font-medium text-white border border-transparent rounded-md shadow-sm bg-brand-600 dark:ring-offset-0 hover:bg-brand-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-brand-500 sm:text-sm"
									onClick={() => closeModal()}>
									Go back to dashboard
								</button>
							</div>
						</div>
					</Transition.Child>
				</div>
			</Dialog>
		</Transition.Root>
	);
}
