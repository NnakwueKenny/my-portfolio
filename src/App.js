import About from "./components/About";
import Contact from "./components/Contact";
import Home from "./components/Home";
import Navbar from "./components/Navbar";
import Skills from "./components/Skills";
import Work from "./components/Work";
import AOS from 'aos';
import 'aos/dist/aos.css';

function App() {
  AOS.init();
  return (
    <div className=''>
      <Navbar />
      <Home />
      {/*<About />*/}
      <Skills />
      <Work />
      <Contact />
    </div>
  );
}

export default App;