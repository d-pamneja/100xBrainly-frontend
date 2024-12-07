"use client";
import { useState,useEffect } from "react";
import {
    Pagination,
    PaginationContent,
    PaginationItem,
    PaginationLink,
    PaginationPrevious,
    PaginationNext,
} from "../../components/ui/pagination";
import { DocumentWobbleCard } from "./docCard";
import { useAuth } from "@/context/AuthContext";
import { deleteDocument } from "@/helpers/communicator";
import { useMutation } from 'convex/react';
import { Id } from "../../../convex/_generated/dataModel"
import { api } from "../../../convex/_generated/api"
import { Badge } from "@/components/ui/badge";
import toast from "react-hot-toast";
import { deleteDocumentPinecone } from "../../helpers/communicator";

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

export function DocStack({
  docsInfo,
}:{
  docsInfo : DocumentValues[]
}) {
    const {isLoggedIn} = useAuth()
    
  
    // Delete Content Functionalities
    const [deletionInProgress,setDeletionInProgress] = useState(false)
    // AWS and Pinecone Deletion
    const removeDocument = async ( _id: Id<"documents">, key : string) : Promise<any> =>{
      if(isLoggedIn){
        try{
          setDeletionInProgress(true)
          const res = await deleteDocument(key)
          if(res){
            await deleteDocumentPinecone(key)
            return deleteConvexDocument(_id)
          }
          return deleteConvexDocument(_id)
        }
        catch(error : any){
          console.log(`Delete failed on AWS : ${error}`)
        }
      }
    }

    // Convex Deletion
    const eraseDocument = useMutation(api.document.deleteDocument)
    const deleteConvexDocument = async (_id : Id<"documents"> ) => {
        try {
            await eraseDocument({_id})
            setDeletionInProgress(false)
            toast.success('Document Deleted Successfully', { id: 'deleteDocument' });
            setTimeout(() => {
                window.location.reload();
            }, 1000);
        } catch (error : any) {
            console.log(error)
            return toast.error(`Could not delete the document : ${error} `, { id: 'deleteDocument' });
        }
    }
  
    // Pages
    const itemsPerPage = 6;
    const [currentPage, setCurrentPage] = useState(1);
    const totalPages = Math.ceil(docsInfo.length / itemsPerPage);
  
    const handleChangePage = (page: number) => {
      setCurrentPage(page);
    };
  
    const startIndex = (currentPage - 1) * itemsPerPage;
    const currentItems = docsInfo.slice(startIndex, startIndex + itemsPerPage);
  
    return (
      <div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {currentItems.map((card, index) => (
            <DocEntryCard 
              _id = {card._id}
              title={card.title} 
              date={card.date}
              type={card.type} 
              docKey={card.key} 
              description={card.description}
              removeContent={removeDocument}
              deletionInProgress={deletionInProgress}
            />
          ))}
        </div>
  
        {/* Pagination */}
        {docsInfo[0] && (
          <Pagination className="mt-8">
            <PaginationContent>
              {/* Previous Page */}
              <PaginationItem>
                <PaginationPrevious
                  href="#"
                  onClick={(e) => {
                    e.preventDefault();
                    handleChangePage(Math.max(1, currentPage - 1));
                  }}
                />
              </PaginationItem>
    
              {/* Page Numbers */}
              {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                <PaginationItem key={page}>
                  <PaginationLink
                    href="#"
                    onClick={(e) => {
                      e.preventDefault();
                      handleChangePage(page);
                    }}
                    isActive={currentPage === page}
                  >
                    {page}
                  </PaginationLink>
                </PaginationItem>
              ))}
    
              {/* Next Page */}
              <PaginationItem>
                <PaginationNext
                  href="#"
                  onClick={(e) => {
                    e.preventDefault();
                    handleChangePage(Math.min(totalPages, currentPage + 1));
                  }}
                />
              </PaginationItem>
            </PaginationContent>
          </Pagination>
        )}
      </div>
    
    );
}
  
export function DocEntryCard({ _id,title,date,type,docKey,description,removeContent,deletionInProgress } : { _id: Id<"documents">,title: string, date: number, type: string, docKey : string , description? : string, deletionInProgress:boolean,removeContent:(_id: Id<"documents">, docKey: string)=>Promise<any>}) {

  return (
        <div className="max-w-8xl mx-auto md:w-full w-4/5">
            <DocumentWobbleCard
                containerClassName="flex flex-col justify-between z-0"
                isAuth={true}
                _id = {_id}
                title={title}
                type={type}
                docKey={docKey}
                date={date}
                deleteFunction={removeContent}
                description={description}
                deletionInProgress={deletionInProgress}
            >
                {description && (
                    <div 
                        className="flex items-center text-left text-balance text-base text-white"
                        style={{
                        maxWidth: `calc(100%)`, 
                        wordBreak: 'break-word', 
                    }}
                    >
                        {description}
                    </div>
                )}

                <p className="mt-4 max-w-[26rem] text-left text-base/6 text-neutral-200" >
                    <Badge variant="secondary" onClick={()=>{
                        console.log("Clicked") // Add funcionality later to make searchable via click
                    }}>
                        {type}
                    </Badge>
                </p>
            </DocumentWobbleCard>
        </div>
    );
}


export default {DocStack}