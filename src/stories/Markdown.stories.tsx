import type { Meta, StoryObj } from "@storybook/react";

import { Markdown } from "../components/markdown/Markdown";

const meta: Meta<typeof Markdown> = {
    component: Markdown,
};

export default meta;

type Story = StoryObj<typeof Markdown>

export const BasicMarkdown: Story = {
    render: () => <Markdown markdownContent="# Hello World!" />,
  };