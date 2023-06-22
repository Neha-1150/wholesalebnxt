import Link from 'next/link';
import { useSelector, RootStateOrAny } from 'react-redux';
import { useRouter } from 'next/router';
import { HomeIcon, ViewGridIcon, ShoppingCartIcon, UserIcon, ShoppingBagIcon, BookOpenIcon, ReceiptTaxIcon} from '@heroicons/react/solid';
import { classNames } from '../../../utilities';

const Navbar = () => {
	const router = useRouter();
	const lineItems = useSelector((state: RootStateOrAny)=> state.lineItems);
	const isPathActive = () => {
		const pathsArr = router.pathname?.split('/');
		const activePath = router.pathname?.split('/').pop();
		if (activePath === 'cart') return 'cart';
		if (activePath === 'orders') return 'orders';
		if (activePath === 'dashboard') return 'dashboard';
		if (activePath === 'books') return 'books';
		if (activePath === 'offers') return 'offers';
		if (pathsArr.includes('category')) return 'category';
		if (activePath === '') return 'home';
		else return false;
	};

	return (
		<div className="fixed bottom-0 z-1 w-screen py-2 pb-4 border text-darkColor-500 dark:text-white dark:border-darkColor-800 nav-blur dark:nav-blur-dark rounded-t-md">
			<ul className="flex justify-around">
				<li>
					<Link href="/">
						<a className="flex flex-col items-center justify-center">
							<HomeIcon className={classNames(isPathActive() && isPathActive() === 'home' ? 'text-brand-500' : '', 'w-6 h-6')} />
							<small className="text-[10px] mt-1">Home</small>
						</a>
					</Link>
				</li>
				{/* <li>
					<Link href="/offers">
						<a className="flex flex-col items-center justify-center">
							<ReceiptTaxIcon className={classNames(isPathActive() && isPathActive() === 'offers' ? 'text-brand-500' : '', 'w-6 h-6')} />
							<small className="text-[10px] mt-1">Offers</small>
						</a>
					</Link>
				</li> */}
				{/* <li>
					<Link href="/category/all">
						<a className="flex flex-col items-center justify-center">
							<ViewGridIcon className={classNames(isPathActive() && isPathActive() === 'category' ? 'text-brand-500' : '', 'w-6 h-6')} />
							<small className="text-[10px] mt-1">Categories</small>
						</a>
					</Link>
				</li> */}
				{/* <li>
					<Link href="/books">
						<a className="relative flex flex-col items-center justify-center">
							<BookOpenIcon className={classNames(isPathActive() && isPathActive() === 'books' ? 'text-brand-500' : '', 'w-6 h-6')} />
							<small className="text-[10px] mt-1">My Books</small>
						</a>
					</Link>
				</li> */}
				<li>
					<Link href="/cart">
						<a className="relative flex flex-col items-center justify-center">
							<ShoppingCartIcon className={classNames(isPathActive() && isPathActive() === 'cart' ? 'text-brand-500' : '', 'w-6 h-6')} />
							<small className="text-[10px] mt-1">Cart</small>
							{lineItems?.length > 0 && (
								<span className="absolute top-[-5px] right-[-5px] text-[10px] text-white font-extrabold bg-[#E64431] px-1 rounded-full leading-none pt-0.5">
									{lineItems?.length}
								</span>
							)}
						</a>
					</Link>
				</li>
				<li>
					<Link href="/dashboard/orders">
						<a className="flex flex-col items-center justify-center">
							<ShoppingBagIcon className={classNames(isPathActive() && isPathActive() === 'orders' ? 'text-brand-500' : '', 'w-6 h-6')} />
							<small className="text-[10px] mt-1">Orders</small>
						</a>
					</Link>
				</li>
				<li>
					<Link href="/dashboard">
						<a className="flex flex-col items-center justify-center">
							<UserIcon className={classNames(isPathActive() && isPathActive() === 'dashboard' ? 'text-brand-500' : '', 'w-6 h-6')} />
							<small className="text-[10px] mt-1">Account</small>
						</a>
					</Link>
				</li>
			</ul>
		</div>
	);
};

export default Navbar;