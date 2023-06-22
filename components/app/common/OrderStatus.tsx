import { CheckIcon } from '@heroicons/react/solid';
import { classNames } from '../../../utilities';

export default function OrderStatus({ status, deliveredDate, outForDeliveryDate, placedAt }) {
	const steps = [
		{
			name: `Order placed <p class="text-xs dark:text-green-400 text-green-600">${placedAt ? `${placedAt}` : ''}</p>`,
			description: 'Your order has been received',
			status: status === 'placed' ? 'current' : status === 'outForDelivery' ? 'complete' : status === 'delivered' ? 'complete' : '',
		},
		{
			name: `In Transit <p class="text-xs dark:text-green-400 text-green-600">${outForDeliveryDate ? `Last Updated: ${outForDeliveryDate}` : ''}</p>`,
			description: 'Your order is in transit',
			status: status === 'outForDelivery' ? 'current' : status === 'delivered' ? 'complete' : 'upcoming',
		},
		{
			name: `Delivered <p class="text-xs dark:text-green-400 text-green-600">${deliveredDate ? `Last Updated: ${deliveredDate}` : ''}</p>`,
			description: 'Your order is delivered',
			status: status === 'outForDelivery' ? 'upcoming' : status === 'delivered' ? 'complete' : 'upcoming',
		},
	];

	return (
		<nav aria-label="Progress">
			<ol role="list" className="w-full overflow-hidden">
				{steps.map((step, stepIdx) => (
					<li key={step.name} className={classNames(stepIdx !== steps.length - 1 ? 'pb-10' : '', 'relative w-full')}>
						{step.status === 'complete' ? (
							<>
								{stepIdx !== steps.length - 1 ? <div className="-ml-px absolute mt-0.5 top-4 left-4 w-0.5 h-full bg-brand-600" aria-hidden="true" /> : null}
								<div className="relative flex items-start w-full group">
									<span className="flex items-center h-9">
										<span className="relative flex items-center justify-center w-8 h-8 rounded-full bg-brand-600">
											<CheckIcon className="w-5 h-5 text-white" aria-hidden="true" />
										</span>
									</span>
									<span className="flex flex-col min-w-0 ml-4">
										<span className="w-full text-xs font-semibold tracking-wide uppercase" dangerouslySetInnerHTML={{ __html: `${step.name}` }}></span>
										<span className="text-sm text-gray-500">{step.description}</span>
									</span>
								</div>
							</>
						) : step.status === 'current' ? (
							<>
								{stepIdx !== steps.length - 1 ? (
									<div className="-ml-px absolute mt-0.5 top-4 left-4 w-0.5 h-full bg-gray-300 dark:bg-gray-800" aria-hidden="true" />
								) : null}
								<div className="relative flex items-start w-full group" aria-current="step">
									<span className="flex items-center h-9" aria-hidden="true">
										<span className="relative flex items-center justify-center w-8 h-8 bg-white border-2 rounded-full dark:bg-black border-brand-600">
											<span className="h-2.5 w-2.5 bg-brand-600 rounded-full" />
										</span>
									</span>
									<span className="flex flex-col min-w-0 ml-4">
										<span
											className="w-full text-xs font-semibold tracking-wide uppercase text-brand-600"
											dangerouslySetInnerHTML={{ __html: `${step.name}` }}></span>
										<span className="text-sm text-gray-500">{step.description}</span>
									</span>
								</div>
							</>
						) : (
							<>
								{stepIdx !== steps.length - 1 ? (
									<div className="-ml-px absolute mt-0.5 top-4 left-4 w-0.5 h-full bg-gray-300 dark:bg-gray-900" aria-hidden="true" />
								) : null}
								<div className="relative flex items-start w-full group">
									<span className="flex items-center h-9" aria-hidden="true">
										<span className="relative flex items-center justify-center w-8 h-8 bg-white border-2 border-gray-300 rounded-full dark:bg-gray-900 dark:border-gray-800 ">
											<span className="h-2.5 w-2.5 bg-transparent rounded-full " />
										</span>
									</span>
									<span className="flex flex-col min-w-0 ml-4">
										<span
											className="w-full text-xs font-semibold tracking-wide text-gray-500 uppercase"
											dangerouslySetInnerHTML={{ __html: `${step.name}` }}></span>
										<span className="text-sm text-gray-500">{step.description}</span>
									</span>
								</div>
							</>
						)}
					</li>
				))}
			</ol>
		</nav>
	);
}
