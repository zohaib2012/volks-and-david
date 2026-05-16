import { Helmet } from 'react-helmet-async'

const sections = [
  {
    title: 'Acceptance of Terms',
    content:
      'By accessing or using the Volks & David website and services, you agree to be bound by these Terms of Service. If you do not agree to all the terms and conditions, you must not access or use our services. These terms apply to all visitors, users, and others who access or use our services.',
  },
  {
    title: 'Description of Services',
    content:
      'Volks & David provides tax filing assistance, NTN registration, GST registration and filing, business registration services, intellectual property registration, USA business setup services, and related financial advisory services. Our services are provided on a professional basis, and we strive to ensure accuracy and compliance with applicable laws and regulations.',
  },
  {
    title: 'User Accounts and Registration',
    content:
      'To access certain features of our services, you may be required to create an account. You are responsible for maintaining the confidentiality of your account credentials and for all activities that occur under your account. You agree to provide accurate, current, and complete information during the registration process and to update such information as necessary.',
  },
  {
    title: 'User Obligations',
    content:
      'You agree to use our services only for lawful purposes and in accordance with these terms. You agree not to: provide false or misleading information; use our services for any illegal or unauthorized purpose; interfere with or disrupt the integrity or performance of our services; attempt to gain unauthorized access to our systems or user accounts; or engage in any activity that could harm our reputation or operations.',
  },
  {
    title: 'Service Fees and Payment',
    content:
      'Fees for our services are as specified on our Pricing page or as mutually agreed upon. All fees are non-refundable unless otherwise stated. We reserve the right to modify our fees with reasonable notice. Payment is due before service delivery unless credit terms have been established. Late payments may incur additional charges.',
  },
  {
    title: 'Intellectual Property',
    content:
      'The Volks & David name, logo, website design, content, and all related intellectual property are owned by Volks & David. You may not use, reproduce, distribute, or create derivative works from our intellectual property without our prior written consent.',
  },
  {
    title: 'Limitation of Liability',
    content:
      'Volks & David shall not be liable for any indirect, incidental, special, consequential, or punitive damages, including but not limited to loss of profits, data, or goodwill, arising out of or in connection with your use of our services. Our total liability for any claim arising from our services shall not exceed the total fees paid by you for the specific service giving rise to the claim.',
  },
  {
    title: 'Disclaimer of Warranties',
    content:
      'Our services are provided on an "as is" and "as available" basis without warranties of any kind, either express or implied. While we strive for accuracy, we do not guarantee that our services will be error-free, uninterrupted, or meet your specific requirements. Tax laws and regulations are subject to change, and we recommend consulting with qualified professionals for specific advice.',
  },
  {
    title: 'Indemnification',
    content:
      'You agree to indemnify, defend, and hold harmless Volks & David, its officers, directors, employees, and agents from and against any claims, liabilities, damages, losses, and expenses arising out of or related to your use of our services, violation of these terms, or violation of any applicable law.',
  },
  {
    title: 'Termination',
    content:
      'We reserve the right to suspend or terminate your access to our services at any time, with or without cause, and with or without notice. Upon termination, your right to use our services will immediately cease. Provisions of these terms that by their nature should survive termination shall survive.',
  },
  {
    title: 'Governing Law',
    content:
      'These terms shall be governed by and construed in accordance with the laws of Pakistan. Any disputes arising under these terms shall be subject to the exclusive jurisdiction of the courts of Lahore, Pakistan.',
  },
  {
    title: 'Changes to Terms',
    content:
      'We reserve the right to modify these terms at any time. We will notify users of material changes by posting the updated terms on this page and updating the "Last Updated" date. Your continued use of our services after any modifications indicates your acceptance of the modified terms.',
  },
  {
    title: 'Contact Information',
    content:
      'For any questions about these Terms of Service, please contact us at: info@volksanddavid.com or visit our Contact page.',
  },
]

export default function TermsPage() {
  return (
    <>
      <Helmet>
        <title>Terms of Service - Volks & David</title>
        <meta name="description" content="Terms of service for Volks & David. Understand the terms and conditions for using our tax filing and financial services." />
      </Helmet>

      <section className="bg-gradient-to-b from-primary/5 py-20">
        <div className="container text-center">
          <h1 className="text-4xl font-bold tracking-tight sm:text-5xl">Terms of Service</h1>
          <p className="mt-4 text-muted-foreground">Last Updated: January 1, 2026</p>
        </div>
      </section>

      <section className="py-16">
        <div className="container max-w-3xl">
          <p className="text-muted-foreground leading-relaxed mb-10">
            Please read these Terms of Service ("Terms") carefully before using the Volks & David website 
            and services. These terms govern your access to and use of our platform, including any content, 
            functionality, and services offered.
          </p>

          <div className="space-y-8">
            {sections.map((section) => (
              <div key={section.title}>
                <h2 className="text-xl font-bold mb-3">{section.title}</h2>
                <p className="text-muted-foreground leading-relaxed">{section.content}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
    </>
  )
}
