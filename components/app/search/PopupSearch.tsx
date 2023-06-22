import * as React from 'react';
import Link from 'next/link';
import algoliasearch from 'algoliasearch/lite';
import { useEffect, useState, useRef } from 'react';
import { useSession } from 'next-auth/client';
import { useRouter } from 'next/dist/client/router';
import { getAlgoliaResults } from '@algolia/autocomplete-preset-algolia';
import { createAutocomplete } from '@algolia/autocomplete-core';
import { createAlgoliaInsightsPlugin } from '@algolia/autocomplete-plugin-algolia-insights';
import { createLocalStorageRecentSearchesPlugin } from '@algolia/autocomplete-plugin-recent-searches';
import insightsClient from 'search-insights';

// const appId = '60XEHN28WM';
const appId = 'VXW45ZDJ47';
// const apiKey = '290b0df6a18d414d97d3e2af7ca62495';
const apiKey = '572f7e88a23ef3085da1914f70f83526';
const searchClient = algoliasearch(appId, apiKey);

insightsClient('init', { appId, apiKey, useCookie: true });
const algoliaInsightsPlugin = createAlgoliaInsightsPlugin({ insightsClient });

export default function SearchBox({ mobileSearchboxOpen, setMobileSearchboxOpen }) {
	const router = useRouter();
	const [closeSearch, setcloseSearch] = useState(mobileSearchboxOpen);
	const [autocompleteState, setAutocompleteState] = React.useState({});
	const [session] = useSession();
	const cityRef = useRef(null);
	const businessCategoryRef = useRef(null);

	const recentSearchesPlugin = createLocalStorageRecentSearchesPlugin({
		key: 'RECENT_SEARCH',
		limit: 3,
	});

	useEffect(() => {
		console.log(session);
		if (session?.user?.defaultCity) {
			cityRef.current = session?.user?.defaultCity;
			businessCategoryRef.current = session?.user?.businessCategory;
		}
	}, [session]);

	const setSearchTo = (query, __autocomplete_indexName, __autocomplete_queryID, item) => {

		if(item && item.id){
			global.analytics.track('Products Searched', {
				itemId: item.id,
				...item
			});
		}
		
		// console.log(`/search/${encodeURIComponent(query)}?__queryId=${encodeURIComponent(__autocomplete_queryID)}&__indexName=${encodeURIComponent(__autocomplete_indexName)}`);

		if (query && query.length > 0) {
			router.push(
				`/search/${encodeURIComponent(query)}?__queryId=${encodeURIComponent(__autocomplete_queryID)}&__indexName=${encodeURIComponent(
					__autocomplete_indexName
				)}`
			);
			setTimeout(() => {
				setMobileSearchboxOpen(false);
			}, 500);
		}
	};

	const autocomplete = React.useMemo(
		() =>
			createAutocomplete({
				onStateChange({ state }) {
					setAutocompleteState(state);
				},
				openOnFocus: true,
				getSources() {
					return [
						{
							sourceId: 'products',
							getItemInputValue({ item }) {
								return item.query;
							},
							getItems({ query }) {
								return getAlgoliaResults({
									searchClient,
									queries: [
										{
											indexName: 'bnxtRetail2_query_suggestions',
											query,
											params: {
												hitsPerPage: 4,
												highlightPreTag: "<span style='font-weight: 200'>",
												highlightPostTag: '</span>',
												clickAnalytics: true,
												enablePersonalization: true,
												userToken: session?.user?.id,
											},
										},
										{
											indexName: 'bnxtRetail2',
											query,
											params: {
												filters: `serviceable_cities: ${cityRef.current} AND businessCategory: ${businessCategoryRef.current} AND isAddOn : false`,
												hitsPerPage: 7,
												highlightPreTag: '<mark>',
												highlightPostTag: '</mark>',
												clickAnalytics: true,
												enablePersonalization: true,
												userToken: session?.user?.id,
											},
										},
									],
								});
							},

							getItemUrl({ item }) {
								return item.url;
							},
						},
					];
				},
				plugins: [recentSearchesPlugin, algoliaInsightsPlugin],
			}),
		[]
	);

	const inputRef = React.useRef(null);
	const formRef = React.useRef(null);
	const panelRef = React.useRef(null);

	const { getEnvironmentProps } = autocomplete;

	React.useEffect(() => {
		if (!(formRef.current && panelRef.current && inputRef.current)) {
			return;
		}

		const { onTouchStart, onTouchMove } = getEnvironmentProps({
			formElement: formRef.current,
			panelElement: panelRef.current,
			inputElement: inputRef.current,
		});

		window.addEventListener('touchstart', onTouchStart);
		window.addEventListener('touchmove', onTouchMove);

		return () => {
			window.removeEventListener('touchstart', onTouchStart);
			window.removeEventListener('touchmove', onTouchMove);
		};
	}, [getEnvironmentProps, formRef, panelRef, inputRef]);

	return (
		<div className="aa-Autocomplete" {...autocomplete.getRootProps({})}>
			<form
				ref={formRef}
				className="aa-Form"
				{...autocomplete.getFormProps({ inputElement: inputRef.current })}
				onSubmit={e => {
					e.preventDefault();
					setSearchTo(inputRef.current.value);
				}}>
				<div className="fixed top-0 left-0 z-20 flex items-center w-full px-4 py-4 dark:bg-darkColor-900 bg-gray-50">
					<button className="mr-3" type="submit">
						<svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
							<path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
						</svg>
					</button>

					<label name="search" className="sr-only aa-Label" {...autocomplete.getLabelProps({})}>
						Search
					</label>
					<input
						ref={inputRef}
						{...autocomplete.getInputProps({})}
						id="search"
						name="search"
						autoComplete="off"
						className="w-full py-2 text-sm placeholder-gray-500 bg-white border border-gray-300 rounded-md dark:placeholder-coolGray-400 dark:bg-darkColor-900 focus:outline-none focus:text-gray-900 focus:placeholder-gray-400 focus:ring-1 focus:ring-transparent focus:border-transparent sm:text-sm dark:border-none dark:focus:text-coolGray-100"
						placeholder="Search"
						type="search"
						autoFocus
					/>
					<button type="button" onClick={() => setMobileSearchboxOpen(false)}>
						<svg xmlns="http://www.w3.org/2000/svg" className="w-6 h-6 ml-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
							<path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
						</svg>
					</button>
				</div>
				<div>
					<div className="aa-Panel" {...autocomplete.getPanelProps({})}>
						{autocompleteState &&
							autocompleteState.collections &&
							autocompleteState.collections.map((collection, index) => {
								const { source, items } = collection;
								return (
									<ul
										key={`source-${index}`}
										className="fixed top-0 left-0 z-10 w-full h-full pt-16 bg-white rounded-md dark:bg-coolGray-800 dark:shadow-md drop-shadow">
										{items.map((item, index) => {
											if (item.__autocomplete_indexName === 'bnxtRetail2_query_suggestions') {
												return (
													<li key={item.id} className="flex items-center justify-between px-4 py-4 cursor-pointer">
														<div
															className="flex items-center justify-between"
															onClick={() => {
																setSearchTo(item.query, item.__autocomplete_indexName, item.__autocomplete_queryID);
															}}>
															<div>
																<svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
																	<path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
																</svg>
															</div>
															<div
																className="ml-6"
																dangerouslySetInnerHTML={{
																	__html: item._highlightResult.query.value,
																}}
															/>
														</div>

														<div
															className="rotate-45 cursor-pointer"
															onClick={() => {
																autocomplete.setQuery(item.query);
															}}>
															<svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
																<path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
															</svg>
														</div>
													</li>
												);
											} else if (source.sourceId == 'recentSearchesPlugin') {
												return (
													<li key={item.id} className="flex items-center justify-between px-4 py-4">
														<div
															className="flex items-center justify-between"
															onClick={() => {
																setSearchTo(item.title, item.__autocomplete_indexName, item.__autocomplete_queryID);
															}}>
															<div>
																<svg width="20" height="20" viewBox="0 0 20 20">
																	<g stroke="currentColor" strokeWidth="2" fill="none" fillRule="evenodd" strokeLinecap="round" strokeLinejoin="round">
																		<path d="M3.18 6.6a8.23 8.23 0 1112.93 9.94h0a8.23 8.23 0 01-11.63 0"></path>
																		<path d="M6.44 7.25H2.55V3.36M10.45 6v5.6M10.45 11.6L13 13"></path>
																	</g>
																</svg>
															</div>
															<div
																className="ml-6"
																dangerouslySetInnerHTML={{
																	__html: item.label,
																}}
															/>
															{/* {item._highlightResult.label.value} */}
															{/* </div> */}
														</div>
														<div
															className="rotate-45"
															onClick={() => {
																autocomplete.setQuery(item.label);
															}}>
															<svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
																<path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
															</svg>
														</div>
													</li>
												);
											} else {
												return (
													<li key={item._id} {...autocomplete.getItemProps({ item, source })}>
														<button
															className="flex px-4 py-5 dark:bg-coolGray-800 dark:text-coolGray-100"
															onClick={() => setSearchTo(item.name, item.__autocomplete_indexName, item.__autocomplete_queryID, item)}>
															<div className="w-10 h-10 rounded-full dark:bg-coolGray-600 dark:text-coolGray-100">
																{item.media ? (
																	<img className="w-10 h-10 rounded-full dark:bg-darkcolor-400 dark:text-coolGray-100" src={item.thumbnail} alt={item.name} />
																) : (
																	<img
																		className="w-10 h-10 rounded-full dark:bg-darkcolor-400 dark:text-coolGray-100"
																		src="https://bnxtcdn.sgp1.digitaloceanspaces.com//bnxt_sm_logo_b31544197d.png"
																		alt={item.name}
																	/>
																)}
															</div>
															<div className="flex flex-col items-start gap-1 ml-3">
																<p className="text-sm font-medium text-left text-gray-900 dark:text-coolGray-100">{item.name}</p>
															</div>
														</button>
													</li>
												);
											}
										})}
									</ul>
								);
							})}
					</div>
				</div>
			</form>
		</div>
	);
}
