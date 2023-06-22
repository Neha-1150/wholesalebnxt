// import router from 'next/router';

const ImageBanner = ({ src }) => {
	return (
		<div className="w-full">
			<img src={src} alt="Banner" />
		</div>
	);
};

export default ImageBanner;
