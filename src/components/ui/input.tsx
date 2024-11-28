'use client'
import * as React from "react"
import { EyeIcon, EyeOffIcon } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { cn } from '@/lib/utils'

export const Input = React.forwardRef<HTMLInputElement, React.ComponentProps<"input">>(
  ({ className, type, ...props }, ref) => {
    return (
      <input
        type={type}
        className={cn(
          "flex h-9 w-full rounded-md border border-input bg-transparent px-3 py-1 text-base shadow-sm transition-colors file:border-0 file:bg-transparent file:text-sm file:font-medium file:text-foreground placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50 md:text-sm",
          className
        )}
        ref={ref}
        {...props}
      />
    )
  }
)
Input.displayName = "Input"


export const PasswordInput = React.forwardRef<HTMLInputElement, React.ComponentProps<"input">>(({ className, ...props }, ref) => {
	const [showPassword, setShowPassword] = React.useState(false)
	const disabled = props.value === '' || props.value === undefined || props.disabled

	return (
		<div className="relative">
			<Input
				type={showPassword ? 'text' : 'password'}
				className={cn('hide-password-toggle pr-10', className)}
				ref={ref}
				{...props}
			/>
			<Button
				type="button"
				variant="ghost"
				size="smNoShadow"
				className="absolute right-0 top-0 w-10 h-8 px-3 py-2 hover:bg-transparent"
        startIcon={<EyeIconSetter showPassword={showPassword} disabled={disabled}/>}
				onClick={() => setShowPassword((prev) => !prev)}
				disabled={disabled}
			/>

			{/* hides browsers password toggles */}
			<style>{`
					.hide-password-toggle::-ms-reveal,
					.hide-password-toggle::-ms-clear {
						visibility: hidden;
						pointer-events: none;
						display: none;
					}
				`}</style>
		</div>
	)
})

const EyeIconSetter = (props : any) : JSX.Element =>{
    if(props.showPassword && !props.disabled){
      return <EyeIcon className="h-4 w-4" aria-hidden="true"/>
    }
    else{
      return <EyeOffIcon className="h-4 w-4" aria-hidden="true" />
    } 
}

PasswordInput.displayName = 'PasswordInput'

export default { Input,PasswordInput }
