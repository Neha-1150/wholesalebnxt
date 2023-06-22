import { useState } from 'react';
import Lottie from 'lottie-react';
import loaderFile from '../public/assets/animations/loader.json';
import styles from '../styles/loader-hoc.module.css';

export default function withLoader(WrappedComponent) {
	return function WrapperComponent(props) {
		const [isLoading, setIsLoading] = useState(false);

		const setLoadingState = loadingState => {
			setIsLoading(loadingState);
		};

		return (
			<>
				<WrappedComponent {...props} setLoadingState={setLoadingState} />
				{isLoading && (
					<div className={styles.loaderWrapper}>
						<Lottie animationData={loaderFile} className={styles.loader} />
					</div>
				)}
			</>
		);
	};
}
