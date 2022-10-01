import React from 'react';
import WorkImg from '../assets/workImg.jpeg';
import realEstate from '../assets/realestate.jpg';

const Work = () => {
  return (
    <div name='work' className='flex flex-col w-full bg-[#0a192f] dark:bg-gray-100 flex justify-center items-center p-4 md:py-10 lg:py-12 shadow-xl'>
      <section class="text-gray-400 max-w-5xl body-font md:px-6">
        <div className='pb-8'>
          <h2 class="inline-flex mb-4 text-4xl tracking-tight font-extrabold text-left text-gray-500 dark:text-gray-200 border-b-4 border-green-500">My Projects</h2>
          <p className='py-1 text-green-500 font-mono'>// check out some of my recent work</p>
          <p className='py-1 text-green-500 font-mono'>// Some, I developed alone, others I worked in collaboration with others.</p>
          <p className='py-1 text-green-500 font-mono'>// They are all open-source. so you can clone, modify them as you wish; Just give me some credits 😊😁</p>
        </div>
        <div class="container px-2 mx-auto">
          <div class="flex flex-wrap -m-4">
            <div class="lg:w-1/3 sm:w-1/2 p-4">
              <div class="flex relative rounded-xl overflow-hidden">
                <img alt="gallery" class="absolute inset-0 w-full h-full object-cover object-center" src="./assets/imago-quad.png" />
                <div class="px-8 py-10 relative z-10 w-full border-4 border-gray-800 bg-gray-900 opacity-0 hover:opacity-[90%] text-center">
                  <h2 class="tracking-widest text-sm title-font font-semibold text-green-500 mb-1">iMAGO qUAD</h2>
                  <p class="leading-relaxed">I built it using ReactJS and Tailwindcss in attempt to clone the features of "4 pics one word".</p>
                  <div className='w-full flex justify-around py-2'>
                    <a className='py-1 px-2 border-2 border-green-500 rounded text-green-500 hover:text-gray-50 hover:bg-green-500' href='https://imago-quad.vercel.app'>Visit Site</a>
                    <a className='py-1 px-2 border-2 border-gray-500 rounded text-gray-500 hover:text-gray-50 hover:bg-gray-500' href='https://github.com/NnakwueKenny/imago_quad'>Github</a>
                  </div>
                </div>
              </div>
            </div>
            <div class="lg:w-1/3 sm:w-1/2 h-full p-4">
              <div class="flex relative rounded-xl overflow-hidden">
                <img alt="gallery" class="absolute inset-0 w-full h-full object-cover object-center" src="./assets/task-manager.png" />
                <div class="px-8 py-10 relative z-10 w-full border-4 border-gray-800 bg-gray-900 opacity-0 hover:opacity-[90%] text-center">
                  <h2 class="tracking-widest text-sm title-font font-semibold text-cyan-500 mb-1">tASK mANAGER</h2>
                  <p class="leading-relaxed">I implemented this using the MERN stack, and designed the UI with tailwindcss CSS utility-first framework.</p>
                  <div className='w-full flex justify-around py-2'>
                    <a className='py-1 px-2 border-2 border-cyan-500 rounded text-cyan-500 hover:text-gray-50 hover:bg-cyan-500' href='https://hermit-task-manager.vercel.app'>Visit Site</a>
                    <a className='py-1 px-2 border-2 border-gray-500 rounded text-gray-500 hover:text-gray-50 hover:bg-gray-500' href='https://github.com/NnakwueKenny/tASK_mANAGER'>Github</a>
                  </div>
                </div>
              </div>
            </div>
            <div class="lg:w-1/3 sm:w-1/2 p-4">
              <div class="flex relative rounded-xl overflow-hidden">
                <img alt="gallery" class="absolute inset-0 w-full h-full object-cover object-center" src="./assets/sabivoters.png" />
                <div class="px-8 py-10 relative z-10 w-full border-4 border-gray-800 bg-gray-900 opacity-0 hover:opacity-[90%] text-center">
                  <h2 class="tracking-widest text-sm title-font font-semibold text-green-700 mb-1">sABI vOTERS</h2>
                  <p class="leading-relaxed">In collaboration with some other PHP developers, I designed the UI of this site using JS and TailwindCss.</p>
                  <div className='w-full flex justify-around py-2'>
                    <a className='py-1 px-2 border-2 border-green-700 rounded text-green-700 hover:text-gray-50 hover:bg-green-700' href='https://sabivoters.000webhostapp.com/'>Visit Site</a>
                  </div>
                </div>
              </div>
            </div>
            <div class="lg:w-1/3 sm:w-1/2 p-4">
              <div class="flex relative rounded-xl overflow-hidden">
                <img alt="gallery" class="absolute inset-0 w-full h-full object-cover object-center" src="./assets/anjima.png" />
                <div class="px-8 py-10 relative z-10 w-full border-4 border-gray-800 bg-gray-900 opacity-0 hover:opacity-[90%] text-center">
                  <h2 class="tracking-widest text-sm title-font font-semibold text-green-500 mb-1">Kolib</h2>
                  <p class="leading-relaxed">The android app '4 pics one word' was my source of inspiration for this project. I built it using ReactJS and Tailwindcss</p>
                  <div className='w-full flex justify-around py-2'>
                    <a className='py-1 px-2 border-2 border-green-500 rounded text-green-500 hover:text-gray-50 hover:bg-green-500' href='http://kolib.rf.gd/'>Visit Site</a>
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
