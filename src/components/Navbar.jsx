import React, { useState } from 'react';
import {
  FaBars,
  FaTimes,
  FaGithub,
  FaLinkedin,
  FaFacebook,
  FaLinkedinIn,
  FaTwitter
} from 'react-icons/fa';
import { HiOutlineMail } from 'react-icons/hi';
import { BsFillPersonLinesFill } from 'react-icons/bs';
import Logo from '../assets/logo.png';
import { Link } from 'react-scroll';

const Navbar = () => {
  const [nav, setNav] = useState(false);
  const handleClick = () => setNav(!nav);

  return (
    <div className='z-50 fixed w-full h-[80px] flex justify-between items-center px-4 bg-gray-200 dark:bg-[#0a192f] text-gray-500 dark:text-gray-300 shadow'>
      <div className='block'>
          <Link to='home' className='block font-semibold text-lg' smooth={true} duration={500}>
          Code<span className='text-green-500'>Hermit</span>
            {/*<img src={Logo} alt='Logo Image' style={{ width: '50px' }} />*/}
          </Link>
        </div>

      {/* menu */}
      <ul className='hidden md:flex'>
        <li>
          <Link to='home' className='hover:text-green-500 font-semibold' smooth={true} duration={500}>
            Home
          </Link>
        </li>
        <li>
          <Link to='about' className='hover:text-green-500 font-semibold' smooth={true} duration={500}>
            About
          </Link>
        </li>
        <li>
          <Link to='skills' className='hover:text-green-500 font-semibold' smooth={true} duration={500}>
            Skills
          </Link>
        </li>
        <li>
          <Link to='work' className='hover:text-green-500 font-semibold' smooth={true} duration={500}>
            Work
          </Link>
        </li>
        <li>
          <Link to='contact' className='hover:text-green-500 font-semibold' smooth={true} duration={500}>
            Contact
          </Link>
        </li>
      </ul>

      {/* Hamburger */}
      <div onClick={handleClick} className='md:hidden z-10'>
        {!nav ? <FaBars /> : <FaTimes />}
      </div>

      {/* Mobile menu */}
      <ul
        className={
          !nav
            ? 'hidden'
            : 'absolute top-0 left-0 w-full h-screen bg-[#0a192f] flex flex-col justify-center items-center'
        }
      >
        <li className='py-6 text-4xl'>
          <Link onClick={handleClick} to='home' smooth={true} duration={500}>
            Home
          </Link>
        </li>
        <li className='py-6 text-4xl'>
          {' '}
          <Link onClick={handleClick} to='about' smooth={true} duration={500}>
            About
          </Link>
        </li>
        <li className='py-6 text-4xl'>
          {' '}
          <Link onClick={handleClick} to='skills' smooth={true} duration={500}>
            Skills
          </Link>
        </li>
        <li className='py-6 text-4xl'>
          {' '}
          <Link onClick={handleClick} to='work' smooth={true} duration={500}>
            Work
          </Link>
        </li>
        <li className='py-6 text-4xl'>
          {' '}
          <Link onClick={handleClick} to='contact' smooth={true} duration={500}>
            Contact
          </Link>
        </li>
      </ul>

      {/* Social icons */}
      <div className='hidden lg:flex fixed flex-col top-[35%] left-0'>
        <ul>
          <li className='w-[160px] h-[60px] flex justify-between items-center ml-[-100px] hover:ml-[-10px] duration-500 bg-blue-600 hover:rounded'>
            <a
              className='flex justify-between items-center w-full text-gray-300'
              href='https://www.linkedin.com/in/kenechukwu-nnakwue-a854081b5/'
            >
              Linkedin <FaLinkedin size={30} />
            </a>
          </li>
          <li className='w-[160px] h-[60px] flex justify-between items-center ml-[-100px] hover:ml-[-10px] duration-500 bg-[#333333] hover:rounded'>
            <a
              className='flex justify-between items-center w-full text-gray-300'
              href='https://github.com/NnakwueKenny'
            >
              Github <FaGithub size={30} />
            </a>
          </li>
          <li className='w-[160px] h-[60px] flex justify-between items-center ml-[-100px] hover:ml-[-10px] duration-500 bg-[#6fc2b0] hover:rounded'>
            <a
              className='flex justify-between items-center w-full text-gray-300'
              href='mailto:https://nnakwuekenny@gmail.com'
            >
              Email <HiOutlineMail size={30} />
            </a>
          </li>
          <li className='w-[160px] h-[60px] flex justify-between items-center ml-[-100px] hover:ml-[-10px] duration-500 bg-blue-500 hover:rounded'>
            <a
              className='flex justify-between items-center w-full text-gray-200'
              href='https://twitter.com/kenny_nnakwue'
            >
              Twitter <FaTwitter size={30} />
            </a>
          </li>
        </ul>
      </div>
    </div>
  );
};

export default Navbar;
