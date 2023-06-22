import { classNames } from '../../../utilities';
import BackbarSearch from '../common/BackbarSearch';
// import Topbar from '../common/Topbar';

const BackWithSearchLayout = ({ children, backTitle, className }) => {
	return (
		<main className={classNames('relative w-screen h-auto pt-14 pb-24', className && className)}>
			<BackbarSearch title={backTitle} className="fixed top-0 z-1 text-black bg-white" />
			{children}
		</main>
	);
};

export default BackWithSearchLayout;
