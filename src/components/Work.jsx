import React from 'react';
import WorkImg from '../assets/workImg.jpeg';
import realEstate from '../assets/realestate.jpg';

const Work = () => {
  return (
    <div name='work' className='flex flex-col w-full bg-[#0a192f] dark:bg-gray-100 flex justify-center items-center p-4 md:py-10 lg:py-12 shadow-xl'>
      <section class="text-gray-400 max-w-5xl body-font md:px-6">
        <div className='pb-8'>
          <h2 class="inline-flex mb-4 text-4xl tracking-tight font-extrabold text-left text-gray-500 dark:text-gray-200 border-b-4 border-green-500">Projects</h2>
          <p className='py-1 text-green-500 font-mono'>// check out some of my recent work</p>
          <p className='py-1 text-green-500 font-mono'>// Some, I developed alone, others I worked in collaboration with others.</p>
          <p className='py-1 text-green-500 font-mono'>// They are all open-source. so you can clone, modify them as you wish; Just give me some credits 😊😁</p>
        </div>
        <div class="container px-2 mx-auto">
          <div class="flex flex-wrap -m-4">
            <div class="lg:w-1/3 sm:w-1/2 p-4">
              <div class="flex relative">
                <img alt="gallery" class="absolute inset-0 w-full h-full object-cover object-center" src="./assets/workImg.jpeg" />
                <div class="px-8 py-10 relative z-10 w-full border-4 border-gray-800 bg-gray-900 opacity-0 hover:opacity-100 text-center">
                  <h2 class="tracking-widest text-sm title-font font-semibold text-green-500 mb-1">iMAGO qUAD</h2>
                  <p class="leading-relaxed">The android app "4 pics one word" was my source of inspiration for this project. I built it using ReactJS and Tailwindcss</p>
                  <div className='w-full flex justify-around py-2'>
                    <a className='py-1 px-2 border-2 border-green-500 rounded text-green-500 hover:text-gray-50 hover:bg-green-500' href='https:github.com'>Visit Site</a>
                    <a className='py-1 px-2 border-2 border-gray-500 rounded text-gray-500 hover:text-gray-50 hover:bg-gray-500' href='https:github.com'>Github</a>
                  </div>
                </div>
              </div>
            </div>
            <div class="lg:w-1/3 sm:w-1/2 h-full p-4">
              <div class="flex relative ">
                <img alt="gallery" class="absolute inset-0 w-full h-full object-cover object-center" src="https://dummyimage.com/601x361" />
                <div class="px-8 py-10 relative z-10 w-full border-4 border-gray-800 bg-gray-900 opacity-0 hover:opacity-100 text-center">
                  <h2 class="tracking-widest text-sm title-font font-semibold text-cyan-500 mb-1">tASK mANAGER</h2>
                  <p class="leading-relaxed">I implemented this using the MERN stack, and designed the UI with tailwindcss CSS utility-first framework.</p>
                  <div className='w-full flex justify-around py-2'>
                    <a className='py-1 px-2 border-2 border-cyan-500 rounded text-cyan-500 hover:text-gray-50 hover:bg-cyan-500' href='https:github.com'>Visit Site</a>
                    <a className='py-1 px-2 border-2 border-gray-500 rounded text-gray-500 hover:text-gray-50 hover:bg-gray-500' href='https:github.com'>Github</a>
                  </div>
                </div>
              </div>
            </div>
            <div class="lg:w-1/3 sm:w-1/2 p-4">
              <div class="flex relative">
                <img alt="gallery" class="absolute inset-0 w-full h-full object-cover object-center" src="https://dummyimage.com/603x363" />
                <div class="px-8 py-10 relative z-10 w-full border-4 border-gray-800 bg-gray-900 opacity-0 hover:opacity-100 text-center">
                  <h2 class="tracking-widest text-sm title-font font-semibold text-green-700 mb-1">sABI vOTERS</h2>
                  <p class="leading-relaxed">I designed the user interface of this site using vanilla javascript and Tailwindcss</p>
                  <div className='w-full flex justify-around py-2'>
                    <a className='py-1 px-2 border-2 border-green-700 rounded text-green-700 hover:text-gray-50 hover:bg-green-700' href='https:github.com'>Visit Site</a>
                    <a className='py-1 px-2 border-2 border-gray-700 rounded text-gray-500 hover:text-gray-50 hover:bg-gray-500' href='https:github.com'>Github</a>
                  </div>
                </div>
              </div>
            </div>
            <div class="lg:w-1/3 sm:w-1/2 p-4">
              <div class="flex relative">
                <img alt="gallery" class="absolute inset-0 w-full h-full object-cover object-center" src="https://dummyimage.com/602x362" />
                <div class="px-8 py-10 relative z-10 w-full border-4 border-gray-800 bg-gray-900 opacity-0 hover:opacity-100 text-center">
                  <h2 class="tracking-widest text-sm title-font font-semibold text-green-500 mb-1">iMAGO qUAD</h2>
                  <p class="leading-relaxed">The android app '4 pics one word' was my source of inspiration for this project. I built it using ReactJS and Tailwindcss</p>
                  <div className='w-full flex justify-around py-2'>
                    <a className='py-1 px-2 border-2 border-green-500 rounded text-green-500 hover:text-gray-50 hover:bg-green-500' href='https:github.com'>Visit Site</a>
                    <a className='py-1 px-2 border-2 border-gray-500 rounded text-gray-500 hover:text-gray-50 hover:bg-gray-500' href='https:github.com'>Github</a>
                  </div>
                </div>
              </div>
            </div>
            <div class="lg:w-1/3 sm:w-1/2 p-4">
              <div class="flex relative">
                <img alt="gallery" class="absolute inset-0 w-full h-full object-cover object-center" src="https://dummyimage.com/605x365" />
                <div class="px-8 py-10 relative z-10 w-full border-4 border-gray-800 bg-gray-900 opacity-0 hover:opacity-100 text-center">
                  <h2 class="tracking-widest text-sm title-font font-semibold text-green-500 mb-1">iMAGO qUAD</h2>
                  <p class="leading-relaxed">The android app '4 pics one word' was my source of inspiration for this project. I built it using ReactJS and Tailwindcss</p>
                  <div className='w-full flex justify-around py-2'>
                    <a className='py-1 px-2 border-2 border-green-500 rounded text-green-500 hover:text-gray-50 hover:bg-green-500' href='https:github.com'>Visit Site</a>
                    <a className='py-1 px-2 border-2 border-gray-500 rounded text-gray-500 hover:text-gray-50 hover:bg-gray-500' href='https:github.com'>Github</a>
                  </div>
                </div>
              </div>
            </div>
            <div class="lg:w-1/3 sm:w-1/2 p-4">
              <div class="flex relative">
                <img alt="gallery" class="absolute inset-0 w-full h-full object-cover object-center" src="https://dummyimage.com/606x366" />
                <div class="px-8 py-10 relative z-10 w-full border-4 border-gray-800 bg-gray-900 opacity-0 hover:opacity-100 text-center">
                  <h2 class="tracking-widest text-sm title-font font-semibold text-green-500 mb-1">iMAGO qUAD</h2>
                  <p class="leading-relaxed">The android app '4 pics one word' was my source of inspiration for this project. I built it using ReactJS and Tailwindcss</p>
                  <div className='w-full flex justify-around py-2'>
                    <a className='py-1 px-2 border-2 border-green-500 rounded text-green-500 hover:text-gray-50 hover:bg-green-500' href='https:github.com'>Visit Site</a>
                    <a className='py-1 px-2 border-2 border-gray-500 rounded text-gray-500 hover:text-gray-50 hover:bg-gray-500' href='https:github.com'>Github</a>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Work;
