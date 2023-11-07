import React from "react"
import PropTypes from "prop-types"
import style from "./ImageDirectUploader.module.css"

const ImageDirectUploader = ({
  uploader,
  handleInputChange,
  isSelected,
  archivo,
}) => (
  <div className={style.UploaderContainer}>
    <form
      id="uploadForm"
      encType="multipart/form-data"
      action="#"
      method="PUT"
      className={style.UploaderForm}
    >
      <label
        htmlFor="file"
        className={style.UploaderLabel}
        style={isSelected ? { backgroundColor: "#94bd0f", color: "#000" } : {}}
      >
        {isSelected ? archivo : "Seleccionar nuevo archivo"}
        <input
          className={style.UploaderInput}
          type="file"
          name="file"
          id="file"
          accept=".jpg, .jpeg, .png"
          onChange={handleInputChange}
        />
      </label>
      <button
        type="submit"
        className={style.UploaderButton}
        onClick={uploader}
        disabled={!isSelected}
      >
        Confirmar
      </button>
    </form>
  </div>
)

ImageDirectUploader.propTypes = {
  uploader: PropTypes.func.isRequired,
  handleInputChange: PropTypes.func.isRequired,
  isSelected: PropTypes.bool.isRequired,
  archivo: PropTypes.string.isRequired,
}

export default ImageDirectUploader
