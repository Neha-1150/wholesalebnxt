import Link from 'next/link';
import AppLayout from '../components/app/layouts/AppLayout';
import { BellIcon } from '@heroicons/react/solid';
import { ReceiptRefundIcon, CameraIcon, CheckCircleIcon, DocumentTextIcon } from '@heroicons/react/outline';
import { useEffect } from 'react';
import ReactGA from "react-ga4";

const sectionOne = [
	{
		icon: '',
		text: 'Book Return in 3 days of delivery.',
	},
	{
		icon: '',
		text: 'Return pickup in 72 hours.',
	},
	{
		icon: '',
		text: 'Get money refunded in 48 hours of return pickup.',
	},
];

const sectionTwo = [
	{
		icon: '',
		text: 'Received wrong product.',
	},
	{
		icon: '',
		text: 'Received damaged product.',
	},
	{
		icon: '',
		text: 'Product quality issue.',
	},
];

const sectionThree = [
	{
		icon: ReceiptRefundIcon,
		text: 'Open order at the time of delivery to book in case of returns or refund.',
	},
	{
		icon: CameraIcon,
		text: 'While booking return, select the issue as mentioned and upload clear picture of the products.',
	},
	{
		icon: CheckCircleIcon,
		text: 'Products cannot be utilized, it has to be returned the way its been delivered. Our logistics team would pickup the product and initiate refund process. Pickup attempt will be done twice only, failing to return on two attempts would result in no refund of the payment made.',
	},
	{
		icon: DocumentTextIcon,
		text: 'Complete KYC for receiving refund in to your Bank Account.',
	},
];

const RefundsPolicy = () => {
	useEffect(() => {global.analytics.page('refund policy'); ReactGA.send({ hitType: "pageview", page: "/refund-policy" });},[])
	return (
		<AppLayout>
			<div className="w-full h-full p-5">
				<div>
					<h1 className="mb-3 text-xl font-bold">Returns & Refunds</h1>

					<h3 className="text-lg font-semibold">Return / Refund Policy</h3>

					<ol className="flex flex-col my-4 text-sm list-inside gap-y-1">
						{sectionOne?.map((item, index) => (
							<li key={index} className="list-decimal gap-x-2">
								<span>{item.text}</span>
							</li>
						))}
					</ol>

					<h3 className="my-2 text-lg font-semibold">Terms & Conditions</h3>

					<ol className="flex flex-col my-4 text-sm list-inside gap-y-1">
						{sectionTwo?.map((item, index) => (
							<li key={index} className="list-decimal gap-x-2">
								<span>{item.text}</span>
							</li>
						))}
					</ol>

					<h3 className="my-2 text-lg font-semibold">4-Step refund process</h3>

					<ul className="flex flex-col mt-4 text-sm gap-y-4">
						{sectionThree?.map((item, index) => (
							<li key={index} className="flex items-start gap-x-2">
								<div>
									<item.icon className="w-6 mt-1" />
								</div>
								<div>{item.text}</div>
							</li>
						))}
					</ul>
				</div>

				<div className="flex flex-col items-center justify-center mt-5 gap-y-2">
					<h4 className="text-base font-bold">In case of any queries</h4>
					<Link href="/contact">
						<a className="mt-2 tracking-wide underline uppercase text-brand-500 dark:text-brand-400">Contact us</a>
					</Link>
				</div>
			</div>
		</AppLayout>
	);
};

export default RefundsPolicy;
