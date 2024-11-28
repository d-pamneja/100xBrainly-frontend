import {createContext, ReactNode, useContext, useEffect, useState} from 'react'
import { checkAuthStatus, loginUser, signUpUser,logoutUser } from '../helpers/communicator'

type User = {
    username : string;
}

type UserAuth = {
    isLoggedIn : boolean;
    user : User | null;

    login:(
        username:string,
        password:string
    )=> Promise<void>;

    signup:(
        username:string,
        password:string
    )=> Promise<void>;

    logout:()=> Promise<void>;
}

const AuthContext  = createContext<UserAuth | null>(null);

export const AuthProvider = ({children}:{children : ReactNode})=> {
    const [user,setUser] = useState<User | null>(null);
    const [isLoggedIn,setIsLoggedIn] = useState(false);


    useEffect(()=>{
        // Fetch if the user's cookies are valid, means already logged in and no need to perform login step here
        async function checkStatus () {
            const data = await checkAuthStatus();
            if(!data){
                setIsLoggedIn(false);
                return;
            }
            else{
                setUser({username:data.username})
                setIsLoggedIn(true);
                return;
            }
        }

        checkStatus();
    },[]);

    const login = async(
        username:string,
        password:string
    )=>{
        const data = await loginUser(username,password);
        if(data){
            setUser({username: username})
            setIsLoggedIn(true);
        }
    };

    const signup = async(
        username:string,
        password:string
    )=>{
        await signUpUser(username,password);
    };

    const logout = async()=>{
        const data = await logoutUser()
        if(data){
            setUser(null)
            setIsLoggedIn(false)
        }

    };

    const value = {
        user,
        isLoggedIn,
        login,
        logout,
        signup
    };


    return <AuthContext.Provider value={value}> {children} </AuthContext.Provider>;
}

export const useAuth = () => {
    const context = useContext(AuthContext)
    if(context){
        return context
    }
    else{
        throw new Error("Context does not exist")
    }
}
