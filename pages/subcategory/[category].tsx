import * as React from 'react';
import axios from 'axios';
import ReactGA from 'react-ga4';
import { useEffect, useState } from 'react';
import { useLayoutBaker } from '../../hooks/useLayoutBaker';
import Navbar from '../../components/app/common/Navbar2';
import BackWithSearchLayout from '../../components/app/layouts/BackWithSearchLayout';
import { InstantSearch, Configure, connectStateResults, connectStats } from 'react-instantsearch-dom';
import algoliasearch from 'algoliasearch/lite';
import { useSession } from 'next-auth/client';
import { InfiniteHits } from '../../components/app/algoliaComponents/customHits';
import ContinueToCart from '../../components/app/cart/ContinueToCart';
import Skeleton from "react-loading-skeleton";
import "react-loading-skeleton/dist/skeleton.css";

const searchClient = algoliasearch('VXW45ZDJ47', '572f7e88a23ef3085da1914f70f83526');

const SubcategoryPage = ({ subcategory }) => {
	const [collectionName] = useState(subcategory?.catName);
	const { renderedBlock, loading, error } = useLayoutBaker(subcategory?.blocks);
	const [session] = useSession();

	useEffect(() => {
		ReactGA.send({ hitType: 'pageview', page: '/subCategory/' + subcategory.catName });
		global.analytics.page('subCategory');
		global.analytics.track('Product List Viewed', {
			listName: collectionName,
		});
	}, []);

	const Results = connectStateResults(({ searchState, searchResults, children, searching }) => {
		return (
		  <>
			{searchResults && searchResults.nbHits !== 0 ? (
			  children
			) : (
			  <>
				{searching ? (
				  new Array(10).fill(1).map((d) => (
					<div className="mt-3 px-5">
					  <div className="flex w-full">
						<div className="w-32 h-32 mr-2">
						  <Skeleton className="w-32 h-32"/>
						</div>
						<div className="w-full mt-1">
						  <div className="flex flex-col h-full min-w-full mb-2">
							<div className="max-w-[60vw] text-[14px] font-bold leading-snug text-[#595959] dark:text-darkColor-100">
							  <Skeleton />
							</div>
							<div className="max-w-[60vw] text-[14px] font-bold leading-snug text-[#595959] dark:text-darkColor-100">
							  <Skeleton />
							</div>
							<div className="mt-2 max-w-[40vw] text-[14px] font-bold leading-snug text-[#595959] dark:text-darkColor-100">
							  <Skeleton />
							</div>
							<div className="mt-2 max-w-[40vw] text-[14px] font-bold leading-snug text-[#595959] dark:text-darkColor-100">
							  <Skeleton />
							</div>
						  </div>
						</div>
					  </div>
					</div>
				  ))
				) : (
				  <div className="flex flex-col pt-16 pb-12">
					<main className="flex flex-col justify-center flex-grow w-full px-4 py-40 mx-auto max-w-7xl sm:px-6 lg:px-8">
					  <div className="pt-8">
						<div className="text-center">
						  <h1 className="mt-2 text-2xl font-extrabold tracking-tight text-gray-900 sm:text-3xl dark:text-white">
							No results have been found for <span className="capitalize">{collectionName}</span>.
						  </h1>
						  <div className="mt-6">
							<a href="/" className="text-base font-medium text-brand-600 hover:text-brand-500">
							  Go back Home Page<span aria-hidden="true"> &rarr;</span>
							</a>
						  </div>
						</div>
					  </div>
					</main>
				  </div>
				)}
			  </>
			)}
		  </>
		);
	  });

	const Stats = connectStats(({ nbHits, processingTimeMS }) => (
		<div className="flex items-center justify-between m-2">
			<p className="">
				Found {nbHits} {nbHits == 1 ? 'Product' : 'Products'} in {processingTimeMS} ms
			</p>
		</div>
	));

	return (
		<BackWithSearchLayout className={" "} backTitle={subcategory.catName}>
			<div className="">
				{loading ? <div>Loading...</div> : renderedBlock}
				{error ? <div>Error...</div> : null}
			</div>

			<div className="mt-10">
				<InstantSearch indexName="bnxtRetail2" searchClient={searchClient}>
					<Configure
						clickAnalytics
						hitsPerPage={8}
						enablePersonalization={true}
						filters={
							collectionName?.toLowerCase() === 'all'
								? ``
								: `category: '${collectionName?.toLowerCase()}' AND serviceable_cities: ${session?.user?.defaultCity} AND businessCategory: ${session?.user?.businessCategory} AND isAddOn: false`
						}
					/>

					<Results>
						<Stats className="text-sm text-gray-900 dark:text-darkColor-300" />
						<InfiniteHits page="category" />
					</Results>
				</InstantSearch>
			</div>

			<ContinueToCart className={" "} positionClass="bottom-[70px]" />
			<Navbar />
		</BackWithSearchLayout>
	);
};

export const getServerSideProps = async ctx => {
	const { category } = ctx.params;

	try {
		const categories = await axios.get(`${process.env.NEXT_PUBLIC_API_URL}/layout-sub-cat-pages-BySlug/${category}`);
		if (categories.status == 200) {
			return {
				props: {
					subcategory: categories.data,
				},
			};
		}
	} catch (error) {
		return {
			props: {
				subcategory: null,
			},
		};
	}
};

export default SubcategoryPage;
