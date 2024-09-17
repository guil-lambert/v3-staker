import { fetchData } from '../fetchData'
import { getData } from '../getData'
import { query } from './oldIncentiveDataQuery'
import { parseOldIncentiveData } from './parseOldIncentiveData'

export async function getOldIncentiveData() {
  return await getData(query, fetchData, parseOldIncentiveData)
}
