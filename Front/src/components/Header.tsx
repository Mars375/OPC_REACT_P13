import React from "react";
import { Link } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import argentBankLogo from "../assets/argentBankLogo.png";

const Header: React.FC = () => {
	return (
		<nav className='flex justify-between items-center px-5 py-[5px] bg-white'>
			<Link className='flex items-center' to='/'>
				<img
					className='w-[12.5rem]'
					src={argentBankLogo}
					alt='Argent Bank Logo'
				/>
				<h1 className='sr-only'>Argent Bank</h1>
			</Link>
			<div>
				<Link className='font-bold hover:underline mr-2' to='/login'>
					<FontAwesomeIcon icon='user-circle' className='mr-1' />
					Sign In
				</Link>
			</div>
		</nav>
	);
};

export default Header;
