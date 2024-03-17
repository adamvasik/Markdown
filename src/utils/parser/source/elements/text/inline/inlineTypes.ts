import { Token } from "../../../utilities";
import {
    InlineElementMarkdownNode,
    TextMarkdownNode,
} from "../../../models/markdownNodes";

export type InlineParseParams = {
    tokens: Token[];
    startIndex: number;
    parent: TextMarkdownNode;
};

export interface InlineElementHandler {
    matchElement(token: Token): boolean;
    parse({ tokens, startIndex, parent }: InlineParseParams): {
        node: InlineElementMarkdownNode | string;
        index: number;
    }; // Returns the node and the index after the parsed element
}
