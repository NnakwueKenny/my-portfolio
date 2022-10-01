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
                <div class="px-8 py-10 relative z-10 w-full border-4 border-gray-800 bg-gray-900 opacity-0 hover:opacity-100">
                  <h2 class="tracking-widest text-sm title-font font-medium text-indigo-400 mb-1">THE SUBTITLE</h2>
                  <h1 class="title-font text-lg font-medium text-white mb-3">Shooting Stars</h1>
                  <p class="leading-relaxed">Photo booth fam kinfolk cold-pressed sriracha leggings jianbing microdosing tousled waistcoat.</p>
                </div>
              </div>
            </div>
            <div class="lg:w-1/3 sm:w-1/2 p-4">
              <div class="flex relative">
                <img alt="gallery" class="absolute inset-0 w-full h-full object-cover object-center" src="https://dummyimage.com/601x361" />
                <div class="px-8 py-10 relative z-10 w-full border-4 border-gray-800 bg-gray-900 opacity-0 hover:opacity-100">
                  <h2 class="tracking-widest text-sm title-font font-medium text-indigo-400 mb-1">THE SUBTITLE</h2>
                  <h1 class="title-font text-lg font-medium text-white mb-3">The Catalyzer</h1>
                  <p class="leading-relaxed">Photo booth fam kinfolk cold-pressed sriracha leggings jianbing microdosing tousled waistcoat.</p>
                </div>
              </div>
            </div>
            <div class="lg:w-1/3 sm:w-1/2 p-4">
              <div class="flex relative">
                <img alt="gallery" class="absolute inset-0 w-full h-full object-cover object-center" src="https://dummyimage.com/603x363" />
                <div class="px-8 py-10 relative z-10 w-full border-4 border-gray-800 bg-gray-900 opacity-0 hover:opacity-100">
                  <h2 class="tracking-widest text-sm title-font font-medium text-indigo-400 mb-1">THE SUBTITLE</h2>
                  <h1 class="title-font text-lg font-medium text-white mb-3">The 400 Blows</h1>
                  <p class="leading-relaxed">Photo booth fam kinfolk cold-pressed sriracha leggings jianbing microdosing tousled waistcoat.</p>
                </div>
              </div>
            </div>
            <div class="lg:w-1/3 sm:w-1/2 p-4">
              <div class="flex relative">
                <img alt="gallery" class="absolute inset-0 w-full h-full object-cover object-center" src="https://dummyimage.com/602x362" />
                <div class="px-8 py-10 relative z-10 w-full border-4 border-gray-800 bg-gray-900 opacity-0 hover:opacity-100">
                  <h2 class="tracking-widest text-sm title-font font-medium text-indigo-400 mb-1">THE SUBTITLE</h2>
                  <h1 class="title-font text-lg font-medium text-white mb-3">Neptune</h1>
                  <p class="leading-relaxed">Photo booth fam kinfolk cold-pressed sriracha leggings jianbing microdosing tousled waistcoat.</p>
                </div>
              </div>
            </div>
            <div class="lg:w-1/3 sm:w-1/2 p-4">
              <div class="flex relative">
                <img alt="gallery" class="absolute inset-0 w-full h-full object-cover object-center" src="https://dummyimage.com/605x365" />
                <div class="px-8 py-10 relative z-10 w-full border-4 border-gray-800 bg-gray-900 opacity-0 hover:opacity-100">
                  <h2 class="tracking-widest text-sm title-font font-medium text-indigo-400 mb-1">THE SUBTITLE</h2>
                  <h1 class="title-font text-lg font-medium text-white mb-3">Holden Caulfield</h1>
                  <p class="leading-relaxed">Photo booth fam kinfolk cold-pressed sriracha leggings jianbing microdosing tousled waistcoat.</p>
                </div>
              </div>
            </div>
            <div class="lg:w-1/3 sm:w-1/2 p-4">
              <div class="flex relative">
                <img alt="gallery" class="absolute inset-0 w-full h-full object-cover object-center" src="https://dummyimage.com/606x366" />
                <div class="px-8 py-10 relative z-10 w-full border-4 border-gray-800 bg-gray-900 opacity-0 hover:opacity-100">
                  <h2 class="tracking-widest text-sm title-font font-medium text-indigo-400 mb-1">THE SUBTITLE</h2>
                  <h1 class="title-font text-lg font-medium text-white mb-3">Alper Kamu</h1>
                  <p class="leading-relaxed">Photo booth fam kinfolk cold-pressed sriracha leggings jianbing microdosing tousled waistcoat.</p>
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
