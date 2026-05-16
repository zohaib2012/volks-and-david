import { PrismaClient, UserRole } from "@prisma/client";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();

async function main() {
  console.log("Seeding database...");

  const hashedPassword = await bcrypt.hash("Admin@12345", 12);
  const hashedConsultant = await bcrypt.hash("Consult@123", 12);
  const hashedUser = await bcrypt.hash("User@12345", 12);

  const admin = await prisma.user.upsert({
    where: { email: "admin@volksanddavid.com" },
    update: {},
    create: {
      email: "admin@volksanddavid.com",
      password: hashedPassword,
      name: "Admin User",
      role: UserRole.ADMIN,
      isEmailVerified: true,
      isActive: true,
      referralCode: "VNDADMIN001",
      language: "en",
    },
  });

  const consultant = await prisma.user.upsert({
    where: { email: "consultant@volksanddavid.com" },
    update: {},
    create: {
      email: "consultant@volksanddavid.com",
      password: hashedConsultant,
      name: "Tax Consultant",
      role: UserRole.CONSULTANT,
      isEmailVerified: true,
      isActive: true,
      referralCode: "VNDCONS001",
      language: "en",
    },
  });

  const regularUser = await prisma.user.upsert({
    where: { email: "user@test.com" },
    update: {},
    create: {
      email: "user@test.com",
      password: hashedUser,
      name: "Test User",
      role: UserRole.USER,
      isEmailVerified: true,
      isActive: true,
      referralCode: "VNDUSER001",
      language: "en",
    },
  });

  console.log(
    "Users created:",
    admin.email,
    consultant.email,
    regularUser.email,
  );

  await prisma.profile.upsert({
    where: { id: "seed-profile-1" },
    update: {},
    create: {
      id: "seed-profile-1",
      userId: regularUser.id,
      name: "Test User",
      cnic: "12345-6789012-3",
      fatherName: "Father Name",
      address: "123 Main Street",
      city: "Lahore",
      province: "Punjab",
      phone: "+923001234567",
      email: "user@test.com",
      isPrimary: true,
    },
  });

  const taxYear = new Date().getFullYear() - 1;
  await prisma.taxReturn.create({
    data: {
      userId: regularUser.id,
      profileId: "seed-profile-1",
      taxYear,
      returnType: "SALARIED",
      income: { salary: 1200000, other: 50000 },
      deductions: { zakat: 30000, donation: 10000 },
      assets: { property: 5000000, vehicle: 2000000, bankBalance: 500000 },
      liabilities: { loan: 1000000 },
      totalIncome: 1250000,
      totalDeductions: 40000,
      taxableIncome: 1210000,
      taxPayable: 45000,
      status: "SUBMITTED",
      fbrReference: "FBR-2024-1234567",
      filedDate: new Date(),
    },
  });

  await prisma.faq.createMany({
    data: [
      {
        question: "Who needs to file a tax return in Pakistan?",
        answer:
          "Any individual whose taxable income exceeds the threshold of PKR 600,000 for the tax year is required to file an income tax return.",
        category: "general",
        order: 1,
        isPublished: true,
      },
      {
        question: "What is the deadline for filing tax returns?",
        answer:
          "The deadline for filing income tax returns in Pakistan is generally September 30th each year for individuals.",
        category: "general",
        order: 2,
        isPublished: true,
      },
      {
        question: "How do I register for NTN?",
        answer:
          "You can register for NTN by visiting the nearest IRIS office or through our online platform.",
        category: "registration",
        order: 3,
        isPublished: true,
      },
      {
        question: "What documents are needed for tax filing?",
        answer:
          "You need your CNIC, salary slips, bank statements, property documents, and details of investments.",
        category: "documents",
        order: 4,
        isPublished: true,
      },
      {
        question: "What is Sales Tax?",
        answer:
          "Sales Tax is a consumption tax imposed on the sale of goods and services in Pakistan.",
        category: "sales-tax",
        order: 5,
        isPublished: true,
      },
      {
        question: "How is income tax calculated?",
        answer:
          "Income tax is calculated based on the applicable tax slabs for the tax year after claiming eligible deductions.",
        category: "general",
        order: 6,
        isPublished: true,
      },
      {
        question: "What is the difference between NTN and STRN?",
        answer:
          "NTN (National Tax Number) is for income tax, while STRN (Sales Tax Registration Number) is for sales tax purposes.",
        category: "registration",
        order: 7,
        isPublished: true,
      },
      {
        question: "Can I file a tax return for previous years?",
        answer:
          "Yes, you can file belated returns for up to 5 previous tax years, though penalties may apply.",
        category: "general",
        order: 8,
        isPublished: true,
      },
      {
        question: "What is the WHT (Withholding Tax)?",
        answer:
          "Withholding Tax is tax deducted at source on various transactions including salaries, contracts, and imports.",
        category: "withholding",
        order: 9,
        isPublished: true,
      },
      {
        question: "How do I check my FBR compliance status?",
        answer:
          "You can check your Active Taxpayer List (ATL) status on the FBR website or through our platform.",
        category: "general",
        order: 10,
        isPublished: true,
      },
    ],
    skipDuplicates: true,
  });

  await prisma.blogPost.createMany({
    data: [
      {
        title: "Understanding Pakistan Tax Return 2025",
        slug: "understanding-pakistan-tax-return-2025",
        content:
          "Complete guide to filing your tax return in Pakistan for the tax year 2025...",
        category: "tax-guide",
        tags: ["tax", "return", "pakistan"],
        status: "PUBLISHED",
        authorId: admin.id,
        views: 120,
        readingTime: 8,
      },
      {
        title: "New Tax Amendments for Freelancers",
        slug: "new-tax-amendments-freelancers",
        content:
          "Recent changes in tax laws that affect freelancers in Pakistan...",
        category: "tax-updates",
        tags: ["freelancer", "tax", "amendments"],
        status: "PUBLISHED",
        authorId: admin.id,
        views: 85,
        readingTime: 5,
      },
      {
        title: "How to Register for GST in Pakistan",
        slug: "register-gst-pakistan",
        content:
          "Step by step guide to registering for Sales Tax in Pakistan...",
        category: "registration",
        tags: ["gst", "registration", "sales-tax"],
        status: "PUBLISHED",
        authorId: consultant.id,
        views: 200,
        readingTime: 6,
      },
      {
        title: "Tax Saving Tips for Salaried Individuals",
        slug: "tax-saving-tips-salaried",
        content:
          "Smart ways to reduce your tax liability as a salaried employee...",
        category: "tax-guide",
        tags: ["savings", "salaried", "deductions"],
        status: "PUBLISHED",
        authorId: consultant.id,
        views: 310,
        readingTime: 7,
      },
      {
        title: "Understanding SECP Company Registration",
        slug: "secp-company-registration-guide",
        content:
          "Everything you need to know about registering a company with SECP...",
        category: "business",
        tags: ["secp", "company", "registration"],
        status: "PUBLISHED",
        authorId: admin.id,
        views: 95,
        readingTime: 10,
      },
    ],
    skipDuplicates: true,
  });

  await prisma.video.createMany({
    data: [
      {
        youtubeId: "dQw4w9WgXcQ",
        title: "How to File Tax Return Online",
        titleUrdu: "آن لائن ٹیکس ریٹرن فائل کرنے کا طریقہ",
        description:
          "Step by step guide to filing your tax return online through our platform.",
        category: "tutorial",
        tags: ["tax-return", "tutorial", "online"],
        thumbnail: "https://img.youtube.com/vi/dQw4w9WgXcQ/maxresdefault.jpg",
        isPublished: true,
        views: 1500,
      },
      {
        youtubeId: "9bZkp7q19f0",
        title: "Understanding NTN Registration",
        titleUrdu: "NTN رجسٹریشن کو سمجھنا",
        description:
          "Complete guide to National Tax Number registration in Pakistan.",
        category: "registration",
        tags: ["ntn", "registration", "guide"],
        thumbnail: "https://img.youtube.com/vi/9bZkp7q19f0/maxresdefault.jpg",
        isPublished: true,
        views: 890,
      },
      {
        youtubeId: "jNQXAC9IVRw",
        title: "Tax Deductions You Should Know About",
        titleUrdu: "ٹیکس کٹوتیاں جو آپ کو معلوم ہونی چاہئیں",
        description:
          "Learn about various tax deductions available for individuals and businesses.",
        category: "education",
        tags: ["deductions", "tax-savings", "education"],
        thumbnail: "https://img.youtube.com/vi/jNQXAC9IVRw/maxresdefault.jpg",
        isPublished: true,
        views: 2100,
      },
    ],
    skipDuplicates: true,
  });

  await prisma.siteSetting.createMany({
    data: [
      { key: "site_name", value: "Volks & David" },
      {
        key: "site_description",
        value: "Your trusted tax and business advisory partner",
      },
      { key: "contact_email", value: "info@volksanddavid.com" },
      { key: "contact_phone", value: "+92-42-111-111-111" },
      { key: "address", value: "Lahore, Pakistan" },
      {
        key: "social_links",
        value: {
          facebook: "https://facebook.com/volksanddavid",
          twitter: "https://twitter.com/volksanddavid",
          linkedin: "https://linkedin.com/company/volksanddavid",
        },
      },
      { key: "tax_year", value: new Date().getFullYear() - 1 },
      { key: "tax_deadline", value: `${new Date().getFullYear()}-09-30` },
      { key: "enable_registrations", value: true },
      { key: "maintenance_mode", value: false },
    ],
    skipDuplicates: true,
  });

  console.log("Seed completed successfully");
}

main()
  .catch((e) => {
    console.error("Seed failed:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
