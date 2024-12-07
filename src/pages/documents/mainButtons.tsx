import { z } from "zod"
import { zodResolver } from "@hookform/resolvers/zod"
import { PDFDocument } from 'pdf-lib';
import { cn } from "../../lib/utils"
import { useMediaQuery } from "react-responsive";
import { Button } from '../../components/ui/button'
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
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
import {
    Tooltip,
    TooltipContent,
    TooltipProvider,
    TooltipTrigger,
} from "@/components/ui/tooltip"  
import { useForm,SubmitHandler,Controller } from "react-hook-form"
import { IoMdDocument,} from "react-icons/io";
import { MdBlock } from "react-icons/md"
import {Loader2} from "lucide-react"
import { useMutation } from 'convex/react';
import { api } from "../../../convex/_generated/api"
import { addDocument, uploadDocumentPinecone, viewDocument } from "../../helpers/communicator";


export const ButtonDiv = ({className,limitExceeded} : {className? : string,limitExceeded : boolean} )=> {
    const { isLoggedIn } = useAuth()

    
    const errorHandler = (errors: any) => {
        console.log(errors)
      let errorsArray: string[] = [];
      Object.keys(errors).forEach((field) => {
        errorsArray.push(errors[field]?.message || "Invalid input");
      });
    
      if (errorsArray.length > 0) {
        toast.error(errorsArray[0]); 
      }
    };
    
    // Adding Documents Form and Functionalities
    // Add Document - AWS
    const addDocumentFormSchema = z.object({
      type: z.string().refine((type)=>["text","pdf"].includes(type),"Select a valid type."),
      filename : z.string().min(1,"Kindly enter a valid file name"),
      file: z.instanceof(FileList)
              .refine((fileList)=>fileList.length > 0,"Kindly upload a file")
              .refine((fileList)=>fileList[0].size < 3 * 1024 * 1024,"Maximum file size limit is 3MB.")
              .superRefine(async (fileList, ctx) => {
                const file = fileList[0];
                console.log(file.type)
          
                if (file.type !== "application/pdf") return; // The above processing is only for PDFs
          
                const arrayBuffer = await file.arrayBuffer();
                try {
                  const pdfDoc = await PDFDocument.load(arrayBuffer);
                  const pageCount = pdfDoc.getPageCount();
          
                  if (pageCount > 10) {
                    ctx.addIssue({
                      code: z.ZodIssueCode.custom,
                      message: "PDF exceeds the maximum page limit of 10.",
                    });
                  }
                } catch (err) {
                  ctx.addIssue({
                    code: z.ZodIssueCode.custom,
                    message: "Unable to process the PDF. Please try again.",
                  });
                }
              }),
    });
    
  type AddDocumentFormValues = z.infer<typeof addDocumentFormSchema>;

  const addDocumentForm = useForm<z.infer<typeof addDocumentFormSchema>>({
      resolver: zodResolver(addDocumentFormSchema),
      defaultValues: {
          filename : "",
          type : ""
      },
  });

    const setDocument : SubmitHandler<AddDocumentFormValues> = async (data)=>{
      const {type,filename,file} = data
      const userID = localStorage.getItem("userID")!
      const contentType = file[0].type
      const fileObject = file[0]
      
      try {
        const res = await addDocument(userID, type, filename, contentType, fileObject);
        
        const AWSData = {
          title : filename,
          type : type,
          key : res
        }

        return addDocumentConvexOnSubmitHandler(AWSData)

      } catch (error) {
          console.error("Upload failed on AWS:", error);
      }
    }

    // Convex Schema
    const documentConvexFormSchema = z.object({
        title: z.string().min(1, "Kindly enter a valid title."),
        type: z.string().refine((type)=>["text","pdf"].includes(type),"Select a valid type."),
        key : z.string()
      });
      
    type DocumentConvexValues = z.infer<typeof documentConvexFormSchema>;

    const createDocument = useMutation(api.document.createDocument)
    const addDocumentConvexOnSubmitHandler : SubmitHandler<DocumentConvexValues> = async (data) => {
        try {
            const { title, type,key } = data
            const userID = localStorage.getItem("userID")!
            const res = await createDocument({userID : userID, type : type,title : title, key : key})
            if (res) {
                const linkDetails = await viewDocument(key)
                if(linkDetails){
                  const link = linkDetails.url
                  const pineconeUpload = await uploadDocumentPinecone(userID,type,key,link)
                  if(pineconeUpload){
                    toast.success('Document Added Successfully', { id: 'addDocument' });
                    setTimeout(() => {
                      window.location.reload();
                    }, 1000);
                  }
                }
            }
        } catch (error : any) {
            console.log(error)
            return toast.error(`Could not add the document : ${error} `, { id: 'addDocument' });
        }
    }

  // Button Size Control
  const isSmall = useMediaQuery({maxWidth : 639})
  const isMedium = useMediaQuery({minWidth: 640, maxWidth : 1023})
  const size = isSmall ? "sm" : isMedium ? "md" : "lg"

    return (
      <div className={cn("flex",className)}>
        <Dialog>
            <DialogTrigger asChild>
              {!limitExceeded && (
                <Button
                    variant={"primaryDoc"}
                    size={size}
                    text="Add Documents"
                    startIcon={<IoMdDocument/>}
                />
              )}
            </DialogTrigger>
            {limitExceeded && (
                <TooltipProvider>
                  <Tooltip>
                    <TooltipTrigger>
                      <Button
                        variant={"destructive"}
                        size={size}
                        text="Max Limit Reached"
                        startIcon={<MdBlock/>}
                      />
                    </TooltipTrigger>
                    <TooltipContent>
                      <p>Only 3 document uploads allowed</p>
                    </TooltipContent>
                  </Tooltip>
                </TooltipProvider>              
              )}
            <DialogContent className="md:max-w-[600px] sm:max-w-[425px] max-w-[325px] rounded-xl">
              <form onSubmit={addDocumentForm.handleSubmit(setDocument,errorHandler)}>
                <DialogHeader>
                  <DialogTitle>Add Document</DialogTitle>
                  <DialogDescription>
                    With this, enable your document for AI querying. Drop it like it's hot! 
                  </DialogDescription>
                </DialogHeader>
                <div className="grid gap-4 py-4">
                  {/* Filename */}
                  <div className="grid grid-cols-4 items-center gap-2">
                    <Label htmlFor="filename" className="text-left">
                      Title
                    </Label>
                    <Input id="filename" {...addDocumentForm.register("filename")} className="col-span-3" />
                  </div>

                  {/* Type */}
                  <div className="grid grid-cols-4 items-center gap-2">
                    <Label htmlFor="type" className="text-left">
                      Type
                    </Label>
                    <Controller
                      name="type"
                      control={addDocumentForm.control}
                      render={({ field }) => (
                        <Select onValueChange={field.onChange} value={field.value}>
                          <SelectTrigger className="md:w-[410px] sm:w-[280px] w-[205px]">
                            <SelectValue placeholder="Select the type of document" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectGroup>
                              <SelectLabel>Document Type</SelectLabel>
                              <SelectItem value="text">Text</SelectItem>
                              <SelectItem value="pdf">PDF</SelectItem>
                            </SelectGroup>
                          </SelectContent>
                        </Select>
                      )}
                    />
                  </div>

                  {/* File Upload */}
                  <div className="grid grid-cols-4 items-center gap-2">
                    <Label htmlFor="file" className="text-left">
                      File
                    </Label>
                    <Input id="file" type="file" {...addDocumentForm.register("file")} className="col-span-3" />
                  </div>
                  

                </div>
                {/* Footer */}
                <DialogFooter>
                  {!addDocumentForm.formState.isSubmitting && (
                    <Button variant="primaryDoc" size="lg" text={"Add Document"} type="submit"></Button>
                  )}
                  {addDocumentForm.formState.isSubmitting && (
                    <Button disabled variant="primaryDoc" size="lg" startIcon={<Loader2 className="animate-spin"/>} text={"Uploading"} type="submit"></Button>
                  )}
                </DialogFooter>
              </form>
              </DialogContent>
        </Dialog>
      </div>
        
    )
}

export default {ButtonDiv}