import { useState } from 'react'
import { Helmet } from 'react-helmet-async'
import { Play, BarChart3, X, AlertCircle } from 'lucide-react'
import { useQuery } from '@tanstack/react-query'
import api from '@/lib/api'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'

interface Video {
  id: string
  youtubeId: string
  title: string
  description: string | null
  category: string | null
  tags: string[] | null
  thumbnail: string | null
  views: number
  isPublished: boolean
}

const categoryColors: Record<string, string> = {
  'Tax Filing': 'bg-blue-500/10 text-blue-600 border-blue-500/20',
  NTN: 'bg-purple-500/10 text-purple-600 border-purple-500/20',
  'Sales Tax': 'bg-emerald-500/10 text-emerald-600 border-emerald-500/20',
  'Tax Guide': 'bg-amber-500/10 text-amber-600 border-amber-500/20',
  'USA Services': 'bg-cyan-500/10 text-cyan-600 border-cyan-500/20',
  Legal: 'bg-rose-500/10 text-rose-600 border-rose-500/20',
  Business: 'bg-indigo-500/10 text-indigo-600 border-indigo-500/20',
}

function SkeletonCard() {
  return (
    <div className="rounded-xl border bg-card overflow-hidden animate-pulse">
      <div className="aspect-video bg-muted" />
      <div className="p-5 space-y-3">
        <div className="h-5 w-16 bg-muted rounded" />
        <div className="h-5 w-full bg-muted rounded" />
        <div className="h-4 w-full bg-muted rounded" />
        <div className="h-4 w-3/4 bg-muted rounded" />
      </div>
    </div>
  )
}

export default function VideosPage() {
  const [activeVideo, setActiveVideo] = useState<Video | null>(null)

  const { data, isLoading, error } = useQuery({
    queryKey: ['public-videos'],
    queryFn: async () => {
      const res = await api.get('/videos')
      return res.data.data as Video[]
    },
  })

  const videos = data || []

  return (
    <>
      <Helmet>
        <title>Video Tutorials - Volks & David</title>
        <meta name="description" content="Watch free video tutorials on tax filing, NTN registration, GST, business services, and more from Volks & David." />
      </Helmet>

      <section className="bg-gradient-to-b from-primary/5 py-20">
        <div className="container text-center">
          <h1 className="text-4xl font-bold tracking-tight sm:text-5xl">Video Tutorials</h1>
          <p className="mt-4 text-lg text-muted-foreground max-w-2xl mx-auto">
            Learn at your own pace with our comprehensive library of video guides and tutorials.
          </p>
        </div>
      </section>

      <section className="py-16">
        <div className="container">
          {isLoading ? (
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {Array.from({ length: 6 }).map((_, i) => (
                <SkeletonCard key={i} />
              ))}
            </div>
          ) : error ? (
            <div className="flex flex-col items-center justify-center py-20 text-center">
              <AlertCircle className="h-12 w-12 text-destructive mb-4" />
              <h3 className="text-lg font-semibold mb-2">Failed to load videos</h3>
              <p className="text-muted-foreground mb-4">Something went wrong. Please try again later.</p>
              <Button onClick={() => window.location.reload()}>Retry</Button>
            </div>
          ) : videos.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-20 text-center">
              <h3 className="text-lg font-semibold mb-2">No videos yet</h3>
              <p className="text-muted-foreground">Video tutorials are coming soon. Stay tuned!</p>
            </div>
          ) : (
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {videos.map((video) => (
                <div
                  key={video.id}
                  className="group rounded-xl border bg-card overflow-hidden hover:shadow-lg transition-all duration-300 cursor-pointer"
                  onClick={() => setActiveVideo(video)}
                >
                  <div className="relative aspect-video bg-gradient-to-br from-primary/30 to-accent/30 flex items-center justify-center">
                    {video.thumbnail ? (
                      <img
                        src={video.thumbnail}
                        alt={video.title}
                        className="w-full h-full object-cover absolute inset-0"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-primary/30 to-accent/30">
                        <div className="h-16 w-16 rounded-full bg-background/90 flex items-center justify-center group-hover:scale-110 transition-transform z-10">
                          <Play className="h-6 w-6 text-primary ml-0.5" />
                        </div>
                      </div>
                    )}
                    {!video.thumbnail && (
                      <div className="h-16 w-16 rounded-full bg-background/90 flex items-center justify-center group-hover:scale-110 transition-transform z-10">
                        <Play className="h-6 w-6 text-primary ml-0.5" />
                      </div>
                    )}
                  </div>
                  <div className="p-5">
                    <div className="mb-2">
                      <Badge
                        variant="outline"
                        className={
                          categoryColors[video.category || ''] || 'bg-primary/10 text-primary border-primary/20'
                        }
                      >
                        {video.category}
                      </Badge>
                    </div>
                    <h3 className="font-semibold mb-2 line-clamp-2 group-hover:text-primary transition-colors">
                      {video.title}
                    </h3>
                    <p className="text-sm text-muted-foreground line-clamp-2">{video.description}</p>
                    <div className="flex items-center gap-1 text-xs text-muted-foreground mt-3">
                      <BarChart3 className="h-3 w-3" />
                      <span>{video.views.toLocaleString()} views</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}

          {videos.length > 0 && (
            <div className="mt-12 text-center p-8 rounded-xl border bg-muted/30">
              <h2 className="text-xl font-bold mb-2">More Videos Coming Soon</h2>
              <p className="text-muted-foreground">
                We are constantly adding new tutorials. Subscribe to stay updated!
              </p>
            </div>
          )}
        </div>
      </section>

      {activeVideo && (
        <div
          className="fixed inset-0 z-50 bg-black/80 flex items-center justify-center p-4"
          onClick={() => setActiveVideo(null)}
        >
          <div
            className="relative w-full max-w-4xl aspect-video bg-black rounded-xl overflow-hidden"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              className="absolute -top-10 right-0 text-white/80 hover:text-white transition-colors z-10"
              onClick={() => setActiveVideo(null)}
            >
              <X className="h-6 w-6" />
            </button>
            <iframe
              src={`https://www.youtube.com/embed/${activeVideo.youtubeId}?autoplay=1`}
              title={activeVideo.title}
              className="w-full h-full"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
            />
          </div>
        </div>
      )}
    </>
  )
}
