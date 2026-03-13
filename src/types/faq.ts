export interface FAQResponse {
  id: string
  category_id: string | null
  question: string
  answer: string
  is_published: boolean
  created_by: string
  created_at: string
  updated_at: string
}

export interface FAQSearchResult {
  faq: FAQResponse
  score: number
}

export interface CategoryResponse {
  id: string
  name: string
  description: string
  sort_order: number
  created_at: string
}

