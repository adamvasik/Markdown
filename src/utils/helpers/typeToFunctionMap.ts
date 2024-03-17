import {
    createBlockQuote,
    createCodeBlock,
    createHeader,
    createList,
    createNewline,
    createParagraph,
} from "./NodeRenderers";

export type NodeType =
    | "paragraph"
    | "heading1"
    | "heading2"
    | "heading3"
    | "heading4"
    | "heading5"
    | "heading6"
    | "orderedlist"
    | "unorderedlist"
    | "blockquote"
    | "codeblock"
    | "newline";

export const typeToFunctionMap: {
    [K in NodeType]: (node: any) => JSX.Element | null;
} = {
    paragraph: createParagraph,
    heading1: createHeader,
    heading2: createHeader,
    heading3: createHeader,
    heading4: createHeader,
    heading5: createHeader,
    heading6: createHeader,
    orderedlist: createList,
    unorderedlist: createList,
    blockquote: createBlockQuote,
    codeblock: createCodeBlock,
    newline: createNewline,
};
