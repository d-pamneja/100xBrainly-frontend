"use client";
import { z } from "zod"
import { zodResolver } from "@hookform/resolvers/zod"
import React, { useState,useEffect,useRef } from "react";
import toast from "react-hot-toast";
import { motion } from "framer-motion";
import { AiOutlineLink } from "react-icons/ai";
import { AiOutlineDelete,AiOutlineEdit} from "react-icons/ai";
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { cn } from "@/lib/utils";
import { editContent } from "@/helpers/communicator";
import Button from "./button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogClose,
  DialogTrigger
} from "@/components/ui/dialog"
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { FancyMultiSelect } from "@/components/ui/multi-select";
import type { Tag } from "@/components/ui/multi-select";
import { useForm,SubmitHandler,Controller } from "react-hook-form"
import { useAuth } from "@/context/AuthContext";

export const WobbleCard = ({
  children,
  containerClassName,
  className, 
  isAuth,
  id,
  title,
  link,
  type,
  tags,
  deleteFunction,
  description
}: {
  children: React.ReactNode
  containerClassName?: string
  className?: string
  isAuth : boolean
  id : string,
  title : string,
  link : string,
  type : string,
  tags : Tag[],
  deleteFunction? : (id : string)=> Promise<any>,
  description? : string
}) => {
  const {isLoggedIn} = useAuth()

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

  // Edit Content Utils
  const formSchema = z.object({
    contentID : z.string(),
    title: z.string().min(1, "Kindly enter a valid title."),
    description : z.string().optional(),
    link: z.string().url({ message: "Invalid URL" }),
    type: z.string().refine((type)=>["text","audio","image","video"].includes(type),"Select a valid type."),
    tags : z.array(z.object({
      value : z.string()
    })).nonempty({message : "Kindly enter at least one tag"})
  });
  
  type FormValues = z.infer<typeof formSchema>;
  
  const editContentOnSubmitHandler: SubmitHandler<FormValues> = async (data) => {
    const { contentID,title, link, type, tags,description } = data;
    try {
      if(isLoggedIn){
        const res = description ? await editContent(contentID,title,link,type,tags,description) : await editContent(contentID,title,link,type,tags)
        if (res) {
          toast.success('Content Modified Successfully', { id: 'editContent' });
          setTimeout(() => {
              window.location.reload();
            }, 1000);
          }
        }
    } catch (error : any){
      if(error.status===400){
        console.log(error)
        return toast.error(`Could not edit the content : ${error.response.data.message} `, { id: 'editContent' });
      }
    }
  };
  
  const editContentOnErrorHandler = (errors: any) => {
    let errorsArray: string[] = [];
    Object.keys(errors).forEach((field) => {
      errorsArray.push(errors[field]?.message || "Invalid input");
    });
  
    if (errorsArray.length > 0) {
      toast.error(errorsArray[0]); 
    }
  };

  
  const [selectedTags, setSelectedTags] = useState<Tag[]>(tags);
  

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      contentID : id,
      title: title,
      link: link,
      type: type,
      description : description ? description : undefined
    },
  });

  useEffect(() => { // Hook to update values of tags selected
    // @ts-ignore
    form.setValue("tags", selectedTags);
    form.setValue("contentID",id);
  }, [selectedTags, form]);

  const linkButtonPos = isAuth ? "110px" : "20px"

  return (
    <section
      // onMouseMove={handleMouseMove}
      // onMouseEnter={() => setIsHovering(true)}
      // onMouseLeave={() => {
      //   setIsHovering(false);
      //   setMousePosition({ x: 0, y: 0 });
      // }}
      style={{
        transform: isHovering
          ? `translate3d(${mousePosition.x}px, ${mousePosition.y}px, 0) scale3d(1, 1, 1)`
          : "translate3d(0px, 0px, 0) scale3d(1, 1, 1)",
        transition: "transform 0.1s ease-out",
      }}
      className={cn(
        "mx-auto w-full bg-indigo-800 relative rounded-2xl overflow-hidden",
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
        {link && (
          <a 
            target="_blank"  
            href={link} 
            rel="noopener noreferrer" 
            className="absolute top-4 flex items-center text-white hover:bg-black/30 z-50 bg-black/20 p-2 rounded-full backdrop-blur-sm"
            style={{right : linkButtonPos}}
          >
            <AiOutlineLink className="w-6 h-6 stroke-current" />
          </a>
        )}

        {/* EDIT BUTTON - ONLY AUTHROIZED USER WILL BE ALLOWED */}
        {id && isAuth && (
              <Dialog>
                <DialogTrigger asChild>
                    <Button 
                    variant={"ghost"}
                    className="absolute top-4 right-14 flex items-center text-white z-50 bg-black/20 p-2 rounded-full backdrop-blur-sm"
                    startIcon={<AiOutlineEdit className="w-6 h-6 stroke-current" />}
                  />
                </DialogTrigger>
                <DialogContent className="md:max-w-[600px] sm:max-w-[425px] max-w-[325px] rounded-xl">
                  <form onSubmit={form.handleSubmit(editContentOnSubmitHandler,editContentOnErrorHandler)}>
                    <DialogHeader>
                          <DialogTitle>
                            Edit Content
                          </DialogTitle>
                          <DialogDescription>
                            Time for a tweak! Let's polish that nugget of wisdom to perfection.
                          </DialogDescription>
                      </DialogHeader>

                      <div className="grid gap-4 py-4">
                          {/* Title */}
                          <div className="grid grid-cols-4 items-center gap-2">
                            <Label htmlFor="title" className="text-left">
                              Title
                            </Label>
                            <Input id="title" {...form.register("title")} className="col-span-3" />
                          </div>

                          {/* Link */}
                          <div className="grid grid-cols-4 items-center gap-2">
                            <Label htmlFor="link" className="text-left">
                              Link
                            </Label>
                            <Input id="link" {...form.register("link")} className="col-span-3" />
                          </div>

                          {/* Type */}
                          <div className="grid grid-cols-4 items-center gap-2">
                            <Label htmlFor="type" className="text-left">
                              Type
                            </Label>
                            <Controller
                              name="type"
                              control={form.control}
                              render={({ field }) => (
                                <Select onValueChange={field.onChange} value={field.value}>
                                  <SelectTrigger className="md:w-[410px] sm:w-[280px] w-[205px]">
                                    <SelectValue placeholder="Select the type of data" />
                                  </SelectTrigger>
                                  <SelectContent>
                                    <SelectGroup>
                                      <SelectLabel>Content Type</SelectLabel>
                                      <SelectItem value="text">Text</SelectItem>
                                      <SelectItem value="audio">Audio</SelectItem>
                                      <SelectItem value="image">Image</SelectItem>
                                      <SelectItem value="video">Video</SelectItem>
                                    </SelectGroup>
                                  </SelectContent>
                                </Select>
                              )}
                            />
                          </div>

                          {/* Description */}
                          <div className="grid grid-cols-4 items-center gap-2">
                            <Label 
                              htmlFor="description" 
                              className="text-left" 
                              style={{
                                maxWidth: `calc(100%)`, 
                                wordBreak: 'break-word', 
                            }}>
                              Description
                            </Label>
                            <Input id="description" {...form.register("description")} className="col-span-3" />
                          </div>

                          {/* Tags */}
                          <div className="grid grid-cols-4 items-center gap-2">
                            <Label htmlFor="tags" className="text-left">
                              Tags
                            </Label>
                            <div className="col-span-3">
                              <FancyMultiSelect
                                selected={selectedTags}
                                setSelected={setSelectedTags}
                              />
                            </div>
                          </div>
                        </div>
                        {/* Footer */}
                        <DialogFooter className="flex justify-center">
                            <Button
                              variant={"primary"}
                              text={"Edit Content"}
                              type="submit"
                            />
                            <DialogClose asChild>
                              <Button
                                variant={"ghostDark"}
                                text={"Cancel"}
                              />
                            </DialogClose>
                        </DialogFooter>
                  </form>
                </DialogContent>
              </Dialog>
        )}

        {/* DELETE BUTTON - ONLY AUTHROIZED USER WILL BE ALLOWED */}
        {id && isAuth &&(
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
                    Are you sure you want to delete this item?
                  </DialogTitle>
                  <DialogDescription>
                    This action is irreversible.
                  </DialogDescription>
              </DialogHeader>
              <div className="flex justify-center">
                <Button
                  variant={"destructive"}
                  text={"Delete"}
                  onClick={()=>{
                    deleteFunction!(id)
                  }}
                />
                <DialogClose asChild>
                  <Button
                    variant={"ghostDark"}
                    text={"Cancel"}
                  />
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
    </section>
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
