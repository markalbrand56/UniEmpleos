import { useState, useEffect } from "react"
import { useStoreon } from "storeon/react"

const useConfig = (schema, initialValues) => {
  const { dispatch, user } = useStoreon("user")
  const [error, setError] = useState(false)
  const [values, setValues] = useState(initialValues)

  console.log("useConfig", user)

  // Aca actualizamos los valores de entrada y los actualizamos en el store
  const setValue = (field, value) => {
    console.log("setValue", field, value)
    setValues({
      ...values,
      [field]: value,
    })

    dispatch("user/config", { ...user, [field]: value })
  }

  const setManyValues = (updates) => {
    console.log("setValues", updates)
    setValues({
      ...values,
      ...updates,
    })
    dispatch("user/config", { ...user, ...updates })
  }

  const onChange =
    (field) =>
    ({ target: { value } }) =>
      setValue(field, value)

  // validar errores en los campos
  const validate = () => {
    const validation = schema.validate(values)
    if (validation.error) {
      setError(validation.error)
      return false
    }
    setError(false)
    return true
  }

  useEffect(() => {
    setValues(user || initialValues)
  }, [])

  return {
    values,
    setValue,
    setValues,
    onChange,
    validate,
    error,
    user,
    setManyValues,
  }
}

export default useConfig
