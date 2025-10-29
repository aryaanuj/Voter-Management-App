"use client";

import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Plus, Search, Edit2, Trash2, X, Loader2, Filter, MapPin } from "lucide-react";
import { useUsers, useCreateUser, useUpdateUser, useDeleteUser } from "@/lib/hooks";
import { User, UserRole, RegisterRequest } from "@/lib/types";
import { toast } from "sonner";
import { AssignConstituencyModal } from "./assign-constituency-modal";

export function UserManagementTab() {
    const [searchTerm, setSearchTerm] = useState("");
    const [showAddModal, setShowAddModal] = useState(false);
    const [editingUser, setEditingUser] = useState<User | null>(null);
    const [showDeleteModal, setShowDeleteModal] = useState(false);
    const [userToDelete, setUserToDelete] = useState<User | null>(null);
    const [roleFilter, setRoleFilter] = useState<string>("all");
    const [statusFilter, setStatusFilter] = useState<string>("all");
    const [showAssignModal, setShowAssignModal] = useState(false);
    const [userToAssign, setUserToAssign] = useState<User | null>(null);
    const [formData, setFormData] = useState<RegisterRequest>({
        name: "",
        mobile: "",
        role: UserRole.BOOTH_MANAGER,
        email: "",
        isActive: true,
    });

    // API hooks
    const { data: usersData, isLoading, refetch } = useUsers({ page: 1, limit: 100 });
    const { mutate: createUser, isPending: isCreating } = useCreateUser();
    const { mutate: updateUser, isPending: isUpdating } = useUpdateUser();
    const { mutate: deleteUser, isPending: isDeleting } = useDeleteUser();

    const users = usersData?.data || [];
    const totalUsers = usersData?.meta?.total || 0;

    const filteredUsers = users.filter((user) => {
        const matchesSearch =
            user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
            user.mobile.includes(searchTerm) ||
            user.role.toLowerCase().includes(searchTerm.toLowerCase()) ||
            (user.email && user.email.toLowerCase().includes(searchTerm.toLowerCase()));

        const matchesRole = roleFilter === "all" || user.role === roleFilter;
        const matchesStatus = statusFilter === "all" || (statusFilter === "active" && user.isActive) || (statusFilter === "inactive" && !user.isActive);

        return matchesSearch && matchesRole && matchesStatus;
    });

    const handleAddUser = () => {
        if (formData.name && formData.mobile) {
            createUser(formData, {
                onSuccess: () => {
                    toast.success("User created successfully");
                    setFormData({ name: "", mobile: "", role: UserRole.BOOTH_MANAGER, email: "", isActive: true });
                    setShowAddModal(false);
                    refetch();
                },
                onError: (error: any) => {
                    toast.error(error.response?.data?.message || "Failed to create user");
                },
            });
        }
    };

    const handleEditUser = (user: User) => {
        setEditingUser(user);
        setFormData({
            name: user.name,
            mobile: user.mobile,
            role: user.role,
            email: user.email || "",
            isActive: user.isActive,
        });
        setShowAddModal(true);
    };

    const handleUpdateUser = () => {
        if (editingUser && formData.name && formData.mobile) {
            updateUser(
                { id: editingUser.id, data: formData },
                {
                    onSuccess: () => {
                        toast.success("User updated successfully");
                        setEditingUser(null);
                        setFormData({ name: "", mobile: "", role: UserRole.BOOTH_MANAGER, email: "", isActive: true });
                        setShowAddModal(false);
                        refetch();
                    },
                    onError: (error: any) => {
                        toast.error(error.response?.data?.message || "Failed to update user");
                    },
                }
            );
        }
    };

    const handleDeleteUser = (user: User) => {
        setUserToDelete(user);
        setShowDeleteModal(true);
    };

    const confirmDeleteUser = () => {
        if (userToDelete) {
            deleteUser(userToDelete.id, {
                onSuccess: () => {
                    toast.success("User deleted successfully");
                    refetch();
                    setShowDeleteModal(false);
                    setUserToDelete(null);
                },
                onError: (error: any) => {
                    toast.error(error.response?.data?.message || "Failed to delete user");
                },
            });
        }
    };

    const cancelDeleteUser = () => {
        setShowDeleteModal(false);
        setUserToDelete(null);
    };

    const handleAssignConstituency = (user: User) => {
        if (user.role !== UserRole.CANDIDATE) {
            toast.error("Only candidate users can have constituencies assigned");
            return;
        }
        setUserToAssign(user);
        setShowAssignModal(true);
    };

    const handleCloseModal = () => {
        setShowAddModal(false);
        setEditingUser(null);
        setFormData({ name: "", mobile: "", role: UserRole.BOOTH_MANAGER, email: "", isActive: true });
    };

    const getRoleDisplayName = (role: UserRole) => {
        switch (role) {
            case UserRole.ADMIN:
                return "Admin";
            case UserRole.CANDIDATE:
                return "Candidate";
            case UserRole.BOOTH_MANAGER:
                return "Booth Manager";
            default:
                return role;
        }
    };

    if (isLoading) {
        return (
            <div className="flex items-center justify-center py-8">
                <Loader2 className="h-8 w-8 animate-spin" />
            </div>
        );
    }

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <div>
                    <h2 className="text-2xl font-bold">User Management</h2>
                    <p className="text-sm text-muted-foreground mt-1">{totalUsers} Total Users</p>
                </div>
                <Button onClick={() => setShowAddModal(true)} className="bg-gradient-to-r from-violet-600 to-violet-700 hover:from-violet-700 hover:to-violet-800 text-white">
                    <Plus className="h-4 w-4 mr-2" />
                    Add User
                </Button>
            </div>

            {/* Search and Filters */}
            <div className="space-y-4">
                {/* Search Bar */}
                <div className="relative">
                    <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                    <Input placeholder="Search by name, phone, or role..." className="pl-10" value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} />
                </div>

                {/* Filters */}
                <div className="flex flex-wrap gap-4">
                    <div className="flex items-center gap-2">
                        <Filter className="h-4 w-4 text-muted-foreground" />
                        <span className="text-sm font-medium text-muted-foreground">Filters:</span>
                    </div>

                    <div className="flex flex-wrap gap-3">
                        <Select value={roleFilter} onValueChange={setRoleFilter}>
                            <SelectTrigger className="w-[140px]">
                                <SelectValue placeholder="Role" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="all">All Roles</SelectItem>
                                <SelectItem value={UserRole.ADMIN}>Admin</SelectItem>
                                <SelectItem value={UserRole.CANDIDATE}>Candidate</SelectItem>
                                <SelectItem value={UserRole.BOOTH_MANAGER}>Booth Manager</SelectItem>
                            </SelectContent>
                        </Select>

                        <Select value={statusFilter} onValueChange={setStatusFilter}>
                            <SelectTrigger className="w-[140px]">
                                <SelectValue placeholder="Status" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="all">All Status</SelectItem>
                                <SelectItem value="active">Active</SelectItem>
                                <SelectItem value="inactive">Inactive</SelectItem>
                            </SelectContent>
                        </Select>
                    </div>
                </div>
            </div>

            {/* User Cards Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {filteredUsers.map((user) => (
                    <Card key={user.id} className="hover:shadow-lg transition-shadow">
                        <CardContent className="pt-6">
                            <div className="space-y-4">
                                <div>
                                    <h3 className="font-bold text-lg text-gray-900">{user.name}</h3>
                                    <p className="text-sm text-muted-foreground">{user.mobile}</p>
                                    {user.email && <p className="text-sm text-muted-foreground">{user.email}</p>}
                                </div>

                                <div className="flex items-center justify-between">
                                    <div>
                                        <p className="text-xs text-muted-foreground">Role</p>
                                        <p className="text-sm font-medium">{getRoleDisplayName(user.role)}</p>
                                    </div>
                                    <div>
                                        <p className="text-xs text-muted-foreground">Status</p>
                                        <span className={`inline-block px-3 py-1 rounded-full text-xs font-medium ${user.isActive ? "bg-green-100 text-green-700" : "bg-gray-100 text-gray-700"}`}>
                                            {user.isActive ? "Active" : "Inactive"}
                                        </span>
                                    </div>
                                </div>

                                {/* Assigned Constituency Info for Candidates */}
                                {user.role === UserRole.CANDIDATE && user.candidateProfile?.assemblyConstituencies && (user.candidateProfile.assemblyConstituencies as any[]).length > 0 && (
                                    <div className="bg-violet-50 border border-violet-200 rounded-lg p-3 space-y-2">
                                        <div className="flex items-center gap-2">
                                            <MapPin className="h-4 w-4 text-violet-600 shrink-0" />
                                            <p className="text-xs font-semibold text-violet-900">Assigned Constituencies ({(user.candidateProfile.assemblyConstituencies as any[]).length})</p>
                                        </div>
                                        {(user.candidateProfile.assemblyConstituencies as any[]).slice(0, 2).map((cc: any, index: number) => {
                                            const ac = cc.assemblyConstituency;
                                            return (
                                                <div key={index} className="pl-6 space-y-0.5">
                                                    <p className="text-sm font-medium text-gray-900">{ac.name}</p>
                                                    <p className="text-xs text-gray-600">{ac.district.name} District</p>
                                                </div>
                                            );
                                        })}
                                        {(user.candidateProfile.assemblyConstituencies as any[]).length > 2 && (
                                            <p className="text-xs text-gray-500 pl-6">+{(user.candidateProfile.assemblyConstituencies as any[]).length - 2} more</p>
                                        )}
                                    </div>
                                )}

                                {/* Polling Station Info for Booth Managers */}
                                {user.role === UserRole.BOOTH_MANAGER && user.boothManagerProfile?.pollingStation && (
                                    <div className="bg-blue-50 border border-blue-200 rounded-lg p-3 space-y-1.5">
                                        <div className="flex items-center gap-2">
                                            <MapPin className="h-4 w-4 text-blue-600 flex-shrink-0" />
                                            <p className="text-xs font-semibold text-blue-900">Assigned Polling Station</p>
                                        </div>
                                        <p className="text-sm font-medium text-gray-900 pl-6">{user.boothManagerProfile.pollingStation.name}</p>
                                        <p className="text-xs text-gray-600 pl-6">Station #{user.boothManagerProfile.pollingStation.number}</p>
                                    </div>
                                )}

                                <div className="flex flex-col gap-2 pt-2 border-t">
                                    {user.role === UserRole.CANDIDATE && (
                                        <Button
                                            onClick={() => handleAssignConstituency(user)}
                                            variant="outline"
                                            size="sm"
                                            className="w-full text-blue-600 border-blue-200 hover:bg-blue-50"
                                            disabled={isUpdating || isDeleting}
                                        >
                                            <MapPin className="h-4 w-4 mr-2" />
                                            Assign Constituency
                                        </Button>
                                    )}
                                    <div className="flex gap-2">
                                        <Button
                                            onClick={() => handleEditUser(user)}
                                            variant="outline"
                                            size="sm"
                                            className="flex-1 text-violet-600 border-violet-200 hover:bg-violet-50"
                                            disabled={isUpdating || isDeleting}
                                        >
                                            <Edit2 className="h-4 w-4 mr-2" />
                                            Edit
                                        </Button>
                                        <Button
                                            onClick={() => handleDeleteUser(user)}
                                            variant="outline"
                                            size="sm"
                                            className="flex-1 text-red-600 border-red-200 hover:bg-red-50"
                                            disabled={isUpdating || isDeleting}
                                        >
                                            <Trash2 className="h-4 w-4 mr-2" />
                                            Delete
                                        </Button>
                                    </div>
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                ))}
            </div>

            {/* Add/Edit User Modal */}
            {showAddModal && (
                <div className="fixed inset-0 bg-black/50 flex items-end z-50">
                    <div className="bg-white w-full rounded-t-3xl p-6 max-h-[90vh] overflow-y-auto">
                        <div className="flex items-center justify-between mb-6">
                            <h2 className="text-2xl font-bold">{editingUser ? "Edit User" : "Add New User"}</h2>
                            <Button variant="ghost" size="icon" onClick={handleCloseModal}>
                                <X className="h-6 w-6" />
                            </Button>
                        </div>

                        <div className="space-y-4">
                            <div>
                                <label className="block text-sm font-medium mb-2">Full Name</label>
                                <Input placeholder="Enter full name" value={formData.name} onChange={(e) => setFormData({ ...formData, name: e.target.value })} />
                            </div>

                            <div>
                                <label className="block text-sm font-medium mb-2">Mobile Number</label>
                                <Input placeholder="Enter mobile number" maxLength={10} value={formData.mobile} onChange={(e) => setFormData({ ...formData, mobile: e.target.value })} />
                            </div>

                            <div>
                                <label className="block text-sm font-medium mb-2">Email Address (Optional)</label>
                                <Input placeholder="Enter email address" value={formData.email} onChange={(e) => setFormData({ ...formData, email: e.target.value })} />
                            </div>

                            {/* Role Section */}
                            <div className="space-y-2">
                                <label className="text-sm font-semibold text-gray-900">Role</label>
                                <div className="flex flex-wrap gap-1.5">
                                    {[UserRole.ADMIN, UserRole.CANDIDATE].map((role) => (
                                        <button
                                            key={role}
                                            type="button"
                                            onClick={() => setFormData({ ...formData, role })}
                                            className={`px-3 py-1.5 rounded-md font-medium text-xs transition ${
                                                formData.role === role ? "border-2 border-violet-600 text-violet-600 bg-white" : "border border-gray-300 text-gray-600 bg-gray-50 hover:bg-gray-100"
                                            }`}
                                        >
                                            {getRoleDisplayName(role)}
                                        </button>
                                    ))}
                                </div>
                            </div>

                            {/* Status Section */}
                            <div className="space-y-2">
                                <label className="text-sm font-semibold text-gray-900">Status</label>
                                <div className="flex flex-wrap gap-1.5">
                                    {[
                                        { value: true, label: "Active" },
                                        { value: false, label: "Inactive" },
                                    ].map((status) => (
                                        <button
                                            key={status.label}
                                            type="button"
                                            onClick={() => setFormData({ ...formData, isActive: status.value })}
                                            className={`px-3 py-1.5 rounded-md font-medium text-xs transition ${
                                                formData.isActive === status.value
                                                    ? "border-2 border-violet-600 text-violet-600 bg-white"
                                                    : "border border-gray-300 text-gray-600 bg-gray-50 hover:bg-gray-100"
                                            }`}
                                        >
                                            {status.label}
                                        </button>
                                    ))}
                                </div>
                            </div>

                            <div className="flex gap-3 pt-6">
                                <Button onClick={handleCloseModal} variant="outline" className="h-14 flex-1 bg-transparent" disabled={isCreating || isUpdating}>
                                    Cancel
                                </Button>
                                <Button
                                    onClick={editingUser ? handleUpdateUser : handleAddUser}
                                    className="flex-1 h-14 bg-gradient-to-r from-violet-600 to-violet-700 hover:from-violet-700 hover:to-violet-800 text-white"
                                    disabled={isCreating || isUpdating || !formData.name || !formData.mobile}
                                >
                                    {isCreating || isUpdating ? (
                                        <>
                                            <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                                            {isCreating ? "Creating..." : "Updating..."}
                                        </>
                                    ) : editingUser ? (
                                        "Update User"
                                    ) : (
                                        "Add User"
                                    )}
                                </Button>
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {/* Delete Confirmation Modal */}
            {showDeleteModal && userToDelete && (
                <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
                    <div className="bg-white rounded-2xl p-6 w-full max-w-md shadow-xl">
                        <div className="flex items-center gap-3 mb-4">
                            <div className="w-10 h-10 bg-red-100 rounded-full flex items-center justify-center">
                                <Trash2 className="h-5 w-5 text-red-600" />
                            </div>
                            <div>
                                <h3 className="text-lg font-semibold text-gray-900">Delete User</h3>
                                <p className="text-sm text-gray-500">This action cannot be undone</p>
                            </div>
                        </div>

                        <div className="mb-6">
                            <p className="text-gray-700 mb-2">
                                Are you sure you want to delete <span className="font-semibold">{userToDelete.name}</span>?
                            </p>
                            <div className="bg-gray-50 rounded-lg p-3 text-sm text-gray-600">
                                <p>
                                    <span className="font-medium">Role:</span> {getRoleDisplayName(userToDelete.role)}
                                </p>
                                <p>
                                    <span className="font-medium">Mobile:</span> {userToDelete.mobile}
                                </p>
                                {userToDelete.email && (
                                    <p>
                                        <span className="font-medium">Email:</span> {userToDelete.email}
                                    </p>
                                )}
                            </div>
                        </div>

                        <div className="flex gap-3">
                            <Button onClick={cancelDeleteUser} variant="outline" className="flex-1 bg-transparent" disabled={isDeleting}>
                                Cancel
                            </Button>
                            <Button onClick={confirmDeleteUser} className="flex-1 bg-red-600 hover:bg-red-700 text-white" disabled={isDeleting}>
                                {isDeleting ? (
                                    <>
                                        <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                                        Deleting...
                                    </>
                                ) : (
                                    <>
                                        <Trash2 className="h-4 w-4 mr-2" />
                                        Delete User
                                    </>
                                )}
                            </Button>
                        </div>
                    </div>
                </div>
            )}

            {/* Assign Constituency Modal */}
            {userToAssign && (
                <AssignConstituencyModal
                    userId={userToAssign.id}
                    userName={userToAssign.name}
                    isOpen={showAssignModal}
                    onClose={() => {
                        setShowAssignModal(false);
                        setUserToAssign(null);
                    }}
                    onSuccess={() => {
                        refetch();
                    }}
                    assignedConstituencies={(() => {
                        const constituencies = userToAssign.candidateProfile?.assemblyConstituencies?.map((cc: any) => cc.assemblyConstituency) || [];
                        console.log("Passing assigned constituencies to modal:", constituencies);
                        return constituencies;
                    })()}
                />
            )}
        </div>
    );
}
