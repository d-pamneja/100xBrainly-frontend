"use client";
import React, { useState,useEffect,useRef } from "react";
import { motion } from "framer-motion";
import { AiOutlineDelete,AiOutlineEye} from "react-icons/ai";
import { cn } from "@/lib/utils";
import Button from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogClose,
  DialogTrigger
} from "@/components/ui/dialog"
import { Id } from "../../../convex/_generated/dataModel";
import { useNavigate } from "react-router-dom";
import { EyeIcon, Loader2 } from "lucide-react";

export const DocumentWobbleCard = ({
  children,
  containerClassName,
  className, 
  isAuth,
  _id,
  title,
  type,
  docKey,
  date,
  deleteFunction,
  description,
  deletionInProgress
}: {
  children: React.ReactNode
  containerClassName?: string
  className?: string
  isAuth : boolean
  _id : Id<"documents">,
  title : string,
  type : string,
  docKey : string,
  date : number,
  deleteFunction? : (_id : Id<"documents">,docKey:string)=> Promise<any>,
  description? : string,
  deletionInProgress : boolean
}) => {

  const navigate = useNavigate()

  // Card Wobble Effect 
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const [isHovering, setIsHovering] = useState(false);

  const handleMouseMove = (event: React.MouseEvent<HTMLElement>) => {
    const { clientX, clientY } = event;
    const rect = event.currentTarget.getBoundingClientRect();
    const x = (clientX - (rect.left + rect.width / 2)) / 20;
    const y = (clientY - (rect.top + rect.height / 2)) / 20;
    setMousePosition({ x, y });
  };

  return (
    <motion.section
      onMouseMove={handleMouseMove}
      onMouseEnter={() => setIsHovering(true)}
      onMouseLeave={() => {
        setIsHovering(false);
        setMousePosition({ x: 0, y: 0 });
      }}
      style={{
        transform: isHovering
          ? `translate3d(${mousePosition.x}px, ${mousePosition.y}px, 0) scale3d(1, 1, 1)`
          : "translate3d(0px, 0px, 0) scale3d(1, 1, 1)",
        transition: "transform 0.1s ease-out",
      }}
      className={cn(
        "mx-auto w-full bg-violet-800 relative rounded-2xl overflow-hidden",
        containerClassName
      )}
    >
      
    <div className="relative w-full">
      {title && (
          <h2 className="absolute top-4 left-4 max-w-80 flex items-center text-left text-balance text-base lg:text-xl md:text-md text-xl font-semibold tracking-[-0.015em] text-white break-words pr-32"
              style={{
                  maxWidth: `calc(100% - 40px)`, 
                  wordBreak: 'break-word', 
              }}
          >
              {title}
      </h2>
      
      )}

      <div>
        {/* VIEW BUTTON - ONLY AUTHROIZED USER WILL BE ALLOWED */}
        {_id && isAuth &&(
            <Button 
                variant={"ghost"}
                className="absolute top-4 right-14 flex items-center text-white z-50 bg-black/20 p-2 rounded-full backdrop-blur-sm"
                startIcon={<EyeIcon className="w-6 h-6 stroke-current" />}
                onClick={()=>{
                    const docID = _id // Just used for resolving easier naming conflict later
                    const redirect = `./document/${docID}`
                    navigate(redirect)
                }}
            />
        )}
      </div>

      <div>
        {/* DELETE BUTTON - ONLY AUTHROIZED USER WILL BE ALLOWED */}
        {_id && isAuth &&(
          <Dialog>
            <DialogTrigger asChild>
                <Button 
                  variant={"ghost"}
                  className="absolute top-4 right-2 flex items-center text-white z-50 bg-black/20 p-2 rounded-full backdrop-blur-sm"
                  startIcon={<AiOutlineDelete className="w-6 h-6 stroke-current" />}
              />
            </DialogTrigger>
            <DialogContent className="md:max-w-[500px] sm:max-w-[425px] max-w-[300px] rounded-xl">
              <DialogHeader>
                  <DialogTitle>
                    Are you sure you want to delete this document?
                  </DialogTitle>
                  <DialogDescription>
                    This action is irreversible.
                  </DialogDescription>
              </DialogHeader>
              <div className="flex justify-center">
                {!deletionInProgress && (
                  <Button
                    variant={"destructive"}
                    text={"Delete"}
                    onClick={()=>{
                      deleteFunction!(_id,docKey)
                    }}
                  />
                )}
                {deletionInProgress && (
                  <Button
                    variant={"destructive"}
                    startIcon={<Loader2 className="animate-spin"/>}
                    disabled
                    onClick={()=>{
                      deleteFunction!(_id,docKey)
                    }}
                  />
                )}
                
                <DialogClose asChild>
                  {!deletionInProgress && (
                    <Button
                      variant={"ghostDark"}
                      text={"Cancel"}
                    />
                  )}
                </DialogClose>
                </div>
            </DialogContent>
          </Dialog>
        )}
      </div>
    
    </div>
    

    <div
      className="relative h-full [background-image:radial-gradient(88%_100%_at_top,rgba(255,255,255,0.5),rgba(255,255,255,0))] sm:mx-0 sm:rounded-2xl overflow-hidden"
      style={{
        boxShadow:
          "0 10px 32px rgba(34, 42, 53, 0.12), 0 1px 1px rgba(0, 0, 0, 0.05), 0 0 0 1px rgba(34, 42, 53, 0.05), 0 4px 6px rgba(34, 42, 53, 0.08), 0 24px 108px rgba(47, 48, 55, 0.10)",
      }}
    >
      <motion.div
        style={{
          transform: isHovering
            ? `translate3d(${-mousePosition.x}px, ${-mousePosition.y}px, 0) scale3d(1.03, 1.03, 1)`
            : "translate3d(0px, 0px, 0) scale3d(1, 1, 1)",
          transition: "transform 0.1s ease-out",
        }}
        className={cn("h-full px-4 py-20 sm:px-10 relative", className)}
      >
        <Noise />
        <div className="relative z-10">
          {children}
        </div>
      </motion.div>
    </div>
    </motion.section>
  );
};

const Noise = () => {
  return (
    <div
      className="absolute inset-0 w-full h-full scale-[1.2] transform opacity-10 [mask-image:radial-gradient(#fff,transparent,75%)]"
      style={{
        backgroundImage: "url(/noise.webp)",
        backgroundSize: "30%",
      }}
    ></div>
  );
};
