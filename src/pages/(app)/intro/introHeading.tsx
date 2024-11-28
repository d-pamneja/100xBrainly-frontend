import AOS from "aos";
import "aos/dist/aos.css";
import { FlipWords } from "../../../components/ui/flipwords"
import { useEffect } from "react";

export function IntroHeading() {
  useEffect(() => {
    AOS.init({
        duration: 1000,
        once: true, 
    });
  }, []);

  const words = ["focused", "sharp", "organized", "thoughtful"];

  return (
    <div 
        className="h-[45rem] flex justify-start items-center px-16"
        data-aos="zoom-in-right"
        data-aos-delay={300}
    >
      <div className="text-6xl mx-auto text-white drop-shadow-[0_2px_2px_rgba(0,0,0,1)] text-left">
        Build your 100x
        <FlipWords words={words}/> <br/>
        second brain!!
      </div>
    </div>
  );
}
