import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import {
  MessageSquare,
  Phone,
  Video,
  Mail,
  ChevronRight,
  ChevronLeft,
  Check,
  Clock,
  Calendar,
  User,
  AlertCircle,
} from "lucide-react";
import { PageHeader } from "@/components/shared/PageHeader";
import { PaymentModal } from "@/components/shared/PaymentModal";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { formatPKR } from "@/lib/utils";
import { EmptyState } from "@/components/shared/EmptyState";

const consultationTypes = [
  {
    id: "chat",
    label: "Chat",
    icon: MessageSquare,
    price: 500,
    description: "Text-based consultation",
  },
  {
    id: "call",
    label: "Voice Call",
    icon: Phone,
    price: 1500,
    description: "Phone call with consultant",
  },
  {
    id: "video",
    label: "Video Call",
    icon: Video,
    price: 2500,
    description: "Video meeting",
  },
  {
    id: "email",
    label: "Email",
    icon: Mail,
    price: 500,
    description: "Email consultation",
  },
];

const consultants = [
  {
    id: "1",
    name: "Ahmed Khan",
    specialty: "Corporate Tax",
    rating: 4.9,
    experience: "12 years",
  },
  {
    id: "2",
    name: "Fatima Ali",
    specialty: "Income Tax",
    rating: 4.8,
    experience: "8 years",
  },
  {
    id: "3",
    name: "Hassan Raza",
    specialty: "GST / Sales Tax",
    rating: 4.7,
    experience: "10 years",
  },
  {
    id: "4",
    name: "Sara Malik",
    specialty: "International Tax",
    rating: 4.9,
    experience: "15 years",
  },
];

const timeSlots = [
  "09:00 AM",
  "10:00 AM",
  "11:00 AM",
  "02:00 PM",
  "03:00 PM",
  "04:00 PM",
  "05:00 PM",
];

const getInitials = (name: string) => {
  return name
    .split(" ")
    .map((n) => n[0])
    .join("")
    .toUpperCase()
    .slice(0, 2);
};

export default function BookConsultationPage() {
  const navigate = useNavigate();
  const [step, setStep] = useState(1);
  const [selectedType, setSelectedType] = useState<string | null>(null);
  const [subject, setSubject] = useState("");
  const [description, setDescription] = useState("");
  const [selectedConsultant, setSelectedConsultant] = useState<string | null>(
    null,
  );
  const [selectedDate, setSelectedDate] = useState("");
  const [selectedTime, setSelectedTime] = useState("");
  const [showPayment, setShowPayment] = useState(false);

  const steps = [
    { number: 1, title: "Select Type" },
    { number: 2, title: "Subject" },
    { number: 3, title: "Select Consultant" },
    { number: 4, title: "Review & Pay" },
  ];

  const getSelectedTypeData = () =>
    consultationTypes.find((t) => t.id === selectedType);
  const getSelectedConsultantData = () =>
    consultants.find((c) => c.id === selectedConsultant);

  const canProceed = () => {
    switch (step) {
      case 1:
        return selectedType !== null;
      case 2:
        return subject.trim().length > 0;
      case 3:
        return selectedConsultant !== null && selectedDate && selectedTime;
      case 4:
        return true;
      default:
        return false;
    }
  };

  const handleNext = () => {
    if (step < 4) {
      setStep(step + 1);
    } else {
      setShowPayment(true);
    }
  };

  const handlePaymentSuccess = (paymentId: string) => {
    toast.success(`Consultation booked successfully! Payment ID: ${paymentId}`);
    navigate("/dashboard/consultations");
  };

  const selectedTypeData = getSelectedTypeData();
  const selectedConsultantData = getSelectedConsultantData();

  return (
    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
      <PageHeader
        title="Book Consultation"
        subtitle="Get expert tax advice from qualified professionals"
      />

      <div className="flex items-center justify-center mb-8">
        {steps.map((s, index) => (
          <div key={s.number} className="flex items-center">
            <div className="flex flex-col items-center">
              <div
                className={`flex h-10 w-10 items-center justify-center rounded-full text-sm font-semibold transition-colors ${
                  step >= s.number
                    ? "bg-primary text-white"
                    : "bg-muted text-muted-foreground"
                }`}
              >
                {step > s.number ? <Check className="h-5 w-5" /> : s.number}
              </div>
              <span
                className={`mt-2 text-xs font-medium ${
                  step >= s.number ? "text-foreground" : "text-muted-foreground"
                }`}
              >
                {s.title}
              </span>
            </div>
            {index < steps.length - 1 && (
              <div
                className={`w-16 sm:w-24 h-1 mx-2 rounded ${
                  step > s.number ? "bg-primary" : "bg-muted"
                }`}
              />
            )}
          </div>
        ))}
      </div>

      <Card className="max-w-2xl mx-auto">
        <CardContent className="p-6">
          <AnimatePresence mode="wait">
            {step === 1 && (
              <motion.div
                key="step1"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
              >
                <h3 className="text-lg font-semibold mb-4">
                  Select Consultation Type
                </h3>
                <div className="grid grid-cols-2 gap-4 mb-6">
                  {consultationTypes.map((type) => {
                    const Icon = type.icon;
                    return (
                      <button
                        key={type.id}
                        onClick={() => setSelectedType(type.id)}
                        className={`p-4 rounded-xl border-2 text-left transition-all ${
                          selectedType === type.id
                            ? "border-primary bg-primary/5"
                            : "border-border hover:border-primary/50"
                        }`}
                      >
                        <div
                          className={`flex h-10 w-10 items-center justify-center rounded-lg mb-3 ${
                            selectedType === type.id
                              ? "bg-primary text-white"
                              : "bg-muted text-muted-foreground"
                          }`}
                        >
                          <Icon className="h-5 w-5" />
                        </div>
                        <h4 className="font-semibold">{type.label}</h4>
                        <p className="text-sm text-muted-foreground mb-2">
                          {type.description}
                        </p>
                        <p className="text-lg font-bold text-primary">
                          {formatPKR(type.price)}
                        </p>
                      </button>
                    );
                  })}
                </div>
              </motion.div>
            )}

            {step === 2 && (
              <motion.div
                key="step2"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
              >
                <h3 className="text-lg font-semibold mb-4">
                  What do you need help with?
                </h3>
                <div className="space-y-4 mb-6">
                  <div className="space-y-2">
                    <Label>Subject *</Label>
                    <Input
                      placeholder="e.g., Need help with tax filing for 2025"
                      value={subject}
                      onChange={(e) => setSubject(e.target.value)}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>Description (optional)</Label>
                    <textarea
                      className="flex min-h-[150px] w-full rounded-md border border-input bg-background px-3 py-2 text-sm placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                      placeholder="Provide more details about your query..."
                      value={description}
                      onChange={(e) => setDescription(e.target.value)}
                    />
                  </div>
                </div>
              </motion.div>
            )}

            {step === 3 && (
              <motion.div
                key="step3"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
              >
                <h3 className="text-lg font-semibold mb-4">
                  Select a Consultant
                </h3>
                <div className="space-y-3 mb-6">
                  {consultants.map((consultant) => (
                    <button
                      key={consultant.id}
                      onClick={() => setSelectedConsultant(consultant.id)}
                      className={`w-full p-4 rounded-xl border-2 text-left transition-all ${
                        selectedConsultant === consultant.id
                          ? "border-primary bg-primary/5"
                          : "border-border hover:border-primary/50"
                      }`}
                    >
                      <div className="flex items-center gap-4">
                        <Avatar className="h-12 w-12">
                          <AvatarFallback className="bg-primary/10 text-primary font-semibold">
                            {getInitials(consultant.name)}
                          </AvatarFallback>
                        </Avatar>
                        <div className="flex-1">
                          <div className="flex items-center gap-2">
                            <h4 className="font-semibold">{consultant.name}</h4>
                            <Badge variant="outline">
                              {consultant.experience}
                            </Badge>
                          </div>
                          <p className="text-sm text-muted-foreground">
                            {consultant.specialty}
                          </p>
                        </div>
                        <div className="text-right">
                          <div className="flex items-center gap-1 text-amber-500">
                            <span className="font-semibold">
                              {consultant.rating}
                            </span>
                          </div>
                        </div>
                      </div>
                    </button>
                  ))}
                </div>

                <div className="space-y-4">
                  <div className="space-y-2">
                    <Label>Preferred Date</Label>
                    <Input
                      type="date"
                      value={selectedDate}
                      onChange={(e) => setSelectedDate(e.target.value)}
                      min={new Date().toISOString().split("T")[0]}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>Available Slots</Label>
                    <div className="grid grid-cols-4 gap-2">
                      {timeSlots.map((slot) => (
                        <Button
                          key={slot}
                          variant={
                            selectedTime === slot ? "default" : "outline"
                          }
                          size="sm"
                          onClick={() => setSelectedTime(slot)}
                        >
                          <Clock className="mr-1 h-3 w-3" />
                          {slot}
                        </Button>
                      ))}
                    </div>
                  </div>
                </div>
              </motion.div>
            )}

            {step === 4 && (
              <motion.div
                key="step4"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
              >
                <h3 className="text-lg font-semibold mb-4">
                  Review Your Booking
                </h3>
                <div className="space-y-4 mb-6">
                  <Card className="border-border/50">
                    <CardContent className="p-4">
                      <h4 className="font-medium text-muted-foreground text-sm mb-3">
                        Consultation Details
                      </h4>
                      <div className="space-y-2">
                        <div className="flex justify-between">
                          <span className="text-muted-foreground">Type</span>
                          <span className="font-medium">
                            {selectedTypeData?.label}
                          </span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-muted-foreground">Subject</span>
                          <span className="font-medium">{subject}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-muted-foreground">
                            Consultant
                          </span>
                          <span className="font-medium">
                            {selectedConsultantData?.name}
                          </span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-muted-foreground">
                            Date & Time
                          </span>
                          <span className="font-medium">
                            {selectedDate} at {selectedTime}
                          </span>
                        </div>
                      </div>
                    </CardContent>
                  </Card>

                  <Card className="border-primary/50 bg-primary/5">
                    <CardContent className="p-4">
                      <div className="flex items-center justify-between">
                        <span className="font-medium">Total Amount</span>
                        <span className="text-2xl font-bold text-primary">
                          {formatPKR(selectedTypeData?.price || 0)}
                        </span>
                      </div>
                    </CardContent>
                  </Card>
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          <div className="flex justify-between pt-4 border-t border-border">
            <Button
              variant="outline"
              onClick={() => setStep(step - 1)}
              disabled={step === 1}
            >
              <ChevronLeft className="mr-2 h-4 w-4" /> Back
            </Button>
            <Button onClick={handleNext} disabled={!canProceed()}>
              {step === 4 ? (
                "Proceed to Payment"
              ) : (
                <>
                  Next <ChevronRight className="ml-2 h-4 w-4" />
                </>
              )}
            </Button>
          </div>
        </CardContent>
      </Card>

      {selectedTypeData && (
        <PaymentModal
          isOpen={showPayment}
          onClose={() => setShowPayment(false)}
          amount={selectedTypeData.price}
          serviceType={`${selectedTypeData.label} Consultation`}
          onSuccess={handlePaymentSuccess}
        />
      )}
    </motion.div>
  );
}
