import {
    BlockQuoteMarkdownNode,
    CodeBlockMarkdownNode,
    HeaderMarkdownNode,
    InlineElementMarkdownNode,
    ListMarkdownNode,
    NewLineMarkdownNode,
    ParagraphMarkdownNode,
    TextMarkdownNode,
} from "../parser/source/models";

export const createInlineElement = (node: InlineElementMarkdownNode) => {
    if (!node) return null;

    // Extract value from node.children if present
    const getValue = (node: InlineElementMarkdownNode) =>
        "value" in node.children ? node.children.value : "";
    const getUrlValue = (node: InlineElementMarkdownNode) =>
        "url" in node.children ? node.children.url.value : "";
    const getTitleValue = (node: InlineElementMarkdownNode) =>
        "title" in node.children ? node.children.title.value : "";

    switch (node.type) {
        case "code":
            return <code>{getValue(node)}</code>;
        case "emphasis":
            return <em>{getValue(node)}</em>;
        case "strong":
            return <strong>{getValue(node)}</strong>;
        case "link":
            return <a href={getUrlValue(node)}>{getTitleValue(node)}</a>;
        case "image":
            return <img src={getUrlValue(node)} alt={getTitleValue(node)} />;
        default:
            console.warn(`Unhandled node type: ${node.type}`);
            return null;
    }
};

export const createText = (node: TextMarkdownNode | null) => {
    if (!node) return null;
    return (
        <>
            {node.children?.map((ele) =>
                typeof ele === "string" ? ele : createInlineElement(ele)
            )}
        </>
    );
};

export const createHeader = (node: HeaderMarkdownNode | null) => {
    if (!node) return null;

    const text = node.children!.text;
    switch (node.type) {
        case "heading1":
            return <h1>{createText(text)}</h1>;
        case "heading2":
            return <h2>{createText(text)}</h2>;
        case "heading3":
            return <h3>{createText(text)}</h3>;
        case "heading4":
            return <h4>{createText(text)}</h4>;
        case "heading5":
            return <h5>{createText(text)}</h5>;
        case "heading6":
            return <h6>{createText(text)}</h6>;
        default:
            console.warn(`Unhandled node type: ${node.type}`);
            return null;
    }
};

export const createBlockQuote = (node: BlockQuoteMarkdownNode | null) => {
    if (!node) return null;

    const text = node.children!.text;

    return <blockquote>{createText(text)}</blockquote>;
};

export const createParagraph = (node: ParagraphMarkdownNode | null) => {
    if (!node) return null;

    const text = node.children;

    return <p>{createText(text)}</p>;
};

export const createCodeBlock = (node: CodeBlockMarkdownNode | null) => {
    if (!node) return null;

    const text = node.children;

    return (
        <pre>
            <code>{text}</code>
        </pre>
    );
};

export const createList = (node: ListMarkdownNode | null) => {
    if (!node) return null;

    const list = node.children;

    switch (node.type) {
        case "orderedlist":
            return (
                <ol>
                    {list?.map((ele) => (
                        <li
                            value={ele.prefix.substring(
                                0,
                                ele.prefix.length - 1
                            )}
                        >
                            {createText(ele.text)}
                        </li>
                    ))}
                </ol>
            );
        case "unorderedlist":
            return (
                <ul>
                    {list?.map((ele) => (
                        <li>{createText(ele.text)}</li>
                    ))}
                </ul>
            );
        default:
            console.warn(`Unhandled node type: ${node.type}`);
            return null;
    }
};

export const createNewline = (node: NewLineMarkdownNode | null) => {
    if (!node) return null;

    return <br />;
};
