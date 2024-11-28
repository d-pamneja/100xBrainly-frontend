"use client";
import { AppSidebar } from '../../components/ui/app-sidebar'
import { SidebarProvider, SidebarTrigger } from "../../components/ui/sidebar"
import { CardStack } from "./content";
import { ButtonDiv } from './mainButtons';

export function Home() {

  return (
    <div className='flex flex-col w-full my-10'>
      <div className='flex justify-between w-full'>
        <MainSidebar/>
        <div className='flex flex-col w-full space-y-10'>
          <Header/>
          <div className='mx-10'>
            <CardStack/>
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

export function Header(){
  return (
    <div className='flex lg:flex-row flex-col lg:justify-between w-full'>
      <h1 className='text-5xl font-bold mx-4'>Workspace</h1>
      <ButtonDiv className="lg:justify-end justify-center lg:my-0 my-[20px]"/>
    </div>
  )
}

export default Home
