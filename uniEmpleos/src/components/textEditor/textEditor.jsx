import React, { useState } from "react"
import ReactQuill from "react-quill"
import "react-quill/dist/quill.snow.css"

const MyEditor = () => {
  const [content, setContent] = useState("")

  const handleContentChange = (newContent) => {
    setContent(newContent)
  }

  return <ReactQuill value={content} onChange={handleContentChange} />
}

export default MyEditor
