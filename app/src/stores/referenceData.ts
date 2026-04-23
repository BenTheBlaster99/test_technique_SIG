import { defineStore } from 'pinia'
import { fetchPostes, fetchStatuts } from '../services/api/referenceData'
import type { Poste, Statut } from '../types/models'

interface ReferenceDataState {
  statuts: Statut[]
  postes: Poste[]
  isLoading: boolean
  error: string
  hasLoaded: boolean
}

export const useReferenceDataStore = defineStore('referenceData', {
  state: (): ReferenceDataState => ({
    statuts: [],
    postes: [],
    isLoading: false,
    error: '',
    hasLoaded: false,
  }),

  getters: {
    statusMap(state) {
      return new Map(state.statuts.map((statut) => [statut.nom, statut]))
    },
  },

  actions: {
    async load() {
      if (this.hasLoaded) {
        return
      }

      this.isLoading = true
      this.error = ''

      try {
        const [statuts, postes] = await Promise.all([fetchStatuts(), fetchPostes()])
        this.statuts = statuts
        this.postes = postes
        this.hasLoaded = true
      } catch (error) {
        this.error = error instanceof Error ? error.message : 'Unable to load reference data.'
      } finally {
        this.isLoading = false
      }
    },
  },
})
