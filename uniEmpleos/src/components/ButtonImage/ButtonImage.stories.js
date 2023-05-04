import ButtonImage from "./ButtonImage"
import user from "../../assets/user.svg"
import corp from "../../assets/corp.svg"

export default {
  title: "ButtonImage",
  component: ButtonImage,
  tags: ["autodocs"],
  argTypes: {},
}

export const asUser = {
  args: {
    src: { user },
    alt: "user",
    text: "Para mí",
  },
}

export const asCorp = {
  args: {
    src: { corp },
    alt: "corp",
    text: "Para mi empresa",
  },
}
