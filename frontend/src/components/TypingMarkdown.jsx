import { useEffect, useState } from "react";
import ReactMarkdown from "react-markdown";

function TypingMarkdown({ content, speed = 15 }) {
    const [typed, setTyped] = useState("");

    useEffect(() => {
        if (!content) return;

        setTyped(""); // Reset on new content
        let index = 0;
        const interval = setInterval(() => {
            setTyped((prev) => prev + content[index]);
            index++;
            if (index >= content.length) clearInterval(interval);
        }, speed);

        return () => clearInterval(interval); // Cleanup
    }, [content, speed]);

    return (
        <div className="markdown-body">
            <ReactMarkdown>{typed}</ReactMarkdown>
        </div>
    );

}

export default TypingMarkdown;
