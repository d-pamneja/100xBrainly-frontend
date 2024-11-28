import { Button } from "./button"
import { FaGithub } from "react-icons/fa"; 
import { useMediaQuery } from "react-responsive";

  
interface GithubButtonProps {
  text: string;
}

export const GithubButton = ({text} : GithubButtonProps) => {
  const isSmall = useMediaQuery({maxWidth : 639})
  const isMedium = useMediaQuery({minWidth: 640, maxWidth : 1023})

  const size = isSmall ? "sm" : isMedium ? "md" : "lg"

  const handleGithubSignIn = () => {
    window.location.href = "https://100x-brainly-backend.vercel.app/auth/github";
  };

  return (
    <div className="flex justify-center mb-8">
        <Button
            variant="outline"
            size={size}
            text={text}
            startIcon={<FaGithub />} 
            onClick={handleGithubSignIn} 
        />
    </div>
  );
};

export default {GithubButton};
