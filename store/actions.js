// Action types
export const ADD_TO_CART = 'ADD_TO_CART';
export const REMOVE_FROM_CART = 'REMOVE_FROM_CART';
export const UPDATE_CART = 'UPDATE_CART';
export const CLEAR_CART = 'CLEAR_CART';
export const SET_CART_ID = 'SET_CART_ID';
export const SET_RECENTLY_VIEWED = 'SET_RECENTLY_VIEWED';

// Actions
export const updateCart = (product, updatedQuantity) => ({
	type: UPDATE_CART,
	payload: {
		product,
		updatedQuantity,
	},
});

export const removeFromCart = productId => ({
	type: REMOVE_FROM_CART,
	payload: {
		productId,
	},
});

export const clearCart = () => ({
	type: CLEAR_CART,
	payload: {},
});

export const setCartId = () => ({
	type: SET_CART_ID,
	payload: {
		cartId,
	},
});
