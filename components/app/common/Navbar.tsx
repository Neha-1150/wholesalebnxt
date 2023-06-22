import { useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { HomeIcon, ViewGridIcon, ShoppingCartIcon } from '@heroicons/react/solid';
import { classNames } from '../../../utilities';

const Navbar = () => {
	const router = useRouter();

	const isPathActive = () => {
		const activePath = router.pathname?.split('/').pop();
		if (activePath === 'cart') return 'cart';
		if (activePath === 'orders') return 'orders';
		if (activePath === '') return 'catalog';
		else return false;
	};

	return (
		<div className="fixed bottom-0 z-10 w-screen py-2 pb-5 border text-darkColor-500 dark:text-white dark:border-darkColor-800 nav-blur dark:nav-blur-dark rounded-t-md">
			<ul className="flex justify-around">
				<li>
					<Link href="/">
						<a className="flex flex-col items-center justify-center">
							<HomeIcon className={classNames(isPathActive() && isPathActive() === 'catalog' ? 'text-brand-500' : '', 'w-6 h-6')} />
							<small className="text-[10px] mt-1">Home</small>
						</a>
					</Link>
				</li>
				<li>
					<Link href="/dashboard/orders">
						<a className="flex flex-col items-center justify-center">
							<ViewGridIcon className={classNames(isPathActive() && isPathActive() === 'orders' ? 'text-brand-500' : '', 'w-6 h-6')} />
							<small className="text-[10px] mt-1">Orders</small>
						</a>
					</Link>
				</li>
				<li>
					<Link href="/cart">
						<a className="flex flex-col items-center justify-center">
							<ShoppingCartIcon className={classNames(isPathActive() && isPathActive() === 'cart' ? 'text-brand-500' : '', 'w-6 h-6')} />
							<small className="text-[10px] mt-1">Cart</small>
						</a>
					</Link>
				</li>
			</ul>
		</div>
	);
};

export default Navbar;
