/**
 * @param {string} fileName
 * @param {string[]} extensions
 */
export function filterByFileNameExtension (fileName, extensions = []) {
  for (let index = 0; index < extensions.length; index++) {
    const extension = extensions[index]
    if (fileName.endsWith(extension)) return fileName
  }
}
