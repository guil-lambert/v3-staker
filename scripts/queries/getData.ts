export async function getData(query, fetchData, parseData) {
  return await fetchData(query)
    .then((data) => {
      return parseData(data)
    })
    .catch((error) => {
      console.error('Error:', error)
    })
}
