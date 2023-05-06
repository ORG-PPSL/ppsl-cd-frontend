export async function getPostById (id) {
  const url = new URL(`./posts/id/${id}`, process.env.API_ENDPOINT)
  const res = await fetch(url)
  return await res.json()
}
