import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { motion } from "framer-motion";
import toast from "react-hot-toast";
import {
  Search,
  Filter,
  Plus,
  Eye,
  UserCog,
  ToggleLeft,
  ToggleRight,
  Trash2,
  AlertCircle,
  Mail,
  Phone,
  Calendar,
  Shield,
  Activity,
} from "lucide-react";
import api from "@/lib/api";
import { PageHeader } from "@/components/shared/PageHeader";
import { DataTable, type Column } from "@/components/shared/DataTable";
import { StatusBadge } from "@/components/shared/StatusBadge";
import { ConfirmDialog } from "@/components/shared/ConfirmDialog";
import { ExportButton } from "@/components/shared/ExportButton";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
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
import { formatDate, formatPKR } from "@/lib/utils";

interface User {
  id: string;
  name: string;
  email: string;
  phone: string;
  role: "USER" | "CONSULTANT" | "ADMIN" | "SUPER_ADMIN";
  isActive: boolean;
  createdAt: string;
}

interface Pagination {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
}

interface UsersResponse {
  data: User[];
  pagination: Pagination;
}

interface TaxReturn {
  id: string;
  taxYear: string;
  returnType: string;
  income: number;
  status: string;
  submittedAt: string;
}

interface Payment {
  id: string;
  service: string;
  amount: number;
  method: string;
  status: string;
  date: string;
}

interface AddUserForm {
  name: string;
  email: string;
  password: string;
  role: "USER" | "CONSULTANT" | "ADMIN";
}

interface EditUserForm {
  name: string;
  email: string;
  role: "USER" | "CONSULTANT" | "ADMIN" | "SUPER_ADMIN";
}

const initialAddForm: AddUserForm = {
  name: "",
  email: "",
  password: "",
  role: "USER",
};

const roles: { value: string; label: string }[] = [
  { value: "USER", label: "User" },
  { value: "CONSULTANT", label: "Consultant" },
  { value: "ADMIN", label: "Admin" },
  { value: "SUPER_ADMIN", label: "Super Admin" },
];

const roleBadgeVariant: Record<string, "default" | "secondary" | "outline" | "destructive"> = {
  USER: "secondary",
  CONSULTANT: "default",
  ADMIN: "outline",
  SUPER_ADMIN: "destructive",
};

export default function UsersManagement() {
  const queryClient = useQueryClient();
  const [search, setSearch] = useState("");
  const [filters, setFilters] = useState({ role: "", status: "" });
  const [page, setPage] = useState(1);
  const limit = 20;

  const [addOpen, setAddOpen] = useState(false);
  const [addForm, setAddForm] = useState<AddUserForm>(initialAddForm);

  const [editOpen, setEditOpen] = useState(false);
  const [editUser, setEditUser] = useState<User | null>(null);
  const [editForm, setEditForm] = useState<EditUserForm>({
    name: "",
    email: "",
    role: "USER",
  });

  const [detailOpen, setDetailOpen] = useState(false);
  const [detailUser, setDetailUser] = useState<User | null>(null);

  const [deleteConfirm, setDeleteConfirm] = useState<{ open: boolean; user: User | null }>({
    open: false,
    user: null,
  });

  const queryParams = new URLSearchParams();
  queryParams.set("page", String(page));
  queryParams.set("limit", String(limit));
  if (search) queryParams.set("search", search);
  if (filters.role) queryParams.set("role", filters.role);
  if (filters.status) queryParams.set("isActive", filters.status === "ACTIVE" ? "true" : "false");

  const { data, isLoading, error, refetch } = useQuery<UsersResponse>({
    queryKey: ["admin-users", page, limit, search, filters],
    queryFn: async () => {
      const res = await api.get(`/admin/users?${queryParams}`);
      return res.data;
    },
  });

  const users = data?.data ?? [];
  const pagination = data?.pagination ?? { page: 1, limit, total: 0, totalPages: 0 };

  const toggleMutation = useMutation({
    mutationFn: async ({ id, isActive }: { id: string; isActive: boolean }) => {
      await api.put(`/admin/users/${id}`, { isActive });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin-users"] });
      toast.success("User status updated");
    },
    onError: () => toast.error("Failed to update user status"),
  });

  const editMutation = useMutation({
    mutationFn: async ({ id, ...body }: { id: string } & EditUserForm) => {
      await api.put(`/admin/users/${id}`, body);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin-users"] });
      toast.success("User updated successfully");
      setEditOpen(false);
      setEditUser(null);
    },
    onError: () => toast.error("Failed to update user"),
  });

  const addMutation = useMutation({
    mutationFn: async (body: AddUserForm) => {
      await api.post("/admin/users", body);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin-users"] });
      toast.success("User created successfully");
      setAddOpen(false);
      setAddForm(initialAddForm);
    },
    onError: () => toast.error("Failed to create user"),
  });

  const deleteMutation = useMutation({
    mutationFn: async (id: string) => {
      await api.delete(`/admin/users/${id}`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin-users"] });
      toast.success("User deleted successfully");
      setDeleteConfirm({ open: false, user: null });
    },
    onError: () => toast.error("Failed to delete user"),
  });

  const { data: detailReturns } = useQuery<TaxReturn[]>({
    queryKey: ["admin-tax-returns", detailUser?.id],
    queryFn: async () => {
      const res = await api.get(`/admin/tax-returns?userId=${detailUser!.id}`);
      return res.data.data;
    },
    enabled: !!detailUser,
  });

  const { data: detailPayments } = useQuery<Payment[]>({
    queryKey: ["admin-payments", detailUser?.id],
    queryFn: async () => {
      const res = await api.get(`/admin/payments?userId=${detailUser!.id}`);
      return res.data.data;
    },
    enabled: !!detailUser,
  });

  const { data: detailNtn } = useQuery({
    queryKey: ["admin-ntn-user", detailUser?.id],
    queryFn: async () => {
      const res = await api.get(`/admin/ntn?userId=${detailUser!.id}&limit=50`);
      return res.data.data;
    },
    enabled: !!detailUser,
  });

  const { data: detailGst } = useQuery({
    queryKey: ["admin-gst-user", detailUser?.id],
    queryFn: async () => {
      const res = await api.get(`/admin/gst?userId=${detailUser!.id}&limit=50`);
      return res.data.data;
    },
    enabled: !!detailUser,
  });

  const { data: detailSecp } = useQuery({
    queryKey: ["admin-secp-user", detailUser?.id],
    queryFn: async () => {
      const res = await api.get(`/admin/secp?userId=${detailUser!.id}&limit=50`);
      return res.data.data;
    },
    enabled: !!detailUser,
  });

  const { data: detailIp } = useQuery({
    queryKey: ["admin-ip-user", detailUser?.id],
    queryFn: async () => {
      const res = await api.get(`/admin/ip-registrations?userId=${detailUser!.id}&limit=50`);
      return res.data.data;
    },
    enabled: !!detailUser,
  });

  const { data: detailConsultations } = useQuery({
    queryKey: ["admin-consultations-user", detailUser?.id],
    queryFn: async () => {
      const res = await api.get(`/admin/consultations?userId=${detailUser!.id}&limit=50`);
      return res.data.data;
    },
    enabled: !!detailUser,
  });

  const { data: detailUserDocuments } = useQuery({
    queryKey: ["admin-documents-user", detailUser?.id],
    queryFn: async () => {
      const res = await api.get(`/admin/documents?userId=${detailUser!.id}&limit=50`);
      return res.data.data;
    },
    enabled: !!detailUser,
  });

  const handleToggleStatus = (user: User) => {
    toggleMutation.mutate({ id: user.id, isActive: !user.isActive });
  };

  const openEdit = (user: User) => {
    setEditUser(user);
    setEditForm({ name: user.name, email: user.email, role: user.role });
    setEditOpen(true);
  };

  const handleEdit = () => {
    if (!editUser) return;
    editMutation.mutate({ id: editUser.id, ...editForm });
  };

  const handleAddUser = () => {
    addMutation.mutate(addForm);
  };

  const handleDelete = () => {
    if (!deleteConfirm.user) return;
    deleteMutation.mutate(deleteConfirm.user.id);
  };

  const openDetail = (user: User) => {
    setDetailUser(user);
    setDetailOpen(true);
  };

  const columns: Column<User>[] = [
    {
      key: "name",
      header: "Name",
      render: (item) => <span className="font-medium">{item.name}</span>,
    },
    { key: "email", header: "Email" },
    { key: "phone", header: "Phone" },
    {
      key: "role",
      header: "Role",
      render: (item) => (
        <Badge variant={roleBadgeVariant[item.role] || "secondary"}>
          {item.role.replace("_", " ")}
        </Badge>
      ),
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
            <UserCog className="h-4 w-4" />
          </Button>
          <Button variant="ghost" size="sm" onClick={() => handleToggleStatus(item)}>
            {item.isActive ? (
              <ToggleRight className="h-4 w-4 text-emerald-500" />
            ) : (
              <ToggleLeft className="h-4 w-4 text-muted-foreground" />
            )}
          </Button>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setDeleteConfirm({ open: true, user: item })}
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
        title="Failed to load users"
        description="There was an error fetching users from the server."
        action={{ label: "Retry", onClick: () => refetch() }}
      />
    );
  }

  return (
    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
      <PageHeader
        title="Users Management"
        subtitle="Manage all registered users on Volks & David"
        action={
          <Button onClick={() => setAddOpen(true)}>
            <Plus className="h-4 w-4 mr-2" /> Add User
          </Button>
        }
      />

      <Card className="mb-6 shadow-sm rounded-xl border-border/60">
        <CardContent className="pt-6">
          <div className="flex items-center gap-2 mb-4">
            <Filter className="h-4 w-4 text-muted-foreground" />
            <span className="text-sm font-medium">Filter Users</span>
          </div>
          <div className="flex flex-wrap gap-4">
            <div className="relative flex-1 min-w-[200px]">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search by name, email, or phone..."
                className="pl-9 rounded-lg"
                value={search}
                onChange={(e) => {
                  setSearch(e.target.value);
                  setPage(1);
                }}
              />
            </div>
            <div className="space-y-1.5 min-w-[140px]">
              <Label>Role</Label>
              <select
                className="flex h-10 w-full rounded-lg border border-input bg-background px-3 py-2 text-sm"
                value={filters.role}
                onChange={(e) => {
                  setFilters((p) => ({ ...p, role: e.target.value }));
                  setPage(1);
                }}
              >
                <option value="">All Roles</option>
                {roles.map((r) => (
                  <option key={r.value} value={r.value}>
                    {r.label}
                  </option>
                ))}
              </select>
            </div>
            <div className="space-y-1.5 min-w-[140px]">
              <Label>Status</Label>
              <select
                className="flex h-10 w-full rounded-lg border border-input bg-background px-3 py-2 text-sm"
                value={filters.status}
                onChange={(e) => {
                  setFilters((p) => ({ ...p, status: e.target.value }));
                  setPage(1);
                }}
              >
                <option value="">All Status</option>
                <option value="ACTIVE">Active</option>
                <option value="INACTIVE">Inactive</option>
              </select>
            </div>
            <div className="flex items-end">
              <ExportButton
                data={users.map((u) => ({
                  name: u.name,
                  email: u.email,
                  phone: u.phone,
                  role: u.role,
                  status: u.isActive ? "Active" : "Inactive",
                  joined: formatDate(u.createdAt),
                }))}
                filename="users.csv"
                columns={[
                  { key: "name", label: "Name" },
                  { key: "email", label: "Email" },
                  { key: "phone", label: "Phone" },
                  { key: "role", label: "Role" },
                  { key: "status", label: "Status" },
                  { key: "joined", label: "Joined" },
                ]}
              />
            </div>
          </div>
        </CardContent>
      </Card>

      <div className="rounded-xl shadow-sm border border-border/60 overflow-hidden bg-card">
        <DataTable
          columns={columns}
          data={users}
          keyExtractor={(item) => item.id}
          pagination={pagination}
          onPageChange={setPage}
          emptyTitle="No users found"
          emptyDescription="Try adjusting your search or filters."
        />
      </div>

      <Dialog open={addOpen} onOpenChange={setAddOpen}>
        <DialogContent className="sm:max-w-md rounded-xl">
          <DialogHeader>
            <DialogTitle>Add New User</DialogTitle>
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
            <div className="space-y-1.5">
              <Label>Role</Label>
              <select
                className="flex h-10 w-full rounded-lg border border-input bg-background px-3 py-2 text-sm"
                value={addForm.role}
                onChange={(e) =>
                  setAddForm((p) => ({ ...p, role: e.target.value as AddUserForm["role"] }))
                }
              >
                <option value="USER">User</option>
                <option value="CONSULTANT">Consultant</option>
                <option value="ADMIN">Admin</option>
              </select>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setAddOpen(false)}>
              Cancel
            </Button>
            <Button
              onClick={handleAddUser}
              disabled={!addForm.name || !addForm.email || !addForm.password}
            >
              Create User
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <Dialog open={editOpen} onOpenChange={setEditOpen}>
        <DialogContent className="sm:max-w-md rounded-xl">
          <DialogHeader>
            <DialogTitle>Edit User - {editUser?.name}</DialogTitle>
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
              <Label>Role</Label>
              <select
                className="flex h-10 w-full rounded-lg border border-input bg-background px-3 py-2 text-sm"
                value={editForm.role}
                onChange={(e) =>
                  setEditForm((p) => ({ ...p, role: e.target.value as EditUserForm["role"] }))
                }
              >
                {roles.map((r) => (
                  <option key={r.value} value={r.value}>
                    {r.label}
                  </option>
                ))}
              </select>
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
        <DialogContent className="sm:max-w-2xl rounded-xl">
          <DialogHeader>
            <DialogTitle>User Details</DialogTitle>
          </DialogHeader>
          {detailUser && (
            <div className="space-y-6">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 p-4 rounded-lg bg-muted/30">
                <div className="flex items-center gap-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary/10">
                    <Mail className="h-4 w-4 text-primary" />
                  </div>
                  <div>
                    <p className="text-xs text-muted-foreground">Email</p>
                    <p className="text-sm font-medium">{detailUser.email}</p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary/10">
                    <Phone className="h-4 w-4 text-primary" />
                  </div>
                  <div>
                    <p className="text-xs text-muted-foreground">Phone</p>
                    <p className="text-sm font-medium">{detailUser.phone || "Not provided"}</p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary/10">
                    <Calendar className="h-4 w-4 text-primary" />
                  </div>
                  <div>
                    <p className="text-xs text-muted-foreground">Joined</p>
                    <p className="text-sm font-medium">{formatDate(detailUser.createdAt)}</p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary/10">
                    <Shield className="h-4 w-4 text-primary" />
                  </div>
                  <div>
                    <p className="text-xs text-muted-foreground">Role</p>
                    <Badge variant={roleBadgeVariant[detailUser.role] || "secondary"}>
                      {detailUser.role.replace("_", " ")}
                    </Badge>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary/10">
                    <Activity className="h-4 w-4 text-primary" />
                  </div>
                  <div>
                    <p className="text-xs text-muted-foreground">Status</p>
                    <StatusBadge status={detailUser.isActive ? "ACTIVE" : "INACTIVE"} />
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary/10">
                    <UserCog className="h-4 w-4 text-primary" />
                  </div>
                  <div>
                    <p className="text-xs text-muted-foreground">User ID</p>
                    <p className="text-xs font-mono text-muted-foreground">{detailUser.id}</p>
                  </div>
                </div>
              </div>

              <div>
                <h4 className="text-sm font-semibold mb-3 flex items-center gap-2">
                  Tax Returns
                  {detailReturns && (
                    <Badge variant="secondary" className="text-xs">
                      {detailReturns.length}
                    </Badge>
                  )}
                </h4>
                {!detailReturns ? (
                  <LoadingSpinner size="sm" />
                ) : detailReturns.length === 0 ? (
                  <p className="text-sm text-muted-foreground py-3 text-center bg-muted/20 rounded-lg">
                    No tax returns found
                  </p>
                ) : (
                  <div className="overflow-x-auto rounded-lg border border-border/60">
                    <table className="w-full text-sm">
                      <thead>
                        <tr className="border-b border-border/60 bg-muted/30">
                          <th className="px-3 py-2 text-left text-xs font-medium text-muted-foreground">Year</th>
                          <th className="px-3 py-2 text-left text-xs font-medium text-muted-foreground">Type</th>
                          <th className="px-3 py-2 text-left text-xs font-medium text-muted-foreground">Income</th>
                          <th className="px-3 py-2 text-left text-xs font-medium text-muted-foreground">Status</th>
                          <th className="px-3 py-2 text-left text-xs font-medium text-muted-foreground">Submitted</th>
                        </tr>
                      </thead>
                      <tbody>
                        {detailReturns.map((tr) => (
                          <tr key={tr.id} className="border-b border-border/40 last:border-0 hover:bg-muted/20 transition-colors">
                            <td className="px-3 py-2">{tr.taxYear}</td>
                            <td className="px-3 py-2">{tr.returnType}</td>
                            <td className="px-3 py-2 font-medium">{formatPKR(tr.income)}</td>
                            <td className="px-3 py-2"><StatusBadge status={tr.status} /></td>
                            <td className="px-3 py-2 text-muted-foreground">{formatDate(tr.submittedAt)}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                )}
              </div>

              <div>
                <h4 className="text-sm font-semibold mb-3 flex items-center gap-2">
                  Payments
                  {detailPayments && (
                    <Badge variant="secondary" className="text-xs">
                      {detailPayments.length}
                    </Badge>
                  )}
                </h4>
                {!detailPayments ? (
                  <LoadingSpinner size="sm" />
                ) : detailPayments.length === 0 ? (
                  <p className="text-sm text-muted-foreground py-3 text-center bg-muted/20 rounded-lg">
                    No payments found
                  </p>
                ) : (
                  <div className="overflow-x-auto rounded-lg border border-border/60">
                    <table className="w-full text-sm">
                      <thead>
                        <tr className="border-b border-border/60 bg-muted/30">
                          <th className="px-3 py-2 text-left text-xs font-medium text-muted-foreground">Service</th>
                          <th className="px-3 py-2 text-left text-xs font-medium text-muted-foreground">Amount</th>
                          <th className="px-3 py-2 text-left text-xs font-medium text-muted-foreground">Method</th>
                          <th className="px-3 py-2 text-left text-xs font-medium text-muted-foreground">Status</th>
                          <th className="px-3 py-2 text-left text-xs font-medium text-muted-foreground">Date</th>
                        </tr>
                      </thead>
                      <tbody>
                        {detailPayments.map((p) => (
                          <tr key={p.id} className="border-b border-border/40 last:border-0 hover:bg-muted/20 transition-colors">
                            <td className="px-3 py-2">{p.service}</td>
                            <td className="px-3 py-2 font-medium">{formatPKR(p.amount)}</td>
                            <td className="px-3 py-2">{p.method}</td>
                            <td className="px-3 py-2"><StatusBadge status={p.status} /></td>
                            <td className="px-3 py-2 text-muted-foreground">{formatDate(p.date)}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                )}
              </div>

              <div>
                <h4 className="text-sm font-semibold mb-3 flex items-center gap-2">
                  NTN Registrations
                  {detailNtn && <Badge variant="secondary" className="text-xs">{detailNtn.length}</Badge>}
                </h4>
                {!detailNtn ? <LoadingSpinner size="sm" />
                : detailNtn.length === 0 ? <p className="text-sm text-muted-foreground py-3 text-center bg-muted/20 rounded-lg">No NTN registrations</p>
                : <div className="overflow-x-auto rounded-lg border border-border/60">
                    <table className="w-full text-sm">
                      <thead><tr className="border-b border-border/60 bg-muted/30">
                        <th className="px-3 py-2 text-left text-xs font-medium text-muted-foreground">Name</th>
                        <th className="px-3 py-2 text-left text-xs font-medium text-muted-foreground">Type</th>
                        <th className="px-3 py-2 text-left text-xs font-medium text-muted-foreground">NTN #</th>
                        <th className="px-3 py-2 text-left text-xs font-medium text-muted-foreground">Status</th>
                      </tr></thead>
                      <tbody>{detailNtn.map((r: any) => (
                        <tr key={r.id} className="border-b border-border/40 hover:bg-muted/20"><td className="px-3 py-2">{r.fullName}</td><td className="px-3 py-2">{r.ntnType}</td><td className="px-3 py-2">{r.ntnNumber || "-"}</td><td className="px-3 py-2"><StatusBadge status={r.status} /></td></tr>
                      ))}</tbody>
                    </table>
                  </div>}
              </div>

              <div>
                <h4 className="text-sm font-semibold mb-3 flex items-center gap-2">
                  GST Registrations
                  {detailGst && <Badge variant="secondary" className="text-xs">{detailGst.length}</Badge>}
                </h4>
                {!detailGst ? <LoadingSpinner size="sm" />
                : detailGst.length === 0 ? <p className="text-sm text-muted-foreground py-3 text-center bg-muted/20 rounded-lg">No GST registrations</p>
                : <div className="overflow-x-auto rounded-lg border border-border/60">
                    <table className="w-full text-sm">
                      <thead><tr className="border-b border-border/60 bg-muted/30">
                        <th className="px-3 py-2 text-left text-xs font-medium text-muted-foreground">Business</th>
                        <th className="px-3 py-2 text-left text-xs font-medium text-muted-foreground">STRN</th>
                        <th className="px-3 py-2 text-left text-xs font-medium text-muted-foreground">Status</th>
                      </tr></thead>
                      <tbody>{detailGst.map((r: any) => (
                        <tr key={r.id} className="border-b border-border/40 hover:bg-muted/20"><td className="px-3 py-2">{r.businessName}</td><td className="px-3 py-2">{r.strn || "-"}</td><td className="px-3 py-2"><StatusBadge status={r.status} /></td></tr>
                      ))}</tbody>
                    </table>
                  </div>}
              </div>

              <div>
                <h4 className="text-sm font-semibold mb-3 flex items-center gap-2">
                  SECP Registrations
                  {detailSecp && <Badge variant="secondary" className="text-xs">{detailSecp.length}</Badge>}
                </h4>
                {!detailSecp ? <LoadingSpinner size="sm" />
                : detailSecp.length === 0 ? <p className="text-sm text-muted-foreground py-3 text-center bg-muted/20 rounded-lg">No SECP registrations</p>
                : <div className="overflow-x-auto rounded-lg border border-border/60">
                    <table className="w-full text-sm">
                      <thead><tr className="border-b border-border/60 bg-muted/30">
                        <th className="px-3 py-2 text-left text-xs font-medium text-muted-foreground">Type</th>
                        <th className="px-3 py-2 text-left text-xs font-medium text-muted-foreground">Status</th>
                        <th className="px-3 py-2 text-left text-xs font-medium text-muted-foreground">Ref #</th>
                      </tr></thead>
                      <tbody>{detailSecp.map((r: any) => (
                        <tr key={r.id} className="border-b border-border/40 hover:bg-muted/20"><td className="px-3 py-2">{r.companyType}</td><td className="px-3 py-2"><StatusBadge status={r.status} /></td><td className="px-3 py-2 font-mono text-xs">{r.secpRefNumber || "-"}</td></tr>
                      ))}</tbody>
                    </table>
                  </div>}
              </div>

              <div>
                <h4 className="text-sm font-semibold mb-3 flex items-center gap-2">
                  IP Registrations
                  {detailIp && <Badge variant="secondary" className="text-xs">{detailIp.length}</Badge>}
                </h4>
                {!detailIp ? <LoadingSpinner size="sm" />
                : detailIp.length === 0 ? <p className="text-sm text-muted-foreground py-3 text-center bg-muted/20 rounded-lg">No IP registrations</p>
                : <div className="overflow-x-auto rounded-lg border border-border/60">
                    <table className="w-full text-sm">
                      <thead><tr className="border-b border-border/60 bg-muted/30">
                        <th className="px-3 py-2 text-left text-xs font-medium text-muted-foreground">Type</th>
                        <th className="px-3 py-2 text-left text-xs font-medium text-muted-foreground">Status</th>
                        <th className="px-3 py-2 text-left text-xs font-medium text-muted-foreground">Ref #</th>
                      </tr></thead>
                      <tbody>{detailIp.map((r: any) => (
                        <tr key={r.id} className="border-b border-border/40 hover:bg-muted/20"><td className="px-3 py-2">{r.type}</td><td className="px-3 py-2"><StatusBadge status={r.status} /></td><td className="px-3 py-2 font-mono text-xs">{r.refNumber || "-"}</td></tr>
                      ))}</tbody>
                    </table>
                  </div>}
              </div>

              <div>
                <h4 className="text-sm font-semibold mb-3 flex items-center gap-2">
                  Consultations
                  {detailConsultations && <Badge variant="secondary" className="text-xs">{detailConsultations.length}</Badge>}
                </h4>
                {!detailConsultations ? <LoadingSpinner size="sm" />
                : detailConsultations.length === 0 ? <p className="text-sm text-muted-foreground py-3 text-center bg-muted/20 rounded-lg">No consultations</p>
                : <div className="overflow-x-auto rounded-lg border border-border/60">
                    <table className="w-full text-sm">
                      <thead><tr className="border-b border-border/60 bg-muted/30">
                        <th className="px-3 py-2 text-left text-xs font-medium text-muted-foreground">Type</th>
                        <th className="px-3 py-2 text-left text-xs font-medium text-muted-foreground">Subject</th>
                        <th className="px-3 py-2 text-left text-xs font-medium text-muted-foreground">Status</th>
                      </tr></thead>
                      <tbody>{detailConsultations.map((r: any) => (
                        <tr key={r.id} className="border-b border-border/40 hover:bg-muted/20"><td className="px-3 py-2">{r.type}</td><td className="px-3 py-2">{r.subject || "-"}</td><td className="px-3 py-2"><StatusBadge status={r.status} /></td></tr>
                      ))}</tbody>
                    </table>
                  </div>}
              </div>

              <div>
                <h4 className="text-sm font-semibold mb-3 flex items-center gap-2">
                  Documents
                  {detailUserDocuments && <Badge variant="secondary" className="text-xs">{detailUserDocuments.length}</Badge>}
                </h4>
                {!detailUserDocuments ? <LoadingSpinner size="sm" />
                : detailUserDocuments.length === 0 ? <p className="text-sm text-muted-foreground py-3 text-center bg-muted/20 rounded-lg">No documents</p>
                : <div className="overflow-x-auto rounded-lg border border-border/60">
                    <table className="w-full text-sm">
                      <thead><tr className="border-b border-border/60 bg-muted/30">
                        <th className="px-3 py-2 text-left text-xs font-medium text-muted-foreground">Name</th>
                        <th className="px-3 py-2 text-left text-xs font-medium text-muted-foreground">Type</th>
                      </tr></thead>
                      <tbody>{detailUserDocuments.map((r: any) => (
                        <tr key={r.id} className="border-b border-border/40 hover:bg-muted/20"><td className="px-3 py-2">{r.name}</td><td className="px-3 py-2">{r.type || "-"}</td></tr>
                      ))}</tbody>
                    </table>
                  </div>}
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
        title="Delete User"
        description={`Are you sure you want to delete ${deleteConfirm.user?.name}? This action cannot be undone.`}
        confirmLabel="Delete"
        variant="destructive"
        onConfirm={handleDelete}
      />
    </motion.div>
  );
}
