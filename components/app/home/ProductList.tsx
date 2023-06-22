import RequestBanner from '../common/RequestBanner';
import ProductListItem from './ProductListItem';

const ProductList = ({ products, selectedCategory }) => {
	return (
		<>
			<div className="flex flex-col items-center justify-center w-screen px-2 overflow-y-scroll pb-14 dark:bg-black gap-y-3">
				{products.map((product, index) => (
					<ProductListItem page={''} key={product?.id} product={product} selectedCategory={selectedCategory} uid={index} />
				))}
				<RequestBanner />
			</div>
		</>
	);
};

export default ProductList;
