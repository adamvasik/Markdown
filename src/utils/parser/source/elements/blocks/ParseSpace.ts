import { TokenType } from "../../models";
import { Token, TokenUtilities } from "../../utilities";

export class ParseSpace {
    public static matchElement(token: Token): boolean {
        if(!token || token === undefined) {
            return false;
        }

        return TokenUtilities.compareTokenType(token, TokenType.Space);
    }

    parse(tokens: Token[], getIndex: () => number, updateIndex: (index: number) => void) {
        let tempIndex = getIndex();

        while(TokenUtilities.compareTokenType(tokens[tempIndex]!, TokenType.Space)) {
            tempIndex++;
        }

        updateIndex(tempIndex);
    }
}