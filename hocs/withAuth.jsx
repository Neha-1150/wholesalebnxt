import { useRouter } from 'next/router';
import { getSession } from 'next-auth/client';
import { useEffect } from 'react';

const withAuth = WrappedComponent => props => {
	const router = useRouter();

	useEffect(async () => {
		const session = await getSession();
		if (session?.user?.canAccessWnxt && !session?.user?.isConfirmed) {
			router.replace(`${process.env.NEXT_PUBLIC_URL}/set-password`);
		}
	}, []);

	return <WrappedComponent {...props} />;
};

export default withAuth;
