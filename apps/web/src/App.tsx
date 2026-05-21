import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import { useAuthStore } from './store/useAuthStore'
import PublicLayout from './layouts/PublicLayout'
import DashboardLayout from './layouts/DashboardLayout'
import AdminLayout from './layouts/AdminLayout'

import HomePage from './pages/public/HomePage'
import AboutPage from './pages/public/AboutPage'
import ServicesPage from './pages/public/ServicesPage'
import PricingPage from './pages/public/PricingPage'
import BlogListPage from './pages/public/BlogListPage'
import BlogDetailPage from './pages/public/BlogDetailPage'
import VideosPage from './pages/public/VideosPage'
import FAQPage from './pages/public/FAQPage'
import ContactPage from './pages/public/ContactPage'
import USAServicesPage from './pages/public/USAServicesPage'
import BusinessServicesPage from './pages/public/BusinessServicesPage'
import SalesTaxPage from './pages/public/SalesTaxPage'
import SalaryCalculatorPage from './pages/public/SalaryCalculatorPage'
import IntellectualPropertyPage from './pages/public/IntellectualPropertyPage'
import PrivacyPolicyPage from './pages/public/PrivacyPolicyPage'
import TermsPage from './pages/public/TermsPage'
import ServicesTaxReturn from './pages/public/ServicesTaxReturn'
import ServicesNTN from './pages/public/ServicesNTN'
import ServicesSECP from './pages/public/ServicesSECP'
import ServicesTrademark from './pages/public/ServicesTrademark'
import ServicesCopyright from './pages/public/ServicesCopyright'
import ServicesPatent from './pages/public/ServicesPatent'
import ServicesGST from './pages/public/ServicesGST'
import ServicesUSA from './pages/public/ServicesUSA'

import LoginPage from './pages/auth/LoginPage'
import RegisterPage from './pages/auth/RegisterPage'
import VerifyOTPPage from './pages/auth/VerifyOTPPage'
import ForgotPasswordPage from './pages/auth/ForgotPasswordPage'
import ResetPasswordPage from './pages/auth/ResetPasswordPage'

import DashboardHome from './pages/dashboard/DashboardHome'
import TaxReturnList from './pages/dashboard/tax-return/TaxReturnList'
import NewTaxReturn from './pages/dashboard/tax-return/NewTaxReturn'
import TaxReturnDetail from './pages/dashboard/tax-return/TaxReturnDetail'
import NTNStatus from './pages/dashboard/ntn/NTNStatus'
import NTNRegister from './pages/dashboard/ntn/NTNRegister'
import GSTStatus from './pages/dashboard/gst/GSTStatus'
import GSTRegister from './pages/dashboard/gst/GSTRegister'
import SalesTaxReturns from './pages/dashboard/gst/SalesTaxReturns'
import SalesTaxNotices from './pages/dashboard/sales-tax-notices/SalesTaxNotices'
import SECPRegistration from './pages/dashboard/business/SECPRegistration'
import SECPRegistrationHistory from './pages/dashboard/business/SECPRegistrationHistory'
import IPRegistrationHistory from './pages/dashboard/business/IPRegistrationHistory'
import TrademarkRegistration from './pages/dashboard/business/TrademarkRegistration'
import CopyrightRegistration from './pages/dashboard/business/CopyrightRegistration'
import PatentRegistration from './pages/dashboard/business/PatentRegistration'
import WithholdingTaxPage from './pages/dashboard/WithholdingTaxPage'
import FBRProfilePage from './pages/dashboard/FBRProfilePage'
import SalaryCalculator from './pages/dashboard/tax-tools/SalaryCalculator'
import ATLChecker from './pages/dashboard/tax-tools/ATLChecker'
import NTNStatusChecker from './pages/dashboard/tax-tools/NTNStatusChecker'
import TaxEstimator from './pages/dashboard/tax-tools/TaxEstimator'
import TaxToolsFAQ from './pages/dashboard/tax-tools/TaxToolsFAQ'
import ExpenseTracker from './pages/dashboard/ExpenseTracker'
import DocumentVault from './pages/dashboard/DocumentVault'
import UsaServicesPage from './pages/dashboard/UsaServicesPage'
import ProfilesPage from './pages/dashboard/ProfilesPage'
import ConsultationList from './pages/dashboard/consultations/ConsultationList'
import BookConsultation from './pages/dashboard/consultations/BookConsultation'
import FBRNoticesPage from './pages/dashboard/FBRNoticesPage'
import PaymentsPage from './pages/dashboard/PaymentsPage'
import ReferralsPage from './pages/dashboard/ReferralsPage'
import NotificationsPage from './pages/dashboard/NotificationsPage'
import ServiceStatus from './pages/dashboard/ServiceStatus'
import TaxCalendar from './pages/dashboard/TaxCalendar'
import ActivityTimeline from './pages/dashboard/ActivityTimeline'
import ProfileSettings from './pages/dashboard/settings/ProfileSettings'
import ThemeSettings from './pages/dashboard/settings/ThemeSettings'
import SecuritySettings from './pages/dashboard/settings/SecuritySettings'
import NotificationSettings from './pages/dashboard/settings/NotificationSettings'

import AdminDashboard from './pages/admin/AdminDashboard'
import UsersManagement from './pages/admin/UsersManagement'
import ReturnsManagement from './pages/admin/ReturnsManagement'
import ConsultantsManagement from './pages/admin/ConsultantsManagement'
import PaymentsManagement from './pages/admin/PaymentsManagement'
import BlogManagement from './pages/admin/BlogManagement'
import VideosManagement from './pages/admin/VideosManagement'
import FAQsManagement from './pages/admin/FAQsManagement'
import NoticesManagement from './pages/admin/NoticesManagement'
import NTNManagement from './pages/admin/NTNManagement'
import GSTManagement from './pages/admin/GSTManagement'
import SECPManagement from './pages/admin/SECPManagement'
import IPRegistrationsManagement from './pages/admin/IPRegistrationsManagement'
import SalesTaxReturnsManagement from './pages/admin/SalesTaxReturnsManagement'
import SalesTaxNoticesManagement from './pages/admin/SalesTaxNoticesManagement'
import WithholdingTaxManagement from './pages/admin/WithholdingTaxManagement'
import USAServicesManagement from './pages/admin/USAServicesManagement'
import ConsultationsManagement from './pages/admin/ConsultationsManagement'
import ReferralsManagement from './pages/admin/ReferralsManagement'
import ActivityLogs from './pages/admin/ActivityLogs'
import SendNotification from './pages/admin/SendNotification'
import DocumentsManagement from './pages/admin/DocumentsManagement'
import ExpensesManagement from './pages/admin/ExpensesManagement'
import SiteSettings from './pages/admin/SiteSettings'
import NotFoundPage from './pages/NotFoundPage'
import { ErrorBoundary } from './components/shared/ErrorBoundary'

const ProtectedRoute = ({ children }: { children: React.ReactNode }) => {
  const { isAuthenticated } = useAuthStore()
  return isAuthenticated ? <>{children}</> : <Navigate to="/login" replace />
}

const AdminRoute = ({ children }: { children: React.ReactNode }) => {
  const { user } = useAuthStore()
  return user?.role === 'ADMIN' || user?.role === 'SUPER_ADMIN' ? <>{children}</> : <Navigate to="/dashboard" replace />
}

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route element={<PublicLayout />}>
          <Route path="/" element={<ErrorBoundary><HomePage /></ErrorBoundary>} />
          <Route path="/about" element={<ErrorBoundary><AboutPage /></ErrorBoundary>} />
          <Route path="/services" element={<ErrorBoundary><ServicesPage /></ErrorBoundary>} />
          <Route path="/pricing" element={<ErrorBoundary><PricingPage /></ErrorBoundary>} />
          <Route path="/blog" element={<ErrorBoundary><BlogListPage /></ErrorBoundary>} />
          <Route path="/blog/:slug" element={<ErrorBoundary><BlogDetailPage /></ErrorBoundary>} />
          <Route path="/videos" element={<ErrorBoundary><VideosPage /></ErrorBoundary>} />
          <Route path="/faq" element={<ErrorBoundary><FAQPage /></ErrorBoundary>} />
          <Route path="/contact" element={<ErrorBoundary><ContactPage /></ErrorBoundary>} />
          <Route path="/usa-services" element={<ErrorBoundary><USAServicesPage /></ErrorBoundary>} />
          <Route path="/business-services" element={<ErrorBoundary><BusinessServicesPage /></ErrorBoundary>} />
          <Route path="/sales-tax" element={<ErrorBoundary><SalesTaxPage /></ErrorBoundary>} />
          <Route path="/tax-tools/salary-calculator" element={<ErrorBoundary><SalaryCalculatorPage /></ErrorBoundary>} />
          <Route path="/intellectual-property" element={<ErrorBoundary><IntellectualPropertyPage /></ErrorBoundary>} />
          <Route path="/privacy" element={<ErrorBoundary><PrivacyPolicyPage /></ErrorBoundary>} />
          <Route path="/terms" element={<ErrorBoundary><TermsPage /></ErrorBoundary>} />
          <Route path="/services/tax-return" element={<ErrorBoundary><ServicesTaxReturn /></ErrorBoundary>} />
          <Route path="/services/ntn" element={<ErrorBoundary><ServicesNTN /></ErrorBoundary>} />
          <Route path="/services/secp" element={<ErrorBoundary><ServicesSECP /></ErrorBoundary>} />
          <Route path="/services/trademark" element={<ErrorBoundary><ServicesTrademark /></ErrorBoundary>} />
          <Route path="/services/copyright" element={<ErrorBoundary><ServicesCopyright /></ErrorBoundary>} />
          <Route path="/services/patent" element={<ErrorBoundary><ServicesPatent /></ErrorBoundary>} />
          <Route path="/services/gst" element={<ErrorBoundary><ServicesGST /></ErrorBoundary>} />
          <Route path="/services/usa" element={<ErrorBoundary><ServicesUSA /></ErrorBoundary>} />
        </Route>

        <Route path="/login" element={<ErrorBoundary><LoginPage /></ErrorBoundary>} />
        <Route path="/register" element={<ErrorBoundary><RegisterPage /></ErrorBoundary>} />
        <Route path="/verify-otp" element={<ErrorBoundary><VerifyOTPPage /></ErrorBoundary>} />
        <Route path="/forgot-password" element={<ErrorBoundary><ForgotPasswordPage /></ErrorBoundary>} />
        <Route path="/reset-password" element={<ErrorBoundary><ResetPasswordPage /></ErrorBoundary>} />

        <Route element={<ProtectedRoute><DashboardLayout /></ProtectedRoute>}>
          <Route path="/dashboard" element={<ErrorBoundary><DashboardHome /></ErrorBoundary>} />
          <Route path="/dashboard/tax-return" element={<ErrorBoundary><TaxReturnList /></ErrorBoundary>} />
          <Route path="/dashboard/tax-return/new" element={<ErrorBoundary><NewTaxReturn /></ErrorBoundary>} />
          <Route path="/dashboard/tax-return/:id" element={<ErrorBoundary><TaxReturnDetail /></ErrorBoundary>} />
          <Route path="/dashboard/ntn" element={<ErrorBoundary><NTNStatus /></ErrorBoundary>} />
          <Route path="/dashboard/ntn/register" element={<ErrorBoundary><NTNRegister /></ErrorBoundary>} />
          <Route path="/dashboard/gst" element={<ErrorBoundary><GSTStatus /></ErrorBoundary>} />
          <Route path="/dashboard/gst/register" element={<ErrorBoundary><GSTRegister /></ErrorBoundary>} />
          <Route path="/dashboard/gst/monthly-returns" element={<ErrorBoundary><SalesTaxReturns /></ErrorBoundary>} />
          <Route path="/dashboard/sales-tax-notices" element={<ErrorBoundary><SalesTaxNotices /></ErrorBoundary>} />
          <Route path="/dashboard/business/secp" element={<ErrorBoundary><SECPRegistration /></ErrorBoundary>} />
          <Route path="/dashboard/business/secp-history" element={<ErrorBoundary><SECPRegistrationHistory /></ErrorBoundary>} />
          <Route path="/dashboard/business/trademark" element={<ErrorBoundary><TrademarkRegistration /></ErrorBoundary>} />
          <Route path="/dashboard/business/copyright" element={<ErrorBoundary><CopyrightRegistration /></ErrorBoundary>} />
          <Route path="/dashboard/business/patent" element={<ErrorBoundary><PatentRegistration /></ErrorBoundary>} />
          <Route path="/dashboard/business/ip-history" element={<ErrorBoundary><IPRegistrationHistory /></ErrorBoundary>} />
          <Route path="/dashboard/withholding-tax" element={<ErrorBoundary><WithholdingTaxPage /></ErrorBoundary>} />
          <Route path="/dashboard/fbr-profile" element={<ErrorBoundary><FBRProfilePage /></ErrorBoundary>} />
          <Route path="/dashboard/tools/salary-calculator" element={<ErrorBoundary><SalaryCalculator /></ErrorBoundary>} />
          <Route path="/dashboard/tools/atl-checker" element={<ErrorBoundary><ATLChecker /></ErrorBoundary>} />
          <Route path="/dashboard/tools/ntn-status" element={<ErrorBoundary><NTNStatusChecker /></ErrorBoundary>} />
          <Route path="/dashboard/tools/tax-estimator" element={<ErrorBoundary><TaxEstimator /></ErrorBoundary>} />
          <Route path="/dashboard/tools/faq" element={<ErrorBoundary><TaxToolsFAQ /></ErrorBoundary>} />
          <Route path="/dashboard/expenses" element={<ErrorBoundary><ExpenseTracker /></ErrorBoundary>} />
          <Route path="/dashboard/documents" element={<ErrorBoundary><DocumentVault /></ErrorBoundary>} />
          <Route path="/dashboard/profiles" element={<ErrorBoundary><ProfilesPage /></ErrorBoundary>} />
          <Route path="/dashboard/consultations" element={<ErrorBoundary><ConsultationList /></ErrorBoundary>} />
          <Route path="/dashboard/consultations/book" element={<ErrorBoundary><BookConsultation /></ErrorBoundary>} />
          <Route path="/dashboard/fbr-notices" element={<ErrorBoundary><FBRNoticesPage /></ErrorBoundary>} />
          <Route path="/dashboard/payments" element={<ErrorBoundary><PaymentsPage /></ErrorBoundary>} />
          <Route path="/dashboard/referrals" element={<ErrorBoundary><ReferralsPage /></ErrorBoundary>} />
          <Route path="/dashboard/notifications" element={<ErrorBoundary><NotificationsPage /></ErrorBoundary>} />
          <Route path="/dashboard/usa-services" element={<ErrorBoundary><UsaServicesPage /></ErrorBoundary>} />
          <Route path="/dashboard/service-status" element={<ErrorBoundary><ServiceStatus /></ErrorBoundary>} />
          <Route path="/dashboard/tax-calendar" element={<ErrorBoundary><TaxCalendar /></ErrorBoundary>} />
          <Route path="/dashboard/activity" element={<ErrorBoundary><ActivityTimeline /></ErrorBoundary>} />
          <Route path="/dashboard/settings" element={<ErrorBoundary><ProfileSettings /></ErrorBoundary>} />
          <Route path="/dashboard/settings/theme" element={<ErrorBoundary><ThemeSettings /></ErrorBoundary>} />
          <Route path="/dashboard/settings/security" element={<ErrorBoundary><SecuritySettings /></ErrorBoundary>} />
          <Route path="/dashboard/settings/notifications" element={<ErrorBoundary><NotificationSettings /></ErrorBoundary>} />
        </Route>

        <Route element={<AdminRoute><AdminLayout /></AdminRoute>}>
          <Route path="/admin" element={<ErrorBoundary><AdminDashboard /></ErrorBoundary>} />
          <Route path="/admin/users" element={<ErrorBoundary><UsersManagement /></ErrorBoundary>} />
          <Route path="/admin/returns" element={<ErrorBoundary><ReturnsManagement /></ErrorBoundary>} />
          <Route path="/admin/consultants" element={<ErrorBoundary><ConsultantsManagement /></ErrorBoundary>} />
          <Route path="/admin/payments" element={<ErrorBoundary><PaymentsManagement /></ErrorBoundary>} />
          <Route path="/admin/blog" element={<ErrorBoundary><BlogManagement /></ErrorBoundary>} />
          <Route path="/admin/videos" element={<ErrorBoundary><VideosManagement /></ErrorBoundary>} />
          <Route path="/admin/faqs" element={<ErrorBoundary><FAQsManagement /></ErrorBoundary>} />
          <Route path="/admin/notices" element={<ErrorBoundary><NoticesManagement /></ErrorBoundary>} />
          <Route path="/admin/ntn" element={<ErrorBoundary><NTNManagement /></ErrorBoundary>} />
          <Route path="/admin/gst" element={<ErrorBoundary><GSTManagement /></ErrorBoundary>} />
          <Route path="/admin/secp" element={<ErrorBoundary><SECPManagement /></ErrorBoundary>} />
          <Route path="/admin/ip-registrations" element={<ErrorBoundary><IPRegistrationsManagement /></ErrorBoundary>} />
          <Route path="/admin/sales-tax-returns" element={<ErrorBoundary><SalesTaxReturnsManagement /></ErrorBoundary>} />
          <Route path="/admin/sales-tax-notices" element={<ErrorBoundary><SalesTaxNoticesManagement /></ErrorBoundary>} />
          <Route path="/admin/withholding-tax" element={<ErrorBoundary><WithholdingTaxManagement /></ErrorBoundary>} />
          <Route path="/admin/usa-services" element={<ErrorBoundary><USAServicesManagement /></ErrorBoundary>} />
          <Route path="/admin/consultations-list" element={<ErrorBoundary><ConsultationsManagement /></ErrorBoundary>} />
          <Route path="/admin/referrals" element={<ErrorBoundary><ReferralsManagement /></ErrorBoundary>} />
          <Route path="/admin/activity-logs" element={<ErrorBoundary><ActivityLogs /></ErrorBoundary>} />
          <Route path="/admin/send-notification" element={<ErrorBoundary><SendNotification /></ErrorBoundary>} />
          <Route path="/admin/documents" element={<ErrorBoundary><DocumentsManagement /></ErrorBoundary>} />
          <Route path="/admin/expenses" element={<ErrorBoundary><ExpensesManagement /></ErrorBoundary>} />
          <Route path="/admin/settings" element={<ErrorBoundary><SiteSettings /></ErrorBoundary>} />
        </Route>

        <Route path="*" element={<NotFoundPage />} />
      </Routes>
    </BrowserRouter>
  )
}
