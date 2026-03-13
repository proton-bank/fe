import apiClient from './client'
import type {
  CategoryResponse,
  FAQResponse,
  FAQSearchResult,
} from '../types/faq'

export async function getFaqs(): Promise<FAQResponse[]> {
  const response = await apiClient.get<FAQResponse[]>('/api/faqs')
  return response.data
}

export async function getFaqById(id: string): Promise<FAQResponse> {
  const response = await apiClient.get<FAQResponse>(
    `/api/faqs/${encodeURIComponent(id)}`,
  )
  return response.data
}

export interface SearchFaqsParams {
  q: string
  category_id?: string
  is_published?: boolean
  limit?: number // 1–3, default 3
}

export async function searchFaqs(
  params: SearchFaqsParams,
): Promise<FAQSearchResult[]> {
  const { q, category_id, is_published = true, limit = 3 } = params
  const searchParams = new URLSearchParams({
    q: q.trim(),
    // Always cap to max 3 results for UI
    limit: String(Math.min(3, Math.max(1, limit ?? 3))),
  })
  if (category_id) searchParams.set('category_id', category_id)
  if (is_published !== undefined)
    searchParams.set('is_published', String(is_published))
  const response = await apiClient.get<FAQSearchResult[]>(
    `/api/faqs/search?${searchParams.toString()}`,
  )
  return response.data
}

export async function getCategories(): Promise<CategoryResponse[]> {
  const response = await apiClient.get<CategoryResponse[]>(
    '/api/faqs/categories',
  )
  return response.data
}

