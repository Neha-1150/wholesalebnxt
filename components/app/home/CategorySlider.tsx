import { FiPackage } from 'react-icons/fi';
import { classNames } from '../../../utilities';

const CategoryItem = ({ category, selectedCategory, setSelectedCategory }) => {
	const isSelected = () => {
		return category.id === selectedCategory?.id;
	};

	const handleClick = () => {
		if (isSelected()) {
			setSelectedCategory(null);
		} else {
			setSelectedCategory(category);
		}
	};

	return (
		<button
			type="button"
			onClick={() => handleClick(category)}
			className={classNames(
				isSelected()
					? 'border-brand-500 text-brand-500 dark:border-brand-500 border dark:text-brand-500'
					: 'dark:border-transparent border text-gray-800 dark:text-gray-300 border-gray-200',
				'flex flex-col items-center justify-center bg-white dark:bg-gradient-to-br  dark:from-gray-900 dark:to-black h-32 p-3 !m-1  shadow-md first-of-type:m-auto rounded-xl'
			)}>
			<div className="mb-1">
				<img src={category?.images?.[0]?.url} alt="" className="h-16" />
			</div>
			<div className="w-[10ch] text-center leading-tight text-xs">{category?.name}</div>
		</button>
	);
};

const CategorySlider = ({ categories, selectedCategory, setSelectedCategory }) => {
	return (
		<div className="flex items-center w-full mt-5 overflow-x-scroll scrollbar-hide">
			{categories
				.sort((a, b) => b?.products?.length - a?.products?.length)
				.map((category, index) =>
					category.products?.length > 0 ? (
						<CategoryItem key={index} category={category} selectedCategory={selectedCategory} setSelectedCategory={setSelectedCategory} />
					) : (
						<div className="hidden" key={index}></div>
					)
				)}
		</div>
	);
};

export default CategorySlider;
