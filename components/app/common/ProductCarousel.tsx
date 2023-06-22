import Link from 'next/link';
import ProductCarouselItem from './ProductCarouselItem';

const ProductCarousel = ({ products, title, seeMoreUrl }) => {
	return (
		<div className="">
			<div className="flex items-center justify-between mx-3">
				<h4 className="font-bold text-gray-900 whitespace-nowrap">{title}</h4>
				{seeMoreUrl && (
					<Link href={seeMoreUrl}>
						<a className="text-sm text-gray-700 underline">See more</a>
					</Link>
				)}
			</div>
			<div className="flex gap-3 overflow-x-auto scrollbar-hide">
				<div className="flex gap-3 m-3">
				{products?.map(product => {
					return <ProductCarouselItem product={product} key={product?.id} />;
				})}
				</div>
			</div>
		</div>
	);
};

export default ProductCarousel;
