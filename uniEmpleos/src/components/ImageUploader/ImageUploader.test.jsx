import React from "react"
import { test, it } from "vitest"
import ImageUploader from "./ImageUploader"

test("ImageUploader Component", () => {
  it("should upload an image successfully", () => {
    const onImageUpload = jest.fn()
    const image = ""
    const wrapper = mount(
      <ImageUploader onImageUpload={onImageUpload} image={image} />
    )
    const dropzone = wrapper.find(Dropzone)
    const file = new File(["(⌐□_□)"], "test.png", { type: "image/png" })
    dropzone.props().onDrop([file])
    expect(wrapper.find("img").prop("src")).toContain("data:image/png;base64")
    expect(onImageUpload).toHaveBeenCalled()
  })

  it("should update an image successfully", () => {
    const onImageUpload = jest.fn()
    const image = ""
    const wrapper = mount(
      <ImageUploader onImageUpload={onImageUpload} image={image} />
    )
    const dropzone = wrapper.find(Dropzone)
    const file1 = new File(["(⌐□_□)"], "test1.png", { type: "image/png" })
    const file2 = new File(["(⌐□_□)"], "test2.png", { type: "image/png" })
    dropzone.props().onDrop([file1])
    expect(wrapper.find("img").prop("src")).toContain("data:image/png;base64")
    dropzone.props().onDrop([file2])
    expect(wrapper.find("img").prop("src")).toContain("data:image/png;base64")
    expect(onImageUpload).toHaveBeenCalledTimes(2)
  })
})
