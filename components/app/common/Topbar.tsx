import Link from 'next/link';
import { useState } from 'react';
import { useRouter } from 'next/router';
import { InformationCircleIcon, MenuIcon } from '@heroicons/react/solid';
import AppSidebar from './AppSidebar';
import LogoFullBnxt from './LogoFullBnxt';

const Topbar = () => {
	const [sidebarOpen, setSidebarOpen] = useState(false);
	const router = useRouter();

	return (
		<>
			<div className="fixed top-0 z-10 w-screen px-2 py-4 bg-[#E64431]">
				<div className="flex items-center justify-center w-full text-white">
					<Link href="/">
						<a>
							<LogoFullBnxt className="w-auto h-4 ml-2" />
						</a>
					</Link>
					<div className="absolute hidden md:block left-[50vw] transform translate-x-[-50%]">
						<div className="flex items-center px-4 py-2 text-sm text-yellow-700 border border-yellow-500 rounded-md select-none dark:border-transparent dark:bg-yellow-400/30 dark:text-yellow-500 bg-yellow-50">
							<InformationCircleIcon className="w-5 h-5 mr-2" />
							Please open the app in a mobile device
						</div>
					</div>
					{/* <div>
						<button className="flex items-center justify-center p-2" onClick={() => setSidebarOpen(true)}>
							<MenuIcon className="w-5 h-5 text-darkColor-800 dark:text-darkColor-300" />
						</button>
					</div> */}
				</div>
			</div>
			{/* <AppSidebar sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen} /> */}
		</>
	);
};

export default Topbar;
