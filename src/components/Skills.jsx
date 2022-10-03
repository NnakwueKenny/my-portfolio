import React from 'react';

import HTML from '../assets/html.png';
import CSS from '../assets/css.png';
import JavaScript from '../assets/javascript.png';
import ReactImg from '../assets/react.png';
import Node from '../assets/node.png';
import FireBase from '../assets/firebase.png';
import AWS from '../assets/aws.png';
import GitHub from '../assets/github.png';
import Tailwind from '../assets/tailwind.png';
import Mongo from '../assets/mongo.png';
import { FaBootstrap } from 'react-icons/fa';

const Skills = () => {
  return (
    <div name='skills' className='w-full bg-white dark:bg-bg-[#0a192f] flex justify-center items-center p-4 md:py-12'>
      {/* Container */}
      <div className='max-w-[1000px] mx-auto p-4 flex flex-col justify-center w-full h-full'>
          <div>
              <p className='text-4xl font-bold inline border-b-4 border-green-500 '>Skills</p>
              <p className='py-4'>// These are the technologies I've worked with</p>
          </div>

          <div className='w-full grid grid-cols-2 md:grid-cols-3 gap-6 text-center py-8'>
              <div
                data-aos="flip-left"
                data-aos-offset="300"
                data-aos-delay="200"
                data-aos-easing="ease-in-sine"
                data-aos-duration="1500"
                className='shadow-md shadow-[#040c16] hover:shadow-none hover:scale-110 hover:bg-orange-500 duration-500 bg-[#0a192f] text-gray-300 py-4'>
                  <img className='w-20 mx-auto' src={HTML} alt="HTML icon" />
                  <p className='my-4'>HTML</p>
              </div>
              <div
                data-aos="flip-left"
                data-aos-offset="300"
                data-aos-delay="300"
                data-aos-easing="ease-in-sine"
                data-aos-duration="1500"
                className='shadow-md shadow-[#040c16] hover:shadow-none hover:scale-110 hover:bg-blue-500 duration-500 bg-[#0a192f] text-gray-300 py-4'>
                  <img className='w-20 mx-auto' src={CSS} alt="HTML icon" />
                  <p className='my-4'>CSS</p>
              </div>
              <div
              data-aos="flip-left"
              data-aos-offset="300"
              data-aos-delay="400"
              data-aos-easing="ease-in-sine"
              data-aos-duration="1500"
              className='shadow-md shadow-[#040c16] hover:shadow-none hover:scale-110 hover:bg-[#323330] duration-500 bg-[#0a192f] text-gray-300 py-4'>
                  <img className='w-20 mx-auto' src={JavaScript} alt="HTML icon" />
                  <p className='my-4'>JAVASCRIPT</p>
              </div>
              <div
              data-aos="flip-left"
              data-aos-offset="300"
              data-aos-delay="500"
              data-aos-easing="ease-in-sine"
              data-aos-duration="1500"
              className='shadow-md shadow-[#040c16] hover:shadow-none hover:scale-110 hover:bg-[#61DBFB] duration-500 bg-[#0a192f] text-gray-300 py-4'>
                  <img className='w-20 mx-auto' src={ReactImg} alt="HTML icon" />
                  <p className='my-4'>REACT</p>
              </div>
              <div
              data-aos="flip-left"
              data-aos-offset="300"
              data-aos-delay="600"
              data-aos-easing="ease-in-sine"
              data-aos-duration="1500"
              className='shadow-md shadow-[#040c16] hover:shadow-none hover:scale-110 hover:bg-[#171515] duration-500 bg-[#0a192f] text-gray-300 py-4'>
                  <img className='w-20 mx-auto' src={GitHub} alt="HTML icon" />
                  <p className='my-4'>GITHUB</p>
              </div>
              <div
              data-aos="flip-left"
              data-aos-offset="300"
              data-aos-delay="700"
              data-aos-easing="ease-in-sine"
              data-aos-duration="1500"
              className='shadow-md shadow-[#040c16] hover:shadow-none hover:scale-110 hover:bg-lime-700 duration-500 bg-[#0a192f] text-gray-300 py-4'>
                  <img className='w-20 mx-auto' src={Node} alt="HTML icon" />
                  <p className='my-4'>NODE JS</p>
              </div>
              <div
              data-aos="flip-left"
              data-aos-offset="300"
              data-aos-delay="800"
              data-aos-easing="ease-in-sine"
              data-aos-duration="1500"
              className='shadow-md shadow-[#040c16] hover:shadow-none hover:scale-110 hover:bg-green-500 duration-500 bg-[#0a192f] text-gray-300 py-4'>
                  <img className='w-20 mx-auto' src={Mongo} alt="HTML icon" />
                  <p className='my-4'>MONGO DB</p>
              </div>
              <div
              data-aos="flip-left"
              data-aos-offset="300"
              data-aos-delay="900"
              data-aos-easing="ease-in-sine"
              data-aos-duration="1500"
              className='shadow-md shadow-[#040c16] hover:shadow-none hover:scale-110 hover:bg-teal-600 duration-500 bg-[#0a192f] text-gray-300 py-4'>
                  <img className='w-20 mx-auto' src={Tailwind} alt="HTML icon" />
                  <p className='my-4'>Tailwind</p>
              </div>
              <div
              data-aos="flip-left"
              data-aos-offset="300"
              data-aos-delay="900"
              data-aos-easing="ease-in-sine"
              data-aos-duration="1500"
              className='flex flex-col justify-center shadow-md shadow-[#040c16] hover:shadow-none hover:scale-110 hover:bg-[#563d7c] duration-500 bg-[#0a192f] text-gray-300 py-4'>
                  <div className='flex justify-center text-7xl'><FaBootstrap /></div>
                  <p className='my-4'>Bootstrap</p>
              </div>
          </div>
      </div>
    </div>
  );
};

export default Skills;
