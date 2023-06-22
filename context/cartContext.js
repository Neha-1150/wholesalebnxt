import { createContext, useContext, useState, useEffect } from 'react';
import axios from 'axios';
import { getSession } from 'next-auth/client';
import store from 'store';

const CartContext = createContext();

export function CartContextWrapper({ children }) {
	const [cart, setCart] = useState({ lineItems: [] });

	const getRequestForCart = async cartId => {
		const session = await getSession();
		try {
			const res = await axios.get(`${process.env.NEXT_PUBLIC_API_URL}/getCartByCartId/${cartId}`, {
				headers: {
					Authorization: `Bearer ${session?.jwt}`,
				},
			});
			if (res?.status === 200) {
				store.set('cartId', res?.data?.cartId);
				return res?.data;
			} else {
				return false;
			}
		} catch (error) {
			console.error(error);
			return false;
		}
	};

	useEffect(async () => {
		const cartIdLocal = store.get('cartId');
		if (cartIdLocal) {
			const cartData = await getRequestForCart(cartIdLocal);
			setCart({
				...cartData,
				lineItems: cartData?.lineItems?.map(item => {
					return { ...item, id: item?.productId, qty: item?.quantity };
				}),
				cartId: cartData?.cartId,
			});
		}
	}, []);

	const updateRequestForCart = async (lineItems, cartId) => {
		const session = await getSession();
		try {
			const res = await axios.post(
				`${process.env.NEXT_PUBLIC_API_URL}/updateCartWnxt`,
				{ lineItems, cartId: cartId ? cartId : null },
				{
					headers: {
						Authorization: `Bearer ${session?.jwt}`,
					},
				}
			);
			if (res?.status === 200) {
				store.set('cartId', res?.data?.cartId);
				return res;
			} else {
				return false;
			}
		} catch (error) {
			console.error(error);
			return false;
		}
	};

	const getQtyFromCart = productId => {
		return cart?.lineItems?.find(item => item.productId === productId)?.qty;
	};

	const updateInCart = async ({ productId, qty }, cb) => {
		const tempCartLineItem = cart.lineItems.map(l => ({ productId: l.productId, qty: l.qty }));

		const itemIndex = tempCartLineItem.findIndex(f => f.productId == productId);

		if (itemIndex > -1) {
			tempCartLineItem[itemIndex] = { productId, qty };
		} else {
			tempCartLineItem.push({ productId, qty });
		}

		const resQuery = await updateRequestForCart(tempCartLineItem, cart?.cartId);

		if (resQuery && resQuery?.data?.lineItems && resQuery?.data?.cartId) {
			setCart({
				...resQuery?.data,
				lineItems: resQuery?.data?.lineItems?.map(item => {
					return { ...item, productId: item?.productId, qty: item?.quantity };
				}),
				cartId: resQuery?.data?.cartId,
			});
			if (cb) {
				setTimeout(() => {
					cb();
				}, 100);
			}
		}
	};

	const deleteFromCart = async productId => {
		let updateLineItems = [...cart.lineItems].filter(l => l.productId != productId).map(l => ({ productId: l.productId, qty: l.qty }));
		const resQuery = await updateRequestForCart(updateLineItems, cart?.cartId);
		if (resQuery?.status === 200) {
			if (resQuery?.data?.deleted) {
				store.remove('cartId');
				setCart({ lineItems: [] });
			} else if (resQuery && resQuery?.data?.lineItems && resQuery?.data?.cartId) {
				setCart({
					...resQuery?.data,
					lineItems: resQuery?.data?.lineItems?.map(item => {
						return { ...item, productId: item?.productId, qty: item?.quantity };
					}),
					cartId: resQuery?.data?.cartId,
				});
			}
		}
	};

	return <CartContext.Provider value={{ cart, getQtyFromCart, updateInCart, deleteFromCart }}>{children}</CartContext.Provider>;
}

export function useCartContext() {
	return useContext(CartContext);
}
