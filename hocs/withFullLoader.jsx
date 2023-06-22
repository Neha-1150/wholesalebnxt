import { useTheme } from 'next-themes';
import { useState } from 'react';

export default function withFullLoader(WrappedComponent) {
	return function WrapperComponent(props) {
		const { theme } = useTheme();
		const [isLoading, setIsLoading] = useState(false);

		const setLoadingState = loadingState => {
			setIsLoading(loadingState);
		};

		return (
			<>
				<WrappedComponent {...props} setLoading={setLoadingState} />
				{isLoading && (
					<>
						{theme === 'light' ? (
							<div
								className="flex"
								style={{
									height: '100vh',
									width: '100vw',
									position: 'fixed',
									display: 'flex',
									justifyContent: 'center',
									alignItems: 'center',
									left: 0,
									top: 0,
									backgroundColor: '#fff',
									zIndex: 99,
								}}>
								<span
									style={{
										width: '48px',
										height: '48px',
										border: '5px solid #ffdfd3',
										borderBottomColor: '#EC4201',
										borderRadius: '50%',
										display: 'inline-block',
										boxSizing: 'border-box',
										animation: 'rotation 1s linear infinite',
									}}
								/>
							</div>
						) : (
							<div
								className="flex"
								style={{
									height: '100vh',
									width: '100vw',
									position: 'fixed',
									display: 'flex',
									alignItems: 'center',
									justifyContent: 'center',
									left: 0,
									top: 0,
									backgroundColor: 'black',
									zIndex: 99,
								}}>
								<span
									style={{
										width: '48px',
										height: '48px',
										border: '5px solid #290c00',
										borderBottomColor: '#EC4201',
										borderRadius: '50%',
										display: 'inline-block',
										boxSizing: 'border-box',
										animation: 'rotation 1s linear infinite',
									}}
								/>
							</div>
						)}
					</>
				)}
			</>
		);
	};
}
