import { useEffect, useMemo, useState } from 'react'
import { Card } from '../components/ui/Card'
import { Input } from '../components/ui/Input'
import { AccordionItem } from '../components/ui/Accordion'
import { Badge } from '../components/ui/Badge'
import { getCategories, getFaqs, searchFaqs } from '../api/faqs'
import type { CategoryResponse, FAQResponse, FAQSearchResult } from '../types/faq'

type Mode = 'all' | 'search'

export default function FaqPage() {
  const [faqs, setFaqs] = useState<FAQResponse[]>([])
  const [categories, setCategories] = useState<CategoryResponse[]>([])
  const [activeCategory, setActiveCategory] = useState<string | 'all'>('all')
  const [openId, setOpenId] = useState<string | null>(null)

  const [query, setQuery] = useState('')
  const [debouncedQuery, setDebouncedQuery] = useState('')
  const [searchResults, setSearchResults] = useState<FAQSearchResult[]>([])
  const [mode, setMode] = useState<Mode>('all')

  // Initial load
  useEffect(() => {
    const load = async () => {
      try {
        const [faqList, categoryList] = await Promise.all([
          getFaqs(),
          getCategories(),
        ])
        setFaqs(faqList.filter((f) => f.is_published))
        setCategories(categoryList)
      } catch (err) {
        console.error(err)
      }
    }
    void load()
  }, [])

  // Debounce search
  useEffect(() => {
    const id = setTimeout(() => setDebouncedQuery(query.trim()), 300)
    return () => clearTimeout(id)
  }, [query])

  // Execute search when user types (default list, search results when searching)
  useEffect(() => {
    const runSearch = async () => {
      if (!debouncedQuery) {
        setSearchResults([])
        setMode('all')
        return
      }
      try {
        const results = await searchFaqs({
          q: debouncedQuery,
          category_id: activeCategory === 'all' ? undefined : activeCategory,
          is_published: true,
          // BE + UI: only show up to 3 results
          limit: 3,
        })
        setSearchResults(results)
        setMode('search')
      } catch (err) {
        console.error(err)
      }
    }
    void runSearch()
  }, [debouncedQuery, activeCategory])

  const visibleFaqs = useMemo(() => {
    if (mode === 'search') {
      return searchResults.map((r) => r.faq)
    }
    if (activeCategory === 'all') return faqs
    return faqs.filter((f) => f.category_id === activeCategory)
  }, [activeCategory, faqs, mode, searchResults])

  return (
    <div className="space-y-6">
      <header>
        <h1 className="text-xl font-semibold tracking-tight text-slate-50">
          Frequently Asked Questions
        </h1>
        <p className="mt-1 text-sm text-slate-400">
          Browse or search FAQs about accounts, transfers, and security.
        </p>
      </header>

      <section>
        <Card>
          <div className="space-y-4">
            <Input
              label="Search FAQs"
              placeholder="Search FAQs..."
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              helperText="Semantic search with 300ms debounce"
            />
            <div className="flex flex-wrap gap-2 text-xs">
              <button
                type="button"
                className={`rounded-full px-3 py-1 ${
                  activeCategory === 'all'
                    ? 'bg-primary text-white'
                    : 'bg-slate-900 text-slate-300 hover:bg-slate-800'
                }`}
                onClick={() => {
                  setActiveCategory('all')
                  setMode('all')
                }}
              >
                All
              </button>
              {categories.map((cat) => (
                <button
                  key={cat.id}
                  type="button"
                  className={`rounded-full px-3 py-1 ${
                    activeCategory === cat.id
                      ? 'bg-primary text-white'
                      : 'bg-slate-900 text-slate-300 hover:bg-slate-800'
                  }`}
                  onClick={() => {
                    setActiveCategory(cat.id)
                    setMode('all')
                  }}
                >
                  {cat.name}
                </button>
              ))}
            </div>
          </div>
        </Card>
      </section>

      <section>
        <Card>
          {mode === 'search' && (
            <p className="mb-3 text-xs text-slate-500">
              Showing search results for &quot;{debouncedQuery}&quot;
            </p>
          )}

          {visibleFaqs.length === 0 ? (
            <p className="text-sm text-slate-400">
              No FAQs found. Try a different search term or category.
            </p>
          ) : (
            <div className="divide-y divide-slate-800 rounded-md border border-slate-800 bg-slate-950/60">
              {visibleFaqs.map((faq) => (
                <AccordionItem
                  key={faq.id}
                  title={
                    <div className="flex items-center gap-2">
                      <span>{faq.question}</span>
                      {faq.category_id && (
                        <Badge variant="outline" className="text-[10px]">
                          {
                            categories.find((c) => c.id === faq.category_id)
                              ?.name
                          }
                        </Badge>
                      )}
                    </div>
                  }
                  isOpen={openId === faq.id}
                  onToggle={() =>
                    setOpenId((current) => (current === faq.id ? null : faq.id))
                  }
                >
                  <p className="text-sm leading-relaxed text-slate-200">
                    {faq.answer}
                  </p>
                </AccordionItem>
              ))}
            </div>
          )}
        </Card>
      </section>
    </div>
  )
}

