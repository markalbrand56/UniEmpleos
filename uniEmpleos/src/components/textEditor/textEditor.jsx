import React from "react"
import { useQuill } from "react-quilljs"
import "react-quill/dist/quill.snow.css"

const MyEditor = ({ content, handleContentChange }) => {

  const { quill, quillRef } = useQuill()
  return (
    <div ref={quillRef} onChange={handleContentChange} />
  )
}

export default MyEditor
