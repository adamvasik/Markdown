import { NewLineMarkdownNode } from "../../models";
import { Token, TokenUtilities } from "../../utilities";
import { BlockParams, ParseBlock } from "./blockTypes";


export class ParseNewline implements ParseBlock {
    matchElement(token: Token): boolean {
        return TokenUtilities.isNewline(token);
    }

    parse({tokens, getIndex, parent, updateIndex}: BlockParams): NewLineMarkdownNode {
        let index = getIndex();

        updateIndex(index + 1);

        return new NewLineMarkdownNode({
            parent: parent,
            type: "newline",
            rowStart: tokens[index]?.position.row || 0,
            rowEnd: tokens[index]?.position.row || 0,
            columnStart:tokens[index]?.position.column,
            columnEnd:tokens[index]?.position.column
        })
    }
}