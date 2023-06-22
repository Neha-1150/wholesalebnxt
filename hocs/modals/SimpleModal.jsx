import { Fragment, useRef } from 'react';
import { useTheme } from 'next-themes';
import { Dialog, Transition } from '@headlessui/react';
import { ExclamationIcon, CheckCircleIcon } from '@heroicons/react/outline';

export default function SimpleModal({
	open,
	setOpen,
	heading,
	description,
	onClose,
	onPrimaryClick,
	onSecondaryClick,
	primaryBtnText,
	secondaryBtnText,
	type,
}) {
	const primaryBtnRef = useRef(null);

	return (
		<Transition.Root show={open} as={Fragment}>
			<Dialog as="div" className="fixed inset-0 z-10 overflow-y-auto" initialFocus={primaryBtnRef} onClose={onClose ? () => onClose() : setOpen(false)}>
				<div className="flex items-end justify-center min-h-screen px-4 pt-4 pb-20 text-center sm:block sm:p-0">
					<Transition.Child
						as={Fragment}
						enter="ease-out duration-300"
						enterFrom="opacity-0"
						enterTo="opacity-100"
						leave="ease-in duration-200"
						leaveFrom="opacity-100"
						leaveTo="opacity-0">
						<Dialog.Overlay className="fixed inset-0 transition-opacity bg-gray-500 bg-opacity-75 dark:bg-gray-900 dark:bg-opacity-30" />
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
						<div className="inline-block px-4 pt-5 pb-4 overflow-hidden text-left align-bottom transition-all transform bg-white rounded-lg shadow-xl dark:bg-gray-800 sm:my-8 sm:align-middle sm:max-w-lg sm:w-full sm:p-6">
							<div className="h-full">
								<div className="flex items-center justify-center">
									{type === 'success' ? (
										<CheckCircleIcon className="w-10 h-10 text-center text-green-500" />
									) : (
										<ExclamationIcon className="w-10 h-10 text-center text-brand-600" />
									)}
								</div>

								<div className="mt-3 text-center sm:mt-0 sm:ml-4 sm:text-left">
									<Dialog.Title as="h3" className="text-lg font-medium leading-6 text-gray-900 dark:text-white">
										{heading || 'Confirmation'}
									</Dialog.Title>
									<div
										className="mt-2 text-sm text-gray-500 dark:text-gray-400 max-h-[60vh] overflow-y-scroll"
										dangerouslySetInnerHTML={{ __html: description || 'Are you sure you want to do this?' }}
									/>
								</div>
							</div>
							<div className="flex justify-between mt-5">
								<button
									type="button"
									className="inline-flex justify-center w-full px-4 py-2 mr-2 text-base font-medium text-white border border-transparent rounded-md shadow-sm bg-brand-600 hover:bg-brand-700 dark:ring-offset-0 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-brand-500 sm:w-auto sm:text-sm"
									ref={primaryBtnRef}
									onClick={onPrimaryClick ? () => onPrimaryClick() : () => setOpen(false)}>
									{primaryBtnText || 'Yes'}
								</button>
								<button
									type="button"
									className="inline-flex justify-center w-full px-4 py-2 ml-2 text-base font-medium text-gray-700 bg-white border border-gray-300 rounded-md shadow-sm hover:bg-gray-50 dark:ring-offset-0 dark:text-white dark:bg-gray-700 dark:border-transparent focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-brand-500 sm:mt-0 sm:ml-3 sm:w-auto sm:text-sm"
									onClick={onSecondaryClick ? () => onSecondaryClick() : () => setOpen(false)}>
									{secondaryBtnText || 'No'}
								</button>
							</div>
						</div>
					</Transition.Child>
				</div>
			</Dialog>
		</Transition.Root>
	);
}
