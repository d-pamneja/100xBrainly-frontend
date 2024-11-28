"use client";
import { useState } from "react";
import {
  motion,
  AnimatePresence,
  useScroll,
  useMotionValueEvent,
} from "framer-motion";
import { cn } from "@/lib/utils";
import { Link as ScrollLink } from 'react-scroll';
import { useNavigate } from "react-router-dom";

export const FloatingNav = ({
  navItems,
  className,
}: {
  navItems: {
    name: string;
    link: string;
    icon?: JSX.Element;
  }[];
  className?: string;
}) => {
  const navigate = useNavigate()
  const { scrollYProgress } = useScroll();

  const [visible, setVisible] = useState(true);

  useMotionValueEvent(scrollYProgress, "change", (current) => {
    if (typeof current === "number") { // Check if current is not undefined and is a number, as direction will be represented by a number
      let direction = current! - scrollYProgress.getPrevious()!;

      if (scrollYProgress.get() < 0.1) { // If in the top 10% of the page, stay visble always, else change depending on direction
        setVisible(true);
      } else {
        if (direction < 0) { // Direction < 0 means the user is scrolling up, hence make it visible
          setVisible(true);
        } else { // Direction > 0 means the user is scrolling up, hence make it visible
          setVisible(false);
        }
      }
    }
  });

  return (
    <AnimatePresence mode="wait">
      <motion.div
        initial={{
          opacity: 1,
          y: -100,
        }}
        animate={{
          y: visible ? 0 : -100,
          opacity: visible ? 1 : 0,
        }}
        transition={{
          duration: 0.2,
        }}
        className={cn(
          "flex max-w-fit fixed top-10 inset-x-0 mx-auto border border-white/[0.2] rounded-full bg-black shadow-[0px_2px_3px_-1px_rgba(0,0,0,0.1),0px_1px_0px_0px_rgba(25,28,33,0.02),0px_0px_0px_1px_rgba(25,28,33,0.08)] z-[5000] pr-2 pl-8 py-2  items-center justify-center space-x-4",
          className
        )}
      >
        {navItems.map((navItem: any, idx: number) => (
          <ScrollLink
            key={`link=${idx}`}
            to={navItem.link}
            smooth={true}
            duration={200}  
            className={cn(
              "relative text-neutral-50 items-center flex space-x-1 hover:text-neutral-300 scroll-smooth cursor-pointer"
            )}
            color="white"
          >
            <span className="block sm:hidden">{navItem.icon}</span>
            <span className="hidden sm:block text-sm">{navItem.name}</span>
          </ScrollLink>
        ))}
        <div className="relative group">
          <button 
            className="relative z-10 border border-white/[0.4] text-sm font-medium relative text-white px-4 py-2 rounded-full"
            onClick={()=>{
              const redirect = "/login";
              navigate(redirect);
            }}
          >
            <span>Login</span>
            <span className="absolute inset-0 rounded-full border-[1.5px] border-transparent group-hover:border-purple-600 group-hover:animate-activateFullBorder" />
          </button>
        </div>
        <div className="relative group">
          <button 
            className="relative z-10 border border-white/[0.4] text-sm font-medium relative text-white px-4 py-2 rounded-full"
            onClick={()=>{
              const redirect = "/signup";
              navigate(redirect);
            }}
          >
            <span>Signup</span>
            <span className="absolute inset-0 rounded-full border-[1.5px] border-transparent group-hover:border-purple-700 group-hover:animate-activateFullBorder" />
          </button>
        </div>
      </motion.div>
    </AnimatePresence>
  );
};
