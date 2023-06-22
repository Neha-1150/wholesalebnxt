import axios from 'axios';
import store from 'store';
import firebase from 'firebase/app';
import dynamic from 'next/dynamic';
import { Toaster } from 'react-hot-toast';
import { useTheme } from 'next-themes';
import { Provider } from 'react-redux';
import { useRouter } from 'next/router';
import { useEffect } from 'react';
import { getSession, Provider as NextAuthProvider } from 'next-auth/client';
import { PersistGate } from 'redux-persist/integration/react';
import { ThemeProvider } from 'next-themes';
import { firebaseCloudMessaging } from '../utilities/webpush';
import reduxStore, { persistor } from '../store/store';
import withFullLoader from '../hocs/withFullLoader';
import 'nprogress/nprogress.css';
import '../styles/globals.css';
import Script from "next/script";
import ReactGA from "react-ga4";

const TopProgressBar = dynamic(
	() => {
		return import('../components/app/common/TopProgressBar');
	},
	{ ssr: false }
);

function MainApp({ Component, pageProps, setLoading }) {
	const router = useRouter();
	function getMessage() {
		const messaging = firebase.messaging();
		messaging.onMessage(message => console.log('foreground', message));
	}

	const { theme } = useTheme();

	useEffect(async () => {
		const session = await getSession();

		ReactGA.initialize("G-K88R0LJBBC");
		// track email, and time of the subscription

		if(session){
			global.analytics.identify(session.user.id, {
				name: session.user.name,
				email: session.user.email,
				phoneNumber: session.user.phoneNumber,
				isBnxtAdmin: session.user.isBnxtAdmin,
				isConfirmed: session.user.isConfirmed,
				defaultCity: session.user.defaultCity
			});
		}

		setToken();
		if ('serviceWorker' in navigator) {
			navigator.serviceWorker.addEventListener('message', event => console.log('event for the service worker', event));
		}
		async function setToken() {
			try {
				const token = await firebaseCloudMessaging.init();
				const localFCMToken = store.get('fcm_token');

				store.set('fcm_token', token);
				if (token && token !== localFCMToken) {
					try {
						const res = await axios.post(`${process.env.NEXT_PUBLIC_API_URL}/registerPushToken`, { token });
						if (res?.status === 200) {
							console.log('fcm_registered');
						}
					} catch (error) {
						console.error(error);
					}
					``;
					getMessage();
				}
			} catch (error) {
				console.error(error);
			}
		}
	}, []);

	return (
    <>
      {/* <Script strategy="lazyOnload" src={`https://www.googletagmanager.com/gtag/js?id=G-K88R0LJBBC`} />

      <Script strategy="lazyOnload">
        {`
            window.dataLayer = window.dataLayer || [];
            function gtag(){dataLayer.push(arguments);}
            gtag('js', new Date());
            gtag('config', 'G-K88R0LJBBC', {
              page_path: window.location.pathname,
            });
                `}
      </Script> */}

      <TopProgressBar />
      <Provider store={reduxStore}>
        <PersistGate loading={null} persistor={persistor}>
          <ThemeProvider enableSystem enableColorScheme defaultTheme="light" attribute="class">
            <NextAuthProvider session={pageProps?.session}>
              <Component {...pageProps} />
            </NextAuthProvider>
          </ThemeProvider>
        </PersistGate>
      </Provider>
      <Toaster
        toastOptions={{
          style: {
            fontSize: "12px",
            borderRadius: "5px",
            background: theme === "light" ? "#f7f7f7" : "#1e1e1e",
            color: theme === "light" ? "#1e1e1e" : "#f7f7f7",
            border: "`1px solid #FF5E20`",
          },
        }}
      />
    </>
  );
}

export default withFullLoader(MainApp);
