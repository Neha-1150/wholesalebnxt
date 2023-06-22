import { useState } from 'react';
import { useRouter } from 'next/router';
import { ArrowLeftIcon, MenuIcon } from '@heroicons/react/solid';
import AppSidebar from './AppSidebar';
import { classNames } from '../../../utilities';

const Backbar = ({ title = 'back', className }) => {
	const [sidebarOpen, setSidebarOpen] = useState(false);
	const router = useRouter();

	const goBack = () => {
		if (router.asPath.split('/')?.[2] === 'orders' && router.asPath.split('/')?.length === 4) {
			router.replace('/dashboard/orders');
		} else {
			router.back();
		}
	};

	return (
		<>
			<div className={classNames('w-full px-2 py-3 z-[15]', className)}>
				<div className="flex items-center justify-between w-full">
					<div className="flex items-center gap-3">
						<button onClick={() => goBack()}>
							<ArrowLeftIcon className="w-5 h-5 ml-2 text-white" />
						</button>
						<h3 className="mt-1 font-medium capitalize">{title}</h3>
					</div>
					{/* <div>
						<button className="flex items-center justify-center p-2" onClick={() => setSidebarOpen(true)}>
							<MenuIcon className="w-5 h-5 text-darkColor-800 dark:text-darkColor-300" />
						</button>
					</div> */}
				</div>
			</div>
			<AppSidebar sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen} />
		</>
	);
};

export default Backbar;
