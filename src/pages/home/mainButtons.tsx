import { z } from "zod"
import { zodResolver } from "@hookform/resolvers/zod"
import { cn } from "../../lib/utils"
import { useState,useEffect } from "react";
import { useMediaQuery } from "react-responsive";
import { Button } from '../../components/ui/button'
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Switch } from "@/components/ui/switch"
import { toast } from 'react-hot-toast';
import { useAuth } from "@/context/AuthContext";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
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
import { CiShare2 } from "react-icons/ci";
import { IoIosAdd } from "react-icons/io";
import { addContent,linkStatus,shareBrain } from "@/helpers/communicator";
import {dracula} from "react-syntax-highlighter/dist/cjs/styles/hljs";
import LinkBlock from "@/components/ui/linkBlock";

export const ButtonDiv = ({className} : {className? : string} )=> {
    const { isLoggedIn } = useAuth()

    // Content Form and Functionalities
    const contentFormSchema = z.object({
      title: z.string().min(1, "Kindly enter a valid title."),
      link: z.string().url({ message: "Invalid URL" }),
      type: z.string().refine((type)=>["text","audio","image","video"].includes(type),"Select a valid type."),
      description : z.string().optional(),
      tags : z.array(z.object({
        value : z.string()
      })).nonempty({message : "Kindly enter at least one tag"})
    });
    
    type ContentFormValues = z.infer<typeof contentFormSchema>;
    
    const addContentOnSubmitHandler: SubmitHandler<ContentFormValues> = async (data) => {
      const { title, link, type, tags,description } = data;
      try {
        if(isLoggedIn){
          const res = description ? await addContent(title,link,type,tags,description) : await addContent(title,link,type,tags)
          if (res) {
            toast.success('Content Added Successfully', { id: 'addContent' });
            setTimeout(() => {
                window.location.reload();
              }, 1000);
            }
          }
      } catch (error : any){
        if(error.status===400){
          console.log(error)
          return toast.error(`Could not add the content : ${error.response.data.message} `, { id: 'addContent' });
        }
      }
    };
    
    const errorHandler = (errors: any) => {
      let errorsArray: string[] = [];
      Object.keys(errors).forEach((field) => {
        errorsArray.push(errors[field]?.message || "Invalid input");
      });
    
      if (errorsArray.length > 0) {
        toast.error(errorsArray[0]); 
      }
    };

    const [selectedTags, setSelectedTags] = useState<Tag[]>([]);
    
    const contentForm = useForm<z.infer<typeof contentFormSchema>>({
      resolver: zodResolver(contentFormSchema),
      defaultValues: {
        title: "",
        link: "",
        type: "",
        description : "",
        tags: [],
      },
    });

    useEffect(() => { // Hook to update values of tags selected
      // @ts-ignore
      contentForm.setValue("tags", selectedTags);
    }, [selectedTags, contentForm]);

    // Share Brain Form and Functionalities
    const shareFormSchema = z.object({
      share : z.boolean(),
    });
    
    type shareFormValues = z.infer<typeof shareFormSchema>;

    const [sharedLink, setSharedLink] = useState<string | null>(null)

    const shareOnSubmitHandler : SubmitHandler<shareFormValues> = async (data) => {
      const { share } = data;
      try {
        if(isLoggedIn){
          const res = await shareBrain(share)
          if(res){
            if(res.link) {
              setSharedLink(res.link)
              toast.success('Brain Sharing Enabled', { id: 'shareBrain' });
              return data
            }
            else{
              setSharedLink(null)
              toast.success('Brain Sharing Disabled', { id: 'shareBrain' });
              return data
            }
          }
        }
      } catch (error : any){
        if(error.status===400){
          console.log(error)
          return toast.error(`Could not enable/disable brain sharing : ${error.response.data.message} `, { id: 'shareBrain' });
        }
      }
    };
    
    // We will use the same error handler as we used for add content
    
    // Status Check of Pre existing shared Link 
    const [status, setStatus] = useState<boolean | null>(null);

    useEffect(() => { // This will fetch the intial link status and if true, well set the link automatically so that it can be displayed
      const fetchInitialData = async () => {
        try {
          const [linkStatusResponse] = await Promise.all([linkStatus()]);
          if (linkStatusResponse && linkStatusResponse.linkStatus !== undefined) {
            if(linkStatusResponse.linkStatus === true){
              setSharedLink(linkStatusResponse.linkCheck[0].hash)
            }
            setStatus(linkStatusResponse.linkStatus);
            shareForm.reset({ share: linkStatusResponse.linkStatus });
          } else {
            console.error("Invalid response structure:", linkStatusResponse);
          }
        } catch (error: any) {
          console.error("Error fetching initial data:", error.message);
        }
      };
    
      fetchInitialData();
    }, []);

    const shareForm = useForm<z.infer<typeof shareFormSchema>>({
      resolver: zodResolver(shareFormSchema),
      defaultValues: {
        share : status ?? false,
      },
    });
    
    
    // Button Size Control
    const isSmall = useMediaQuery({maxWidth : 639})
    const isMedium = useMediaQuery({minWidth: 640, maxWidth : 1023})
    const size = isSmall ? "sm" : isMedium ? "md" : "lg"

    
    return (
      <div className={cn("flex",className)}>
        <Dialog>
          <DialogTrigger asChild>
                <Button
                    variant={"secondary"}
                    size={size}
                    text="Share Content"
                    startIcon={<CiShare2/>}
                />
          </DialogTrigger>
          <DialogContent className="md:max-w-[600px] sm:max-w-[425px] max-w-[325px] rounded-xl overflow-hidden">
              <DialogHeader>
                <DialogTitle>Share Dashboard</DialogTitle>
                <DialogDescription>
                  Let the world see your brainchild! Share your dashboard and inspire!
                </DialogDescription>
              </DialogHeader>
              <div className="grid gap-4 py-4">
                <form onSubmit={shareForm.handleSubmit(shareOnSubmitHandler, errorHandler)}>
                  <Controller
                    name="share"
                    control={shareForm.control}
                    render={({ field }) => (
                      <div>
                        <Switch
                          id="share"
                          checked={field.value} 
                          onCheckedChange={(checked) => {
                            field.onChange(checked); 
                            shareForm.handleSubmit(shareOnSubmitHandler, errorHandler)(); // This will trigger the form submission immediately after state changes
                          }}
                        />
                        <Label className="mx-2" htmlFor="share">Share Mode</Label>
                      </div>
                    )}
                  />
                </form>
              </div>
              {sharedLink && (
                <div className="my-4 text-balance">
                  <div
                    className="overflow-hidden rounded-xl border bg-background p-4 w-full"
                    style={{
                      maxWidth: "100%",
                      wordBreak: "break-all",
                    }}
                  >
                    <LinkBlock style={dracula} code={sharedLink} language={'bash'} />
                  </div>
                </div>
              )}
          </DialogContent>
        </Dialog>
        <Dialog>
            <DialogTrigger asChild>
              <Button
                  variant={"primary"}
                  size={size}
                  text="Add Content"
                  startIcon={<IoIosAdd/>}
              />
            </DialogTrigger>
            <DialogContent className="md:max-w-[600px] sm:max-w-[425px] max-w-[325px] rounded-xl">
              <form onSubmit={contentForm.handleSubmit(addContentOnSubmitHandler,errorHandler)}>
                <DialogHeader>
                  <DialogTitle>Add Content</DialogTitle>
                  <DialogDescription>
                    Go ahead and log that awesome piece of information for your second brain!!
                  </DialogDescription>
                </DialogHeader>
                <div className="grid gap-4 py-4">
                  {/* Title */}
                  <div className="grid grid-cols-4 items-center gap-2">
                    <Label htmlFor="title" className="text-left">
                      Title
                    </Label>
                    <Input id="title" {...contentForm.register("title")} className="col-span-3" />
                  </div>

                  {/* Link */}
                  <div className="grid grid-cols-4 items-center gap-2">
                    <Label htmlFor="link" className="text-left">
                      Link
                    </Label>
                    <Input id="link" {...contentForm.register("link")} className="col-span-3" />
                  </div>

                  {/* Type */}
                  <div className="grid grid-cols-4 items-center gap-2">
                    <Label htmlFor="type" className="text-left">
                      Type
                    </Label>
                    <Controller
                      name="type"
                      control={contentForm.control}
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
                    }}
                    >
                      Description
                    </Label>
                    <Input id="description" {...contentForm.register("description")} className="col-span-3" />
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
                <DialogFooter>
                  <Button size="lg" text={"Add Content"} type="submit"></Button>
                </DialogFooter>
              </form>
              </DialogContent>
        </Dialog>
      </div>
        
    )
}

export default {ButtonDiv}