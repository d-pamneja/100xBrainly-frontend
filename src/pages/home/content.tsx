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
import { WobbleCard } from "../../components/ui/card";
import { useAuth } from "@/context/AuthContext";
import { deleteContent, viewContent } from "@/helpers/communicator";
import { Badge } from "@/components/ui/badge";
import type { Tag } from "@/components/ui/multi-select";
import LinkPreview from "@/components/ui/linkPreview";
import toast from "react-hot-toast";

export function CardStack() {
    const {isLoggedIn} = useAuth()
  
    // Content (Frontend Display Type)
    type ContentValues = {
      _id : string,
      title : string,
      link : string,
      type : string,
      tags : string[],
      description? : string
    }
  
    // View and Display Content
    const fetchContent = async () : Promise<ContentValues[]> => {
      if(isLoggedIn){
        const res = await viewContent()
        return res.response
      }
      return []
    }
  
    const [content, setContent] = useState<ContentValues[]>([]);
  
    useEffect(() => {
      const loadContent = async () => {
        try {
          const data = await fetchContent();
          setContent(data); 
        } catch (error) {
          console.error("Error fetching content:", error); 
        }
      };
  
      loadContent();
    }, []);

    // Delete Content
    const removeContent = async (id : string) : Promise<any> =>{
      if(isLoggedIn){
        try{
          const res = await deleteContent(id)
          if(res){
            toast.success("Content Deleted Successfully",{ id: 'deleteContent' })
            setTimeout(() => {
                window.location.reload();
              }, 1000);
            }
        }
        catch(error : any){
          if(error.status===400 || error.status===403 ){
            console.log(error)
            return toast.error(`Could not delete the content : ${error.response.data.message} `, { id: 'deleteContent' });
          }
        }
      }
    }
  
    // Pages
    const itemsPerPage = 6;
    const [currentPage, setCurrentPage] = useState(1);
    const totalPages = Math.ceil(content.length / itemsPerPage);
  
    const handleChangePage = (page: number) => {
      setCurrentPage(page);
    };
  
    const startIndex = (currentPage - 1) * itemsPerPage;
    const currentItems = content.slice(startIndex, startIndex + itemsPerPage);
  
    return (
      <div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {currentItems.map((card, index) => (
            <EntryCard 
              key={index} 
              id = {card._id}
              title={card.title} 
              link={card.link} 
              type={card.type} 
              tags={card.tags.map((tag) => tag)}
              description={card.description}
              removeContent={removeContent}
            />
          ))}
        </div>
  
        {/* Pagination */}
        {content[0] && (
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
  
export function EntryCard({ id,title, link, type, tags,description,removeContent }: { id : string,title: string; link: string; type: string; tags: string[],description? : string, removeContent:(id:string)=>Promise<any>}) {
  const tagsArray: Tag[] = tags.map((tag) => ({ value: tag }));

  return (
        <div className="max-w-8xl mx-auto md:w-full w-4/5">
            {description && (
                <WobbleCard
                  containerClassName="flex flex-col justify-between z-0"
                  isAuth={true}
                  id = {id}
                  title={title}
                  link={link}
                  type={type}
                  tags={tagsArray}
                  description={description}
                  deleteFunction={removeContent}
              >
                  <div className="my-20">
                    <LinkPreview url={link} />
                  </div>

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
                  <p className="mt-4 max-w-[26rem] text-left text-base/6 text-neutral-200">  
                      {tags.map((tag) => (
                          <Badge className="mx-1 mb-1" key={tag} variant="default">{tag}</Badge> // Add funcionality later to make searchable via click
                      ))}
                  </p>
              </WobbleCard>
            )}

            {!description && (
              <WobbleCard
                  containerClassName="flex flex-col justify-between z-0"
                  isAuth={true}
                  id = {id}
                  title={title}
                  link={link}
                  type={type}
                  tags={tagsArray}
                  deleteFunction={removeContent}
              >
                  <div className="my-10">
                    <LinkPreview url={link} />
                  </div>

                  <p className="mt-4 max-w-[26rem] text-left text-base/6 text-neutral-200" >
                      <Badge variant="secondary" onClick={()=>{
                          console.log("Clicked") // Add funcionality later to make searchable via click
                      }}>
                          {type}
                      </Badge>
                  </p>
                  <p className="mt-4 max-w-[26rem] text-left text-base/6 text-neutral-200">  
                      {tags.map((tag) => (
                          <Badge className="mx-1 mb-1" key={tag} variant="default">{tag}</Badge> // Add funcionality later to make searchable via click
                      ))}
                  </p>
              </WobbleCard>
            )}
        </div>
    );
}

export default {CardStack}