import { LockClosedIcon, LockOpenIcon } from '@heroicons/react/solid';
import React from 'react';

const LockedCreditLimit = () => {
	return (
		<div className="">
			<div>
				<div className="flex items-center space-x-1 text-sm font-medium text-gray-900 dark:text-gray-100">
					<div>
						Unlock Credit Limit of <span className="font-bold">₹40,000</span>
					</div>
					<LockClosedIcon className="w-4 h-4" />
				</div>
				<div className="mt-2" aria-hidden="true">
					<div className="relative z-0 h-2 overflow-hidden bg-gray-200 rounded-full dark:bg-gray-800">
						<div className="absolute inset-0 z-[2] rounded-full-l bg-brand-600" style={{ width: '25%' }}></div>
					</div>
					<div className="grid grid-cols-2 mt-2 text-sm font-medium">
						<div className="text-brand-600">
							<div className="flex items-center space-x-1">
								To Unlock <LockOpenIcon className="w-4 h-4 ml-1" />
							</div>
							<div>Spend: ₹30,000 more</div>
						</div>
						<div className="text-right text-gray-500">
							<div>Goal</div>
							<div className="text-green-500">₹40,000</div>
						</div>
					</div>
				</div>
			</div>
		</div>
	);
};

export default LockedCreditLimit;
