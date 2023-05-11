import ButtonImage from "./ButtonImage"
import user from "/images/user.svg"
import corp from "/images/corp.svg"

export default {
  title: "Components/ButtonImage",
  component: ButtonImage,
  tags: ["autodocs"],
  argTypes: {},
}

export const AsUser = {
  args: {
    src: user,
    alt: "user",
    text: "Para mí",
    textColor: "#000",
  },
}

export const AsCorp = {
  args: {
    src: corp,
    alt: "corp",
    text: "Para mi empresa",
    textColor: "#000",
  },
}
