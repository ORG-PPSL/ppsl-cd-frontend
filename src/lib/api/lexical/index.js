import { API_ENDPOINT } from '../posts'

export async function getPostHistoryHTMLByPostHistoryId (type, postHistoryId) {
  const url = new URL(`/api/lexical/${type}/${postHistoryId}`, API_ENDPOINT)
  const res = await fetch(url)
  return await res.text()
}
