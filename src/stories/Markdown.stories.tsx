import type { Meta, StoryObj } from "@storybook/react";

import { MarkdownPreview } from "../components/markdownPreview/MarkdownPreview";

import { sampleA } from "../utils/markdownSamples/";

const meta: Meta<typeof MarkdownPreview> = {
    component: MarkdownPreview,
};

export default meta;

type Story = StoryObj<typeof MarkdownPreview>;

export const BasicMarkdown: Story = {
    render: () => <MarkdownPreview markdownContent={sampleA} />,
};
