export default function ProgressBar({ className }) {
	return (
		<div className={className}>
			<h4 className="sr-only">Status</h4>
			<p className="text-sm font-medium text-gray-900 dark:text-gray-100">Migrating MySQL database...</p>
			<div className="mt-6" aria-hidden="true">
				<div className="relative z-0 h-2 overflow-hidden bg-gray-200 rounded-full dark:bg-gray-800">
					<div className="absolute inset-0 z-[2] rounded-full bg-brand-600" style={{ width: '37.5%' }} />
					<div className="absolute inset-0 bg-green-600 rounded-full z-[1]" style={{ width: '88.5%' }} />
				</div>
				<div className="grid grid-cols-4 mt-6 text-sm font-medium text-gray-600">
					<div className="text-brand-600">Copying files</div>
					<div className="text-center text-brand-600">Migrating database</div>
					<div className="text-center">Compiling assets</div>
					<div className="text-right">Deployed</div>
				</div>
			</div>
		</div>
	);
}
