import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { motion } from "framer-motion";
import toast from "react-hot-toast";
import {
  Search,
  Plus,
  Eye,
  Edit,
  UserX,
  UserCheck,
  Trash2,
  AlertCircle,
  Mail,
  Phone,
  Calendar,
  Shield,
  Activity,
  Hash,
} from "lucide-react";
import api from "@/lib/api";
import { PageHeader } from "@/components/shared/PageHeader";
import { DataTable, type Column } from "@/components/shared/DataTable";
import { StatusBadge } from "@/components/shared/StatusBadge";
import { ConfirmDialog } from "@/components/shared/ConfirmDialog";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Badge } from "@/components/ui/badge";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { LoadingSpinner } from "@/components/shared/LoadingSpinner";
import { EmptyState } from "@/components/shared/EmptyState";
import { formatDate } from "@/lib/utils";

interface Consultant {
  id: string;
  name: string;
  email: string;
  phone: string;
  role: "CONSULTANT";
  isActive: boolean;
  createdAt: string;
  specializations: string[];
}

interface Pagination {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
}

interface ConsultantsResponse {
  success: boolean;
  data: Consultant[];
  pagination: Pagination;
}

interface AddConsultantForm {
  name: string;
  email: string;
  password: string;
  specializations: string[];
}

interface EditConsultantForm {
  name: string;
  email: string;
  isActive: boolean;
}

export default function ConsultantsManagement() {
  const queryClient = useQueryClient();
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);
  const limit = 20;

  const [addOpen, setAddOpen] = useState(false);
  const [addForm, setAddForm] = useState<AddConsultantForm>({
    name: "",
    email: "",
    password: "",
    specializations: [],
  });

  const [editOpen, setEditOpen] = useState(false);
  const [editConsultant, setEditConsultant] = useState<Consultant | null>(null);
  const [editForm, setEditForm] = useState<EditConsultantForm>({
    name: "",
    email: "",
    isActive: true,
  });

  const [detailOpen, setDetailOpen] = useState(false);
  const [detailConsultant, setDetailConsultant] = useState<Consultant | null>(null);

  const [deleteConfirm, setDeleteConfirm] = useState<{ open: boolean; consultant: Consultant | null }>({
    open: false,
    consultant: null,
  });

  const queryParams = new URLSearchParams();
  queryParams.set("page", String(page));
  queryParams.set("limit", String(limit));
  if (search) queryParams.set("search", search);

  const { data, isLoading, error, refetch } = useQuery<ConsultantsResponse>({
    queryKey: ["admin-consultants", page, limit, search],
    queryFn: async () => {
      const res = await api.get(`/admin/consultants?${queryParams}`);
      return res.data;
    },
  });

  const consultants = data?.data ?? [];
  const pagination = data?.pagination ?? { page: 1, limit, total: 0, totalPages: 0 };

  const addMutation = useMutation({
    mutationFn: async (body: AddConsultantForm) => {
      await api.post("/admin/consultants", body);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin-consultants"] });
      toast.success("Consultant added successfully");
      setAddOpen(false);
      setAddForm({ name: "", email: "", password: "", specializations: [] });
    },
    onError: () => toast.error("Failed to add consultant"),
  });

  const editMutation = useMutation({
    mutationFn: async ({ id, ...body }: { id: string } & EditConsultantForm) => {
      await api.put(`/admin/consultants/${id}`, body);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin-consultants"] });
      toast.success("Consultant updated successfully");
      setEditOpen(false);
      setEditConsultant(null);
    },
    onError: () => toast.error("Failed to update consultant"),
  });

  const deleteMutation = useMutation({
    mutationFn: async (id: string) => {
      await api.delete(`/admin/consultants/${id}`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin-consultants"] });
      toast.success("Consultant deleted successfully");
      setDeleteConfirm({ open: false, consultant: null });
    },
    onError: () => toast.error("Failed to delete consultant"),
  });

  const toggleMutation = useMutation({
    mutationFn: async ({ id, isActive }: { id: string; isActive: boolean }) => {
      await api.put(`/admin/consultants/${id}`, { isActive });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin-consultants"] });
      toast.success("Consultant status updated");
    },
    onError: () => toast.error("Failed to update consultant status"),
  });

  const handleAdd = () => {
    addMutation.mutate(addForm);
  };

  const openEdit = (consultant: Consultant) => {
    setEditConsultant(consultant);
    setEditForm({ name: consultant.name, email: consultant.email, isActive: consultant.isActive });
    setEditOpen(true);
  };

  const handleEdit = () => {
    if (!editConsultant) return;
    editMutation.mutate({ id: editConsultant.id, ...editForm });
  };

  const handleDelete = () => {
    if (!deleteConfirm.consultant) return;
    deleteMutation.mutate(deleteConfirm.consultant.id);
  };

  const handleToggleActive = (consultant: Consultant) => {
    toggleMutation.mutate({ id: consultant.id, isActive: !consultant.isActive });
  };

  const openDetail = (consultant: Consultant) => {
    setDetailConsultant(consultant);
    setDetailOpen(true);
  };

  const columns: Column<Consultant>[] = [
    {
      key: "name",
      header: "Name",
      render: (item) => <span className="font-medium">{item.name}</span>,
    },
    { key: "email", header: "Email" },
    {
      key: "role",
      header: "Role",
      render: () => <Badge variant="default">CONSULTANT</Badge>,
    },
    {
      key: "status",
      header: "Status",
      render: (item) => (
        <StatusBadge status={item.isActive ? "ACTIVE" : "INACTIVE"} />
      ),
    },
    {
      key: "createdAt",
      header: "Joined",
      render: (item) => formatDate(item.createdAt),
      sortable: true,
    },
    {
      key: "actions",
      header: "Actions",
      render: (item) => (
        <div className="flex items-center gap-1">
          <Button variant="ghost" size="sm" onClick={() => openDetail(item)}>
            <Eye className="h-4 w-4" />
          </Button>
          <Button variant="ghost" size="sm" onClick={() => openEdit(item)}>
            <Edit className="h-4 w-4" />
          </Button>
          <Button variant="ghost" size="sm" onClick={() => handleToggleActive(item)}>
            {item.isActive ? (
              <UserX className="h-4 w-4 text-destructive" />
            ) : (
              <UserCheck className="h-4 w-4 text-emerald-500" />
            )}
          </Button>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setDeleteConfirm({ open: true, consultant: item })}
          >
            <Trash2 className="h-4 w-4 text-destructive" />
          </Button>
        </div>
      ),
    },
  ];

  if (isLoading) return <LoadingSpinner size="lg" />;

  if (error) {
    return (
      <EmptyState
        icon={<AlertCircle className="h-12 w-12 text-destructive" />}
        title="Failed to load consultants"
        description="There was an error fetching consultants from the server."
        action={{ label: "Retry", onClick: () => refetch() }}
      />
    );
  }

  return (
    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
      <PageHeader
        title="Consultants Management"
        subtitle="Manage all tax consultants on Volks & David"
        action={
          <Button onClick={() => setAddOpen(true)}>
            <Plus className="h-4 w-4 mr-2" /> Add Consultant
          </Button>
        }
      />

      <Card className="mb-6 shadow-sm rounded-xl border-border/60">
        <CardContent className="pt-6">
          <div className="relative flex-1 max-w-md">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search by name or email..."
              className="pl-9 rounded-lg"
              value={search}
              onChange={(e) => {
                setSearch(e.target.value);
                setPage(1);
              }}
            />
          </div>
        </CardContent>
      </Card>

      <div className="rounded-xl shadow-sm border border-border/60 overflow-hidden bg-card">
        <DataTable
          columns={columns}
          data={consultants}
          keyExtractor={(item) => item.id}
          pagination={pagination}
          onPageChange={setPage}
          emptyTitle="No consultants found"
          emptyDescription="Try adjusting your search or add a new consultant."
        />
      </div>

      <Dialog open={addOpen} onOpenChange={setAddOpen}>
        <DialogContent className="sm:max-w-md rounded-xl">
          <DialogHeader>
            <DialogTitle>Add Consultant</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div className="space-y-1.5">
              <Label>Full Name</Label>
              <Input
                placeholder="Enter full name"
                className="rounded-lg"
                value={addForm.name}
                onChange={(e) => setAddForm((p) => ({ ...p, name: e.target.value }))}
              />
            </div>
            <div className="space-y-1.5">
              <Label>Email</Label>
              <Input
                type="email"
                placeholder="Enter email address"
                className="rounded-lg"
                value={addForm.email}
                onChange={(e) => setAddForm((p) => ({ ...p, email: e.target.value }))}
              />
            </div>
            <div className="space-y-1.5">
              <Label>Password</Label>
              <Input
                type="password"
                placeholder="Enter password"
                className="rounded-lg"
                value={addForm.password}
                onChange={(e) => setAddForm((p) => ({ ...p, password: e.target.value }))}
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setAddOpen(false)}>
              Cancel
            </Button>
            <Button
              onClick={handleAdd}
              disabled={!addForm.name || !addForm.email || !addForm.password}
            >
              Create Consultant
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <Dialog open={editOpen} onOpenChange={setEditOpen}>
        <DialogContent className="sm:max-w-md rounded-xl">
          <DialogHeader>
            <DialogTitle>Edit Consultant - {editConsultant?.name}</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div className="space-y-1.5">
              <Label>Full Name</Label>
              <Input
                placeholder="Enter full name"
                className="rounded-lg"
                value={editForm.name}
                onChange={(e) => setEditForm((p) => ({ ...p, name: e.target.value }))}
              />
            </div>
            <div className="space-y-1.5">
              <Label>Email</Label>
              <Input
                type="email"
                placeholder="Enter email address"
                className="rounded-lg"
                value={editForm.email}
                onChange={(e) => setEditForm((p) => ({ ...p, email: e.target.value }))}
              />
            </div>
            <div className="space-y-1.5">
              <Label>Active Status</Label>
              <div className="flex items-center gap-2 pt-1">
                <Switch
                  checked={editForm.isActive}
                  onCheckedChange={(v) => setEditForm((p) => ({ ...p, isActive: v }))}
                />
                <span className="text-sm text-muted-foreground">
                  {editForm.isActive ? "Active" : "Inactive"}
                </span>
              </div>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setEditOpen(false)}>
              Cancel
            </Button>
            <Button
              onClick={handleEdit}
              disabled={!editForm.name || !editForm.email}
            >
              Save Changes
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <Dialog open={detailOpen} onOpenChange={setDetailOpen}>
        <DialogContent className="sm:max-w-lg rounded-xl">
          <DialogHeader>
            <DialogTitle>Consultant Details</DialogTitle>
          </DialogHeader>
          {detailConsultant && (
            <div className="space-y-6">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 p-4 rounded-lg bg-muted/30">
                <div className="flex items-center gap-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary/10">
                    <Mail className="h-4 w-4 text-primary" />
                  </div>
                  <div>
                    <p className="text-xs text-muted-foreground">Email</p>
                    <p className="text-sm font-medium">{detailConsultant.email}</p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary/10">
                    <Phone className="h-4 w-4 text-primary" />
                  </div>
                  <div>
                    <p className="text-xs text-muted-foreground">Phone</p>
                    <p className="text-sm font-medium">{detailConsultant.phone || "Not provided"}</p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary/10">
                    <Calendar className="h-4 w-4 text-primary" />
                  </div>
                  <div>
                    <p className="text-xs text-muted-foreground">Joined</p>
                    <p className="text-sm font-medium">{formatDate(detailConsultant.createdAt)}</p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary/10">
                    <Shield className="h-4 w-4 text-primary" />
                  </div>
                  <div>
                    <p className="text-xs text-muted-foreground">Role</p>
                    <Badge variant="default">CONSULTANT</Badge>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary/10">
                    <Activity className="h-4 w-4 text-primary" />
                  </div>
                  <div>
                    <p className="text-xs text-muted-foreground">Status</p>
                    <StatusBadge status={detailConsultant.isActive ? "ACTIVE" : "INACTIVE"} />
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary/10">
                    <Hash className="h-4 w-4 text-primary" />
                  </div>
                  <div>
                    <p className="text-xs text-muted-foreground">Consultant ID</p>
                    <p className="text-xs font-mono text-muted-foreground">{detailConsultant.id}</p>
                  </div>
                </div>
              </div>
              <div className="p-4 rounded-lg bg-muted/30">
                <p className="text-xs text-muted-foreground mb-2">Specializations</p>
                {detailConsultant.specializations && detailConsultant.specializations.length > 0 ? (
                  <div className="flex flex-wrap gap-1">
                    {detailConsultant.specializations.map((s) => (
                      <Badge key={s} variant="secondary" className="text-xs">
                        {s}
                      </Badge>
                    ))}
                  </div>
                ) : (
                  <p className="text-sm text-muted-foreground">No specializations listed</p>
                )}
              </div>
            </div>
          )}
          <DialogFooter>
            <Button onClick={() => setDetailOpen(false)}>Close</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <ConfirmDialog
        open={deleteConfirm.open}
        onOpenChange={(o) => setDeleteConfirm((p) => ({ ...p, open: o }))}
        title="Delete Consultant"
        description={`Are you sure you want to delete ${deleteConfirm.consultant?.name}? This action cannot be undone.`}
        confirmLabel="Delete"
        variant="destructive"
        onConfirm={handleDelete}
      />
    </motion.div>
  );
}
