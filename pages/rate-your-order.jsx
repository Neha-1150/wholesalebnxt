import axios from 'axios';
import toast from 'react-hot-toast';
import { useState } from 'react';
import { useRouter } from 'next/router';
import { getSession } from 'next-auth/client';
import StarRatingComponent from 'react-star-rating-component';

const RateYourOrder = ({ id }) => {
	const router = useRouter();
	const [rating, setRating] = useState(0);

	const submitRating = async () => {
		const session = await getSession();
		if (id && session) {
			if (rating > 0) {
				try {
					const res = axios.put(
						`${process.env.NEXT_PUBLIC_API_URL}/orderRating/${rating}/${id}`,
						{},
						{
							headers: {
								Authorization: `Bearer ${session.jwt}`,
							},
						}
					);
					if (res.status === 200) {
						toast.success('Thank you for your feedback!');
						router.replace(`/dashboard/orders/${id}`);
					}
				} catch (error) {
					toast.error('Something went wrong');
				}
			} else {
				toast.error('Please select a rating');
			}
		} else {
			router.push('/dashboard/orders');
		}
	};

	return (
		<div className="flex flex-col items-center justify-center w-screen h-screen gap-5">
			<div>
				<h3>Rate your Experience</h3>
			</div>
			<StarRatingComponent name="rate1" starCount={5} value={rating} onStarClick={setRating} className="text-5xl" />

			<button onClick={submitRating} className="font-bold tracking-wide uppercase text-md">
				Submit Rating
			</button>
			<button className="mt-10" onClick={() => router.replace(`/dashboard/orders/${id}`)}>
				Skip for now
			</button>
		</div>
	);
};

export default RateYourOrder;

export const getServerSideProps = async ctx => {
	const { id } = ctx.query;
	return {
		props: {
			id,
		},
	};
};
