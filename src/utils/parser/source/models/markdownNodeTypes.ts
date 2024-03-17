import {
    BlockQuoteMarkdownNode,
    CodeBlockMarkdownNode,
    FootnodeMarkdownNode,
    HeaderMarkdownNode,
    HorizontalRuleMarkdownNode,
    InlineElementMarkdownNode,
    ListMarkdownNode,
    NewLineMarkdownNode,
    ParagraphMarkdownNode,
    RootMarkdownNode,
    TextMarkdownNode,
} from "./markdownNodes";

// MarkdownNode
export interface MarkdownNodeParams {
    type: string;
    rowStart: number;
    rowEnd: number;
    columnStart?: number;
    columnEnd?: number;
}

// RootNode
export type RootMarkdownNodeChild =
    | HeaderMarkdownNode
    | BlockQuoteMarkdownNode
    | ListMarkdownNode
    | CodeBlockMarkdownNode
    | HorizontalRuleMarkdownNode
    | FootnodeMarkdownNode
    | ParagraphMarkdownNode
    | NewLineMarkdownNode;

export interface RootMarkdownNodeChildren {
    children: RootMarkdownNodeChild[] | null;
}

export interface RootMarkdownNodeParams
    extends MarkdownNodeParams,
        RootMarkdownNodeChildren {}

// HeaderNode
export type HeaderMarkdownNodeChildren = {
    prefix: string;
    text: TextMarkdownNode;
};

export interface HeaderMarkdownNodeRelatives {
    parent: RootMarkdownNode;
    children: HeaderMarkdownNodeChildren | null;
}

export interface HeaderMarkdownNodeParams
    extends MarkdownNodeParams,
        HeaderMarkdownNodeRelatives {}

// BlockQuoteNode
export type BlockQuoteChildren = {
    prefix: string;
    text: TextMarkdownNode;
} | null;

export interface BlockQuoteMarkdownNodeRelatives {
    parent: RootMarkdownNode;
    children: BlockQuoteChildren;
}

export interface BlockQuoteMarkdownNodeParams
    extends MarkdownNodeParams,
        BlockQuoteMarkdownNodeRelatives {}

// ListNode
export type listItem = { prefix: string; text: TextMarkdownNode};

export interface ListMarkdownNodeRelatives {
    parent: RootMarkdownNode;
    children: listItem[] | null;
}

export interface ListMarkdownNodeParams
    extends MarkdownNodeParams,
        ListMarkdownNodeRelatives {}

// CodeBlockNode
export interface CodeBlockMarkdownNodeRelatives {
    parent: RootMarkdownNode;
    children: string;
}

export interface CodeBlockMarkdownNodeParams
    extends MarkdownNodeParams,
        CodeBlockMarkdownNodeRelatives {}

// HorizontalRule
export interface HorizontalRuleMarkdownNodeRelatives {
    parent: RootMarkdownNode;
    children: "---" | "***" | "___";
}

export interface HorizontalRuleMarkdownNodeParams
    extends MarkdownNodeParams,
        HorizontalRuleMarkdownNodeRelatives {}

// FootNode
export type footnodeId = string | number;

export type footnodeLink = {
    prefix: "[^";
    footnodeId: footnodeId;
    suffix: "]";
};

export type Footnode = {
    footnodeLink: footnodeLink;
    text: TextMarkdownNode;
};

export interface FootnodeMarkdownNodeRelatives {
    parent: RootMarkdownNode;
    children: Footnode;
}

export interface FootnodeMarkdownNodeParams
    extends MarkdownNodeParams,
        FootnodeMarkdownNodeRelatives {}

// ParagraphNode
export interface ParagraphMarkdownNodeRelatives {
    parent: RootMarkdownNode;
    children: TextMarkdownNode | null;
}

export interface ParagraphMarkdownNodeParams
    extends MarkdownNodeParams,
        ParagraphMarkdownNodeRelatives {}

// NewlineNode
export interface NewLineMarkdownNodeRelatives {
    parent: RootMarkdownNode;
}

export interface NewLineMarkdownNodeParams
    extends MarkdownNodeParams,
        NewLineMarkdownNodeRelatives {}

/* Text Nodes */
// TextNode
export type TextMarkdownNodeChildren =
    | (string | InlineElementMarkdownNode)[]
    | null;
export type TextMarkdownNodeParent =
    | HeaderMarkdownNode
    | BlockQuoteMarkdownNode
    | ListMarkdownNode
    | CodeBlockMarkdownNode
    | HorizontalRuleMarkdownNode
    | FootnodeMarkdownNode
    | ParagraphMarkdownNode;

export interface TextMarkdownNodeRelatives {
    parent: TextMarkdownNodeParent;
    children: TextMarkdownNodeChildren;
}

export interface TextMarkdownNodeParams
    extends MarkdownNodeParams,
        TextMarkdownNodeRelatives {}

// InlineElement
export type InlineElementA = {
    prefix: string;
    value: string;
    suffix: string;
};

export type InlineElementB = {
    title: InlineElementA;
    url: InlineElementA;
};

export interface InlineElementMarkdownNodeRelatives {
    parent: TextMarkdownNode;
    children: InlineElementA | InlineElementB;
}
export interface InlineElementMarkdownNodeParams
    extends MarkdownNodeParams,
        InlineElementMarkdownNodeRelatives {}
