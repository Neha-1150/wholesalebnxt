import { useState, useEffect, useCallback } from 'react';
import { useTheme } from 'next-themes';
import toast from 'react-hot-toast';
import _ from 'lodash';
import { useSelector, useDispatch, RootStateOrAny } from 'react-redux';
import { getQtyByProductId } from '../../../utilities';
import { REMOVE_FROM_CART } from '../../../store/actions';
import { useSession } from 'next-auth/client';

// Integer quantity input
const QtyInput = ({ step = 100, min = 500, max = 50000, product, addOns, cb }) => {
	const dispatch = useDispatch();
	const lineItems = useSelector((state: RootStateOrAny) => state.lineItems);

	const { theme } = useTheme();
	const [cartLoader, setCartLoader] = useState(false);
	const [itemQty, setItemQty] = useState(getQtyByProductId(lineItems, product?.id, product?.moq));

	useEffect(() => {
		setItemQty(getQtyByProductId(lineItems, product?.id, product?.moq));
		setCartLoader(false);
	}, [lineItems]);

	const updateGlobalCart = useCallback(
		_.throttle(
			(v, updateType) => {
				setCartLoader(true);
				dispatch({
					type: 'UPDATE_CART',
					payload: {
						product,
						updatedQuantity: v,
						updateType,
						selectedAddOns: addOns
					},
				});
				cb && cb(v)
			},
			800,
			{ leading: false, trailing: true, maxWait: 800 }
		),
		[]
	);

	let superProducts = [];

	const increment = e => {
		e.stopPropagation();
		if(product.trackInventory && product.status != 'outOfStock' && product.inventory > 0){
			if(itemQty+step <= product.inventory){
				if (itemQty < max) {
					setItemQty(itemQty + step);
					updateGlobalCart(itemQty + step, 'add');
				} else {
					setItemQty(max);
					updateGlobalCart(max);
				}
			}else{
				console.log("Inventory not availabe");
			}
		}else{
			if (itemQty < max) {
				setItemQty(itemQty + step);
				updateGlobalCart(itemQty + step, 'add');
			} else {
				setItemQty(max);
				updateGlobalCart(max);
			}
		}
	};

	const decrement = e => {
		e.stopPropagation();
		if (itemQty > min) {
			setItemQty(itemQty - step);
			updateGlobalCart(itemQty - step, 'subtract');
		} else {
			setItemQty(min);
			updateGlobalCart(min);
		}
	};

	const removeFromCartHandler = e => {
		e.stopPropagation();
		dispatch({
			type: REMOVE_FROM_CART,
			payload: {
				productId: product?.id,
				product: product,
			},
		});
		toast.success(`${product?.title} removed from cart`);
	};

	return (
		<div className="relative border rounded-full z-0 m-0 border-green-700 border-2">
			<button
				disabled={cartLoader}
				className="absolute left-1 inset-y-0 w-auto px-2 text-lg font-extrabold text-green-700 rounded-l-full"
				type="button"
				onClick={e => (itemQty > min ? decrement(e) : removeFromCartHandler(e))}>
				-
			</button>

			{cartLoader ? (
				<CartLoader />
			) : (
				<div className="flex items-center justify-center px-1 py-1 mx-3 my-0 font-semibold text-green-700 text-center border-transparent border-box dark:bg-transparent focus:outline-none focus:ring-0">
					{itemQty}
				</div>
			)}

			<button
				disabled={cartLoader}
				className="absolute right-1 inset-y-0 w-auto px-2 text-lg font-extrabold text-green-700 rounded-r-full"
				type="button"
				onClick={e => increment(e)}>
				+
			</button>
		</div>
	);
};

const CartLoader = () => (
	<>
		<div className="flex justify-center w-20 px-3 py-2 mx-5 my-0 align-center">
			<span
				style={{
					width: '20px',
					height: '20px',
					border: '5px solid #164E63',
					borderBottomColor: '#22d3ee',
					borderRadius: '50%',
					display: 'inline-block',
					boxSizing: 'border-box',
					animation: 'rotation 1s linear infinite',
				}}
			/>
		</div>
	</>
);

export default QtyInput;
