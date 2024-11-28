import SyntaxHighlighter from "react-syntax-highlighter";
import CopyButton from "./copyButton";

type Props = {
  code: string;
  language: string;
  style: any;
};

export default function LinkBlock({ code, style }: Props) {
  return (
    <div className="CodeBlockClass">
      <CopyButton code={code} />
      <SyntaxHighlighter
        language={"text"}
        style={style}
        wrapLines={true}
        wrapLongLines={true}
        showLineNumbers={true}
        showInlineLineNumbers={false}
        customStyle={{
          border: "1px solid #c3c3c3",
          borderRadius: "5px",
        }}
      >
        {code}
      </SyntaxHighlighter>
    </div>
  );
}