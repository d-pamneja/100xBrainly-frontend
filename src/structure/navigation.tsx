import Home from "@/pages/home/page"
import Login from "@/pages/login/page"
import SignUp from "@/pages/signup/page"
import NotFound from "@/pages/notfound/page"
import Landing from "@/pages/(app)/page"
import View from "@/pages/externalView/page"

export const nav = [
    {
        path : "/home", name : "Home", element : <Home/>, isRestricted : true
    },
    {
        path : "/login", name : "Login", element : <Login/>, isRestricted : false
    },
    {
        path : "/signup", name : "SignUp", element : <SignUp/>, isRestricted : false
    },
    {
        path : "*", name : "Not Found", element : <NotFound/>, isRestricted : false
    },
    {
        path : "/share/viewBrain/:username/:uid", name : "External", element : <View/>, isRestricted : false
    },
    {
        path : "/", name : "Landing", element : <Landing/>, isRestricted : false
    }
]

import github from '../assets/socials/github.png'
import X from '../assets/socials/X.png'
import linkedIn from '../assets/socials/linkedIn.png'
import medium from '../assets/socials/medium.png'
import mail from '../assets/socials/mail.png'

export const socials = [
    {
        path : "https://github.com/d-pamneja/FullStack/tree/main/SecondBrain_Project", name : "Github", logo : github 
    },
    {
        path : "https://x.com/DPamneja", name : "X/Twitter", logo : X
    },
    {
        path : "https://www.linkedin.com/in/dhruv-pamneja-3b8432187/", name : "LinkedIn", logo : linkedIn
    },
    {
        path : "https://medium.com/@dpamneja", name : "Medium", logo : medium 
    },
    {
        path : "mailto:dpamneja@gmail.com", name : "Mail", logo : mail
    },
]