"use client"
import { toast } from 'react-hot-toast';
import { useAuth } from '../../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import { z } from "zod"
import { zodResolver } from "@hookform/resolvers/zod"
import { SubmitHandler, useForm } from "react-hook-form"
import {Typography} from '@mui/material';
import Button from '@/components/ui/button';
import {Input,PasswordInput} from '@/components/ui/input';
import {GoogleButton} from "@/components/ui/googleButton";
import { GithubButton } from "@/components/ui/githubButton";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form"
import { useMediaQuery } from "react-responsive";
import { AiOutlineUserAdd } from "react-icons/ai";
import { cn } from "../../lib/utils"

const formSchema = z.object({
  username : z.string()
                .min(3,"The username should be a minimum of 3 characters")
                .max(10, "The username should be a maximum of 10 characters"),
  password : z.string()
                .min(8,"The password has to be a minimum of 8 characters")
                .max(20,"The password has to be a maximum of 20 characters")
                .refine((password) => /[A-Z]/.test(password), {message: "Required atleast one uppercase character"})
                .refine((password) => /[a-z]/.test(password), {message: "Required atleast one lowercase character"})
                .refine((password) => /[0-9]/.test(password), {message: "Required atleast one number"})
                .refine((password) => /[!@#$%^&*]/.test(password), {message: "Required atleast one special character"})
})

export const SubmitButton = ({className} : {className? : string} )=> {
  const isSmall = useMediaQuery({maxWidth : 639})
  const isMedium = useMediaQuery({minWidth: 640, maxWidth : 1023})

  const size = isSmall ? "sm" : isMedium ? "md" : "lg"


  return (
      <div className={cn("flex",className)}>
          <Button
              variant={"primary"}
              size={size}
              text="Signup"
              startIcon={<AiOutlineUserAdd/>}
          />
      </div>
  )
}

const SignUp = () => {
  const {signup} = useAuth();
  const navigate = useNavigate();

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      username: "",
      password : ""
    },
  })

  const handleSignUp : SubmitHandler<z.infer<typeof formSchema>> = async (data : any) => {
    const { username, password } = data;

    try {
      await signup(username, password);
      toast.success('Signed Up Successfully', { id: 'signup' });
      const redirect = "/login";
      navigate(redirect);
    } catch (error : any) {
      if(error.status===411){
        return toast.error(`Sign Up Failed: ${error.response.data.message} `, { id: 'signup' });
      }

      else if(error.status===400){
        const errorsArray : string[] = []
        const errors = (error.response.data.details)
        errors.map((err : string)=>{
            console.log(err)
            errorsArray.push(err)
        })
        
        if (errorsArray && errorsArray.length > 0) {
            return toast.error(`Sign Up Failed : ${errorsArray[0]}`, { id: 'signup' });
        } else {
            return toast.error("Sign Up Failed: Unknown error", { id: 'signup' });
        }
      }
    }
  };

  return (
    <div className="flex justify-center items-center md:h-[600px] h-screen">
      <div className='flex flex-col items-center justify-center border border-gray-300 rounded-xl shadow-[5px_5px_rgba(80,_70,_227,_0.4),_10px_10px_rgba(80,_70,_227,_0.3),_15px_15px_rgba(80,_70,_227,_0.2),_20px_20px_rgba(80,_70,_227,_0.1),_25px_25px_rgba(80,_70,_227,_0.05)] md:w-1/2 w-4/5'>
          <Typography 
            variant='h3' 
            textAlign="center" 
            fontFamily={'inherit'}
            fontSize={50}
            fontWeight={500}
            color="#5046e3"
            marginTop={6}
          >
            SIGNUP
          </Typography>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(handleSignUp)} className="my-10 w-3/5 space-y-8">
              <FormField
                control={form.control}
                name="username"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="flex justify-start">Username</FormLabel>
                    <FormControl>
                      <Input placeholder="username" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="password"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="flex justify-start">Password</FormLabel>
                    <FormControl>
                      <PasswordInput placeholder="password" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <SubmitButton className="justify-center"/>
            </form>
          </Form>
          <GoogleButton text="Google Signup"/>
          <GithubButton text="Github Signup"/>
      </div>
    </div>
    
    
  )
};

export default SignUp;