"use client";
import { AppSidebar } from '../../components/ui/app-sidebar'
import { SidebarProvider, SidebarTrigger } from "../../components/ui/sidebar"
import { DocStack } from './docs';
import { useState,useEffect } from "react";
import { ButtonDiv } from './mainButtons';
import { Id } from '../../../convex/_generated/dataModel';
import { useAuth } from "@/context/AuthContext";
import { useMutation } from 'convex/react';
import { api } from "../../../convex/_generated/api"

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

export function DocumentsDashboard() {

  const {isLoggedIn} = useAuth()

  // Fetching Documents Form and Functionalities
  // Convex Schema
  const [docsInfo,setDocsInfo] = useState<DocumentValues[]> ([])

  const viewAllDocuments = useMutation(api.document.viewAllDocuments)
  const fetchAllDocsInfo = async (userID : string) : Promise<DocumentValues[]> =>{
      if(isLoggedIn){
          const res = await viewAllDocuments({userID : userID})
          if(res){
              return res
          }
          else{
              console.log(`Error fetching doc info :  `,res)
          }
      }
      return []
  }

  useEffect(()=>{
      const loadDocs = async () => {
          try {
            const data = await fetchAllDocsInfo(localStorage.getItem("userID")!);
            setDocsInfo(data); 
          } catch (error) {
            console.error("Error fetching documents:", error); 
          }
      };
    
      loadDocs();
  },[])

  return (
    <div className='flex flex-col w-full my-10'>
      <div className='flex justify-between w-full'>
        <MainSidebar/>
        <div className='flex flex-col w-full space-y-10'>
          <Header docsInfo={docsInfo}/>
          <div className='mx-10'>
            {docsInfo && (<DocStack docsInfo={docsInfo}/>)}
            {!docsInfo && (
              <div>
                Loading your documents....
              </div>
            )}
          </div>
        </div>
      </div>
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

export function Header({
  docsInfo
}:{
  docsInfo : DocumentValues[]
}){
  const [limitExceeded,setLimitExceeded] = useState(false)
  useEffect(()=>{
    const checkLimit = ()=>{
      if(docsInfo.length >=3){
        setLimitExceeded(true)
      }
      else{
        setLimitExceeded(false)
      }
    }

    checkLimit()
  },[docsInfo])

  return (
    <div className='flex lg:flex-row flex-col lg:justify-between w-full'>
      <h1 className='text-5xl font-bold mx-4'>Documents</h1>
      <ButtonDiv className="lg:justify-end justify-center lg:my-0 my-[20px]" limitExceeded={limitExceeded}/>
    </div>
  )
}

export default DocumentsDashboard
