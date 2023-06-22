import { classNames, getInitials } from '../../../utilities';

const Avatar = ({ name, className }) => {
	return (
		<span
			className={classNames(
				'inline-flex items-center justify-center w-10 h-10 rounded-full select-none bg-gradient-to-tr from-brand-400 to-brand-200 dark:from-brand-800 dark:to-brand-600',
				className
			)}>
			<span className="font-semibold leading-none dark:text-brand-100 text-brand-700">{getInitials(name)}</span>
		</span>
	);
};

export default Avatar;
