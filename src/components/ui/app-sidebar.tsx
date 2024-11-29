import { Home,Brain, File,BotMessageSquare, LucideFileLineChart} from "lucide-react"

import {
  Sidebar,
  SidebarHeader,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarFooter
} from "./sidebar"

import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
  } from "./dropdown-menu"
import { NavUser } from "./nav-user"

import { useAuth } from "@/context/AuthContext"


// Menu items.
const items = [
  {
    title: "Home",
    url: "#",
    icon: Home,
  },
  {
    title: "Documents",
    url: "#",
    icon: File,
  },
  {
    title: "Search & Query",
    url: "#",
    icon: BotMessageSquare,
  },
  {
    title: "Analysis",
    url: "#",
    icon: LucideFileLineChart,
  },
  
]

export function AppSidebar() {
  const { user } = useAuth()

  return (
    <Sidebar variant="floating">
        <SidebarHeader className="flex justify-start">
            <Brain className="w-20 h-10 text-purple-600"/>
            <div className="text-4xl font-bold">
                Brainly
            </div>
        </SidebarHeader>

      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupContent>
            <SidebarMenu>
              {items.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton asChild>
                    <a href={item.url}>
                      <item.icon/>
                      <span className="text-2xl">{item.title}</span>
                    </a>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>

      <SidebarFooter>
          <SidebarMenu>
            <SidebarMenuItem>
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                    <NavUser user={{
                      name : user?.username || "Guest",
                      avatar : "./src/assets/avatars/male-avatar.png"
                    }}/>
                </DropdownMenuTrigger>
                    <DropdownMenuContent
                    side="top"
                    className="w-[--radix-popper-anchor-width]"
                    >
                        {/* <DropdownMenuItem>
                            <span>Account</span>
                        </DropdownMenuItem> */}
                        <DropdownMenuItem>
                            <span>Sign out</span>
                        </DropdownMenuItem>
                    </DropdownMenuContent>
              </DropdownMenu>
            </SidebarMenuItem>
          </SidebarMenu>
        </SidebarFooter>
    </Sidebar>
  )
}
