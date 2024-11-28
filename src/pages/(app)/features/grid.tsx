"use client";
import AOS from "aos";
import "aos/dist/aos.css";
import { useEffect } from "react";
import { cn } from "@/lib/utils";
import { BentoGrid, BentoGridItem } from "../../../components/ui/bentoGrid";
import {
  IconClipboardCopy,
  IconUserShare,
  IconMessageChatbotFilled,
  IconReportAnalytics,
  IconTableColumn,
} from "@tabler/icons-react";
import { motion } from "framer-motion";


export function FeatureGrid() {

  useEffect(() => {
    AOS.init({
        duration: 1000,
        once: true, 
    });
  }, []);

  return (
    <div
        data-aos="flip-up"
        data-aos-delay={300}
    >
        <BentoGrid className="max-w-4xl mx-auto md:auto-rows-[20rem]">
            {items.map((item, i) => (
                <BentoGridItem
                key={i}
                title={item.title}
                description={item.description}
                header={item.header}
                className={cn("[&>p:text-lg]", item.className)}
                icon={item.icon}
                />
            ))}
        </BentoGrid>
    </div>
    
  );
}

const SkeletonOne = () => {
  const variants = {
    initial: {
      x: 0,
    },
    animate: {
      x: 10,
      rotate: 5,
      transition: {
        duration: 0.2,
      },
    },
  };
  const variantsSecond = {
    initial: {
      x: 0,
    },
    animate: {
      x: -10,
      rotate: -5,
      transition: {
        duration: 0.2,
      },
    },
  };

  return (
    <motion.div
      initial="initial"
      whileHover="animate"
      className="flex flex-1 w-full h-full min-h-[6rem] bg-dot-black/[0.4] flex-col space-y-2"
    >
      <motion.div
        variants={variants}
        className="flex flex-row rounded-full border border-neutral-300 p-2  items-center space-x-2 bg-black"
      >
        <div className="h-6 w-6 rounded-full bg-gradient-to-r from-pink-500 to-violet-500 flex-shrink-0" />
        <div className="w-full bg-gray-100 h-4 rounded-full" />
      </motion.div>
      <motion.div
        variants={variantsSecond}
        className="flex flex-row rounded-full border border-neutral-300 p-2 items-center space-x-2 w-3/4 ml-auto bg-black"
      >
        <div className="w-full bg-gray-100 h-4 rounded-full dark:bg-neutral-900" />
        <div className="h-6 w-6 rounded-full bg-gradient-to-r from-pink-500 to-violet-500 flex-shrink-0" />
      </motion.div>
      <motion.div
        variants={variants}
        className="flex flex-row rounded-full border border-neutral-300 p-2 items-center space-x-2 bg-black"
      >
        <div className="h-6 w-6 rounded-full bg-gradient-to-r from-pink-500 to-violet-500 flex-shrink-0" />
        <div className="w-full bg-gray-100 h-4 rounded-full dark:bg-neutral-900" />
      </motion.div>
    </motion.div>
  );
};

const SkeletonTwo = () => {
  const variants = {
    initial: {
      width: 0,
    },
    animate: {
      width: "100%",
      transition: {
        duration: 0.2,
      },
    },
    hover: {
      width: ["0%", "100%"],
      transition: {
        duration: 2,
      },
    },
  };
  const arr = new Array(6).fill(0);
  return (
    <motion.div
      initial="initial"
      animate="animate"
      whileHover="hover"
      className="flex flex-1 w-full h-full min-h-[6rem] bg-dot-black/[0.4] flex-col space-y-2"
    >
      {arr.map((_, i) => (
        <motion.div
          key={"skelenton-two" + i}
          variants={variants}
          style={{
            maxWidth: Math.random() * (100 - 40) + 40 + "%",
          }}
          className="flex flex-row rounded-full border border-neutral-300 p-2  items-center space-x-2 bg-neutral-100 w-full h-4"
        ></motion.div>
      ))}
    </motion.div>
  );
};
const SkeletonThree = () => {
  const variants = {
    initial: {
      backgroundPosition: "0 50%",
    },
    animate: {
      backgroundPosition: ["0, 50%", "100% 50%", "0 50%"],
    },
  };
  return (
    <motion.div
      initial="initial"
      animate="animate"
      variants={variants}
      transition={{
        duration: 5,
        repeat: Infinity,
        repeatType: "reverse",
      }}
      className="flex flex-1 w-full h-full min-h-[6rem] dark:bg-dot-white/[0.2] rounded-lg bg-dot-black/[0.2] flex-col space-y-2"
      style={{
        background:
          "linear-gradient(-45deg, #ee7752, #e73c7e, #23a6d5, #23d5ab)",
        backgroundSize: "400% 400%",
      }}
    >
      <motion.div className="h-full w-full rounded-lg"></motion.div>
    </motion.div>
  );
};
const SkeletonFour = () => {
  const first = {
    initial: {
      x: 20,
      rotate: -5,
    },
    hover: {
      x: 0,
      rotate: 0,
    },
  };
  const second = {
    initial: {
      x: -20,
      rotate: 5,
    },
    hover: {
      x: 0,
      rotate: 0,
    },
  };
  return (
    <motion.div
      initial="initial"
      animate="animate"
      whileHover="hover"
      className="flex flex-1 w-full h-full min-h-[6rem] dark:bg-dot-white/[0.2] bg-dot-black/[0.2] flex-row space-x-2"
    >
      <motion.div
        variants={first}
        className="h-full w-1/3 rounded-2xl bg-purple-900 p-4 border border-black flex flex-col items-center justify-center"
      >
        <img
          src="https://www.businessinsider.in/_next/image?url=https%3A%2F%2Fstaticbiassets.in%2Fthumb%2Fmsid-69927800%2Cwidth-700%2Cresizemode-4%2Cimgsize-71719%2Felon-musk-tweeted-an-occupy-mars-meme-but-he-was-mocked-because-it-featured-a-picture-of-the-moon.jpg&w=1080&q=75"
          height="100"
          width="100"
          className="rounded-full h-10 w-10"
        />
        <p className="sm:text-sm text-xs text-center font-semibold text-white mt-4">
          Elon Musk Tweets on DogeCoin
        </p>
        <p className="border border-white border-rounded bg-white text-xs text-black rounded-full px-2 py-0.5 mt-4">
          Text
        </p>
      </motion.div>
      <motion.div className="h-full w-1/3 rounded-2xl bg-purple-900 p-4 border border-black flex flex-col items-center justify-center">
        <img
          src="https://i1.sndcdn.com/artworks-sITnz5ROuLUmZDRC-gQWb9Q-t500x500.jpg"
          alt="avatar"
          height="100"
          width="100"
          className="rounded-full h-10 w-10"
        />
        <p className="sm:text-sm text-xs text-center font-semibold text-white mt-4">
          Wavy - Karan Aujla
        </p>
        <p className="border border-white border-rounded bg-white text-xs text-black rounded-full px-2 py-0.5 mt-4">
          Audio
        </p>
      </motion.div>
      <motion.div
        variants={second}
        className="h-full w-1/3 rounded-2xl bg-purple-900 p-4 border border-black flex flex-col items-center justify-center"
      >
        <img
          src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcStEFkIuT4GIjbF5sf6xJbHyWwqdtPtueUJlg&s"
          alt="avatar"
          height="100"
          width="100"
          className="rounded-full h-10 w-10"
        />
        <p className="sm:text-sm text-xs text-center font-semibold text-white mt-4">
          DSA or Dev - Harkirat
        </p>
        <p className="border border-white border-rounded bg-white text-xs text-black rounded-full px-2 py-0.5 mt-4">
          Video
        </p>
      </motion.div>
    </motion.div>
  );
};
const SkeletonFive = () => {
  const variants = {
    initial: {
      x: 0,
    },
    animate: {
      x: 10,
      rotate: 5,
      transition: {
        duration: 0.2,
      },
    },
  };
  const variantsSecond = {
    initial: {
      x: 0,
    },
    animate: {
      x: -10,
      rotate: -5,
      transition: {
        duration: 0.2,
      },
    },
  };

  return (
    <motion.div
      initial="initial"
      whileHover="animate"
      className="flex flex-1 w-full h-full min-h-[6rem] bg-dot-black/[0.2] flex-col space-y-2"
    >
    <motion.div
        variants={variantsSecond}
        className="flex flex-row rounded-full border border-neutral-100 p-2 items-center justify-end space-x-2 w-3/4 ml-auto bg-black"
      >
        <p className="text-xs text-white text-right">I want to find my resources about Web 3.0 roadmap</p>
        <img
          src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTCLk15snGGvayM65_rIFh5u2ct1UlB6wcV9Q&s"
          alt="avatar"
          height="100"
          width="100"
          className="rounded-full h-10 w-10"
        />
      </motion.div>
      <motion.div
        variants={variants}
        className="flex flex-row rounded-2xl border border-neutral-100 p-2  items-start space-x-2 bg-black"
      >
        <div className="h-6 w-6 rounded-full bg-gradient-to-r from-pink-500 to-violet-500 flex-shrink-0" />
        <p className="text-xs text-white text-left">
          Sure. You have saved many tweets regarding the in depth 
          roadmap to learn web 3.0, which are....
        </p>
      </motion.div>
      
    </motion.div>
  );
};

const items = [
    {
      title: "DocuTalk Wizard (Coming Soon)",
      description: (
        <span className="text-sm">
          Upload and chat with your documents via AI magic.
        </span>
      ),
      header: <SkeletonOne />,
      className: "md:col-span-1",
      icon: <IconClipboardCopy className="h-4 w-4 text-neutral-500" />,
    },
    {
      title: "Profile Prodigy (Coming Soon)",
      description: (
        <span className="text-sm">
          Unlock AI-powered insights for your resource bank.
        </span>
      ),
      header: <SkeletonTwo />,
      className: "md:col-span-1",
      icon: <IconReportAnalytics className="h-4 w-4 text-neutral-500" />,
    },
    {
      title: "Shared Spaces Guru",
      description: (
        <span className="text-sm">
          Share your resources and let others thrive with your workspace.
        </span>
      ),
      header: <SkeletonThree />,
      className: "md:col-span-1",
      icon: <IconUserShare className="h-4 w-4 text-neutral-500" />,
    },
    {
      title: "Bucket Brainiac",
      description: (
        <span className="text-sm">
          Organize and search data like a pro—store them in type-specific buckets!
        </span>
      ),
      header: <SkeletonFour />,
      className: "md:col-span-2",
      icon: <IconTableColumn className="h-4 w-4 text-neutral-500" />,
    },
    {
      title: "Query Genius (Coming Soon)",
      description: (
        <span className="text-sm">
          Ask AI anything and get instant answers from your resources.
        </span>
      ),
      header: <SkeletonFive />,
      className: "md:col-span-1",
      icon: <IconMessageChatbotFilled className="h-4 w-4 text-neutral-500" />,
    },
  ];
  
