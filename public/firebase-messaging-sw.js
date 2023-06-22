//firebase-messaging-sw.js

importScripts('https://www.gstatic.com/firebasejs/7.9.1/firebase-app.js');
importScripts('https://www.gstatic.com/firebasejs/7.9.1/firebase-messaging.js');

firebase.initializeApp({
	apiKey: 'AIzaSyDOf_0VFdPfSg6q3lgKdePBFK23kU1WmFE',
	authDomain: 'wnxt-5c3e6.firebaseapp.com',
	projectId: 'wnxt-5c3e6',
	storageBucket: 'wnxt-5c3e6.appspot.com',
	messagingSenderId: '783935370795',
	appId: '1:783935370795:web:3d69d0537302233449dc6e',
	measurementId: 'G-K88R0LJBBC',
});

const messaging = firebase.messaging();

// Both of them ain't working

//background notifications will be received here
messaging.setBackgroundMessageHandler(function (payload) {
	const notificationData = JSON.parse(payload.data.notification);
	console.log(notificationData);

	// Customize notification here
	const notificationTitle = notificationData.title;
	const notificationOptions = {
		body: notificationData.body,
		icon: '/meta/wnxt-app-icon.png',
		vibrate: [100, 50, 100],
		data: {
			dateOfArrival: Date.now(),
			primaryKey: 1,
			link: notificationData.link,
		},
	};

	return self.registration.showNotification(notificationTitle, notificationOptions);
});

self.addEventListener('notificationclick', function (event) {
	event.notification.close();

	// This looks to see if the current is already open and
	// focuses if it is
	event.waitUntil(
		clients
			.matchAll({
				type: 'window',
			})
			.then(function (clientList) {
				for (var i = 0; i < clientList.length; i++) {
					var client = clientList[i];
					if (client.url == '/' && 'focus' in client) return client.focus();
				}
				if (clients.openWindow) return clients.openWindow(event.notification.data.link ? event.notification.data.link : '/');
			})
	);
});
