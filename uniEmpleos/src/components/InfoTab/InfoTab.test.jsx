import React from "react"
import { test, it } from "vitest"
import InfoTab from "./InfoTab"

test("InfoTab Component", () => {
  it("should render component with all props", () => {
    const wrapper = shallow(
      <InfoTab
        title="Title"
        area="Area"
        salary="Salary"
        company="Company"
        labelbutton="Label"
        onClick={() => {}}
      />
    )
    expect(wrapper.find("h3").text()).toEqual("Title")
    expect(wrapper.find("p").at(0).text()).toEqual("Company")
    expect(wrapper.find("p").at(1).text()).toEqual("Area")
    expect(wrapper.find("p").at(2).text()).toEqual("Salary")
    expect(wrapper.find(Button).prop("label")).toEqual("Label")
  })
  it("should call onClick function when button is clicked", () => {
    const onClickMock = jest.fn()
    const wrapper = shallow(
      <InfoTab
        title="Title"
        area="Area"
        salary="Salary"
        company="Company"
        labelbutton="Label"
        onClick={onClickMock}
      />
    )
    wrapper.find(Button).simulate("click")
    expect(onClickMock).toHaveBeenCalled()
  })
})
