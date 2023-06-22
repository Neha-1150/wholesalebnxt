import { useRouter } from 'next/dist/client/router';
import Head from 'next/head';

const DEFAULT_DESCRIPTION = `BazaarNXT is thriving to become India’s largest marketplace to offer best quality packaging products to businesses at affordable prices, unique customizations and quicker TATs.`;
const DEFAULT_TITLE = 'BazaarNXT';

const SEO = ({ title = DEFAULT_TITLE, description = DEFAULT_DESCRIPTION, url, imgUrl, imgAlt }) => {
	const { asPath } = useRouter();

	const calcUrl = url ? url : process.env.NEXT_PUBLIC_URL + asPath;
	const calcImgUrl = imgUrl ? imgUrl : `${process.env.NEXT_PUBLIC_URL}/assets/seo/bazaarnxt-seo.png`;

	return (
		<Head>
			<title>{title}</title>
			<meta name="description" content={description} />
			<meta property="og:type" content="website" />
			<meta name="og:title" property="og:title" content={title} />
			<meta name="og:description" property="og:description" content={description} />
			<meta property="og:site_name" content={DEFAULT_TITLE} />
			<meta property="og:url" content={calcUrl} />
			<meta name="twitter:image" content={calcImgUrl} />
			<meta name="twitter:card" content="summary_large_image" />
			<meta name="twitter:image:alt" content={imgAlt ? imgAlt : DEFAULT_DESCRIPTION} />
			<meta name="og:image:alt" content={imgAlt ? imgAlt : DEFAULT_DESCRIPTION} />
			<meta name="twitter:title" content={title} />
			<meta name="twitter:description" content={description} />
			<meta name="twitter:site" content="@BNXTofficial" />
			<meta name="twitter:creator" content="@BNXTofficial" />
			<meta property="og:image" content={calcImgUrl} />
		</Head>
	);
};
export default SEO;
