export interface Commentaire {
  id: number
  auteur: string
  date: string
  contenu: string
}

export interface Candidature {
  id: number
  nom: string
  poste: string
  statut: string
  competences: string[]
  experience: string
  dateCandidature: string
  email: string
  telephone: string
  cv: string
  lettreMotivation: string
  salaireSouhaite: number
  disponibilite: string
  localisation: string
  commentaires: Commentaire[]
}

export interface Statut {
  id: number
  nom: string
  couleur: string
  ordre: number
}

export interface Poste {
  id: number
  titre: string
  description: string
  competencesRequises: string[]
}

export interface CandidatureFilters {
  search: string
  statut: string
  poste: string
  dateFrom: string
  page: number
  limit: number
}

export interface PaginatedResponse<T> {
  data: T[]
  totalCount: number
}
