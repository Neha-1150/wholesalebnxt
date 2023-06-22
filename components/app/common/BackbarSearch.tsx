import { useState } from 'react';
import { useRouter } from 'next/router';
import PopupSearchBox from '../search/PopupSearch';
import { ArrowLeftIcon } from '@heroicons/react/solid';
import { SearchIcon } from '@heroicons/react/outline';
import { classNames } from '../../../utilities';

const Backbar = ({ title = 'back', className }) => {
	const [searchOpen, setSearchOpen] = useState(false);
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
			<div className={classNames('w-full px-2 py-3 z-[1]', className)}>
				<div className="flex items-center justify-between w-full">
					<div className="flex items-center gap-3">
						<button onClick={() => goBack()}>
							<ArrowLeftIcon className="w-5 h-5 ml-2 text-black" />
						</button>
						<h3 className="mt-1 text-xl font-semibold">{title}</h3>
					</div>
					<div>
						<button className="flex items-center justify-center p-2" onClick={() => setSearchOpen(true)}>
							<SearchIcon className="w-5 h-5 text-darkColor-800 dark:text-darkColor-300" />
						</button>
					</div>
				</div>
			</div>
			{searchOpen && <PopupSearchBox mobileSearchboxOpen={searchOpen} setMobileSearchboxOpen={setSearchOpen} />}
		</>
	);
};

export default Backbar;
