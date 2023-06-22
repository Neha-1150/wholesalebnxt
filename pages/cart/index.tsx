import * as React from 'react';
import axios from 'axios';
import Link from 'next/link';
import toast from 'react-hot-toast';
import { useTheme } from 'next-themes';
import { getSession } from 'next-auth/client';
import { useRouter } from 'next/router';
import { useDispatch, useSelector, RootStateOrAny } from 'react-redux';
import Topbar from '../../components/app/common/Topbar';
import Navbar from '../../components/app/common/Navbar2';
import CartLineItem from '../../components/app/cart/CartLineItem';
import withFullLoader from '../../hocs/withFullLoader';
import { VscTriangleRight } from 'react-icons/vsc';
import { toINR, calculateTotal } from '../../utilities';
import { SET_CART_ID, CLEAR_CART } from '../../store/actions';
import { useEffect } from 'react';
import ReactGA from 'react-ga4';

const CartPage = ({ setLoading }) => {
	const dispatch = useDispatch();
	const cartIdRedux = useSelector((state: RootStateOrAny) => state.cartId);
	const lineItems = useSelector((state: RootStateOrAny) => state.lineItems);
	const router = useRouter();
	const { theme }: any = useTheme;

	const clearCart = () => {
		dispatch({ type: CLEAR_CART });
		toast.success(`Cart cleared!`);
	};

	useEffect(() => {
		ReactGA.send({ hitType: 'pageview', page: '/cart' });
		global.analytics.page('cart', {
			cartId: cartIdRedux || null,
			cartTotal: calculateTotal(lineItems),
			lineItems: lineItems,
			totalLineItemsInCart: lineItems.length,
		});

		global.analytics.track("Cart Viewed", {
			cartId: cartIdRedux || null,
			cartTotal: calculateTotal(lineItems),
			lineItems: lineItems.map(li => ({ ...li, itemId: li?.id })),
			totalLineItemsInCart: lineItems.length
		})

	}, [])

	const initializeOrder = async () => {
		const session = await getSession();
		if (session) {

			if(session?.user?.defaultCity != 'Kochi'){
				try {
					setLoading(true);
					const resCart = await axios.post(
						`${process.env.NEXT_PUBLIC_API_URL}/updateCartv3`,
						{
							lineItems: lineItems.map(item => {
								return { productId: item?.product?._id, qty: item?.quantity, selectedAddOns: item?.selectedAddOns };
							}),
							cartId: cartIdRedux || null,
						},
						{
							headers: {
								Authorization: `Bearer ${session?.jwt}`,
							},
						}
					);
					if (resCart?.status === 200) {
						const res = await axios.get(`${process.env.NEXT_PUBLIC_API_URL}/getCartByCartId/${resCart?.data?.cartId}`, {
							headers: {
								Authorization: 'Bearer ' + session.jwt,
							},
						});
						if (res.status === 200) {
							setLoading(false);
							dispatch({
								type: SET_CART_ID,
								payload: {
									cartId: res?.data?.cartId,
								},
							});
							router.push(`/delivery/${res?.data?.cartId}`);
						} else {
							setLoading(false);
						}
					}
				} catch (err) {
					console.error(err);
					toast.error(`Something went wrong.`, {
						style: {
							fontSize: '12px',
							borderRadius: '5px',
							background: theme === 'light' ? '#f7f7f7' : '#1e1e1e',
							color: theme === 'light' ? '#1e1e1e' : '#f7f7f7',
						},
					});
					setLoading(false);
				}
			}else{
				toast.error('We have not started our operations in Kochi yet. Stay Tuned for updates')
			}
		} else {
			const url = process.env.NEXT_PUBLIC_URL + '/cart';
			toast.error(`Please login first.`, {
				style: {
					fontSize: '12px',
					borderRadius: '5px',
					background: theme === 'light' ? '#f7f7f7' : '#1e1e1e',
					color: theme === 'light' ? '#1e1e1e' : '#f7f7f7',
				},
			});
			router.replace(`/login?redirect=${encodeURIComponent(url)}`);
			setLoading(false);
		}
	};

	return (
		<>
			<Topbar />
			<main className="relative w-screen h-auto pt-10 pb-24">
				{lineItems?.length > 0 ? (
					<div className="">
						{/* info */}
						<div className="relative flex items-center justify-between px-4 mt-3">
							<div className="absolute font-extrabold -translate-x-1/2 -translate-y-1/2 top-1/2 left-1/2">Your cart</div>
							<div className="mt-1 text-sm">{lineItems?.length > 1 ? `${lineItems?.length} items` : `1 item`}</div>
							<div>
								<button
									className="flex items-center justify-center py-3 pl-5 text-xs font-semibold tracking-wider text-red-500 uppercase rounded-lg gap-x-1 dark:bg-red-800/30 dark:text-red-300"
									onClick={() => clearCart()}>
									Clear
								</button>
							</div>
						</div>

						<div className="flex flex-col mt-4 space-y-3 px-3">
							{lineItems?.filter(item => item.trackInventory).map((item, index) => (
								<CartLineItem key={index} item={item} />
							))}
						</div>

						{lineItems?.filter(item => !item.trackInventory).length > 0 && (
						<div className="text-[12px] flex p-3 py-4 items-center text-green-700 font-semibold bg-[#f9f9f9] mt-5">
							<svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="green">
								<path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
							</svg>
							<div>Below products are only available if they are confirmed by the seller</div>
						</div>)}

						<div className="flex flex-col pb-20 space-y-3 px-3">
							{lineItems?.filter(item => !item.trackInventory).map((item, index) => (
								<CartLineItem key={index} item={item} />
							))}
						</div>

					</div>
				) : (
					<div className="flex flex-col items-center justify-center pt-20 gap-y-4">
						<p>Your cart is empty.</p>
						<Link href="/">
							<a className="underline text-brand-500">Shop now</a>
						</Link>
					</div>
				)}
				<div className="fixed bottom-[4.2rem] w-full p-4 nav-blur dark:nav-blur-dark ">
					{lineItems?.length > 0 && (
						<button
							className="flex items-center justify-between w-full p-4 text-white rounded-lg shadow-xl bg-gradient-to-br from-rose-500 to-orange-500"
							onClick={() => initializeOrder()}>
							<div className="flex flex-col">
								<div className="font-semibold text-left">{toINR(calculateTotal(lineItems))}</div>
								<div className="text-sm text-left">{lineItems?.length > 1 ? `${lineItems?.length} items` : `1 item`}</div>
							</div>
							<div className="flex items-center text-lg">
								<span>Place Order</span>
								<VscTriangleRight className="w-4 h-4 ml-1 animate-pulse" />
							</div>
						</button>
					)}
				</div>
			</main>
			<Navbar />
		</>
	);
};

export const getServerSideProps = async ctx => {
	const session = await getSession(ctx);

	if (!session) {
		return {
			redirect: {
				destination: '/login',
				permanent: false,
			},
		};
	}

	return { props: {} };
};

export default withFullLoader(CartPage);
