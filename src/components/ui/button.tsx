import {cva,VariantProps} from "class-variance-authority"
import { ComponentProps, ReactElement } from "react"
import React from "react"
import { cn } from "../../lib/utils"


// Now, we will use ComponentProps from React, which can help us get all the basic defualt props made available in an HTML element or any other external library : https://www.totaltypescript.com/react-component-props-type-helper
// We will also use VariantProps to import all types from the above const ButtonStyles

export type ButtonProps = VariantProps<typeof ButtonStyles> & {
    text? : string
    startIcon? : ReactElement  // React Element Tag (we will use react - icons) tag
    endIcon? : ReactElement  // React Element Tag (we will use react - icons) tag
} & ComponentProps<"button"> // This combines the above ButtonStyles, our custom designed types and the basic types in button by default


export const Button = ({variant,size,className,...props} : ButtonProps) => { // Means we will be giving variant,size and our classname, along with all props defined above
    const IconSizeMap = {
        sm: "w-4 h-4 mx-0.5",
        smNoShadow : "w-4 h-4 mx-0.5",
        md: "w-5 h-5 mx-1", 
        lg: "w-6 h-6 mx-1.5", 
        icon : "w-9 h-9"
    }
    
    return(
        <div>
            <button 
                {...props}
                className={cn(ButtonStyles({variant,size}),className)}
            >

                {props.startIcon &&
                    React.cloneElement(props.startIcon,{ // Clone element clones the element passed first, and adds the new classname to it to give final modified element
                        className:cn(IconSizeMap[size!], props.startIcon.props.className)}, // It gets the size of the button, and then merges icon style based on size to given element's current classname (which is a prop of the element)
                    )
                }


                {props.text}

                {props.endIcon &&
                    React.cloneElement(props.endIcon,{ // Clone element clones the element passed first, and adds the new classname to it to give final modified element
                        className:cn(IconSizeMap[size!], props.endIcon.props.className)}, // It gets the size of the button, and then merges icon style based on size to given element's current classname (which is a prop of the element)
                    )
                }

                {}
                
            </button>
        </div>
    )
}

export const ButtonStyles = cva( 
    ["flex","items-center"], // This means the base tailwind class which will cover all the variants
    {
        variants : { // Different types of buttons
            variant : { // Different types of variant types
                primary : ["bg-purple-600","hover:bg-purple-900","text-white"],
                secondary : ["bg-purple-300","hover:bg-purple-700","text-purple-500"],
                outline: ["border","border-input","bg-background","shadow-sm","hover:bg-accent","hover:text-accent-foreground"],
                ghost: ["hover:bg-accent","hover:text-accent-foreground"],
                ghostDark: ["bg-black","text-white","hover:bg-transparent","shadow-sm","hover:text-current","hover:border","hover:border-black"],
                destructive: ["border-transparent","bg-destructive","text-destructive-foreground","shadow-sm","hover:bg-destructive/90"],
            },
            size : { // Different types of size types (for button and span elements inside that button)
                sm : ["rounded-xl","px-2","py-1","mx-2","shadow-xl"],
                smNoShadow : ["rounded-xl","px-2","py-1","mx-2"],
                md : ["rounded-2xl","px-3","py-2","mx-3","shadow-xl"],
                lg : ["rounded-3xl","px-4","py-3","mx-4","shadow-xl"],
                icon: ["rounded-xl","p-1","mx-2","shadow-xl"]
            },
        },
        defaultVariants : { // Default types of variants, in case nothing or something undefined is sent in
            variant : "primary",
            size : "sm",
        }
    }
) 


export default Button