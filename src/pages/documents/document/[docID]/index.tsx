"use-client"
import { z } from "zod"
import { zodResolver } from "@hookform/resolvers/zod"
import { cn } from "../../../../lib/utils";
import { api } from "../../../../../convex/_generated/api"
import { useMutation } from "convex/react"
import { useNavigate, useParams } from 'react-router-dom';
import { Id } from "../../../../../convex/_generated/dataModel";
import {  useEffect, useRef, useState } from "react";
import { useForm,SubmitHandler } from "react-hook-form"
import { queryDoc, viewDocument } from "../../../../helpers/communicator";
import Button from "../../../../components/ui/button";
import { Input } from "../../../../components/ui/input";
import {Switch} from "../../../../components/ui/switch"
import { useMediaQuery } from "react-responsive";
import { IoMdArrowBack } from "react-icons/io";
import { FaUserCircle } from "react-icons/fa"
import { ChatGptIcon } from "hugeicons-react"
import {Loader2} from "lucide-react"
import ReactMarkdown from 'react-markdown'
import { FaArrowUp } from "react-icons/fa"
import { toast } from 'react-hot-toast';
import { AppSidebar } from "../../../../components/ui/app-sidebar";
import { SidebarProvider,SidebarTrigger } from "../../../../components/ui/sidebar";

type DocumentValues = {
  _id : Id<"documents">,
  userID : string,
  _creationTime : number,
  title : string,
  key : string,
  type : string,
  date : number,
  description? : string
}

export function DocumentView() {
  const { docID } = useParams<{ docID: string }>();
  const _id: Id<"documents"> = docID as Id<"documents">;


  const fetchConvexDoc = useMutation(api.document.viewDocument)

  const [document,setDocument] = useState<DocumentValues>()
  const [docLink,setDocLink] = useState<string>("")

  useEffect(()=>{
    const fetchDoc = async (_id : Id<"documents">)=>{
      const res = await fetchConvexDoc({_id})
      if(res){
        setDocument(res)
        const fetchLink = await viewDocument(res.key)
        if(fetchLink){
          setDocLink(fetchLink.url)
          console.log(fetchLink.url) // Debug
        }
        else{
          console.error(`Could not find the AWS Link for given document`)
        }
      }
      else{
        console.error(`Could not find the Convex document`)
      }

    }

    fetchDoc(_id)
  },[])


  return (
    <div className='flex flex-col w-full my-10'>
      <div className='flex justify-between w-full'>
        <MainSidebar/>
        {document && (
          <div className='flex flex-col w-full space-y-10'>
            <Header title={document.title}/>
            <div className='mx-10'>
              <DocPage document={document!} docLink={docLink} />
            </div>
          </div>
        )}
      </div>
    </div>      
  )
}

export function Header({title}:{title : string}){
  return (
    <div className='flex lg:flex-row flex-col lg:justify-between w-full'>
      <h1 className='text-5xl font-bold mx-4'>{title}</h1>
      <ButtonDiv className="lg:justify-end justify-center lg:my-0 my-[20px]"/>
    </div>
  )
}

export const ButtonDiv = ({className} : {className? : string} )=> {
  const navigate = useNavigate()
// Button Size Control
const isSmall = useMediaQuery({maxWidth : 639})
const isMedium = useMediaQuery({minWidth: 640, maxWidth : 1023})
const size = isSmall ? "sm" : isMedium ? "md" : "lg"

  return (
    <div className={cn("flex",className)}>
        <Button
            variant={"primaryDoc"}
            size={size}
            text="Documents Dashboard"
            startIcon={<IoMdArrowBack/>}
            onClick={()=>{
              const redirect = "/documents"
              navigate(redirect)
            }}
        />
    </div>
      
  )
}

export function MainSidebar() {
  return (
    <div className="flex justify-start">
        <SidebarProvider>
          <AppSidebar/>
          <SidebarTrigger/>
        </SidebarProvider>
      </div>
  )
}

export function DocPage({document,docLink}:{document : DocumentValues,docLink : string}){
  const isPDF = document.type==="pdf" ? true : false
  const [chatMode,setChatMode] = useState(false)

  const chatBoxRef = useRef<HTMLDivElement>(null)
  const [queries,setQueries] = useState<Array<QueryObjects>>([])
  const [answers,setAnswers] = useState<Array<AnswerObjects>>([])

  useEffect(()=>{
    if (chatBoxRef.current) {
      chatBoxRef.current.scrollTop = chatBoxRef.current.scrollHeight;
    }
  },[queries,answers])
  
  return (
      <main className="space-y-8">
        <div className="flex flex-col gap-6">
          <div className="flex justify-start items-center gap-2">
            <div className="font-semibold text-l">
              Chat Mode
            </div>
            <div className="flex justify-center">
              <Switch
                checked={chatMode} 
                onCheckedChange={() => {
                  setChatMode(!chatMode)
                }}
              />
            </div>
          </div>
          <div className="bg-slate-800 p-4 rounded h-[550px]">
            {!chatMode && (
                <iframe
                  className={`w-full h-full rounded ${isPDF ? "" : "bg-white"}`}
                  src={docLink}
                />
            )}
            
            {chatMode && (
              <ChatBox 
                document={document} 
                chatBoxRef={chatBoxRef}
                queries={queries}
                setQueries={setQueries}
                answers={answers}
                setAnswers={setAnswers}
              />
            )}
          </div>
          
        </div>
        {!document && <h1>Document Not Found</h1>}
      </main>
  )
}

type QueryObjects = {
  user : string,
}

type AnswerObjects = {
  brainly : string,
}

export function ChatBox({
  document,
  chatBoxRef,
  queries,
  setQueries,
  answers,
  setAnswers
}:{
  document: DocumentValues;
  chatBoxRef: React.RefObject<HTMLDivElement>; 
  queries: Array<QueryObjects>;
  setQueries: React.Dispatch<React.SetStateAction<Array<QueryObjects>>>;
  answers: Array<AnswerObjects>;
  setAnswers: React.Dispatch<React.SetStateAction<Array<AnswerObjects>>>;
}){

  useEffect(()=>{
    if (chatBoxRef.current) {
      chatBoxRef.current.scrollTop = chatBoxRef.current.scrollHeight;
    }
  },[queries,answers])

  // Start Chatting Button Highlight
  const [isHighlighted, setIsHighlighted] = useState(false);
  const handleHighlight = () => {
    setIsHighlighted(true);
    setTimeout(() => {
      setIsHighlighted(false);
    }, 1000);
    
  };

  // Query Functionalities
  const querySchema = z.object({
    user_query : z.string().min(1,"Kindly enter a valid query")
    });
    
  type QueryValues = z.infer<typeof querySchema>;

  const queryForm = useForm<z.infer<typeof querySchema>>({    
      resolver: zodResolver(querySchema),
      defaultValues: {
        user_query : ""
      },
  });

  const sendQuery : SubmitHandler<QueryValues> = async (data)=>{ 
    try{
      const {user_query} = data
      const query : QueryObjects = {
        user : user_query
      }
      setQueries([...queries,query])

      const userID = document.userID
      const key = document.key
      const res = await queryDoc(user_query,userID,key)

      if (res) {
        const answer : AnswerObjects = {
          brainly : res.output.response
        }
        setAnswers([...answers,answer])
        queryForm.reset(); 
      }
    }
    catch (error : any) {
      console.log(error)
      return toast.error(`Could not fetch the query : ${error} `, { id: 'fetchquery' });
    }
  }
  

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

  return (
    <div className={`flex flex-col h-full w-full rounded bg-indigo-900 w-full h-full text-white`}>
      {queries.length === 0 && (
        <div className="flex flex-col justify-center items-center h-full text-center">
          <h1 className="text-4xl font-bold mb-4">Welcome to Chat Mode!</h1>
          <p className="text-lg text-gray-300 mb-4">
            Ask any question, and I'll provide the answers you need. Start your conversation now!
          </p>
          <button
            className="bg-violet-500 hover:bg-violet-700 text-white font-semibold py-2 px-6 rounded-lg shadow-md transition-all"
            onClick={() => handleHighlight()}
          >
            Start Chatting
          </button>
        </div>
      )}
      
      {queries.length > 0 && (
        <div ref={chatBoxRef} className="h-5/6 overflow-y-auto p-4">
            <div className="h-full p-4">
                {/* Chat messages */}
                {queries.map((query, index) => (
                  <div key={index} className="flex flex-col mb-4">
                    {/* User messages */}
                    <div className="flex justify-end items-center gap-2 mb-4">
                      {/* User Chat Bubble */}
                      <div className="max-w-[75%] bg-blue-200 text-black px-4 py-2 rounded-lg shadow text-right">
                        {query.user}
                      </div>

                      {/* User Icon */}
                      <FaUserCircle className="w-10 h-10 text-blue-500 text-2xl" />
                    </div>


                    {/* LLM response */}
                    {!answers[index] && (
                      <div className="flex justify-start items-center gap-2 mb-4">
                        {/* LLM Loading Icon */}
                        <ChatGptIcon 
                          size={48} 
                          color={"#9F7AEA"}
                          className="animate-spin"
                        />
                      </div>
                    )}

                    {answers[index] && (
                      <div className="flex justify-start items-center gap-2 mb-4">
                        {/* LLM Icon */}
                        <ChatGptIcon 
                          size={48} 
                          color={"#9F7AEA"} 
                        />

                        {/* LLM Chat Bubble */}
                        <div className="self-start max-w-[75%] bg-violet-200 text-black px-4 py-2 rounded-lg shadow mt-2 text-left">
                          <ReactMarkdown>{answers[index].brainly}</ReactMarkdown>
                        </div>
                      </div>
                    )}
                  </div>
                ))}
            </div>
        </div>
      )}

      <form className="flex justify-end items-end w-full p-8" onSubmit={queryForm.handleSubmit(sendQuery,errorHandler)}>
          <Input 
            id="user_query" 
            type="user_query" 
            {...queryForm.register("user_query")} 
            className={`h-[50px] bg-white text-black transition-all outline-none ${
              isHighlighted ? "ring-4 ring-blue-500" : ""
            }`}
          />

          {!queryForm.formState.isSubmitting && (
            <Button size={"xl"} startIcon={<FaArrowUp/>} type="submit"></Button>
          )}
          {queryForm.formState.isSubmitting && (
            <Button disabled size={"xl"} startIcon={<Loader2 className="animate-spin"/>} type="submit"></Button>
          )}
      </form>
    </div>
  )
}


export default DocumentView