export type UserRole = "USER" | "CONSULTANT" | "ADMIN" | "SUPER_ADMIN"
export type Gender = "MALE" | "FEMALE" | "OTHER"
export type TaxReturnStatus = "DRAFT" | "IN_REVIEW" | "SUBMITTED" | "ACCEPTED" | "REJECTED" | "REQUIRES_INFO"
export type TaxReturnType = "SALARIED" | "BUSINESS" | "RENTAL" | "AGRICULTURE" | "FREELANCER" | "AOP" | "COMPANY" | "PREVIOUS_YEAR"
export type NTNStatus = "PENDING" | "UNDER_REVIEW" | "APPROVED" | "REJECTED"
export type GSTStatus = "PENDING" | "UNDER_REVIEW" | "APPROVED" | "REJECTED"
export type ConsultationStatus = "PENDING" | "CONFIRMED" | "IN_PROGRESS" | "COMPLETED" | "CANCELLED"
export type ConsultationType = "CHAT" | "CALL" | "EMAIL" | "VIDEO"
export type PaymentStatus = "PENDING" | "COMPLETED" | "FAILED" | "REFUNDED"
export type PaymentMethod = "JAZZCASH" | "EASYPAISA" | "CARD" | "BANK_TRANSFER"
export type NotificationType = "TAX_DEADLINE" | "RETURN_STATUS" | "PAYMENT" | "CONSULTATION" | "SYSTEM" | "REFERRAL" | "FBR_NOTICE"
export type DocumentType = "CNIC" | "TAX_CERTIFICATE" | "SALARY_SLIP" | "BANK_STATEMENT" | "PROPERTY_DEED" | "BUSINESS_REG" | "NTN_CERTIFICATE" | "GST_CERTIFICATE" | "OTHER"
export type IPServiceType = "TRADEMARK" | "COPYRIGHT" | "PATENT"
export type WithholdingTaxStatus = "PENDING" | "PROCESSING" | "COMPLETED" | "REJECTED"

export interface ApiResponse<T = unknown> {
  success: boolean
  message: string
  data: T
  errors?: Record<string, string[]>
}

export interface PaginatedResponse<T> extends ApiResponse<T[]> {
  pagination: {
    page: number
    limit: number
    total: number
    totalPages: number
  }
}

export interface ThemeConfig {
  primaryColor: string
  primaryColorName: string
  mode: "light" | "dark" | "system"
  sidebarStyle: "solid" | "glass" | "minimal"
  fontSize: "sm" | "md" | "lg"
  borderRadius: "sharp" | "rounded" | "pill"
  density: "compact" | "default" | "comfortable"
}

export interface User {
  id: string
  email: string
  name?: string
  phone?: string
  role: UserRole
  isEmailVerified: boolean
  isPhoneVerified: boolean
  isActive: boolean
  referralCode: string
  referredBy?: string
  language: string
  themeSettings?: ThemeConfig
  lastLoginAt?: string
  createdAt: string
}

export interface Profile {
  id: string
  userId: string
  isPrimary: boolean
  name: string
  cnic: string
  dob?: string
  gender?: Gender
  fatherName?: string
  address?: string
  city?: string
  province?: string
  ntn?: string
  strn?: string
  employer?: string
  designation?: string
}

export interface TaxReturn {
  id: string
  userId: string
  profileId?: string
  taxYear: number
  returnType: TaxReturnType
  status: TaxReturnStatus
  consultantId?: string
  salaryIncome?: number
  businessIncome?: number
  rentalIncome?: number
  agricultureIncome?: number
  foreignIncome?: number
  otherIncome?: number
  totalIncome?: number
  zakat?: number
  donation?: number
  pensionContrib?: number
  medicalExpenses?: number
  educationExpenses?: number
  propertyValue?: number
  vehicleValue?: number
  bankBalance?: number
  investmentValue?: number
  otherAssets?: number
  totalAssets?: number
  bankLoan?: number
  mortgageLoan?: number
  otherLiabilities?: number
  totalLiabilities?: number
  taxableIncome?: number
  taxPayable?: number
  taxPaid?: number
  taxRefund?: number
  fbrAcknowledgement?: string
  submittedAt?: string
  createdAt: string
}

export interface NTNRegistration {
  id: string
  userId: string
  type: string
  status: NTNStatus
  cnic: string
  name: string
  businessName?: string
  ntnNumber?: string
  createdAt: string
}

export interface GSTRegistration {
  id: string
  userId: string
  status: GSTStatus
  businessName: string
  strnNumber?: string
  createdAt: string
}

export interface Payment {
  id: string
  userId: string
  amount: number
  currency: string
  method: PaymentMethod
  status: PaymentStatus
  serviceType: string
  createdAt: string
}

export interface Consultation {
  id: string
  userId: string
  consultantId?: string
  type: ConsultationType
  status: ConsultationStatus
  subject: string
  scheduledAt?: string
  createdAt: string
}

export interface Notification {
  id: string
  userId: string
  type: NotificationType
  title: string
  message: string
  isRead: boolean
  createdAt: string
}

export interface BlogPost {
  id: string
  title: string
  slug: string
  excerpt?: string
  coverImage?: string
  tags: string[]
  category?: string
  isPublished: boolean
  publishedAt?: string
  createdAt: string
}

export interface Video {
  id: string
  title: string
  youtubeId: string
  thumbnail?: string
  category?: string
  duration?: number
  isPublished: boolean
  createdAt: string
}

export interface FAQ {
  id: string
  question: string
  answer: string
  category?: string
  order: number
  isPublished: boolean
}
