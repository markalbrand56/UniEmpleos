import Logo from "./Logo"
import logo from "../../assets/Ue_1.svg"

export default {
  title: "Logo/Logo",
  component: Logo,
  tags: ["autodocs"],
  argTypes: {},
}

export const AsPrimary = {
  args: {
    src: logo,
    size: 100,
  },
}
