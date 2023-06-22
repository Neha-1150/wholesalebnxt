import router from 'next/router';

const RequestBanner = () => {
	return (
		<div className="w-full h-24 p-3 rounded-md shadow-md bg-brand-50 dark:bg-gradient-to-br dark:from-[#0F2027] dark:via-[#203A43] dark:to-[#2C5364]">
			<h4 className="text-lg font-extrabold text-center text-black/70 dark:text-transparent dark:bg-gradient-to-tr dark:from-purple-500 dark:to-orange-500 bg-clip-text">
				Can't find what you're looking for?
			</h4>
			<button
				onClick={() => router.push('/contact')}
				className="w-full mt-3 font-semibold tracking-wide text-center text-black underline uppercase dark:text-brand-200">
				Request a product
			</button>
		</div>
	);
};

export default RequestBanner;
