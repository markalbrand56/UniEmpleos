import React from "react"
import ReactQuill from "react-quill"
import "react-quill/dist/quill.snow.css"

const MyEditor = ({ content, handleContentChange }) => {
  return <ReactQuill value={content} onChange={handleContentChange} />
}

export default MyEditor
