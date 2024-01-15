export function uint8ArrayToString (uint8Array) {
  return btoa(uint8Array)
}

export function stringToUint8Array (base64uint8Array) {
  return new Uint8Array(atob(base64uint8Array).split(','))
}
