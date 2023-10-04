import React from "react"
import PropTypes from "prop-types"
import style from "./ImageDirectUploader.module.css"

const ImageDirectUploader = ({ uploader }) => (
  <div className={style.UploaderContainer}>
    <form id="uploadForm" encType="multipart/form-data" action="#" method="PUT">
      <label htmlFor="file">Selecciona un archivo:</label>
      <input
        type="file"
        name="file"
        id="file"
        accept=".jpg, .jpeg, .png"
        className={style.UploaderInput}
      ></input>
      <button type="submit" className={style.UploaderButton} onClick={uploader}>
        Subir
      </button>
    </form>
  </div>
)

ImageDirectUploader.propTypes = {
  uploader: PropTypes.func.isRequired,
}

export default ImageDirectUploader
