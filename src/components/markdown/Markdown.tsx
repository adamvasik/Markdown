import React from "react";

interface MarkdownProps {
    markdownContent:string
}

export const Markdown: React.FC<MarkdownProps> = ({markdownContent}) => {
    return (<div>{markdownContent}</div>)
}  