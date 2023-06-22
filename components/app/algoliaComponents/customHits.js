import Link from 'next/link';
import { connectHits, connectInfiniteHits } from 'react-instantsearch-dom';
import ProductListItem3 from '../home/ProductListItem3';
import { useInView } from 'react-intersection-observer';
import { useEffect } from 'react';
import ProductListItem2 from '../home/ProductListItem2';

export const CustomHits = connectHits(({ hits }) =>
	hits.map((product, index) => {
		return <ProductListItem2 key={product?.id} product={product} uid={index} />;
	})
);

export const InfiniteHits = connectInfiniteHits(({ hits, hasMore, refineNext, page }) => {
	const { ref, inView } = useInView({ threshold: 0 });

	useEffect(() => {
		if (inView && hasMore) refineNext();
	}, [inView]);

	return (
		<>
			<div className='grid grid-cols-2 gap-2 p-2'>
			{hits.map((product, index) => {
				return <ProductListItem3 key={product?.id} product={product} uid={index} page={page}/>;
				// return <ProductListItem2 key={product?.id} product={product} uid={index} page={page}/>;
			})}
			</div>

			<li style={{ visibility: 'hidden' }} ref={ref} />
		</>
	);
});
