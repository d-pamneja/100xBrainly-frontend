import { CopyToClipboard } from "react-copy-to-clipboard";
import { FaRegCopy } from "react-icons/fa";
import { toast } from 'react-hot-toast';

type Props = {
  code: string;
};
function CopyButton({ code }: Props) {
  return (
    <button className="CopyButtonClass">
      <CopyToClipboard text={code} onCopy={() => {
            try {
                toast.success('Copied to Clipboard', { id: 'clipboardCopy' });
            } catch (error : any){
                return toast.error(`Could not copy to clipboard : ${error.response.data.message} `, { id: 'clipboardCopy' });
          };
      }}>
        <div>
          <FaRegCopy />
        </div>
      </CopyToClipboard>
    </button>
  );
}

export default CopyButton;