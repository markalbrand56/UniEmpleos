import React from "react"
import PropTypes from "prop-types"
import style from "./ImageDirectUploader.module.css"

const ImageDirectUploader = ({ uploader }) => (
  <div className={style.UploaderContainer}>
    <form id="uploadForm" encType="multipart/form-data" action="#" method="PUT" className={style.UploaderForm}>
      <label htmlFor="file" className={style.UploaderLabel}>
        Sube una nueva foto de perfil
        <input
          className={style.UploaderInput}
          type="file"
          name="file"
          id="file"
          accept=".jpg, .jpeg, .png"
        ></input>
      </label>
      <button type="submit" className={style.UploaderButton} onClick={uploader}>
        Confirmar
      </button>
    </form>
  </div>
)

ImageDirectUploader.propTypes = {
  uploader: PropTypes.func.isRequired,
}

export default ImageDirectUploader
