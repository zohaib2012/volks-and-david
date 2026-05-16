import { Helmet } from 'react-helmet-async'

const sections = [
  {
    title: 'Information We Collect',
    content:
      'We collect information you provide directly to us, including your name, email address, phone number, CNIC number, NTN number, financial information, and any other information you choose to provide when using our services. We also automatically collect certain technical information when you visit our website, including your IP address, browser type, device information, and usage data through cookies and similar technologies.',
  },
  {
    title: 'How We Use Your Information',
    content:
      'We use the information we collect to provide, maintain, and improve our services; process your tax filings, registrations, and other requests; communicate with you about your account and our services; send you technical notices, updates, security alerts, and support messages; respond to your comments, questions, and requests; and comply with legal and regulatory obligations.',
  },
  {
    title: 'Information Sharing and Disclosure',
    content:
      'We may share your information with third parties only in the following circumstances: with FBR and other government authorities as required for tax filing and compliance; with payment processors to facilitate payments; with your consent or at your direction; to comply with legal obligations; to protect the rights and safety of Volks & David, our users, or others; and in connection with a business transfer such as a merger or acquisition.',
  },
  {
    title: 'Data Security',
    content:
      'We implement appropriate technical and organizational security measures to protect your personal information against unauthorized access, alteration, disclosure, or destruction. These measures include encryption, access controls, secure servers, and regular security audits. However, no method of transmission over the Internet or electronic storage is 100% secure, and we cannot guarantee absolute security.',
  },
  {
    title: 'Data Retention',
    content:
      'We retain your personal information for as long as necessary to provide our services and fulfill the purposes described in this policy, or as required by applicable law. Tax records and related documents are retained in accordance with FBR requirements and applicable legal obligations.',
  },
  {
    title: 'Your Rights',
    content:
      'You have the right to access, update, or delete your personal information; object to or restrict the processing of your data; request data portability; withdraw consent at any time where we rely on your consent to process your data; and lodge a complaint with a data protection authority. To exercise these rights, please contact us at info@volksanddavid.com.',
  },
  {
    title: 'Cookies and Tracking',
    content:
      'We use cookies and similar tracking technologies to collect and use personal information about you. This helps us analyze trends, administer the website, track users\' movements around the site, and gather demographic information. You can control the use of cookies at the individual browser level, but disabling cookies may limit your use of certain features.',
  },
  {
    title: 'Third-Party Services',
    content:
      'Our website may contain links to third-party websites and services that are not owned or controlled by Volks & David. We are not responsible for the privacy practices of these third parties. We encourage you to review the privacy policies of any third-party services you use.',
  },
  {
    title: 'Children\'s Privacy',
    content:
      'Our services are not intended for individuals under the age of 18. We do not knowingly collect personal information from children. If we become aware that a child has provided us with personal information, we will take steps to delete such information.',
  },
  {
    title: 'Changes to This Policy',
    content:
      'We may update this Privacy Policy from time to time. We will notify you of any changes by posting the new policy on this page and updating the "Last Updated" date. Your continued use of our services after any changes constitutes your acceptance of the new policy.',
  },
  {
    title: 'Contact Us',
    content:
      'If you have any questions about this Privacy Policy or our data practices, please contact us at: info@volksanddavid.com or visit our Contact page.',
  },
]

export default function PrivacyPolicyPage() {
  return (
    <>
      <Helmet>
        <title>Privacy Policy - Volks & David</title>
        <meta name="description" content="Privacy policy for Volks & David. Learn how we collect, use, and protect your personal information." />
      </Helmet>

      <section className="bg-gradient-to-b from-primary/5 py-20">
        <div className="container text-center">
          <h1 className="text-4xl font-bold tracking-tight sm:text-5xl">Privacy Policy</h1>
          <p className="mt-4 text-muted-foreground">Last Updated: January 1, 2026</p>
        </div>
      </section>

      <section className="py-16">
        <div className="container max-w-3xl">
          <p className="text-muted-foreground leading-relaxed mb-10">
            At Volks & David, we take your privacy seriously. This Privacy Policy explains how we collect, 
            use, disclose, and safeguard your information when you use our website and services. Please 
            read this policy carefully. By using our services, you consent to the practices described herein.
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
