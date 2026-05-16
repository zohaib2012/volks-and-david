import { prisma } from "../../config/database";

export const blogService = {
  async list(
    page: number,
    limit: number,
    filters: Record<string, any>,
    publicOnly: boolean,
  ) {
    const where: any = {};
    if (publicOnly) where.status = "PUBLISHED";
    if (filters.category) where.category = filters.category;
    if (filters.search) {
      where.OR = [
        { title: { contains: filters.search as string } },
        { content: { contains: filters.search as string } },
      ];
    }

    const [data, total] = await Promise.all([
      prisma.blogPost.findMany({
        where,
        skip: (page - 1) * limit,
        take: limit,
        orderBy: { createdAt: "desc" },
      }),
      prisma.blogPost.count({ where }),
    ]);
    return { data, pagination: { page, limit, total } };
  },

  async getBySlug(slug: string) {
    const post = await prisma.blogPost.findUnique({ where: { slug } });
    if (post) {
      await prisma.blogPost
        .update({ where: { id: post.id }, data: { views: post.views + 1 } })
        .catch(() => {});
    }
    return post;
  },

  async getById(id: string) {
    return prisma.blogPost.findUnique({ where: { id } });
  },

  async create(data: any) {
    return prisma.blogPost.create({ data });
  },

  async update(id: string, data: any) {
    return prisma.blogPost.update({ where: { id }, data });
  },

  async remove(id: string) {
    return prisma.blogPost.delete({ where: { id } });
  },
};
