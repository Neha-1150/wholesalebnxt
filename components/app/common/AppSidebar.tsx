import Link from 'next/link';
import store from 'store';
import { Fragment, useEffect, useState } from 'react';
import { getSession, signOut } from 'next-auth/client';
import { Dialog, Transition } from '@headlessui/react';
import { ShoppingBagIcon, TruckIcon, MapIcon, UserAddIcon, PhoneIcon, UserCircleIcon, MailIcon, XIcon, QuestionMarkCircleIcon } from '@heroicons/react/outline';
import LogoFullBnxt from './LogoFullBnxt';
import Avatar from './Avatar';
import ThemeSwitch from './ThemeSwitch';
import { LogoutIcon, LoginIcon } from '@heroicons/react/solid';
import withModal from '../../../hocs/withModal';
import LockedCreditLimit from './LockedCreditLimit';

const navigation = [
	{ name: 'Profile', href: '/dashboard', icon: UserCircleIcon, current: false },
	{ name: 'Addresses', href: '/dashboard/addresses', icon: MapIcon, current: false },
	{ name: 'Orders', href: '/dashboard/orders', icon: ShoppingBagIcon, current: false },
];

const aux = [
	{ name: 'Contact', href: '/contact', icon: MailIcon, current: false },
	// { name: 'Shipping Policy', href: '/shipping-policy', icon: TruckIcon, current: false },
	{ name: 'Refund Policy', href: '/refunds-policy', icon: QuestionMarkCircleIcon, current: false },
];

function classNames(...classes) {
	return classes.filter(Boolean).join(' ');
}

const AppSidebar = ({ sidebarOpen = false, setSidebarOpen }) => {
	const [userSession, setUserSession] = useState(false);
	const [mounted, setMounted] = useState(false);

	useEffect(async () => {
		setMounted(true);
		const session = await getSession();
		setUserSession(session);
	}, []);

	const logOut = async () => {
		store.remove('fcm_token');
		store.remove('wnxt-cart');
		store.remove('token_set');
		store.remove('rzp_device_id');
		await signOut();
	};

	return (
		<>
			{/*
        This example requires updating your template:

        ```
        <html class="h-full bg-gray-100">
        <body class="h-full">
        ```
      */}
			<div>
				<Transition.Root show={sidebarOpen} as={Fragment}>
					<Dialog as="div" className="fixed inset-0 z-40 flex flex-row-reverse" onClose={setSidebarOpen}>
						<Transition.Child
							as={Fragment}
							enter="transition-opacity ease-linear duration-300"
							enterFrom="opacity-0"
							enterTo="opacity-100"
							leave="transition-opacity ease-linear duration-300"
							leaveFrom="opacity-100"
							leaveTo="opacity-0">
							<Dialog.Overlay className="fixed inset-0 bg-gray-600 bg-opacity-75 dark:bg-black dark:bg-opacity-80" />
						</Transition.Child>
						<Transition.Child
							as={Fragment}
							enter="transition ease-in-out duration-300 transform"
							enterFrom="translate-x-full"
							enterTo="-translate-x-0"
							leave="transition ease-in-out duration-300 transform"
							leaveFrom="-translate-x-0"
							leaveTo="translate-x-full">
							<div className="relative flex flex-col flex-1 w-full max-w-xs bg-white dark:bg-black">
								<Transition.Child
									as={Fragment}
									enter="ease-in-out duration-300"
									enterFrom="opacity-0"
									enterTo="opacity-100"
									leave="ease-in-out duration-300"
									leaveFrom="opacity-100"
									leaveTo="opacity-0">
									<div className="absolute top-0 left-[-15vw] pt-2">
										<button
											type="button"
											className="flex items-center justify-center w-10 h-10 ml-1 rounded-full focus:outline-none"
											onClick={() => setSidebarOpen(false)}>
											<span className="sr-only">Close sidebar</span>
											<XIcon className="w-6 h-6 text-white" aria-hidden="true" />
										</button>
									</div>
								</Transition.Child>
								<div className="flex-1 h-0 pt-5 pb-4 overflow-y-auto">
									<div className="flex items-center flex-shrink-0 px-4">
										<Link href="/">
											<a>
												<LogoFullBnxt className="w-auto h-4" />
											</a>
										</Link>
									</div>
									{/* <div className="mx-4 mt-8 space-y-1">
										<Link href="/credit-limit">
											<a>
												<LockedCreditLimit />
											</a>
										</Link>
									</div> */}
									{userSession && (
										<>
											<nav className="px-2 mt-5 space-y-1">
												{userSession?.user?.isBnxtAdmin && (
													<Link href="/onboard">
														<a
															className={classNames(
																false
																	? 'bg-gray-100 text-gray-900 dark:text-darkColor-100'
																	: 'dark:text-darkColor-300 dark:hover:bg-darkColor-800 text-gray-600 hover:bg-gray-50 hover:text-gray-900',
																'group flex items-center px-2 py-2 text-base font-medium rounded-md'
															)}>
															<UserAddIcon
																className={classNames(false ? 'text-gray-500' : 'text-green-400 group-hover:text-gray-500', 'mr-4 flex-shrink-0 h-6 w-6')}
																aria-hidden="true"
															/>
															Onboard User
														</a>
													</Link>
												)}
												{navigation.map(item => (
													<Link key={item.name} href={item.href}>
														<a
															className={classNames(
																item.current
																	? 'bg-gray-100 text-gray-900 dark:text-darkColor-100'
																	: 'dark:text-darkColor-300 dark:hover:bg-darkColor-800 text-gray-600 hover:bg-gray-50 hover:text-gray-900',
																'group flex items-center px-2 py-2 text-base font-medium rounded-md'
															)}>
															<item.icon
																className={classNames(item.current ? 'text-gray-500' : 'text-gray-400 group-hover:text-gray-500', 'mr-4 flex-shrink-0 h-6 w-6')}
																aria-hidden="true"
															/>
															{item.name}
														</a>
													</Link>
												))}
											</nav>
											<div className="w-[50px] h-[2px] text-darkColor-900" />
										</>
									)}
									<nav className="px-2 mt-5 space-y-1">
										<a
											href="tel:9738168131"
											className="flex items-center px-2 py-2 text-base font-medium text-gray-600 rounded-md dark:text-darkColor-300 dark:hover:bg-darkColor-800 hover:bg-gray-50 hover:text-gray-900 group">
											<PhoneIcon
												className={classNames(false ? 'text-gray-500' : 'text-gray-400 group-hover:text-gray-500', 'mr-4 flex-shrink-0 h-6 w-6')}
												aria-hidden="true"
											/>
											<span className="flex items-center justify-center">
												Helpline <small className="mt-1 ml-2">(+91-9738168131)</small>
											</span>
										</a>
										{aux.map(item => (
											<Link key={item.name} href={item.href}>
												<a
													className={classNames(
														item.current
															? 'bg-gray-100 text-gray-900 dark:text-darkColor-100'
															: 'dark:text-darkColor-300 dark:hover:bg-darkColor-800 text-gray-600 hover:bg-gray-50 hover:text-gray-900',
														'group flex items-center px-2 py-2 text-base font-medium rounded-md'
													)}>
													<item.icon
														className={classNames(item.current ? 'text-gray-500' : 'text-gray-400 group-hover:text-gray-500', 'mr-4 flex-shrink-0 h-6 w-6')}
														aria-hidden="true"
													/>
													{item.name}
												</a>
											</Link>
										))}
									</nav>
								</div>
								{userSession && (
									<>
										<div className="w-[50px] h-[2px] text-darkColor-900" />
										<nav className="w-full px-2 mt-2 space-y-1">
											<button
												onClick={() => logOut()}
												className={classNames(
													false
														? 'bg-gray-100 text-gray-900 dark:text-darkColor-100'
														: 'dark:text-darkColor-300 dark:hover:bg-darkColor-800 text-gray-600 hover:bg-gray-50 hover:text-gray-900',
													'group flex items-center w-full px-2 py-2 text-base font-medium rounded-md'
												)}>
												<LogoutIcon
													className={classNames(false ? 'text-gray-500' : 'text-gray-400 group-hover:text-gray-500', 'mr-4 flex-shrink-0 h-6 w-6')}
													aria-hidden="true"
												/>
												Log out
											</button>
										</nav>
									</>
								)}
								<div className="flex items-center justify-center py-5">
									<ThemeSwitch />
								</div>
								<div className="flex flex-shrink-0 p-4 border-t border-gray-200 dark:border-darkColor-800">
									{userSession ? (
										<div className="flex-shrink-0 block group">
											<div className="flex items-center">
												<div>
													<Avatar className={" "} name={userSession?.user?.name} />
												</div>
												<div className="ml-3">
													<p className="text-base font-medium text-gray-700 dark:text-darkColor-50 group-hover:text-gray-900 dark:group-hover:text-white">
														{userSession?.user?.name}
													</p>
												</div>
											</div>
										</div>
									) : (
										<Link href="/login">
											<a className="flex-shrink-0 block w-full group text-brand-400">
												<div className="flex items-center">
													<LoginIcon className={classNames('group-hover:text-brand-500 mr-4 flex-shrink-0 h-6 w-6')} aria-hidden="true" />
													Log in
												</div>
											</a>
										</Link>
									)}
								</div>
							</div>
						</Transition.Child>
						<div className="flex-shrink-0 w-14">{/* Force sidebar to shrink to fit close icon */}</div>
					</Dialog>
				</Transition.Root>
			</div>
		</>
	);
};

export default AppSidebar;
