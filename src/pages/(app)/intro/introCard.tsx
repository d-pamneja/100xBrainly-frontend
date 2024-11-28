"use client";
import { CardBody, CardContainer, CardItem } from "../../../components/ui/3DCard";
import AOS from "aos";
import "aos/dist/aos.css";
import { useNavigate } from "react-router-dom";
import { useEffect } from "react";
import { cn } from "@/lib/utils";

export function IntroCard({className}:{className? : string}) {
  const navigate = useNavigate()

  useEffect(() => {
    AOS.init({
        duration: 1000,
        once: true, 
    });
  }, []);

  return (
    <div
      data-aos="zoom-in-left"
      data-aos-delay={300}
      className="my-14 px-16"
    >
      <CardContainer className={cn("inter-var",className)}>
        <CardBody className="bg-purple-900 relative group/card  w-auto sm:w-[30rem] h-auto rounded-xl p-6 hover:shadow-4xl shadow-[0_2.8px_2.2px_rgba(0,_0,_0,_0.034),_0_6.7px_5.3px_rgba(0,_0,_0,_0.048),_0_12.5px_10px_rgba(0,_0,_0,_0.06),_0_22.3px_17.9px_rgba(0,_0,_0,_0.072),_0_41.8px_33.4px_rgba(0,_0,_0,_0.086),_0_100px_80px_rgba(0,_0,_0,_0.12)]">
          <CardItem
            translateZ="50"
            className="text-xl font-bold text-white"
          >
            Where Your Ideas Take Flight
          </CardItem>
          <CardItem
            as="p"
            translateZ="60"
            className="text-sm max-w-sm mt-2 text-neutral-300 text-center"
          >
            Create, share, and manage AI-enhanced workspaces. Store everything from links to documents and get instant AI-powered insights
          </CardItem>
          <CardItem translateZ="100" className="w-full mt-4">
            <img
              src="https://images.unsplash.com/photo-1483058712412-4245e9b90334?q=80&w=2940&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
              height="800"
              width="800"
              className="h-60 w-full object-cover rounded-xl group-hover/card:shadow-xl"
              alt="thumbnail"
            />
          </CardItem>
          <div className="flex justify-between items-center mt-20">
            <CardItem
              as={"a"}
              translateZ={20}
              href="https://twitter.com/dpamneja"
              target="__blank"
              className="px-4 py-2 rounded-xl text-xs font-normal text-white"
              
            >
              Connect Now →
            </CardItem>
            <CardItem
              translateZ={20}
              as="button"
              onClick={()=>{
                const redirect = "./signup"
                navigate(redirect)
              }}
              className="px-4 py-2 rounded-xl bg-white text-black text-xs font-bold"
            >
              Sign up
            </CardItem>
          </div>
        </CardBody>
    </CardContainer>
    </div>
  )
}
