// https://stackoverflow.com/a/73006128

import { useState, useEffect } from 'react'

const useFormattedDate = (date) => {
  const [formattedDate, setFormattedDate] = useState(null)

  useEffect(() => {
    if (date) setFormattedDate(new Date(date).toLocaleString())
  }, [])

  return formattedDate
}

export default useFormattedDate
