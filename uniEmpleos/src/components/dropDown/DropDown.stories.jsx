import DropDown from "./DropDown"

export default {
  title: "Inputs/DropDown",
  component: DropDown,
  tags: ["autodocs"],
  argTypes: {},
}

export const asDefault = {
  args: {
    opciones: [
      { value: "1", label: "Opcion 1" },
      { value: "2", label: "Opcion 2" },
      { value: "3", label: "Opcion 3" },
    ],
  },
}
