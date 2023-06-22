import NextAuth from 'next-auth';
import Providers from 'next-auth/providers';
import axios from 'axios';
import Analytics from 'analytics-node'

let analytics = new Analytics('JOsFbsyrSVLXkHeKkzEwCjlgYAeM00tz');

const options = {
	providers: [
		Providers.Credentials({
			// The name to display on the sign in form (e.g. 'Sign in with...')
			name: 'Credentials',
			// credentials: {
			// 	username: { label: 'Email/Name', type: 'text' },
			// 	password: { label: 'Password', type: 'password' },
			//   otp_code: {},
			// 	otp,
			// },
			async authorize(credentials, req) {
				const { identifier, password, otp, otp_code } = credentials;

				// If Identifier and password are sent (Id can be mobile or email)
				if (identifier && password) {
					const res = await axios.post(`${process.env.NEXT_PUBLIC_API_URL}/auth/local`, {
						identifier,
						password,
					});
					console.log(res);
					if (res?.status === 200 && res?.data) {
						return res?.data;
					} else {
						console.log(res);
					}
				} else if (otp && otp_code) {
					// If otp and otp_code are sent
					const res = await axios.post(`${process.env.NEXT_PUBLIC_API_URL}/auth/verifyOtp`, {
						otp_code,
						otp,
					});
					if (res?.status === 200 && res?.data) {
						return res?.data;
					} else {
						console.log(res);
					}
				} else {
					console.error('Something went wrong with authorization', credentials, req);
					return null;
				}
			},
		}),
	],
	pages: {
		signin: '/login',
		error: '/login',
	},
	session: {
		jwt: true,
	},
	callbacks: {
		// redirect: async (url, baseUrl) => {
		// 	return Promise.resolve(url);
		// },
		session: async (session, user) => {
			session.jwt = user.jwt;
			session.id = user.id;
			session.user = {
				id: user.user.id,
				name: user.name ? user.name : user.user.name,
				email: user.user.email,
				whatsappConsent: user.user.whatsappConsent,
				phoneNumber: user.user.phoneNumber,
				isBnxtAdmin: user?.user?.isBnxtAdmin ? user?.user?.isBnxtAdmin : false,
				canAccessWnxt: user?.user?.canAccessWnxt ? user?.user?.canAccessWnxt : false,
				isConfirmed: user?.user?.isConfirmed,
				defaultCity: user?.user?.defaultCity,
				businessCategory: user?.user?.businessCategory
			};

			return Promise.resolve(session);
		},
		jwt: async (token, user, account) => {
			const isSignIn = user ? true : false;
			if (isSignIn) {
				if (account.type == 'credentials') {

					console.log(user, "user");

					token.jwt = user.jwt;
					token.id = user.user.id;
					token.user = {
						id: user.user.id,
						name: user.user.username,
						email: user.user.email,
						whatsappConsent: user.user.whatsappConsent,
						phoneNumber: user.user.phoneNumber,
						isBnxtAdmin: user?.user?.isBnxtAdmin ? user?.user?.isBnxtAdmin : false,
						canAccessWnxt: user?.user?.canAccessWnxt ? user?.user?.canAccessWnxt : false,
						isConfirmed: user?.user?.confirmed,
						defaultCity: user?.user?.defaultAddress?.city,
						businessCategory: user?.user?.businessCategory
					};
				} else {
					const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/auth/${account.provider}/callback?access_token=${account?.accessToken}`);
					const data = await response.json();
					token.jwt = data.jwt;
					token.id = data.user.id;
					token.user = {
						id: data.user.id,
						name: data.user.username,
						email: data.user.email,
						whatsappConsent: data.user.whatsappConsent,
						phoneNumber: data.user.phoneNumber,
						isBnxtAdmin: data?.user?.isBnxtAdmin ? data?.user?.isBnxtAdmin : false,
						canAccessWnxt: data?.user?.canAccessWnxt ? data?.user?.canAccessWnxt : false,
						isConfirmed: data?.user?.confirmed,
						defaultCity: data?.user?.defaultAddress?.city,
						businessCategory: data?.user?.businessCategory
					};
				}
			}
			return Promise.resolve(token);
		},
		signIn: ({ user }) => {
			if (user?.canAccessWnxt) {
				if (user?.confirmed) {
					return true;
				} else {
					return '//set-password';
				}
			} else {
				return false;
			}
		},
	},
};

const Auth = (req, res) => NextAuth(req, res, options);

export default Auth;
