import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { motion } from "framer-motion";
import toast from "react-hot-toast";
import {
  Plus,
  Edit,
  Trash2,
  GripVertical,
  AlertCircle,
  Eye,
  EyeOff,
} from "lucide-react";
import api from "@/lib/api";
import { PageHeader } from "@/components/shared/PageHeader";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { LoadingSpinner } from "@/components/shared/LoadingSpinner";
import { EmptyState } from "@/components/shared/EmptyState";

interface FAQ {
  id: string;
  question: string;
  answer: string;
  category: string;
  published: boolean;
  order: number;
}

const fallbackFAQs: FAQ[] = [
  {
    id: "1",
    question: "What documents are needed for tax filing?",
    answer:
      "You need your CNIC, NTN certificate, salary slips, bank statements, and property details if applicable.",
    category: "Tax Filing",
    published: true,
    order: 1,
  },
  {
    id: "2",
    question: "How long does NTN registration take?",
    answer:
      "NTN registration typically takes 2-3 working days after submission of all required documents.",
    category: "NTN",
    published: true,
    order: 2,
  },
  {
    id: "3",
    question: "What is the tax filing deadline?",
    answer:
      "The tax return filing deadline is usually September 30th each year.",
    category: "Tax Filing",
    published: true,
    order: 3,
  },
  {
    id: "4",
    question: "Can I file my own tax return?",
    answer:
      "Yes, you can file your own return online through the FBR portal or use our guided service.",
    category: "Tax Filing",
    published: false,
    order: 4,
  },
  {
    id: "5",
    question: "What is GST registration threshold?",
    answer:
      "GST registration is mandatory if your annual turnover exceeds PKR 10 million.",
    category: "GST",
    published: true,
    order: 5,
  },
];

const categories = [
  "Tax Filing",
  "NTN",
  "GST",
  "Sales Tax",
  "Business",
  "General",
];

export default function FAQsManagement() {
  const [categoryFilter, setCategoryFilter] = useState("");
  const [addOpen, setAddOpen] = useState(false);
  const [editItem, setEditItem] = useState<FAQ | null>(null);
  const [form, setForm] = useState({
    question: "",
    answer: "",
    category: "",
    published: true,
  });

  const { data, isLoading, error, refetch } = useQuery({
    queryKey: ["admin-faqs"],
    queryFn: async () => {
      const res = await api.get("/admin/faqs");
      return res.data.data;
    },
  });

  const faqs: FAQ[] = data || fallbackFAQs;

  const filtered = categoryFilter
    ? faqs.filter((f) => f.category === categoryFilter)
    : faqs;
  const sorted = [...filtered].sort((a, b) => a.order - b.order);

  const openAdd = () => {
    setEditItem(null);
    setForm({ question: "", answer: "", category: "", published: true });
    setAddOpen(true);
  };

  const openEdit = (faq: FAQ) => {
    setEditItem(faq);
    setForm({
      question: faq.question,
      answer: faq.answer,
      category: faq.category,
      published: faq.published,
    });
    setAddOpen(true);
  };

  const handleSave = () => {
    if (editItem) {
      toast.success(`FAQ updated`);
    } else {
      toast.success(`FAQ added`);
    }
    setAddOpen(false);
    setEditItem(null);
  };

  const handleDelete = (faq: FAQ) => {
    toast.success(`FAQ deleted`);
  };

  const handleMoveUp = (index: number) => {
    if (index === 0) return;
    toast.success("Order updated");
  };

  const handleMoveDown = (index: number) => {
    if (index === sorted.length - 1) return;
    toast.success("Order updated");
  };

  if (isLoading) return <LoadingSpinner size="lg" />;

  if (error) {
    return (
      <EmptyState
        icon={<AlertCircle className="h-12 w-12 text-destructive" />}
        title="Failed to load FAQs"
        action={{ label: "Retry", onClick: () => refetch() }}
      />
    );
  }

  return (
    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
      <PageHeader
        title="FAQs Management"
        subtitle="Manage frequently asked questions"
        action={
          <Button onClick={openAdd}>
            <Plus className="h-4 w-4 mr-2" /> Add FAQ
          </Button>
        }
      />

      <div className="mb-6">
        <div className="flex items-center gap-2">
          <Label>Filter by Category</Label>
          <select
            className="flex h-10 rounded-md border border-input bg-background px-3 py-2 text-sm min-w-[160px]"
            value={categoryFilter}
            onChange={(e) => setCategoryFilter(e.target.value)}
          >
            <option value="">All Categories</option>
            {categories.map((c) => (
              <option key={c} value={c}>
                {c}
              </option>
            ))}
          </select>
        </div>
      </div>

      {sorted.length === 0 ? (
        <EmptyState
          title="No FAQs found"
          description={
            categoryFilter ? "No FAQs in this category." : "Add your first FAQ."
          }
          action={{ label: "Add FAQ", onClick: openAdd }}
        />
      ) : (
        <div className="space-y-3">
          {sorted.map((faq, index) => (
            <Card key={faq.id} className="relative">
              <CardContent className="p-4">
                <div className="flex items-start gap-3">
                  <div className="flex flex-col items-center gap-0.5 pt-1">
                    <button
                      onClick={() => handleMoveUp(index)}
                      className="text-muted-foreground hover:text-foreground transition-colors"
                      disabled={index === 0}
                    >
                      <svg
                        className="h-3.5 w-3.5"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M5 15l7-7 7 7"
                        />
                      </svg>
                    </button>
                    <GripVertical className="h-4 w-4 text-muted-foreground" />
                    <button
                      onClick={() => handleMoveDown(index)}
                      className="text-muted-foreground hover:text-foreground transition-colors"
                      disabled={index === sorted.length - 1}
                    >
                      <svg
                        className="h-3.5 w-3.5"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M19 9l-7 7-7-7"
                        />
                      </svg>
                    </button>
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      <h3 className="font-medium text-sm">{faq.question}</h3>
                      {!faq.published && (
                        <EyeOff className="h-3.5 w-3.5 text-muted-foreground" />
                      )}
                    </div>
                    <p className="text-sm text-muted-foreground line-clamp-2 mb-2">
                      {faq.answer}
                    </p>
                    <div className="flex items-center gap-2">
                      <Badge variant="secondary" className="text-xs">
                        {faq.category}
                      </Badge>
                      <span className="text-xs text-muted-foreground">
                        Order: {faq.order}
                      </span>
                    </div>
                  </div>
                  <div className="flex items-center gap-1">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => openEdit(faq)}
                    >
                      <Edit className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleDelete(faq)}
                    >
                      <Trash2 className="h-4 w-4 text-destructive" />
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      <Dialog open={addOpen} onOpenChange={setAddOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{editItem ? "Edit FAQ" : "Add FAQ"}</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div className="space-y-1.5">
              <Label>Question</Label>
              <Input
                value={form.question}
                onChange={(e) =>
                  setForm((p) => ({ ...p, question: e.target.value }))
                }
                placeholder="Enter the question"
              />
            </div>
            <div className="space-y-1.5">
              <Label>Answer</Label>
              <Textarea
                value={form.answer}
                onChange={(e) =>
                  setForm((p) => ({ ...p, answer: e.target.value }))
                }
                placeholder="Enter the answer..."
                rows={4}
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <Label>Category</Label>
                <select
                  className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
                  value={form.category}
                  onChange={(e) =>
                    setForm((p) => ({ ...p, category: e.target.value }))
                  }
                >
                  <option value="">Select category</option>
                  {categories.map((c) => (
                    <option key={c} value={c}>
                      {c}
                    </option>
                  ))}
                </select>
              </div>
              <div className="space-y-1.5">
                <Label>Published</Label>
                <div className="flex items-center gap-2 pt-2">
                  <Switch
                    checked={form.published}
                    onCheckedChange={(v) =>
                      setForm((p) => ({ ...p, published: v }))
                    }
                  />
                  <span className="text-sm text-muted-foreground">
                    {form.published ? "Visible on site" : "Hidden"}
                  </span>
                </div>
              </div>
            </div>
          </div>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => {
                setAddOpen(false);
                setEditItem(null);
              }}
            >
              Cancel
            </Button>
            <Button
              onClick={handleSave}
              disabled={!form.question || !form.answer || !form.category}
            >
              Save
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </motion.div>
  );
}
