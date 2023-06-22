import Link from 'next/link';
import { Splide, SplideSlide } from '@splidejs/react-splide';

const Banner = ({ banner }) => {
	return (
		<Link href={banner.url}>
			<a>
				<img src={banner?.imgUrl} alt={`image`} />
			</a>
		</Link>
	);
};

const Carousel = ({ banners }) => {
	return (
		<div>
			<Splide
				options={{
					type: 'loop',
					rewind: true,
					gap: '0.75rem',
					autoplay: true,
					interval: 2000,
					arrows: false,
					pagination: 'slider',
				}}>
				{banners?.map((banner, i) => {
					return (
						<SplideSlide key={i}>
							<Banner banner={banner} />
						</SplideSlide>
					);
				})}
			</Splide>
		</div>
	);
};

export default Carousel;
