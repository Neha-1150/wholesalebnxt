import 'firebase/messaging';
import firebase from 'firebase/app';
import localforage from 'localforage';

const firebaseCloudMessaging = {
	//checking whether token is available in indexed DB
	tokenInlocalforage: async () => {
		return localforage.getItem('fcm_token');
	},
	//initializing firebase app
	init: async function () {
		console.log('fcm');
		if (!firebase?.apps.length) {
			firebase?.initializeApp({
				apiKey: 'AIzaSyDOf_0VFdPfSg6q3lgKdePBFK23kU1WmFE',
				authDomain: 'wnxt-5c3e6.firebaseapp.com',
				projectId: 'wnxt-5c3e6',
				storageBucket: 'wnxt-5c3e6.appspot.com',
				messagingSenderId: '783935370795',
				appId: '1:783935370795:web:3d69d0537302233449dc6e',
				measurementId: 'G-K88R0LJBBC',
			});

			try {
				const messaging = firebase?.messaging();
				const tokenInLocalForage = await this?.tokenInlocalforage();
				//if FCM token is already there just return the token
				if (tokenInLocalForage !== null) {
					return tokenInLocalForage;
				}
				//requesting notification permission from browser
				const status = await Notification?.requestPermission();
				if (status && status === 'granted') {
					//getting token from FCM
					const fcm_token = await messaging?.getToken();
					if (fcm_token) {
						//setting FCM token in indexed db using localforage
						localforage?.setItem('fcm_token', fcm_token);
						console.log('fcm_token_saved');
						//return the FCM token after saving it
						return fcm_token;
					}
				}
			} catch (error) {
				console.error(error);
				return null;
			}
		}
	},
};

export { firebaseCloudMessaging };
