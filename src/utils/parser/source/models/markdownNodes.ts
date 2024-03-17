import {
    BlockQuoteChildren,
    BlockQuoteMarkdownNodeParams,
    CodeBlockMarkdownNodeParams,
    Footnode,
    FootnodeMarkdownNodeParams,
    HeaderMarkdownNodeChildren,
    HeaderMarkdownNodeParams,
    HorizontalRuleMarkdownNodeParams,
    InlineElementA,
    InlineElementB,
    InlineElementMarkdownNodeParams,
    ListMarkdownNodeParams,
    MarkdownNodeParams,
    NewLineMarkdownNodeParams,
    ParagraphMarkdownNodeParams,
    RootMarkdownNodeChild,
    RootMarkdownNodeParams,
    TextMarkdownNodeChildren,
    TextMarkdownNodeParams,
    TextMarkdownNodeParent,
    listItem,
} from ".";

export class MarkdownNode {
    public type: string;
    public rowStart: number;
    public rowEnd: number;
    public columnStart: number;
    public columnEnd: number;

    constructor({
        type,
        rowStart,
        rowEnd,
        columnStart,
        columnEnd,
    }: MarkdownNodeParams) {
        this.type = type;
        this.rowStart = rowStart;
        this.rowEnd = rowEnd;
        this.columnStart = columnStart || 0;
        this.columnEnd = columnEnd || 0;
    }
}

/* Root Node = Document */
export class RootMarkdownNode extends MarkdownNode {
    public children: RootMarkdownNodeChild[] | null;
    constructor({
        type,
        children,
        rowStart,
        rowEnd,
        columnStart,
        columnEnd,
    }: RootMarkdownNodeParams) {
        super({
            type,
            rowStart,
            rowEnd,
            columnStart,
            columnEnd,
        });
        this.children = children;
    }

    getStringValue(): string {
        if (this.children) {
            let str = [];
            for (let i in this.children) {
                let currentItem = this.children[i]?.getStringValue();

                str.push(currentItem);
            }

            return str.join("");
        }
        return "";
    }
}

/* Block Nodes */
export class HeaderMarkdownNode extends MarkdownNode {
    public parent: RootMarkdownNode;
    public children: HeaderMarkdownNodeChildren | null;
    constructor({
        parent,
        type,
        children,
        rowStart,
        rowEnd,
        columnStart,
        columnEnd,
    }: HeaderMarkdownNodeParams) {
        super({
            type,
            rowStart,
            rowEnd,
            columnStart,
            columnEnd,
        });
        this.parent = parent;
        this.children = children;
    }

    getStringValue(): string {
        if (this.children) {
            const { prefix, text } = this.children;

            return `${prefix} ${text.getSringValue()}`;
        }
        return "";
    }
}

export class BlockQuoteMarkdownNode extends MarkdownNode {
    public parent: RootMarkdownNode;
    public children: BlockQuoteChildren;
    constructor({
        parent,
        type,
        children,
        rowStart,
        rowEnd,
        columnStart,
        columnEnd,
    }: BlockQuoteMarkdownNodeParams) {
        super({
            type,
            rowStart,
            rowEnd,
            columnStart,
            columnEnd,
        });
        this.parent = parent;
        this.children = children;
    }

    getStringValue(): string {
        if (this.children) {
            const { prefix, text } = this.children;
            const textValue = text.getSringValue();

            return `${prefix} ${textValue}`;
        }
        return "";
    }
}

export class ListMarkdownNode extends MarkdownNode {
    public parent: RootMarkdownNode;
    public children: listItem[] | null;
    constructor({
        parent,
        type,
        children,
        rowStart,
        rowEnd,
        columnStart,
        columnEnd,
    }: ListMarkdownNodeParams) {
        super({
            type,
            rowStart,
            rowEnd,
            columnStart,
            columnEnd,
        });
        this.parent = parent;
        this.children = children;
    }

    getStringValue(): string {
        if (this.children) {
            let str = [];
            for (let i in this.children) {
                const listNode = this.children[i];

                str.push(`${listNode?.prefix} ${listNode?.text.getSringValue()}`);
            }

            return str.join("");
        }
        return "";
    }
}

export class CodeBlockMarkdownNode extends MarkdownNode {
    public parent: RootMarkdownNode;
    public children: string;
    constructor({
        parent,
        type,
        children,
        rowStart,
        rowEnd,
        columnStart,
        columnEnd,
    }: CodeBlockMarkdownNodeParams) {
        super({
            type,
            rowStart,
            rowEnd,
            columnStart,
            columnEnd,
        });
        this.parent = parent;
        this.children = children;
    }

    getStringValue(): string {
        return "```" + this.children + "```";
    }
}

export class HorizontalRuleMarkdownNode extends MarkdownNode {
    public parent: RootMarkdownNode;
    public children: "---" | "***" | "___";
    constructor({
        parent,
        type,
        children,
        rowStart,
        rowEnd,
        columnStart,
        columnEnd,
    }: HorizontalRuleMarkdownNodeParams) {
        super({
            type,
            rowStart,
            rowEnd,
            columnStart,
            columnEnd,
        });
        this.parent = parent;
        this.children = children;
    }

    getStringValue(): string {
        return "";
    }
}

export class FootnodeMarkdownNode extends MarkdownNode {
    public parent: RootMarkdownNode;
    public children: Footnode;
    constructor({
        parent,
        type,
        children,
        rowStart,
        rowEnd,
        columnStart,
        columnEnd,
    }: FootnodeMarkdownNodeParams) {
        super({
            type,
            rowStart,
            rowEnd,
            columnStart,
            columnEnd,
        });
        this.parent = parent;
        this.children = children;
    }

    getStringValue(): string {
        return "";
    }
}

export class ParagraphMarkdownNode extends MarkdownNode {
    public parent: RootMarkdownNode;
    public children: TextMarkdownNode | null;
    constructor({
        parent,
        type,
        children,
        rowStart,
        rowEnd,
        columnStart,
        columnEnd,
    }: ParagraphMarkdownNodeParams) {
        super({
            type,
            rowStart,
            rowEnd,
            columnStart,
            columnEnd,
        });
        this.parent = parent;
        this.children = children;
    }

    getStringValue(): string {
        if (this.children) {
            const str = this.children.getSringValue();

            return str;
        }

        return "";
    }
}

export class NewLineMarkdownNode extends MarkdownNode {
    public parent: RootMarkdownNode;
    constructor({
        parent,
        type,
        rowStart,
        rowEnd,
        columnStart,
        columnEnd,
    }: NewLineMarkdownNodeParams) {
        super({ type, rowStart, rowEnd, columnStart, columnEnd });
        this.parent = parent;
    }

    getStringValue(): string {
        return "\n";
    }
}

/* TextNodes */
export class TextMarkdownNode extends MarkdownNode {
    public parent: TextMarkdownNodeParent;
    public children: TextMarkdownNodeChildren;
    constructor({
        parent,
        type,
        children,
        rowStart,
        rowEnd,
        columnStart,
        columnEnd,
    }: TextMarkdownNodeParams) {
        super({
            type,
            rowStart,
            rowEnd,
            columnStart,
            columnEnd,
        });
        this.parent = parent;
        this.children = children;
    }

    getSringValue(): string {
        if (this.children) {
            let strings = [];
            for (let i in this.children) {
                let currentItem = this.children[i];

                if (typeof currentItem === "string") {
                    strings.push(currentItem);
                } else {
                    const str = currentItem?.getStringValue();
                    strings.push(str);
                }
            }

            return strings.join("");
        }
        return "";
    }
}

export class InlineElementMarkdownNode extends MarkdownNode {
    public parent: TextMarkdownNode;
    public children: InlineElementA | InlineElementB;
    constructor({
        parent,
        type,
        children,
        rowStart,
        rowEnd,
        columnStart,
        columnEnd,
    }: InlineElementMarkdownNodeParams) {
        super({
            type,
            rowStart,
            rowEnd,
            columnStart,
            columnEnd,
        });
        this.parent = parent;
        this.children = children;
    }

    getStringValue(): string {
        if ("prefix" in this.children) {
            const values = Object.values(this.children);
            console.log(values)
            return values.join("");
        } else if ("title" in this.children) {
            const title = Object.values(this.children["title"]);
            const url = Object.values(this.children["url"]);

            return `${title.join("")} ${url.join("")}`;
        }

        return "";
    }
}
