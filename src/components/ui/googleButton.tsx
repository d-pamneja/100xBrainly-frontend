import { Button } from "./button"
import { FcGoogle } from "react-icons/fc"; 
import { useMediaQuery } from "react-responsive";

interface GoogleButtonProps {
  text: string;
}

export const GoogleButton = ({ text }: GoogleButtonProps) => {
  const isSmall = useMediaQuery({maxWidth : 639})
  const isMedium = useMediaQuery({minWidth: 640, maxWidth : 1023})

  const size = isSmall ? "sm" : isMedium ? "md" : "lg"

  const handleGoogleSignIn = () => {
    window.location.href = "https://100x-brainly-backend.vercel.app/auth/google";
  };

  return (
    <div className="flex justify-center mb-4">
        <Button
            variant="outline"
            size={size}
            text={text}
            startIcon={<FcGoogle />} 
            onClick={handleGoogleSignIn} 
        />
    </div>
  );
};

export default {GoogleButton};
