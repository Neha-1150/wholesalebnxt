import Link from 'next/link';
import { ShoppingCartIcon } from '@heroicons/react/outline';
import { useSelector, RootStateOrAny } from 'react-redux';
import { calculateTotal, classNames, toINR } from '../../../utilities';
import { ChevronRightIcon } from '@heroicons/react/solid';

const ContinueToCart = ({ positionClass, className }) => {
	const lineItems = useSelector((state: RootStateOrAny) => state.lineItems);

	if (lineItems.length === 0) return null;
	return (
		<div className={classNames('fixed w-full text-sm p-2', positionClass ?? 'bottom-[75px]', className)}>
			<Link href="/cart">
				<a className="flex items-center justify-between w-full px-3 py-2 text-white  bg-brand-600 rounded-md">
					<div className="flex items-center">
						<ShoppingCartIcon className="w-4 h-4 mr-2" />
						{lineItems?.length}&nbsp;items&nbsp;•&nbsp;<strong>{toINR(calculateTotal(lineItems))}</strong>
					</div>
					<div className="flex items-center font-semibold">
						view cart <ChevronRightIcon className="w-4 h-4 ml-2" />
					</div>
				</a>
			</Link>
		</div>
	);
};

export default ContinueToCart;
