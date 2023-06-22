import axios from 'axios';
import Link from 'next/link';
import { getSession } from 'next-auth/client';
import ContinueToCart from '../../components/app/cart/ContinueToCart';
import BackWithSearchLayout from '../../components/app/layouts/BackWithSearchLayout';
import { useLayoutBaker } from '../../hooks/useLayoutBaker';
import Navbar from '../../components/app/common/Navbar2';

const AllCategories = ({ homepageData }) => {
	
	// let catBlocks = homepageData.blocks.filter(b => b.__component == 'image-grid.data' && b.name == 'categoriesGrid')
	const { renderedBlock, loading, error } = useLayoutBaker(homepageData.blocks);
	return (
		<BackWithSearchLayout backTitle="All Categories">
			{renderedBlock}
			<ContinueToCart positionClass="bottom-[70px]"/>
			<Navbar/>
		</BackWithSearchLayout>
	);
};

export const getServerSideProps = async ctx => {
	const session = await getSession(ctx);

	if (!session) {
		return {
			props: {
				categories: [],
				redirect: {
					pathname: '/login',
					permanent: false,
				},
			},
		};
	}

	try {
		const homepage = await axios.get(`${process.env.NEXT_PUBLIC_API_URL}/layout-main-cat-pages/1`);
		return {
			props: {
				session,
				homepageData: homepage?.data,
			},
		};
	} catch (e) {
		return {
			props: {
				session,
				homepageData: null
			},
		};
	}
};

export default AllCategories;
