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

/**  INR commas formatter utility
 * @param {Float} amount - Amount to format
 * @return {String} - Formatter INR amount
 **/
export function toINR(amount, isRound) {
	if (amount) {
		if(isRound) amount = amount.toFixed(2)
		amount = amount.toString();
		let afterPoint = '';
		if (amount.indexOf('.') > 0) afterPoint = amount.substring(amount.indexOf('.'), amount.length);
		amount = Math.floor(amount);
		amount = amount.toString();
		let lastThree = amount.substring(amount.length - 3);
		let otherNumbers = amount.substring(0, amount.length - 3);
		if (otherNumbers != '') lastThree = ',' + lastThree;
		let res = otherNumbers.replace(/\B(?=(\d{2})+(?!\d))/g, ',') + lastThree + afterPoint;

		return `₹${res}`;
	} else {
		return null;
	}
}


export function addBusinessDays(originalDate, numDaysToAdd) {
	const Sunday = 0;
	let daysRemaining = numDaysToAdd;
  
	const newDate = originalDate.clone();
  
	while (daysRemaining > 0) {
	  newDate.add(1, 'days');
	  if (newDate.day() !== Sunday) {
		daysRemaining--;
	  }
	}
  
	return newDate;
}

export function tagsColor(tag){
	switch (tag) {
		case 'Compostable':
			return '#66aa72'

		case 'Oxo Biodegradable':
			return '#D8AA65'
			
		case 'Reusable':
			return '#B365D8'
	
		case 'Recycled':
			return '#65B5D8'
	
		case 'Recyclable':
			return '#D86565'

		case 'Bio-degradable':
			return '#91D865'
	
		default:
			break;
	}
}


export const shimmer = (w, h) => `
<svg width="${w}" height="${h}" version="1.1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink">
  <defs>
    <linearGradient id="g">
      <stop stop-color="#f1f1f1" offset="20%" />
      <stop stop-color="#f7e7e0" offset="50%" />
      <stop stop-color="#f1f1f1" offset="70%" />
    </linearGradient>
  </defs>
  <rect width="${w}" height="${h}" fill="#f7e7e0" />
  <rect id="r" width="${w}" height="${h}" fill="url(#g)" />
  <animate xlink:href="#r" attributeName="x" from="-${w}" to="${w}" dur="1s" repeatCount="indefinite"  />
</svg>`

export const toBase64 = (str) =>
  typeof window === 'undefined'
    ? Buffer.from(str).toString('base64')
    : window.btoa(str)