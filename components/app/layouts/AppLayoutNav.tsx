import { FC } from 'react';
import { classNames } from '../../../utilities';
import Backbar from '../common/Backbar';
import Navbar from '../common/Navbar2';
// import Topbar from '../common/Topbar';

interface LayoutProps{
	className: ;
	backTitle: string;
 }

const AppLayoutNav: FC<LayoutProps> = ({ children, backTitle, className }) => {
	return (
		<main className={classNames('relative w-screen h-auto pt-16 pb-24', className)}>
			<Backbar title={backTitle} className="fixed top-0 z-10 w-screen bg-[#E64431] text-white nav-blur dark:nav-blur-dark" />
			{children}
			<Navbar className="fixed bottom-0 z-10 w-full nav-blur dark:nav-blur-dark" />
		</main>
	);
};

export default AppLayoutNav;
