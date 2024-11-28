"use client";
import { useState } from "react";
import {
    Pagination,
    PaginationContent,
    PaginationItem,
    PaginationLink,
    PaginationPrevious,
    PaginationNext,
} from "../../components/ui/pagination";
import { WobbleCard } from "../../components/ui/card";
import { Badge } from "@/components/ui/badge";
import type { Tag } from "@/components/ui/multi-select";
import LinkPreview from "@/components/ui/linkPreview";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { AlertCircle } from "lucide-react"

type ContentValues = {
    _id: string;
    title: string;
    link: string;
    type: string;
    tags: string[];
    description? : string
  };

interface CardStackProps {
    content: ContentValues[];
    access: boolean;
}

const CardStack: React.FC<CardStackProps> = ({ content, access }) => {
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
        <>
        {access && (
            <div>
                <div className="grid md:grid-cols-3 grid-cols-1 md:gap-4 gap-6">
                {currentItems.map((card, index) => (
                    <EntryCard 
                        key={index} 
                        id = {card._id}
                        title={card.title} 
                        link={card.link} 
                        type={card.type} 
                        tags={card.tags.map((tag) => tag)}
                        description={card.description}
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
        )}

        {!access && (
            <div>
                <Alert className="flex justify-center items-center h-[100px]" variant="destructive">
                    <AlertCircle className="h-12 w-12" />
                    <div className="flex flex-col text-xl">
                        <AlertTitle>Access Denied</AlertTitle>
                        <AlertDescription>
                            Oops! It looks like this link is no longer valid. Either the link's expired, or the workspace owner has stopped sharing it. Double-check and try again!
                        </AlertDescription>
                    </div>
                </Alert>
            </div>
        )}
        </>
    );
}
  
export function EntryCard({ id,title, link, type, tags,description }: { id : string,title: string; link: string; type: string; tags: string[],description? : string}) {
  const tagsArray: Tag[] = tags.map((tag) => ({ value: tag }));

  return (
        <div className="max-w-8xl mx-auto md:w-full w-4/5">
            <WobbleCard
                containerClassName="flex flex-col justify-between z-0"
                isAuth={false}
                id = {id}
                title={title}
                link={link}
                type={type}
                tags={tagsArray}
            >
                <div className="my-10">
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
                        console.log("Clicked")
                    }}>
                        {type}
                    </Badge>
                </p>
                <p className="mt-4 max-w-[26rem] text-left text-base/6 text-neutral-200">  
                    {tags.map((tag) => (
                        <Badge className="mx-1 mb-1" key={tag} variant="default">{tag}</Badge>
                    ))}
                </p>
            </WobbleCard>
        </div>
    );
}

export default CardStack;