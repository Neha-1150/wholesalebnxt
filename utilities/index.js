import moment from 'moment';
import NumberFormat from 'react-number-format';

/** Utility to get browser information
 * @return {Object} - `{name, version}`
 **/
export function getBrowserInfo() {
	var ua = navigator?.userAgent,
		tem,
		M = ua.match(/(opera|chrome|safari|firefox|msie|trident(?=\/))\/?\s*(\d+)/i) || [];
	if (/trident/i.test(M[1])) {
		tem = /\brv[ :]+(\d+)/g.exec(ua) || [];
		return { name: 'IE ', version: tem[1] || '' };
	}
	if (M[1] === 'Chrome') {
		tem = ua.match(/\bOPR\/(\d+)/);
		if (tem != null) {
			return { name: 'Opera', version: tem[1] };
		}
	}
	M = M[2] ? [M[1], M[2]] : [navigator.appName, navigator.appVersion, '-?'];
	if ((tem = ua.match(/version\/(\d+)/i)) != null) {
		M.splice(1, 1, tem[1]);
	}
	return {
		name: M[0],
		version: M[1],
	};
}

/** Utility to resolve conditional classes - by TailwindCSS
 * @param {String} classes - Multiple classes
 * @return {Boolean} - Calculated value
 **/
export function classNames(...classes) {
	return classes.filter(Boolean).join(' ');
}

/** Utility to convert usernames into initials
 * @param {String} username - Username
 * @return {String} - Initial(s)
 **/
export function getInitials(name) {
	if (name && name.length > 0) {
		const val = name
			.split(' ')
			.map(n => n[0])
			.join('')
			.toUpperCase()
			.slice(0, 2);
		return val;
	} else {
		return '😄';
	}
}

/**  Date formatter utility
 * @param {Date} d - Date to format
 * @return {String} - Formatted date
 **/
export function formatDate(dateString, time = true) {
	if (time) {
		return moment(dateString).format('Do MMM YY, hh:mm A');
	} else {
		return moment(dateString).format('Do MMM YY');
	}
}

/**  ### DateString expiry checker
 * @param {String} dateString - Date to check in string format
 * @return {Boolean} - Formatter INR amount
 **/
export function isExpired(dateString) {
	return moment(dateString) < moment();
}

/**  ### INR commas formatter utility
 * @param {Float} amount - Amount to format
 * @return {String} - Formatter INR amount
 **/
// export function toINR(a) {
// 	let amount = parseInt(a);
// 	if (amount) {
// 		amount = amount.toFixed(2);
// 		amount = amount.toString();
// 		let afterPoint = '';
// 		if (amount.indexOf('.') > 0) afterPoint = amount.substring(amount.indexOf('.'), amount.length);
// 		amount = Math.floor(amount);
// 		amount = amount.toString();
// 		let lastThree = amount.substring(amount.length - 3);
// 		let otherNumbers = amount.substring(0, amount.length - 3);
// 		if (otherNumbers != '') lastThree = ',' + lastThree;
// 		let res = otherNumbers.replace(/\B(?=(\d{2})+(?!\d))/g, ',') + lastThree + afterPoint;
// 		return `₹${res}`;
// 	} else {
// 		return `₹${0.0}`;
// 	}
// }

export function toINR(a) {
	return <NumberFormat value={a} displayType={'text'} thousandSeparator={true} thousandsGroupStyle="lakh" prefix={'₹'} />;
}

/**  ### Dimensions formatter utility
 * @param {String} dimension - Dimension to format
 * @return {String} - L' ✕ B' ✕ H' formatted
 **/
export function formatDimensions(dimension) {
	// '4’(L) ✕ 4’(B) ✕ 4’(H)'
	// Possible symbols: ✕ X ’ ' " . , (Change accordingly)
	const inchComma = `"`;
	const crossSign = '✕';
	if (dimension && dimension.length > 0) {
		const [l, b, h] = dimension.split(',');
		return `${!isNaN(l) || l === '' ? l : 0}${inchComma}(L) ${crossSign}  ${!isNaN(b) ? b : 0}${inchComma}(B) ${crossSign} ${!isNaN(h) ? h : 0}${inchComma}(H)`;
	} else {
		return `0${inchComma}(L) ${crossSign} 0${inchComma}(B) ${crossSign} 0${inchComma}(H)`;
	}
}

/**  ### Volumetric Weight Calculator
 * @param {Float} l - Length
 * @param {Float} w - Width
 * @param {Float} h - Height
 * @return {String} - kg/m³ formatted
 **/
export function volumetricWeight(l, w, h) {
	const lbs = (l * w * h) / 139;
	const kg = (0.4535924 * lbs).toFixed(2);
	if (isNaN(kg) || kg === 0) {
		return '0.00 kg';
	} else {
		return `~ ${kg} KGs`;
	}
}

/**  ### Extract Dimensions
 * @param {String} dimensionText - Dimension to extract from - Ex: 4’(L) ✕ 4’(B) ✕ 4’(H)
 * @return {Object} - {length, width, height}
 **/
export function extractDimensions(dimensionText) {
	// '4’(L) ✕ 4’(B) ✕ 4’(H)'
	// Possible symbols: ✕ X ’ ' " . , (Change accordingly)
	const inchComma = `"`;
	const crossSign = '✕';
	if (dimensionText && dimensionText.length > 0) {
		const striped = dimensionText?.replace(`${inchComma}(L) ${crossSign} `, ',')?.replace(`${inchComma}(B) ${crossSign} `, ',')?.replace(`${inchComma}(H)`, '');
		const [l, w, h] = striped.split(',');
		return {
			length: parseFloat(l),
			width: parseFloat(w),
			height: parseFloat(h),
		};
	}
}

/**  ### Search String in an Array
 * @param {String} str - String to search
 * @param {Array} strArray - Array to search in
 * @return {Number} - Found on index
 **/
export function searchStringInArray(str, strArray) {
	for (var j = 0; j < strArray?.length; j++) {
		if (strArray[j].match(str)) return j;
	}
	return -1;
}

/**  ### Random ID Generator
 * @return {String} - Random ID
 **/
export function randomIdGen() {
	return Math.random()
		.toString(36)
		.replace(/[^a-z]+/g, '')
		.substr(2, 10);
}

/**  ### String truncator
 * @param {String} str - String to truncate
 * @param {Number} len - Length to check
 * @return {String} - Truncated String
 **/
export function truncateLength(str, len) {
	if (str?.length > len) {
		return str.slice(0, len) + '...';
	} else {
		return str;
	}
}

/**  ### Transform dimensions for API
 * @param {String} dimString - '4’(L) ✕ 4’(B) ✕ 4’(H)'
 * @return {String} - 4X4X4
 **/
export function transformDimensions(dimString) {
	const { length, width, height } = extractDimensions(dimString);
	return `${length}X${width}X${height}`;
}

export function toCamelCase(str) {
	return str
		.replace(/\s(.)/g, function (a) {
			return a.toUpperCase();
		})
		.replace(/\s/g, '')
		.replace(/^(.)/, function (b) {
			return b.toLowerCase();
		});
}

export const camelCaseToNormal = str => {
	const result = str.replace(/([A-Z])/g, ' $1');
	return result.charAt(0).toUpperCase() + result.slice(1);
};

export function triggerEvent(event, user, data) {
	console.log('TRIGGERED', event);
}

export function sanitizeProduct(product) {
	const temp = { ...product };
	delete temp?.created_at;
	delete temp?.published_at;
	delete temp?.categories;
	delete temp?.updated_at;
	delete temp?.description;
	delete temp?.hsn;
	return temp;
}

export const getQtyByProductId = (lineItems, productId, defaultVal) => {
	const lineItemIndex = lineItems.findIndex(item => item.product.id === productId);
	if (lineItemIndex > -1) {
		return lineItems[lineItemIndex].quantity;
	} else {
		return defaultVal || 0;
	}
};

export const calculateTotal = lineItems => {
	if (lineItems?.length > 0) {
		return lineItems
			.reduce((acc, item) => {
				return acc + item.quantity * item.productRate;
			}, 0)
			.toFixed(2);
	}
	return 0;
};
// export const calculateTotal = lineItems => {
// 	// console.log('lineItems', lineItems);
// 	if (lineItems?.length > 0) {
// 		return lineItems
// 			.reduce((acc, item) => {
// 				if(item.selectedAddOns && item.selectedAddOns.length > 0){
// 					return acc + item.quantity * ((item.product.discountedPrice || item.product.rate) + item.selectedAddOns.reduce((acc1,cur1) => { acc1 += cur1.rate; return acc1} ,0));
// 				}else{
// 					return acc + item.quantity * (item.product.discountedPrice || item.product.rate);
// 				}
// 			}, 0)
// 			.toFixed(2);
// 	}
// 	return 0;
// };

export const pluralize = word => {
	if (word.endsWith('s')) {
		return word;
	} else if (word.endsWith('y')) {
		return word.slice(0, -1) + 'ies';
	} else if (word.endsWith('f')) {
		return word.slice(0, -1) + 'ves';
	} else if (word.endsWith('fe')) {
		return word.slice(0, -2) + 'ves';
	} else if (word.endsWith('o')) {
		return word.slice(0, -1) + 'es';
	} else if (word.endsWith('ch')) {
		return word.slice(0, -2) + 'es';
	} else if (word.endsWith('x')) {
		return word + 'es';
	} else if (word.endsWith('sh')) {
		return word.slice(0, -2) + 'es';
	} else if (word.endsWith('z')) {
		return word.slice(0, -1) + 'es';
	} else {
		return word + 's';
	}
};
