/**
 * Asking for cookie is bad, but this should only be called by the SSR side.
 */
export async function getUserById (id, cookie) {
  const url = new URL(`./users/${id}`, process.env.API_ENDPOINT)
  const res = await fetch(url, { headers: { cookie } })
  return await res.json()
}
