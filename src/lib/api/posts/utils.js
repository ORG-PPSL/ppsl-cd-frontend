import { decode } from '@msgpack/msgpack'

/**
 * @param {string} UintStr
 * @param {boolean} stringify
 * @returns {object | string}
 */
export function tryParseContent (UintStr, stringify = false) {
  let res = UintStr || ''

  if (res.length > 0) {
    res = decode(res.split(','))
    if (stringify) res = JSON.stringify(res)

    return res
  }

  return res
}
