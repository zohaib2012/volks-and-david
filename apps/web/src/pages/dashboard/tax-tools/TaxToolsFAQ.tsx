import { motion } from "framer-motion";
import { useState } from "react";
import { Search, ChevronDown, MessageCircle } from "lucide-react";
import { PageHeader } from "@/components/shared/PageHeader";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Tabs } from "@/components/ui/tabs";
import { cn } from "@/lib/utils";

interface FAQ {
  question: string;
  answer: string;
}

const FAQ_DATA: Record<string, FAQ[]> = {
  general: [
    {
      question: "What is the difference between filer and non-filer?",
      answer:
        "A filer is a person who has filed their income tax return for the tax year and is on FBR's Active Taxpayer List (ATL). Non-filers pay higher withholding tax rates on various transactions including banking, property, and vehicle purchases.",
    },
    {
      question: "When is the tax return deadline?",
      answer:
        "The tax return filing deadline for individuals is typically September 30th each year for the preceding tax year. However, FBR may extend this date through official notifications.",
    },
    {
      question: "What happens if I don't file my tax return?",
      answer:
        "Non-filing can result in penalties, higher withholding tax rates, inability to open bank accounts, purchase property or vehicles, and potential legal action by FBR.",
    },
    {
      question: "How can I check my tax refund status?",
      answer:
        "You can check your refund status on FBR's IRIS portal using your NTN and password. Refunds are typically processed within 45-60 days of filing.",
    },
  ],
  incomeTax: [
    {
      question: "What income is taxable in Pakistan?",
      answer:
        "Salary, business income, property income, capital gains, dividends, interest, and any other income accrued or received in Pakistan is taxable under the Income Tax Ordinance 2001.",
    },
    {
      question: "What are the tax slabs for 2024-25?",
      answer:
        "0-600K: 0%, 600K-1.2M: 5%, 1.2M-2.2M: 15%, 2.2M-3.2M: 25%, 3.2M-4.1M: 30%, 4.1M+: 35%. Non-filers pay approximately double the rate.",
    },
    {
      question: "Can I get a tax refund if excess tax was deducted?",
      answer:
        "Yes, if the tax deducted at source exceeds your actual tax liability, you can claim a refund by filing your annual tax return.",
    },
    {
      question: "How is rental income taxed?",
      answer:
        "Rental income from property is taxed at the applicable slab rates. A standard deduction of 20% for maintenance is allowed. The tax is 15% for filers and 25% for non-filers on gross rent.",
    },
  ],
  ntn: [
    {
      question: "How do I register for NTN?",
      answer:
        "You can register for NTN online through FBR's IRIS portal or visit your nearest Regional Tax Office (RTO) with your CNIC and relevant documents.",
    },
    {
      question: "How long does NTN registration take?",
      answer:
        "Online registration on IRIS is usually processed within 24-48 hours. Physical applications at RTOs may take 5-7 working days.",
    },
    {
      question: "Is NTN mandatory for everyone?",
      answer:
        "NTN is mandatory for individuals whose taxable income exceeds the exemption limit (Rs.600,000 for 2024-25), or who are required to file a return for any other reason.",
    },
    {
      question: "Can I have multiple NTNs?",
      answer:
        "No, a person can only have one NTN. Having multiple NTNs is illegal and can result in penalties. If you have multiple NTNs, you should contact FBR to have them merged.",
    },
  ],
  gst: [
    {
      question: "What is GST and who needs to register?",
      answer:
        "GST (General Sales Tax) is a consumption tax. Businesses with annual turnover exceeding Rs.10 million must register for GST with the relevant provincial or federal authority.",
    },
    {
      question: "What is the difference between GST and Sales Tax?",
      answer:
        "They are essentially the same. GST is charged on goods and services at each stage of the supply chain. The standard rate is 18% for goods and 16% for services.",
    },
    {
      question: "How do I file GST returns?",
      answer:
        "GST returns are filed monthly/quarterly through FBR's IRIS system. The return includes details of sales, purchases, and tax payable or refundable.",
    },
    {
      question: "What are the penalties for late GST filing?",
      answer:
        "Late filing of GST returns attracts a penalty of Rs.10,000 per return. Continued non-compliance can lead to suspension or cancellation of registration.",
    },
  ],
  usaServices: [
    {
      question: "Do I need to pay US taxes as a Pakistani resident?",
      answer:
        "If you provide services to US clients as a Pakistani resident, you may be subject to US withholding tax. However, the Pakistan-US tax treaty can reduce or eliminate double taxation.",
    },
    {
      question: "What is Form W-8BEN?",
      answer:
        "Form W-8BEN is a US IRS form that certifies you are a foreign person (non-US resident) and claim treaty benefits to reduce or avoid US withholding tax on US-sourced income.",
    },
    {
      question: "How do I claim foreign tax credit in Pakistan?",
      answer:
        "You can claim foreign tax credit in Pakistan by filing your return and providing evidence of foreign tax paid (Form W-2, 1099, or foreign tax return). The credit is limited to the lower of foreign tax paid or Pakistan tax on that income.",
    },
  ],
  notices: [
    {
      question: "What should I do if I receive a tax notice?",
      answer:
        "Do not ignore it. Read the notice carefully, understand the issue raised, and respond within the specified timeframe. You can consult a tax professional for assistance.",
    },
    {
      question: "What are the types of tax notices?",
      answer:
        "Common notices include: notice for non-filing, notice for discrepancies in return, notice for audit, notice for demand of tax, and show cause notice before penalty.",
    },
    {
      question: "Can I appeal against a tax notice?",
      answer:
        "Yes, you can file an appeal before the Commissioner (Appeals) within 30 days of receiving the order. Further appeals can be made to ATIR (Appellate Tribunal Inland Revenue) and High Court.",
    },
    {
      question: "What is a show cause notice?",
      answer:
        "A show cause notice is issued when FBR believes you have violated tax laws. You must respond with explanations and evidence within the given time to avoid penalty or legal action.",
    },
  ],
};

const CATEGORIES = [
  { id: "general", label: "General" },
  { id: "incomeTax", label: "Income Tax" },
  { id: "ntn", label: "NTN" },
  { id: "gst", label: "GST" },
  { id: "usaServices", label: "USA Services" },
  { id: "notices", label: "Notices" },
];

export default function TaxToolsFAQ() {
  const [search, setSearch] = useState("");

  const filteredData = Object.entries(FAQ_DATA).reduce(
    (acc, [cat, faqs]) => {
      const filtered = faqs.filter(
        (f) =>
          f.question.toLowerCase().includes(search.toLowerCase()) ||
          f.answer.toLowerCase().includes(search.toLowerCase()),
      );
      if (filtered.length > 0) acc[cat] = filtered;
      return acc;
    },
    {} as Record<string, FAQ[]>,
  );

  const tabs = CATEGORIES.map((cat) => ({
    id: cat.id,
    label: cat.label,
    content: (
      <div className="space-y-2">
        {(filteredData[cat.id] || []).length > 0 ? (
          (filteredData[cat.id] || []).map((faq, i) => (
            <FAQItem key={i} faq={faq} />
          ))
        ) : (
          <div className="text-center py-8 text-sm text-muted-foreground">
            No matching questions found in this category
          </div>
        )}
      </div>
    ),
  }));

  return (
    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
      <PageHeader
        title="Tax Tools FAQ"
        subtitle="Find answers to common tax questions"
      />

      <div className="mb-6 relative">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
        <Input
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Search FAQs..."
          className="pl-10"
        />
      </div>

      <Card>
        <CardContent className="pt-6">
          <Tabs tabs={tabs} />
        </CardContent>
      </Card>

      <Card className="mt-6 bg-primary/5 border-primary/20">
        <CardContent className="py-6 text-center space-y-3">
          <MessageCircle className="h-8 w-8 text-primary mx-auto" />
          <div>
            <p className="font-semibold">Still have questions?</p>
            <p className="text-sm text-muted-foreground">
              Get personalized assistance from our tax consultants
            </p>
          </div>
          <Button size="lg">Book a Consultant</Button>
        </CardContent>
      </Card>
    </motion.div>
  );
}

function FAQItem({ faq }: { faq: FAQ }) {
  const [open, setOpen] = useState(false);

  return (
    <div className="border rounded-lg overflow-hidden">
      <button
        onClick={() => setOpen(!open)}
        className="w-full flex items-center justify-between p-4 text-left hover:bg-muted/30 transition-colors"
      >
        <span className="text-sm font-medium pr-4">{faq.question}</span>
        <ChevronDown
          className={cn(
            "h-4 w-4 shrink-0 transition-transform duration-200",
            open && "rotate-180",
          )}
        />
      </button>
      <div
        className={cn(
          "overflow-hidden transition-all duration-200",
          open ? "max-h-96" : "max-h-0",
        )}
      >
        <p className="px-4 pb-4 text-sm text-muted-foreground">{faq.answer}</p>
      </div>
    </div>
  );
}
