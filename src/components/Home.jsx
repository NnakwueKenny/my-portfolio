import React, {useState, useEffect} from 'react';
import { HiArrowNarrowRight } from 'react-icons/hi';
import { FaNodeJs, FaReact, FaWatchmanMonitoring } from 'react-icons/fa';

const Home = () => {
  const backgroundImageArr = ['../assets/bg3.jpg', '../assets/bg1.jpg'];
  const [backgroundImage, setBackgroundImage] = useState(backgroundImageArr[1]);
  useEffect(() => {
    setTimeout(() => {
      setBackgroundImage(() => {
        if (backgroundImageArr.indexOf(backgroundImage) === (backgroundImageArr.length-1)) {
          return backgroundImageArr[0]
        } else {
          return backgroundImageArr[backgroundImageArr.indexOf(backgroundImage) + 1]
        }
      })
    }, 5000);
  }, [backgroundImage, backgroundImageArr]);

  return (
    <div name='home' className='w-full h-screen bg-gray-200 bg-no-repeat bg-cover text-gray-500' style={{backgroundImage: `url(${backgroundImage})`}}>
      {/* Container */}
      
      <div className='max-w-[1000px] mx-auto px-8 pt-12 flex flex-col justify-center h-full'>
        <p className='text-yellow-500 text-3xl italic font-mono font-extrabold'>This is for =&gt;</p>
        <div
          data-aos="fade-in"
          data-aos-offset="300"
          data-aos-easing="ease-in-sine"
          data-aos-duration="2500"
        >
          <h1 className='text-4xl sm:text-7xl font-bold text-green-500 font-mono'>
            &lt;Code Hermit /&gt;;
          </h1>
          <h2 className='text-4xl sm:text-7xl font-bold text-blue-500 py-2'>
            Full Stack Web Developer.
          </h2>
        </div>
        <p 
          data-aos="fade-right"
          data-aos-offset="300"
          data-aos-easing="ease-in-sine"
          data-aos-duration="1500"
          className='text-[#8892b0] text-xl py-3 max-w-4xl font-cursive font-mono'
        >
          I specialize in building (and occasionally
          designing) responsive full-stack web applications using:
        </p>
        <div className='flex flex-col gap-1 py-2'>
            <a href='https://tailwindcss.com' className='self-start flex gap-2 font-semibold hover:text-cyan-400 text-lg md:text-xl font-mono'>Tailwindcss</a>
            <a href='https://nodejs.org' className='self-start flex gap-2 font-semibold hover:text-lime-500 text-lg md:text-xl font-mono'><FaNodeJs /> NodeJs</a>
            <a href='https://www.mongodb.com' className='self-start flex gap-2 font-semibold hover:text-green-600 text-lg md:text-xl font-mono'><FaWatchmanMonitoring /> MongoDB</a>
            <a href='https://reactjs.org' className='self-start flex gap-2 font-semibold hover:text-teal-400 text-lg md:text-xl font-mono'><FaReact /> ReactJS</a>
        </div>
        <div>
          <button className='group border-2 px-6 py-3 my-2 flex items-center rounded-md hover:rounded font-semibold text-green-500 border-green-500 hover:text-white hover:bg-green-600 hover:border-green-600'>
            View Work
            <span className='group-hover:rotate-90 duration-300'>
              <HiArrowNarrowRight className='ml-3 ' />
            </span>
          </button>
        </div>
      </div>
    </div>
  );
};

export default Home;
