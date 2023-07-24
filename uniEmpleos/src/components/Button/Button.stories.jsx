import Button from "./Button"

// More on how to set up stories at: https://storybook.js.org/docs/react/writing-stories/introduction
export default {
  title: "Buttons/Button",
  component: Button,
  tags: ["autodocs"],
  argTypes: {
    backgroundColor: { control: "color" },
  },
}

// More on writing stories with args: https://storybook.js.org/docs/react/writing-stories/args
export const Primary = {
  args: {
    label: "Button",
    backgroundColor: "#fff",
    textColor: "#000",
  },
}

export const Secondary = {
  args: {
    label: "Button",
    backgroundColor: "#000",
    textColor: "#fff",
  },
}