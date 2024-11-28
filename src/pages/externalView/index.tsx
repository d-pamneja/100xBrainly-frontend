"use client";
import { useEffect, useState } from "react";
import CardStack from "./content";
import { useParams } from "react-router-dom";
import { viewBrain } from "@/helpers/communicator";

type ContentValues = {
  _id: string;
  title: string;
  link: string;
  type: string;
  tags: string[];
};

export function View() {

  const { username, uid } = useParams();
  const [access, setAccess] = useState<boolean>(false);
  const [content, setContent] = useState<ContentValues[]>([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const data = await viewBrain(username!, uid!);
        if (data) {
          setAccess(true);
          setContent(data.contentResponse);
        }
      } catch (error) {
        console.error("Error fetching content:", error);
        setAccess(false); 
      }
    };

    fetchData();
  }, [username, uid]);

  return (
    <div className='flex flex-col w-full my-10'>
      <div className='flex justify-between w-full'>
        <div className='flex flex-col w-full space-y-10'>
          {access && (<Header/>)}
          <div className="mx-10">
            <CardStack content={content} access={access}/>
          </div>
        </div>
      </div>
    </div>      
  )
}


export function Header(){
  const { username } = useParams();
  return (
    <div className='flex flex-col lg:justify-between w-full'>
      <h1 className='text-5xl font-bold mx-4'>{username}'s Workspace</h1>
        <div className="p-4 text-center font-semibold">
            <p>💡 Welcome to the Idea Playground: Let the Brainwaves Flow! 💡</p>
            <p className="text-sm text-yellow-600 mt-2">
            Please respect the creativity — copying here is a no-fly zone!
            </p>
        </div>
    </div>
  )
}

export default View
