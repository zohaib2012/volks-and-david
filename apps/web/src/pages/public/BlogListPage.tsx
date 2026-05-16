import { useState, useMemo } from 'react'
import { Helmet } from 'react-helmet-async'
import { Link } from 'react-router-dom'
import { Calendar, Clock, ArrowRight, Tag, Search, AlertCircle } from 'lucide-react'
import { useQuery } from '@tanstack/react-query'
import api from '@/lib/api'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { formatDate } from '@/lib/utils'

interface BlogPost {
  id: string
  title: string
  slug: string
  excerpt: string | null
  coverImage: string | null
  category: string | null
  tags: string[] | null
  publishedAt: string | null
  readingTime: number | null
  content: string | null
}

interface PaginationInfo {
  page: number
  limit: number
  total: number
  totalPages: number
}

interface BlogListResponse {
  success: boolean
  data: BlogPost[]
  pagination: PaginationInfo
}

const categoryColors: Record<string, string> = {
  'Tax Guide': 'bg-blue-500/10 text-blue-600 border-blue-500/20',
  Freelancing: 'bg-purple-500/10 text-purple-600 border-purple-500/20',
  'Sales Tax': 'bg-emerald-500/10 text-emerald-600 border-emerald-500/20',
  'USA Services': 'bg-amber-500/10 text-amber-600 border-amber-500/20',
  Legal: 'bg-rose-500/10 text-rose-600 border-rose-500/20',
}

function SkeletonCard() {
  return (
    <div className="rounded-xl border bg-card overflow-hidden animate-pulse">
      <div className="h-48 bg-muted" />
      <div className="p-6 space-y-3">
        <div className="h-5 w-20 bg-muted rounded" />
        <div className="h-5 w-full bg-muted rounded" />
        <div className="h-5 w-3/4 bg-muted rounded" />
        <div className="h-4 w-full bg-muted rounded" />
        <div className="h-4 w-2/3 bg-muted rounded" />
        <div className="flex justify-between pt-4 border-t">
          <div className="h-3 w-32 bg-muted rounded" />
          <div className="h-3 w-12 bg-muted rounded" />
        </div>
      </div>
    </div>
  )
}

const pageUrl = 'https://volksanddavid.com/blog'
const title = 'Blog - Volks & David'
const desc =
  'Read the latest articles, guides, and insights on tax filing, NTN registration, GST, business services, and more from Volks & David.'

export default function BlogListPage() {
  const [search, setSearch] = useState('')
  const [selectedCategory, setSelectedCategory] = useState('')

  const { data, isLoading, error } = useQuery<BlogListResponse>({
    queryKey: ['public-blog'],
    queryFn: async () => {
      const res = await api.get('/blog')
      return res.data
    },
  })

  const posts = data?.data || []

  const categories = useMemo(() => {
    const cats = new Set<string>()
    posts.forEach((p) => {
      if (p.category) cats.add(p.category)
    })
    return Array.from(cats).sort()
  }, [posts])

  const filtered = useMemo(() => {
    return posts.filter((post) => {
      const matchesSearch =
        !search ||
        post.title.toLowerCase().includes(search.toLowerCase())
      const matchesCategory =
        !selectedCategory || post.category === selectedCategory
      return matchesSearch && matchesCategory
    })
  }, [posts, search, selectedCategory])

  const blogPostingSchema = {
    '@context': 'https://schema.org',
    '@type': 'Blog',
    name: 'Volks & David Blog',
    description: desc,
    url: pageUrl,
    publisher: { '@type': 'LocalBusiness', name: 'Volks & David' },
    blogPost: posts.slice(0, 10).map((post) => ({
      '@type': 'BlogPosting',
      headline: post.title,
      url: `${pageUrl}/${post.slug}`,
      datePublished: post.publishedAt || undefined,
      description: post.excerpt || undefined,
    })),
  }

  return (
    <>
      <Helmet>
        <title>{title}</title>
        <meta name="description" content={desc} />
        <link rel="canonical" href={pageUrl} />

        <meta property="og:type" content="website" />
        <meta property="og:title" content={title} />
        <meta property="og:description" content={desc} />
        <meta property="og:url" content={pageUrl} />
        <meta property="og:image" content="https://volksanddavid.com/og-image.png" />

        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content={title} />
        <meta name="twitter:description" content={desc} />

        {posts.length > 0 && (
          <script type="application/ld+json">{JSON.stringify(blogPostingSchema)}</script>
        )}
      </Helmet>

      <section className="bg-gradient-to-b from-primary/5 py-20">
        <div className="container text-center">
          <h1 className="text-4xl font-bold tracking-tight sm:text-5xl">Our Blog</h1>
          <p className="mt-4 text-lg text-muted-foreground max-w-2xl mx-auto">
            Insights, guides, and updates on tax, finance, and business in Pakistan.
          </p>
        </div>
      </section>

      <section className="py-16">
        <div className="container">
          <div className="flex flex-col sm:flex-row gap-4 mb-8">
            <div className="relative flex-1 max-w-md">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search by title..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="pl-9"
              />
            </div>
            <select
              className="flex h-10 rounded-md border border-input bg-background px-3 py-2 text-sm"
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
            >
              <option value="">All Categories</option>
              {categories.map((cat) => (
                <option key={cat} value={cat}>
                  {cat}
                </option>
              ))}
            </select>
          </div>

          {isLoading ? (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {Array.from({ length: 6 }).map((_, i) => (
                <SkeletonCard key={i} />
              ))}
            </div>
          ) : error ? (
            <div className="flex flex-col items-center justify-center py-20 text-center">
              <AlertCircle className="h-12 w-12 text-destructive mb-4" />
              <h3 className="text-lg font-semibold mb-2">Failed to load blog posts</h3>
              <p className="text-muted-foreground mb-4">Something went wrong. Please try again later.</p>
              <Button onClick={() => window.location.reload()}>Retry</Button>
            </div>
          ) : filtered.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-20 text-center">
              <h3 className="text-lg font-semibold mb-2">
                {search || selectedCategory
                  ? 'No posts match your filters'
                  : 'No blog posts yet'}
              </h3>
              <p className="text-muted-foreground">
                {search || selectedCategory
                  ? 'Try adjusting your search or filter criteria.'
                  : 'Check back later for new articles.'}
              </p>
            </div>
          ) : (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filtered.map((post) => (
                <article
                  key={post.id}
                  className="group rounded-xl border bg-card overflow-hidden hover:shadow-lg transition-all duration-300 flex flex-col"
                >
                  <div className="h-48 bg-gradient-to-br from-primary/20 to-accent/20 flex items-center justify-center">
                    {post.coverImage ? (
                      <img
                        src={post.coverImage}
                        alt={post.title}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <span className="text-6xl font-bold text-primary/20">{post.title[0]}</span>
                    )}
                  </div>
                  <div className="p-6 flex flex-col flex-1">
                    <div className="flex items-center gap-2 mb-3">
                      <Badge
                        className={
                          categoryColors[post.category || ''] || 'bg-primary/10 text-primary border-primary/20'
                        }
                        variant="outline"
                      >
                        {post.category}
                      </Badge>
                    </div>
                    <h2 className="text-lg font-bold mb-2 group-hover:text-primary transition-colors line-clamp-2">
                      <Link to={`/blog/${post.slug}`}>{post.title}</Link>
                    </h2>
                    <p className="text-sm text-muted-foreground mb-4 line-clamp-3 flex-1">
                      {post.excerpt}
                    </p>
                    <div className="flex items-center justify-between text-xs text-muted-foreground pt-4 border-t">
                      <div className="flex items-center gap-3">
                        <span className="flex items-center gap-1">
                          <Calendar className="h-3 w-3" />
                          {post.publishedAt ? formatDate(post.publishedAt) : 'Not published'}
                        </span>
                        <span className="flex items-center gap-1">
                          <Clock className="h-3 w-3" />
                          {post.readingTime ? `${post.readingTime} min read` : '—'}
                        </span>
                      </div>
                      <div className="flex items-center gap-1">
                        <Tag className="h-3 w-3" />
                        <span>{post.tags?.length || 0}</span>
                      </div>
                    </div>
                  </div>
                </article>
              ))}
            </div>
          )}

          <div className="text-center mt-12">
            <Button asChild variant="outline" size="lg">
              <Link to="/videos">
                Watch Our Video Tutorials <ArrowRight className="ml-2 h-4 w-4" />
              </Link>
            </Button>
          </div>
        </div>
      </section>
    </>
  )
}
