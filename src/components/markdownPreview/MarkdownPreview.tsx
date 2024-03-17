import React from "react";

import { markdownToHTML } from "../../utils/helpers/MarkdownToHTML";

interface IMarkdownProps {
    markdownContent:string
}

export const MarkdownPreview: React.FC<IMarkdownProps> = ({markdownContent}) => {
    const content = markdownToHTML(markdownContent); 

    return (<div className="markdown-preview">{content}</div>)
}  