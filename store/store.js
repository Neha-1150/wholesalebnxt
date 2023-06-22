import thunk from 'redux-thunk';
import { createStore, applyMiddleware } from 'redux';
import { composeWithDevTools } from 'redux-devtools-extension';
import { CLEAR_CART, REMOVE_FROM_CART, SET_CART_ID, SET_RECENTLY_VIEWED, UPDATE_CART } from './actions';
import { persistReducer } from 'redux-persist';
import { persistStore } from 'redux-persist';
import storage from 'redux-persist/lib/storage';
import { sanitizeProduct } from '../utilities';
import ReactGA from "react-ga4";
import recombee from 'recombee-js-api-client/src'

const recombeeDb = "bnxt-new";
const recombeeApiKey = "66Aa0NmUR7Ek9vQyaAWN7nKKtfZej93q2B3CMkuniHFEKckeonTpqxkKKtmN08CI";
const recombeeClient = new recombee.ApiClient(recombeeDb, recombeeApiKey, { region: "ca-east" });

const initialState = { lineItems: [], recentlyViewed: [] };

// Reducer for Cart
const cartReducer = (state, action) => {
	switch (action.type) {
		case UPDATE_CART:
			const product = action.payload.product;
			const updatedQuantity = action.payload.updatedQuantity;
			const updateType = action.payload.updateType;
			const session = action.payload?.session;
			const selectedAddOns = action.payload?.selectedAddOns;
			const productRate = action.payload?.productRate;
			const trackInventory = action.payload?.trackInventory || true;

			const newLineItems = state?.lineItems?.length > 0 ? [...state.lineItems] : [];
			const itemIndex = newLineItems.findIndex(f => f.product?._id == product?._id);
			
			if (itemIndex > -1) {
				newLineItems[itemIndex].quantity = updatedQuantity;
				newLineItems[itemIndex].selectedAddOns = selectedAddOns;
				newLineItems[itemIndex].productRate = productRate;
				newLineItems[itemIndex].trackInventory = trackInventory;
			} else {
				newLineItems.push({ product: sanitizeProduct(action?.payload?.product), quantity: updatedQuantity, selectedAddOns, productRate, trackInventory });
			}

			let total = newLineItems.reduce((acc,cur) => {
				if(cur.product.discountedPrice){
					if(selectedAddOns && selectedAddOns.length > 0){
						acc += parseInt(((cur.product.discountedPrice + selectedAddOns.reduce((acc1,cur1) => { acc1 += cur1.rate; return acc1} ,0))*cur.quantity).toFixed(2))
					}else{
						acc += parseInt(((cur.product.discountedPrice)*cur.quantity).toFixed(2))
					}
				}else{
					if(selectedAddOns && selectedAddOns.length > 0){
						acc += parseInt(((cur.product.rate + selectedAddOns.reduce((acc1,cur1) => acc1 += cur1.rate ,0))*cur.quantity).toFixed(2))
					}else{
						acc += parseInt(((cur.productRate)*cur.quantity).toFixed(2))
					}
				}
				return acc
			},0)

			
			if(updateType == 'add'){

				ReactGA.event({
					category: "cart",
					action: "add_to_cart",
					cartId: state.cartId ? state.cartId : 'NA',
					...product,
					quantity: product.MOQ,
					cartTotal: total,
					itemsInCart: newLineItems.length
				});

				global.analytics.track('Product Added', {
					cartId: state.cartId ? state.cartId : 'NA',
					itemId: product.id,
					quantity: product.MOQ,
					cartTotal: total,
					itemsInCart: newLineItems.length
				});

				// session && recombeeClient.send(new recombee.AddCartAddition(session.user.id, product?.id, { cascadeCreate: true } ));
				
			}else{

				ReactGA.event({
					category: "cart",
					action: "remove_from_cart",
					cartId: state.cartId ? state.cartId : 'NA',
					...product,
					quantity: product.MOQ,
					cartTotal: total,
					itemsInCart: newLineItems.length
				});

				global.analytics.track('Product Removed', {
					cartId: state.cartId ? state.cartId : 'NA',
					itemId: product.id,
					quantity: product.MOQ,
					cartTotal: total,
					itemsInCart: newLineItems.length
				});

				
			}


			return {
				...state,
				lineItems: newLineItems,
			};

		case REMOVE_FROM_CART:
			const productId = action.payload.productId;
			const product2 = action.payload.product;
			const newLineItems2 = state?.lineItems?.filter(f => f.product?._id !== productId);

			let total2 = 0
			newLineItems2.map(li => {
				total2 += parseInt(((li.product.discountedPrice && li.product.discountedPrice > 0 ? li.product.discountedPrice : li.product.rate)*li.quantity).toFixed(2))
			})

			// global.analytics.track('Product Removed', {
			// 	cartId: state.cartId ? state.cartId : 'NA',
			// 	itemId: product2._id,
			// 	quantity: product2.MOQ,
			// 	cartTotal: total2,
			// 	itemsInCart: newLineItems2.length
			// });


			return {
				...state,
				lineItems: newLineItems2,
			};

		case CLEAR_CART:

			state.lineItems.map(li => {
				global.analytics.track('Product Removed', {
					cartId: state.cartId ? state.cartId : 'NA',
					...li,
					quantity: li.moq,
					cartTotal: 0,
					itemsInCart: 0
				});
			})

			return {
				lineItems: [],
				cartId: null,
			};

		case SET_CART_ID:
			return {
				...state,
				cartId: action.payload.cartId,
			};

		case SET_RECENTLY_VIEWED:
			console.log(action.payload);
			let newState = []
			let pIndex = state.recentlyViewed.findIndex(p => p.id == action.payload.id);
			if(pIndex > -1){
				newState = [state.recentlyViewed[pIndex], ...state.recentlyViewed.filter((p,i) => i != pIndex)]
			}else{
				newState = [action.payload, ...state.recentlyViewed]
			}
			if(newState.length > 5){
				newState.pop();
			}
			return {
				...state,
				recentlyViewed: newState
			}
		default:
			return state;
	}
};


const persistConfig = {
	keyPrefix: 'wnxt-',
	key: 'cart',
	storage,
};

const middleware = [thunk];

const reduxStore = createStore(persistReducer(persistConfig, cartReducer), initialState, composeWithDevTools(applyMiddleware(...middleware)));

export const persistor = persistStore(reduxStore);

export default reduxStore;
