import resolveConfig from 'tailwindcss/resolveConfig';
import tailwindConfig from '../../../tailwind.config.js';

const fullConfig = resolveConfig(tailwindConfig);

const Logo = ({ className }) => {
	return (
		<svg className={className} width="64" height="64" viewBox="0 0 64 64" fill="none" xmlns="http://www.w3.org/2000/svg">
			<rect width="64" height="64" fill="none" />
			<path d="M59 46.6667L32 61V32.3333L59 18V46.6667Z" fill={fullConfig.theme.colors.brand[500]} fillOpacity="0.55" />
			<path d="M32 3V31L59 17L32 3Z" fill={fullConfig.theme.colors.brand[500]} fillOpacity="0.15" />
			<path d="M6 18L32 32.3333V61L6 46.6667V18Z" fill={fullConfig.theme.colors.brand[500]} />
		</svg>
	);
};

export default Logo;
