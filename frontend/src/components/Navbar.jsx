import { Link } from 'react-router-dom';
import qwe from '../assets/react.svg';
import AccountCircleIcon from '@mui/icons-material/AccountCircle';
import { useLocation } from 'react-router-dom'; 


function Navbar() {
    const location = useLocation();
    const isActive = (path) => location.pathname === path;

    return (
        <nav className="bg-green-800 px-2 py-2">

            <div className="w-full flex justify-between items-center px-4">
                {/* Left side - Logo and Farm Name */}
                <div className="flex items-center">
                    <img src={qwe} alt="Logo" className="h-8 w-auto m-1" />
                    <div className="text-white text-xl">Monvirey Poultry Farm</div>
                </div>
                {/* Right side - Navigation Links */}
                <div className="flex space-x-5 items-center ml-auto">
                    <Link
                        to="/home"
                        className={`nav-item cursor-pointer text-white hover:text-gray-300 ${isActive('/home') ? 'border-b-2 border-white pb-2' : ''}`}
                    >
                        Home
                    </Link>
                    <Link
                        to="/inventory"
                        className={`nav-item cursor-pointer text-white hover:text-gray-300 ${isActive('/inventory') ? 'border-b-2 border-white pb-2' : ''}`}
                    >
                        Inventory
                    </Link>
                    <Link
                        to="/transactions"
                        className={`nav-item cursor-pointer text-white hover:text-gray-300 ${isActive('/transactions') ? 'border-b-2 border-white pb-2' : ''}`}
                    >
                        Transactions
                    </Link>
                    <Link
                        to="/batch-history"
                        className={`nav-item cursor-pointer text-white hover:text-gray-300 ${isActive('/batch-history') ? 'border-b-2 border-white pb-2' : ''}`}
                    >
                        Batch History
                    </Link>

                    {/* My Account with Dropdown */}
                    <div className="relative group">
                        <div className="nav-item cursor-pointer text-white hover:text-gray-300">
                            <AccountCircleIcon style={{ fontSize: 42 }} />
                        </div>
                        <div className="absolute bg-white text-black p-1 shadow-lg rounded mt-2 right-0 w-40 z-50 hidden group-hover:block">
                            <ul>
                                <li className="px-4 py-2 hover:bg-gray-200 cursor-pointer">
                                    My Profile
                                </li>
                                <li className="px-4 py-2 hover:bg-gray-200 cursor-pointer">
                                    Logout
                                </li>
                            </ul>
                        </div>
                    </div>
                </div>
            </div>

        </nav>
    );

}

export default Navbar;