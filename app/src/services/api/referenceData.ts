import { buildUrl, request } from './client'
import type { Poste, Statut } from '../../types/models'

export async function fetchStatuts() {
  const url = buildUrl('/statuts', {
    _sort: 'ordre',
    _order: 'asc',
  })

  const { data } = await request<Statut[]>(url)
  return data
}

export async function fetchPostes() {
  const url = buildUrl('/postes')
  const { data } = await request<Poste[]>(url)
  return data
}
