import { useMemo } from 'react'
import { Helmet } from 'react-helmet-async'
import { useParams, Link } from 'react-router-dom'
import { Calendar, Clock, ArrowLeft, Tag, AlertCircle } from 'lucide-react'
import { useQuery } from '@tanstack/react-query'
import api from '@/lib/api'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { formatDate } from '@/lib/utils'

interface BlogPost {
  id: string
  title: string
  slug: string
  excerpt: string | null
  content: string | null
  coverImage: string | null
  category: string | null
  tags: string[] | null
  publishedAt: string | null
  readingTime: number | null
  authorId: string | null
}

interface BlogListResponse {
  success: boolean
  data: BlogPost[]
}

function DetailSkeleton() {
  return (
    <div className="container max-w-3xl py-16 animate-pulse">
      <div className="h-4 w-24 bg-muted rounded mb-8" />
      <div className="space-y-3 mb-8">
        <div className="h-5 w-20 bg-muted rounded" />
        <div className="h-10 w-full bg-muted rounded" />
        <div className="h-10 w-3/4 bg-muted rounded" />
      </div>
      <div className="flex gap-4 pb-6 border-b mb-8">
        <div className="h-4 w-32 bg-muted rounded" />
        <div className="h-4 w-24 bg-muted rounded" />
        <div className="h-4 w-20 bg-muted rounded" />
      </div>
      <div className="space-y-3">
        {Array.from({ length: 8 }).map((_, i) => (
          <div key={i} className="h-4 w-full bg-muted rounded" />
        ))}
      </div>
    </div>
  )
}

const baseUrl = 'https://volksanddavid.com'

export default function BlogDetailPage() {
  const { slug } = useParams<{ slug: string }>()

  const { data: postData, isLoading, error } = useQuery({
    queryKey: ['public-blog', slug],
    queryFn: async () => {
      const res = await api.get(`/blog/${slug}`)
      return res.data.data as BlogPost
    },
    enabled: !!slug,
  })

  const { data: allPostsData } = useQuery<BlogListResponse>({
    queryKey: ['public-blog'],
    queryFn: async () => {
      const res = await api.get('/blog')
      return res.data
    },
  })

  const relatedPosts = useMemo(() => {
    if (!allPostsData?.data || !postData) return []
    return allPostsData.data
      .filter((p) => p.id !== postData.id)
      .slice(0, 3)
  }, [allPostsData, postData])

  if (isLoading) {
    return <DetailSkeleton />
  }

  if (error) {
    return (
      <div className="container py-20 text-center">
        <AlertCircle className="h-12 w-12 text-destructive mx-auto mb-4" />
        <h1 className="text-2xl font-bold mb-4">Failed to load post</h1>
        <p className="text-muted-foreground mb-6">Something went wrong. Please try again later.</p>
        <Button asChild>
          <Link to="/blog">Back to Blog</Link>
        </Button>
      </div>
    )
  }

  if (!postData) {
    return (
      <div className="container py-20 text-center">
        <h1 className="text-2xl font-bold mb-4">Post Not Found</h1>
        <p className="text-muted-foreground mb-6">The blog post you are looking for does not exist.</p>
        <Button asChild>
          <Link to="/blog">Back to Blog</Link>
        </Button>
      </div>
    )
  }

  const tags: string[] = Array.isArray(postData.tags) ? postData.tags : []
  const readTime = postData.readingTime ? `${postData.readingTime} min read` : '—'
  const content = postData.content || ''
  const pageUrl = `${baseUrl}/blog/${postData.slug}`
  const pageTitle = `${postData.title} - Volks & David Blog`
  const pageDesc = postData.excerpt || ''
  const coverImage = postData.coverImage || 'https://volksanddavid.com/og-image.png'

  const blogPostingSchema = {
    '@context': 'https://schema.org',
    '@type': 'BlogPosting',
    headline: postData.title,
    description: postData.excerpt || undefined,
    image: coverImage,
    datePublished: postData.publishedAt || undefined,
    url: pageUrl,
    author: {
      '@type': 'Organization',
      name: 'Volks & David',
      url: baseUrl,
    },
    publisher: {
      '@type': 'Organization',
      name: 'Volks & David',
      logo: { '@type': 'ImageObject', url: 'https://volksanddavid.com/og-image.png' },
    },
    mainEntityOfPage: { '@type': 'WebPage', '@id': pageUrl },
    keywords: tags.join(', ') || undefined,
  }

  return (
    <>
      <Helmet>
        <title>{pageTitle}</title>
        <meta name="description" content={pageDesc} />
        <link rel="canonical" href={pageUrl} />

        <meta property="og:type" content="article" />
        <meta property="og:title" content={pageTitle} />
        <meta property="og:description" content={pageDesc} />
        <meta property="og:url" content={pageUrl} />
        <meta property="og:image" content={coverImage} />
        {postData.publishedAt && (
          <meta property="article:published_time" content={postData.publishedAt} />
        )}
        {tags.map((tag) => (
          <meta key={tag} property="article:tag" content={tag} />
        ))}

        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content={pageTitle} />
        <meta name="twitter:description" content={pageDesc} />
        {coverImage && <meta name="twitter:image" content={coverImage} />}

        <script type="application/ld+json">{JSON.stringify(blogPostingSchema)}</script>
      </Helmet>

      <article className="py-16">
        <div className="container max-w-3xl">
          <Button asChild variant="ghost" className="mb-8 -ml-2">
            <Link to="/blog">
              <ArrowLeft className="mr-2 h-4 w-4" /> Back to Blog
            </Link>
          </Button>

          <div className="mb-8">
            <div className="flex flex-wrap items-center gap-3 mb-4">
              {postData.category && (
                <Badge variant="outline" className="bg-primary/10 text-primary border-primary/20">
                  {postData.category}
                </Badge>
              )}
              {tags.map((tag) => (
                <Badge key={tag} variant="secondary" className="text-xs">
                  {tag}
                </Badge>
              ))}
            </div>

            <h1 className="text-3xl sm:text-4xl font-bold tracking-tight mb-6">{postData.title}</h1>

            <div className="flex flex-wrap items-center gap-4 text-sm text-muted-foreground pb-6 border-b">
              <span className="flex items-center gap-1.5">
                <Calendar className="h-4 w-4" />
                {postData.publishedAt ? formatDate(postData.publishedAt) : 'Not published'}
              </span>
              <span className="flex items-center gap-1.5">
                <Clock className="h-4 w-4" />
                {readTime}
              </span>
              {tags.length > 0 && (
                <span className="flex items-center gap-1.5">
                  <Tag className="h-4 w-4" />
                  {tags.join(', ')}
                </span>
              )}
            </div>
          </div>

          <div className="prose prose-sm sm:prose-base max-w-none">
            {content.split('\n').map((line, i) => {
              if (line.startsWith('## ')) {
                return (
                  <h2 key={i} className="text-2xl font-bold mt-8 mb-4">
                    {line.replace('## ', '')}
                  </h2>
                )
              }
              if (line.startsWith('### ')) {
                return (
                  <h3 key={i} className="text-xl font-semibold mt-6 mb-3">
                    {line.replace('### ', '')}
                  </h3>
                )
              }
              if (line.startsWith('- **')) {
                const match = line.match(/- \*\*(.+?)\*\*(:?.*)/)
                if (match) {
                  return (
                    <p key={i} className="ml-4 mb-2">
                      <strong>{match[1]}</strong>
                      {match[2]}
                    </p>
                  )
                }
              }
              if (line.startsWith('- ')) {
                return (
                  <li key={i} className="ml-4 mb-1 list-disc">
                    {line.replace('- ', '')}
                  </li>
                )
              }
              if (line.startsWith('###')) {
                return null
              }
              if (line.trim() === '') {
                return <div key={i} className="h-2" />
              }
              return (
                <p key={i} className="mb-4 leading-relaxed text-muted-foreground">
                  {line}
                </p>
              )
            })}
          </div>

          {relatedPosts.length > 0 && (
            <div className="mt-16 pt-8 border-t">
              <h2 className="text-2xl font-bold mb-6">Related Posts</h2>
              <div className="grid md:grid-cols-3 gap-6">
                {relatedPosts.map((post) => (
                  <Link
                    key={post.id}
                    to={`/blog/${post.slug}`}
                    className="group rounded-xl border bg-card overflow-hidden hover:shadow-lg transition-all duration-300"
                  >
                    <div className="h-32 bg-gradient-to-br from-primary/20 to-accent/20 flex items-center justify-center">
                      {post.coverImage ? (
                        <img src={post.coverImage} alt={post.title} className="w-full h-full object-cover" />
                      ) : (
                        <span className="text-3xl font-bold text-primary/20">{post.title[0]}</span>
                      )}
                    </div>
                    <div className="p-4">
                      <Badge
                        variant="outline"
                        className="bg-primary/10 text-primary border-primary/20 mb-2"
                      >
                        {post.category}
                      </Badge>
                      <h3 className="font-semibold text-sm line-clamp-2 group-hover:text-primary transition-colors">
                        {post.title}
                      </h3>
                    </div>
                  </Link>
                ))}
              </div>
            </div>
          )}

          <div className="mt-8 text-center">
            <Button asChild>
              <Link to="/blog">More Articles</Link>
            </Button>
          </div>
        </div>
      </article>
    </>
  )
}
