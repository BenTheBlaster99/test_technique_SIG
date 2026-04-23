import { defineStore } from 'pinia'
import {
  fetchCandidatureById,
  fetchCandidatures,
  patchCandidature,
} from '../services/api/candidatures'
import type { Candidature, CandidatureFilters, Commentaire } from '../types/models'

const FILTER_STORAGE_KEY = 'recruitment-dashboard-filters'

function getDefaultFilters(): CandidatureFilters {
  return {
    search: '',
    statut: '',
    poste: '',
    dateFrom: '',
    page: 1,
    limit: 5,
  }
}

function loadStoredFilters() {
  try {
    const rawValue = localStorage.getItem(FILTER_STORAGE_KEY)
    if (!rawValue) {
      return getDefaultFilters()
    }

    return {
      ...getDefaultFilters(),
      ...JSON.parse(rawValue),
    } as CandidatureFilters
  } catch {
    return getDefaultFilters()
  }
}

interface CandidatureState {
  items: Candidature[]
  selected: Candidature | null
  filters: CandidatureFilters
  totalCount: number
  listLoading: boolean
  detailLoading: boolean
  isSaving: boolean
  listError: string
  detailError: string
  saveError: string
  saveSuccess: string
}

export const useCandidatureStore = defineStore('candidatures', {
  state: (): CandidatureState => ({
    items: [],
    selected: null,
    filters: loadStoredFilters(),
    totalCount: 0,
    listLoading: false,
    detailLoading: false,
    isSaving: false,
    listError: '',
    detailError: '',
    saveError: '',
    saveSuccess: '',
  }),

  getters: {
    totalPages(state) {
      return Math.max(1, Math.ceil(state.totalCount / state.filters.limit))
    },
  },

  actions: {
    persistFilters() {
      localStorage.setItem(FILTER_STORAGE_KEY, JSON.stringify(this.filters))
    },

    updateFilters(payload: Partial<CandidatureFilters>) {
      this.filters = {
        ...this.filters,
        ...payload,
      }

      this.persistFilters()
    },

    resetFilters() {
      this.filters = getDefaultFilters()
      this.persistFilters()
    },

    clearFeedback() {
      this.saveError = ''
      this.saveSuccess = ''
    },

    async loadList(): Promise<void> {
      this.listLoading = true
      this.listError = ''

      try {
        const response = await fetchCandidatures(this.filters)
        this.items = response.data
        this.totalCount = response.totalCount

        if (this.filters.page > this.totalPages) {
          this.filters.page = this.totalPages
          this.persistFilters()
          return this.loadList()
        }
      } catch (error) {
        this.listError = error instanceof Error ? error.message : 'Unable to load candidatures.'
      } finally {
        this.listLoading = false
      }
    },

    async loadById(id: number): Promise<void> {
      this.detailLoading = true
      this.detailError = ''
      this.clearFeedback()

      try {
        this.selected = await fetchCandidatureById(id)
      } catch (error) {
        this.detailError = error instanceof Error ? error.message : 'Unable to load this candidature.'
        this.selected = null
      } finally {
        this.detailLoading = false
      }
    },

    async updateStatus(id: number, statut: string): Promise<void> {
      this.isSaving = true
      this.clearFeedback()

      try {
        const updated = await patchCandidature(id, { statut })
        this.selected = updated
        this.items = this.items.map((item) => (item.id === id ? updated : item))
        this.saveSuccess = 'Status updated successfully.'
      } catch (error) {
        this.saveError = error instanceof Error ? error.message : 'Unable to update the status.'
      } finally {
        this.isSaving = false
      }
    },

    async addComment(id: number, auteur: string, contenu: string): Promise<void> {
      if (!this.selected) {
        return
      }

      this.isSaving = true
      this.clearFeedback()

      const nextCommentId =
        this.selected.commentaires.reduce((maxId, comment) => Math.max(maxId, comment.id), 0) + 1

      const nextComment: Commentaire = {
        id: nextCommentId,
        auteur,
        contenu,
        date: new Date().toISOString(),
      }

      try {
        const updatedComments = [...this.selected.commentaires, nextComment]
        const updated = await patchCandidature(id, { commentaires: updatedComments })
        this.selected = updated
        this.items = this.items.map((item) => (item.id === id ? updated : item))
        this.saveSuccess = 'Comment added successfully.'
      } catch (error) {
        this.saveError = error instanceof Error ? error.message : 'Unable to save the comment.'
      } finally {
        this.isSaving = false
      }
    },
  },
})
