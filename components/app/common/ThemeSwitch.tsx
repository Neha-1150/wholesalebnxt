import { useEffect, useState } from 'react';
import store from 'store';
import { useTheme } from 'next-themes';
import { Switch } from '@headlessui/react';
import { classNames } from '../../../utilities';

const ThemeSwitch = () => {
	const { theme, setTheme } = useTheme();
	const [mounted, setMounted] = useState(false);

	// When mounted on client, now we can show the UI
	useEffect(() => {
		setMounted(true);
		const gotTheme = store.get('theme');
		if (gotTheme === 'light' || gotTheme === 'dark') {
		} else {
			setTheme('light');
		}
	}, []);

	if (!mounted) return null;

	return (
		<Switch
			value={theme}
			onChange={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
			className={classNames(
				theme === 'dark' ? 'bg-brand-600' : 'bg-gray-200',
				'relative inline-flex flex-shrink-0 h-6 w-11 border-2 border-transparent mr-3 rounded-full cursor-pointer transition-colors ease-in-out duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-brand-500 dark:focus:ring-offset-0'
			)}>
			<span className="sr-only">Toggle Dark Theme</span>
			<span
				className={classNames(
					theme === 'dark' ? 'translate-x-5' : 'translate-x-0',
					'pointer-events-none relative inline-block h-5 w-5 rounded-full dark:bg-darkColor-800 bg-white shadow transform ring-0 transition ease-in-out duration-200'
				)}>
				<span
					className={classNames(
						theme === 'dark' ? 'opacity-0 ease-out duration-100' : 'opacity-100 ease-in duration-200',
						'absolute inset-0 h-full w-full flex items-center justify-center transition-opacity'
					)}
					aria-hidden="true">
					<svg
						className="w-3 h-3 text-yellow-400"
						xmlns="http://www.w3.org/2000/svg"
						width="24"
						height="24"
						viewBox="0 0 24 24"
						fill="none"
						stroke="currentColor"
						strokeWidth="2"
						strokeLinecap="round"
						strokeLinejoin="round">
						<circle cx="12" cy="12" r="5"></circle>
						<line x1="12" y1="1" x2="12" y2="3"></line>
						<line x1="12" y1="21" x2="12" y2="23"></line>
						<line x1="4.22" y1="4.22" x2="5.64" y2="5.64"></line>
						<line x1="18.36" y1="18.36" x2="19.78" y2="19.78"></line>
						<line x1="1" y1="12" x2="3" y2="12"></line>
						<line x1="21" y1="12" x2="23" y2="12"></line>
						<line x1="4.22" y1="19.78" x2="5.64" y2="18.36"></line>
						<line x1="18.36" y1="5.64" x2="19.78" y2="4.22"></line>
					</svg>
				</span>
				<span
					className={classNames(
						theme === 'dark' ? 'opacity-100 ease-in duration-200' : 'opacity-0 ease-out duration-100',
						'absolute inset-0 h-full w-full flex items-center justify-center transition-opacity'
					)}
					aria-hidden="true">
					<svg
						className="w-3 h-3 text-yellow-300"
						xmlns="http://www.w3.org/2000/svg"
						width="24"
						height="24"
						viewBox="0 0 24 24"
						fill="currentColor"
						stroke="currentColor"
						strokeWidth="2"
						strokeLinecap="round"
						strokeLinejoin="round">
						<path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"></path>
					</svg>
				</span>
			</span>
		</Switch>
	);
};

export default ThemeSwitch;
