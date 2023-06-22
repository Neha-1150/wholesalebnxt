import { SearchIcon } from '@heroicons/react/outline';

const SearchInput = ({ query, setSearchQuery }) => {
	return (
		<div className="fixed z-10 flex items-center justify-center w-full px-2 py-2 nav-blur dark:nav-blur-dark">
			<input
				type="search"
				className="w-full placeholder-gray-300 border border-gray-300 rounded-lg shadow-lg outline-none bg-white/20 dark:border-transparent dark:bg-gray-900/20 pl-9 focus:ring-brand-400"
				placeholder="Search for items, categories etc"
				onChange={e => setSearchQuery(e.target.value)}
			/>
			<SearchIcon className="absolute top-[50%] left-[15px] w-5 h-5 transform translate-y-[-50%] text-brand-500" />
		</div>
	);
};

export default SearchInput;
