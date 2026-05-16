import { useMemo } from "react";
import { useQuery } from "@tanstack/react-query";
import { motion } from "framer-motion";
import { Calendar, Clock, AlertCircle, ArrowRight } from "lucide-react";
import api from "@/lib/api";
import { PageHeader } from "@/components/shared/PageHeader";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { formatDate } from "@/lib/utils";
import { LoadingSpinner } from "@/components/shared/LoadingSpinner";
import { EmptyState } from "@/components/shared/EmptyState";

interface Deadline {
  id: string;
  title: string;
  date: Date;
  type: "annual" | "monthly";
  href: string;
}

const DAY_MS = 1000 * 60 * 60 * 24;

function getNextDate(day: number, month?: number): Date {
  const now = new Date();
  let target = month !== undefined
    ? new Date(now.getFullYear(), month, day)
    : new Date(now.getFullYear(), now.getMonth(), day);
  if (target <= now) {
    target = month !== undefined
      ? new Date(now.getFullYear() + 1, month, day)
      : new Date(now.getFullYear(), now.getMonth() + 1, day);
  }
  return target;
}

const HARDCODED_DEADLINES: Deadline[] = [
  {
    id: "income-tax",
    title: "Income Tax Return Filing",
    date: getNextDate(30, 8),
    type: "annual",
    href: "/dashboard/tax-return/new",
  },
  {
    id: "sales-tax",
    title: "Sales Tax Return",
    date: getNextDate(15),
    type: "monthly",
    href: "/dashboard/gst/monthly-returns",
  },
  {
    id: "withholding-tax",
    title: "Withholding Tax Statement",
    date: getNextDate(10),
    type: "monthly",
    href: "/dashboard/withholding-tax",
  },
];

export default function TaxCalendar() {
  const { data: eventsData, isLoading } = useQuery({
    queryKey: ["upcoming-events"],
    queryFn: async () => {
      try {
        const res = await api.get("/events/upcoming");
        return res.data.data;
      } catch {
        return [];
      }
    },
  });

  const events = useMemo(() => {
    const fetched = Array.isArray(eventsData) ? eventsData : [];
    const mapped: Deadline[] = fetched.map((e: any) => ({
      id: e.id,
      title: e.title,
      date: new Date(e.date),
      type: e.type || "annual",
      href: e.href || "/dashboard",
    }));
    const all = [...HARDCODED_DEADLINES, ...mapped];
    all.sort((a, b) => a.date.getTime() - b.date.getTime());
    return all;
  }, [eventsData]);

  const nextDeadline = events[0];

  const getCountdown = (date: Date) => {
    const diff = Math.ceil((date.getTime() - Date.now()) / DAY_MS);
    return diff > 0 ? diff : 0;
  };

  const getTypeVariant = (type: string) => {
    switch (type) {
      case "annual": return "default";
      case "monthly": return "secondary";
      default: return "outline";
    }
  };

  if (isLoading) return <LoadingSpinner size="lg" />;

  return (
    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
      <PageHeader title="Tax Calendar" subtitle="Upcoming tax deadlines and events" />

      {nextDeadline && (
        <Card className="mb-8 border-l-4 border-l-primary">
          <CardContent className="p-6">
            <div className="flex items-center justify-between flex-wrap gap-4">
              <div className="flex items-center gap-4">
                <div className="flex h-14 w-14 items-center justify-center rounded-xl bg-gradient-to-br from-primary/20 to-primary/5 text-primary">
                  <Calendar className="h-7 w-7" />
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Next Deadline</p>
                  <p className="text-lg font-semibold">{nextDeadline.title}</p>
                  <p className="text-sm text-muted-foreground">{formatDate(nextDeadline.date)}</p>
                </div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-primary">{getCountdown(nextDeadline.date)}</div>
                <p className="text-xs text-muted-foreground">days remaining</p>
              </div>
              <Button asChild>
                <a href={nextDeadline.href}>
                  Take Action <ArrowRight className="ml-2 h-4 w-4" />
                </a>
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      {events.length === 0 ? (
        <EmptyState
          icon={<Calendar className="h-12 w-12 text-muted-foreground" />}
          title="No deadlines"
          description="You have no upcoming tax deadlines."
        />
      ) : (
        <div className="grid gap-4">
          {events.map((deadline) => {
            const countdown = getCountdown(deadline.date);
            return (
              <Card key={deadline.id} className="hover:shadow-md transition-shadow">
                <CardContent className="p-5">
                  <div className="flex items-center justify-between flex-wrap gap-3">
                    <div className="flex items-center gap-3 min-w-0">
                      <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary/10 shrink-0">
                        <Clock className="h-5 w-5 text-primary" />
                      </div>
                      <div className="min-w-0">
                        <p className="font-medium truncate">{deadline.title}</p>
                        <p className="text-sm text-muted-foreground">
                          {formatDate(deadline.date)}
                          {countdown <= 7 && (
                            <span className="ml-2 inline-flex items-center gap-1 text-amber-600 font-medium">
                              <AlertCircle className="h-3 w-3" />
                              Due soon
                            </span>
                          )}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center gap-3 shrink-0">
                      <div className="text-right">
                        <span className="text-xl font-bold">{countdown}</span>
                        <span className="text-xs text-muted-foreground ml-1">days</span>
                      </div>
                      <Badge variant={getTypeVariant(deadline.type) as any}>
                        {deadline.type === "annual" ? "Yearly" : "Monthly"}
                      </Badge>
                      <Button variant="outline" size="sm" asChild>
                        <a href={deadline.href}>View</a>
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>
      )}
    </motion.div>
  );
}
