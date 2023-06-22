import { useRef, useEffect } from 'react';
import { InstantSearch, Configure, connectStateResults, connectStats } from 'react-instantsearch-dom';
import algoliasearch from 'algoliasearch/lite';
import withAuth from '../../hocs/withAuth';
import withFullLoader from '../../hocs/withFullLoader';
import { getSession, useSession } from 'next-auth/client';
import { capitalize } from 'lodash';
import { InfiniteHits } from '../../components/app/algoliaComponents/customHits';
import ContinueToCart from '../../components/app/cart/ContinueToCart';
import BackWithSearchLayout from '../../components/app/layouts/BackWithSearchLayout';
import ReactGA from "react-ga4";

const searchClient = algoliasearch('VXW45ZDJ47', '572f7e88a23ef3085da1914f70f83526');

const CollectionListingPage = ({ collectionName, session }) => {
	collectionName = decodeURIComponent(collectionName);

	useEffect(() => {
		ReactGA.send({ hitType: "pageview", page: "/collection/"+decodeURIComponent(collectionName) });
		global.analytics.page('collection');
	}, [])

	const Results = connectStateResults(({ searchState, searchResults, children }) =>
		searchResults && searchResults.nbHits !== 0 ? (
			children
		) : (
			<>
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
			</>
		)
	);

	const Stats = connectStats(({ nbHits, processingTimeMS }) => (
		<div className="flex items-center justify-between m-2">
			<p className="">
				Found {nbHits} {nbHits == 1 ? 'Product' : 'Products'} in {processingTimeMS} ms
			</p>
		</div>
	));

	return (
		<div>
			<InstantSearch indexName="bnxtRetail" searchClient={searchClient}>
				<Configure
					clickAnalytics
					hitsPerPage={8}
					enablePersonalization={true}
					filters={collectionName?.toLowerCase() === 'all' ? `` : `wnxt_collections: '${collectionName}' AND serviceable_cities: ${session?.user?.defaultCity} AND businessCategory: ${session?.user?.businessCategory}`}
				/>

				<BackWithSearchLayout className="relative w-screen" backTitle={capitalize(collectionName)}>
					<Results>
						<Stats className="text-sm text-gray-900 dark:text-darkColor-300" />
						<InfiniteHits page="category" />
					</Results>
					<ContinueToCart className={" "} positionClass="bottom-[20px]" />
				</BackWithSearchLayout>
			</InstantSearch>
		</div>
	);
};

export default withAuth(withFullLoader(CollectionListingPage));

export async function getServerSideProps(ctx) {
	const { collectionName } = ctx.params;
	const session = await getSession(ctx);
	return {
		props: { collectionName, session },
	};
}
