import ProductCarousel from '../components/app/common/ProductCarousel';
import BackWithSearchLayout from '../components/app/layouts/BackWithSearchLayout';
import { BottomSheet } from 'react-spring-bottom-sheet';
import { useState } from 'react';

const Test = () => {

	const [open, setOpen] = useState(false)

	return (
		<BackWithSearchLayout backTitle={'Test Page'}>

			<button onClick={() => setOpen(true)}>Click</button>

			<BottomSheet open={open} onDismiss={() => setOpen(false)}  snapPoints={({ minHeight }) => minHeight}>
				<div>ecoehviuehviuhviunev</div>
			</BottomSheet>
		</BackWithSearchLayout>
	);
};

export default Test;
