import {
    RootMarkdownNode,
    HeaderMarkdownNode,
    ParagraphMarkdownNode,
    BlockQuoteMarkdownNode,
    ListMarkdownNode,
    NewLineMarkdownNode,
    CodeBlockMarkdownNode,
} from "../../models/markdownNodes";
import { Token } from "../../utilities/Lexer";

export type ParseResult =
    | HeaderMarkdownNode
    | ParagraphMarkdownNode
    | BlockQuoteMarkdownNode
    | ListMarkdownNode
    | NewLineMarkdownNode
    | CodeBlockMarkdownNode;

export type BlockParams = {
    tokens: Token[];
    getIndex: () => number;
    parent: RootMarkdownNode;
    updateIndex: (newIndex: number) => void;
};

export interface ParseBlock {
    matchElement(token: Token): boolean;
    parse({ tokens, getIndex, parent, updateIndex }: BlockParams): ParseResult;
}
