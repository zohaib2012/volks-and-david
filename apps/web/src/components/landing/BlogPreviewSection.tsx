import { motion } from "framer-motion"
import { Link } from "react-router-dom"
import { ArrowRight, Calendar, Clock } from "lucide-react"

interface BlogPost {
  title: string
  excerpt: string
  date: string
  readTime: string
  category: string
  slug: string
}

const posts: BlogPost[] = [
  {
    title: "Complete Guide to Tax Filing in Pakistan 2024",
    excerpt:
      "Everything you need to know about filing your income tax return in Pakistan this year. From deadlines to deductions, we cover it all.",
    date: "Mar 15, 2024",
    readTime: "5 min read",
    category: "Tax Guide",
    slug: "/blog/complete-guide-tax-filing-pakistan-2024",
  },
  {
    title: "NTN Registration: Step-by-Step Process",
    excerpt:
      "Learn how to register for a National Tax Number online. Simple steps to get your NTN without visiting any government office.",
    date: "Mar 10, 2024",
    readTime: "4 min read",
    category: "Registration",
    slug: "/blog/ntn-registration-step-by-step",
  },
  {
    title: "Tax Savings Tips for Freelancers in Pakistan",
    excerpt:
      "Maximize your tax savings with these proven strategies for freelancers. Legal ways to reduce your tax burden and keep more of what you earn.",
    date: "Mar 5, 2024",
    readTime: "6 min read",
    category: "Tax Tips",
    slug: "/blog/tax-savings-tips-freelancers-pakistan",
  },
]

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.12 },
  },
}

const cardVariants = {
  hidden: { opacity: 0, y: 40 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.5, ease: "easeOut" } },
}

export default function BlogPreviewSection() {
  return (
    <section className="py-24 relative">
      <div className="absolute inset-0 bg-gradient-to-b from-background via-accent/5 to-background" />

      <div className="container relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.6 }}
          className="text-center space-y-4 mb-16"
        >
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold">
            Latest from Our <span className="gradient-text">Blog</span>
          </h2>
          <p className="text-muted-foreground max-w-2xl mx-auto text-lg">
            Stay informed with the latest tax news, tips, and guides.
          </p>
        </motion.div>

        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-50px" }}
          className="grid md:grid-cols-3 gap-8"
        >
          {posts.map((post) => (
            <motion.div
              key={post.slug}
              variants={cardVariants}
              className="group"
            >
              <Link to={post.slug}>
                <div className="glass-card rounded-2xl overflow-hidden h-full hover:-translate-y-2 transition-all duration-300">
                  <div className="aspect-[16/9] bg-gradient-to-br from-primary/20 to-accent/10 flex items-center justify-center relative overflow-hidden">
                    <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent" />
                    <div className="text-center">
                      <div className="text-4xl mb-2">📄</div>
                      <p className="text-sm text-muted-foreground">
                        Blog Image
                      </p>
                    </div>
                    <span className="absolute top-4 left-4 text-xs font-medium bg-primary/80 text-primary-foreground px-3 py-1 rounded-full backdrop-blur-sm">
                      {post.category}
                    </span>
                  </div>

                  <div className="p-6 space-y-4">
                    <div className="flex items-center gap-4 text-xs text-muted-foreground">
                      <span className="flex items-center gap-1">
                        <Calendar className="h-3.5 w-3.5" />
                        {post.date}
                      </span>
                      <span className="flex items-center gap-1">
                        <Clock className="h-3.5 w-3.5" />
                        {post.readTime}
                      </span>
                    </div>

                    <h3 className="text-lg font-semibold group-hover:text-primary transition-colors line-clamp-2">
                      {post.title}
                    </h3>

                    <p className="text-sm text-muted-foreground leading-relaxed line-clamp-3">
                      {post.excerpt}
                    </p>

                    <div className="inline-flex items-center gap-2 text-sm font-medium text-primary group/link">
                      Read More
                      <ArrowRight className="h-4 w-4 transition-transform group-hover/link:translate-x-1" />
                    </div>
                  </div>
                </div>
              </Link>
            </motion.div>
          ))}
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.4 }}
          className="text-center mt-12"
        >
          <Link
            to="/blog"
            className="inline-flex items-center gap-2 text-sm font-medium text-primary hover:text-primary/80 transition-colors"
          >
            View All Articles
            <ArrowRight className="h-4 w-4" />
          </Link>
        </motion.div>
      </div>
    </section>
  )
}
