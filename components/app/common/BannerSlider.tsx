import Link from 'next/link';
import { classNames } from '../../../utilities';

const banners = [
	{
		src: '/assets/banners/banner1.png',
	},
	{
		src: '/assets/banners/banner2.png',
	},
	{
		src: '/assets/banners/banner3.png',
	},
];

const Banner = ({ className, imgUrl, url }) => {
	return (
		<Link href={url}>
			<a className={classNames('relative flex-shrink-0 snap-center max-w-[90vw] overflow-hidden', className)}>
				<img src={imgUrl} alt="Banner" height="500" width="1000" className="w-full h-full " />
			</a>
		</Link>
	);
};

const BannerSlider = ({ className, banners }) => {
	return (
		<div className={classNames('mx-2 w-full flex snap-x gap-x-1 overflow-x-auto scrollbar-hide', className)}>
			{banners.map((item, i) => (
				<Banner key={i} imgUrl={item?.imgUrl} url={item?.url} />
			))}
		</div>
	);
};

export default BannerSlider;
