import { classNames } from '../../../utilities';
import Backbar from '../common/Backbar';
// import Topbar from '../common/Topbar';

const AppLayout = ({ children, backTitle, className, barStyle }) => {
	return (
		<main className={classNames('relative w-screen h-auto pt-14 pb-24', className && className)}>
			<Backbar title={backTitle} className={classNames('fixed top-0 z-10 bg-[#E64431] text-white', barStyle)} />
			{children}
		</main>
	);
};

export default AppLayout;
