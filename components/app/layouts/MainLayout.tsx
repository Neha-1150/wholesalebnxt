import Navbar from '../common/Navbar2';
import Topbar from '../common/Topbar';
// import Topbar from '../common/Topbar';

const MainLayout = ({ children, backTitle }) => {
	return (
		<div className="relative">
			<Topbar />
			{children}
			<Navbar />
		</div>
	);
};

export default MainLayout;
