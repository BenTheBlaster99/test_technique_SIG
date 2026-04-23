import { buildUrl, request } from './client'
import type { Candidature, CandidatureFilters, PaginatedResponse } from '../../types/models'

export async function fetchCandidatures(filters: CandidatureFilters): Promise<PaginatedResponse<Candidature>> {
  const url = buildUrl('/candidatures', {
    _page: filters.page,
    _limit: filters.limit,
    _sort: 'dateCandidature',
    _order: 'desc',
    q: filters.search,
    statut: filters.statut,
    poste: filters.poste,
    dateCandidature_gte: filters.dateFrom,
  })

  const { data, headers } = await request<Candidature[]>(url)
  const totalCount = Number(headers.get('X-Total-Count') ?? data.length)

  return {
    data,
    totalCount,
  }
}

export async function fetchCandidatureById(id: number) {
  const url = buildUrl(`/candidatures/${id}`)
  const { data } = await request<Candidature>(url)

  return data
}

export async function patchCandidature(id: number, payload: Partial<Candidature>) {
  const url = buildUrl(`/candidatures/${id}`)
  const { data } = await request<Candidature>(url, {
    method: 'PATCH',
    body: JSON.stringify(payload),
  })

  return data
}
