import { SearchIcon } from '@heroicons/react/solid';
import { useRouter } from 'next/router';
import { useState } from 'react';
import { classNames } from '../../../utilities';
import Navbar2 from '../common/Navbar2';
import PopupSearchBox from '../search/PopupSearch';

// import Topbar from '../common/Topbar';

const SearchLayout = ({ children, className, title }) => {
    const [searchOpen, setSearchOpen] = useState(false);

	return (
		<main className={classNames('relative w-screen h-auto pt-16 pb-24', className)}>
            <div className={classNames('w-full px-2 py-3 z-[1] fixed top-0 z-1 text-black bg-white')}>
				<div className="flex items-center justify-between w-full">
					<div className="flex items-center gap-3">
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

			{children}

            <Navbar2 className="fixed bottom-0 z-10 w-full nav-blur dark:nav-blur-dark" />
		</main>
	);
};

export default SearchLayout;
