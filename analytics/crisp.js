import { useEffect } from 'react';

export function useCrisp() {
	useEffect(() => {
		window.$crisp = [];
		window.CRISP_WEBSITE_ID = process.env.NEXT_PUBLIC_CRISP_WEBSITE_ID;
		(() => {
			const d = document;
			const s = d.createElement('script');
			s.src = 'https://client.crisp.chat/l.js';
			s.async = 1;
			d.getElementsByTagName('body')[0].appendChild(s);
		})();
	});
}
