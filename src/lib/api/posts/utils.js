/**
 * @param {string} UintStr
 * @param {boolean} stringify
 * @returns {object | string}
 */
export function tryParseContent (UintStr, stringify = false) {
  let res = UintStr || ''

  if (res.length > 0) {
    if (stringify) res = JSON.parse(res)

    return res
  }

  return res
}
