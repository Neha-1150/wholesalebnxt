import Link from 'next/link';
import axios from 'axios';
import { getSession } from 'next-auth/client';
import { Fragment, useState, useEffect } from 'react';
import { Dialog, Transition } from '@headlessui/react';
import { CheckCircleIcon } from '@heroicons/react/solid';

export default function AddressSelector({ open, setOpen, setAddress, address, gotAddresses }) {
	const [allAddresses, setAllAddresses] = useState([]);

	const selectAddress = address => {
		setAddress?.(address);
		setOpen(false);
	};

	useEffect(() => {
		if (gotAddresses?.length > 0) {
			setAllAddresses([...gotAddresses]);
		}
	}, [gotAddresses]);

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
						<Dialog.Overlay className="fixed inset-0 transition-opacity bg-gray-500 bg-opacity-75 dark:bg-gray-900/80" />
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
						<div className="inline-block w-full px-4 pt-5 pb-4 overflow-hidden text-left align-bottom transition-all transform bg-white rounded-lg shadow-xl dark:bg-gray-900 sm:my-8 sm:align-middle sm:max-w-sm sm:w-full sm:p-6">
							<div>
								<div className="w-full mt-3">
									<Dialog.Title as="h3" className="text-lg font-medium leading-6 text-gray-900 dark:text-white">
										Choose shipping address
									</Dialog.Title>
									<div className="flex flex-col w-full mt-2 space-y-2 overflow-y-scroll max-h-72 scrollbar-hide">
										{allAddresses?.length > 0 ? (
											allAddresses.map((addr, index) =>
												addr?.id === address?.id ? (
													<button key={index} type="button" className="relative p-2 mt-2 text-sm text-left border rounded-md text-brand-500 border-brand-500">
														<p>
															<strong>{address?.name}</strong>
														</p>
														<p>{address?.line1},</p>
														<p>{address?.line2},</p>
														<p>
															{address?.city}, {address?.state}, {address?.pincode}
														</p>
														{address?.phoneNumber && (
															<p>
																<em>+91-{address?.phoneNumber}</em>
															</p>
														)}
														<CheckCircleIcon className="absolute w-5 h-5 top-1 text-brand-500 right-1" />
													</button>
												) : (
													<button
														type="button"
														key={index}
														onClick={() => selectAddress(addr)}
														className="p-2 mt-2 text-sm text-left text-gray-500 border border-gray-200 rounded-md dark:border-gray-800">
														<p>
															<strong>{addr?.name}</strong>
														</p>
														<p>{addr?.line1},</p>
														<p>{addr?.line2},</p>
														<p>
															{addr?.city}, {addr?.state}, {addr?.pincode}
														</p>
														{addr?.phoneNumber && (
															<p>
																<em>+91-{addr?.phoneNumber}</em>
															</p>
														)}
													</button>
												)
											)
										) : (
											<div className="flex flex-col items-center justify-center w-full mt-2 space-y-2 overflow-y-scroll max-h-72 scrollbar-hide">
												<p>No addresses found.</p>
												<Link href="/dashboard/addresses/add">
													<a className="text-sm font-bold tracking-wide underline uppercase text-brand-500">Add Address</a>
												</Link>
											</div>
										)}
									</div>
								</div>
							</div>
						</div>
					</Transition.Child>
				</div>
			</Dialog>
		</Transition.Root>
	);
}
