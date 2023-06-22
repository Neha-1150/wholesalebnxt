import Link from 'next/link';
import { signOut } from 'next-auth/client';
import { useRouter } from 'next/dist/client/router';
import Lottie from 'lottie-react';
import sadBox from '../public/assets/animations/sad-box.json';
import { ChevronRightIcon } from '@heroicons/react/solid';

export default function NotFound() {
	const router = useRouter();
	const { asPath } = router;

	const signMeOut = () => {
		signOut().then(res => {
			window.location.href = '/';
		});
	};

	return (
		<>
			<header></header>
			<main className="flex items-center justify-center min-h-screen dark:bg-black">
				<div className="flex flex-col items-center gap-5">
					<Lottie animationData={sadBox} className="w-20 h-20" />
					<div className="tracking-tight text-center">
						<h1 className="text-2xl text-center text-coolGray-700 dark:text-coolGray-200">Oops! 404.</h1>
						<p className="mt-2">
							<samp className="px-2 py-1 rounded-lg dark:bg-gray-900 dark:text-coolGray-300 text-coolGray-600 bg-coolGray-100">{asPath?.slice(0, 10)}...</samp>{' '}
							- We couldn't find the page you're looking for.
						</p>
					</div>
					<Link href="/">
						<a className="inline-flex items-center px-4 py-2 text-xs font-medium text-white border border-transparent rounded-md shadow-sm bg-gradient-to-br from-rose-400 to-brand-600 hover:bg-brand-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-brand-500">
							Go Home <ChevronRightIcon className="w-5 h-5 ml-2" />
						</a>
					</Link>
					<button className="text-xs font-bold tracking-wide uppercase" onClick={() => signMeOut()}>
						Logout
					</button>
				</div>
			</main>
		</>
	);
}
