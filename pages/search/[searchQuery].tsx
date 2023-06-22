import * as React from 'react';
import { useEffect, useState, useRef } from 'react';
import { InstantSearch, Configure, connectStateResults, connectStats } from 'react-instantsearch-dom';
import algoliasearch from 'algoliasearch/lite';
import { Stats, Hits } from 'react-instantsearch-dom';
import withAuth from '../../hocs/withAuth';
import withFullLoader from '../../hocs/withFullLoader';
import SearchInput from '../../components/app/common/SearchInput2';
import Link from 'next/link';
import LogoFullBnxt from '../../components/app/common/LogoFullBnxt';
import { CustomHits, InfiniteHits } from '../../components/app/algoliaComponents/customHits';
import BackWithSearchLayout from '../../components/app/layouts/BackWithSearchLayout';
import ContinueToCart from '../../components/app/cart/ContinueToCart';
import { getSession, useSession } from 'next-auth/client';
import ReactGA from "react-ga4";

const searchClient = algoliasearch('VXW45ZDJ47', '572f7e88a23ef3085da1914f70f83526');

const SearchHome = ({ searchQuery, session, filters }) => {

	useEffect(() => {
		ReactGA.send({ hitType: "pageview", page: "/search" });
		global.analytics.page('searchResults');
		global.analytics.track('Product List Viewed', {
			listName: decodeURIComponent(searchQuery),
		});

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
									No results have been found for <span className="capitalize">{searchQuery}</span>.
								</h1>
								<div className="mt-6">
									<a href="/" className="text-base font-medium text-indigo-600 hover:text-indigo-500">
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
			<InstantSearch indexName="bnxtRetail2" searchClient={searchClient}>
				<Configure hitsPerPage={8} query={searchQuery} filters={`serviceable_cities: ${session?.user?.defaultCity} AND businessCategory: ${session?.user?.businessCategory} AND isAddOn : false  ${filters ? 'AND ' + filters : ''}`} enablePersonalization={true}/>
				<BackWithSearchLayout className="relative w-screen" backTitle={`results for ${searchQuery}`}>
					<Results>
						<Stats className="text-sm text-gray-900 dark:text-darkColor-300" />
						<InfiniteHits />
					</Results>
					<ContinueToCart positionClass={" "} className={" "}/>
				</BackWithSearchLayout>
			</InstantSearch>
		</div>
	);
};

export default withAuth(withFullLoader(SearchHome));

export async function getServerSideProps(ctx) {
	const { searchQuery } = ctx.params;
	const { filters } = ctx.query;

	const session = await getSession(ctx);
	return {
		props: { searchQuery, session, filters: filters ? filters : null },
	};
}