import { useState } from 'react'

export function InputTitle ({ name, initialValue, handleChange }) {
  const [title, setTitle] = useState(initialValue || '')
  const [error, setError] = useState(initialValue ? null : 'Required!')

  const handleTitleChange = (e) => {
    const value = e.target.value.trimStart()
    setTitle(value)

    let error
    if (value.length === 0) {
      error = 'Required'
    } else {
      error = null
    }
    setError(error)

    handleChange({ name, value, error })
  }

  return (
    <>
      <input
        name={name}
        className="!m-0"
        placeholder="Title"
        value={title}
        onChange={handleTitleChange}
        required
      />
      {error && <span className="text-red-500">{error}</span>}
    </>
  )
}
