import { useState } from 'react';
import { SearchIcon } from '@heroicons/react/outline';
import PopupSearchBox from '../search/PopupSearch';

const SearchInput = () => {
	const [mobileSearchboxOpen, setMobileSearchboxOpen] = useState(false);
	return (
		<div className="z-10 flex items-center justify-center w-full px-2 py-2">
			<button
				type="button"
				className="w-full font-semibold text-left pl-10 mt-1 text-gray-500 bg-[#F3F3F3] border-none py-2 rounded-md outline-none dark:bg-gray-900/20  focus:ring-brand-400"
				onClick={() => {
					setMobileSearchboxOpen(true);
				}}>
				Search for a product, brand or category
			</button>
			<SearchIcon className="absolute top-[50%] left-[20px] w-5 h-5 transform translate-y-[-50%] text-brand-500" />
			{mobileSearchboxOpen && <PopupSearchBox mobileSearchboxOpen={mobileSearchboxOpen} setMobileSearchboxOpen={setMobileSearchboxOpen} />}
		</div>
	);
};

export default SearchInput;
