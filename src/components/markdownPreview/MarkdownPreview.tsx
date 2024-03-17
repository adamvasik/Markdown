import React from "react";

import { markdownToHTML } from "../../utils/helpers/MarkdownToHTML";

interface IMarkdownProps {
    markdownContent: string;
}

/**
 * Renders a preview of markdown content as HTML.
 *
 * The `MarkdownPreview` component takes markdown content as a prop,
 * converts it to HTML using the `markdownToHTML` function, and then
 * renders it within a `div` with a class of "markdown-preview".
 * This allows for the styled presentation of markdown content within
 * the application.
 *
 * @param {IMarkdownProps} props The props for this component.
 * @param {string} props.markdownContent The markdown content to render as HTML.
 * @returns {React.FC} A functional component that renders the markdown content.
 */
export const MarkdownPreview: React.FC<IMarkdownProps> = ({
    markdownContent,
}) => {
    const content = markdownToHTML(markdownContent);

    return <div className="markdown-preview">{content}</div>;
};
