"use client";

import React, { useEffect, useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Loader2, Search, Plus } from "lucide-react";
import { getRequest, postRequest, putRequest } from "@/utils/apiUtils";
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { useNotification } from "@/context/NotificationContext";

interface User {
    id: number;
    name: string;
    email: string;
    company_name: string;
    flows_count: number;
}

export default function Users() {
    const { showSuccess, showError, showWarning } = useNotification();
    const [users, setUsers] = useState<User[]>([]);
    const [loading, setLoading] = useState(true);
    const [search, setSearch] = useState("");
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingUser, setEditingUser] = useState<User | null>(null);
    const [formData, setFormData] = useState({
        name: "",
        email: "",
        password: "",
    });
    const [saving, setSaving] = useState(false);

    // ✅ Fetch users
    const fetchUsers = async () => {
        setLoading(true);
        try {
            const res: any = await getRequest("/api/company/users", true);
            if (res && res.users) {
                setUsers(res.users);
            } else {
                showWarning("No users found for this company.");
            }
        } catch (error) {
            console.error("Failed to load users", error);
            showError("Failed to load users. Please try again later.");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchUsers();
    }, []);

    const filteredUsers = users.filter(
        (user) =>
            user.name.toLowerCase().includes(search.toLowerCase()) ||
            user.email.toLowerCase().includes(search.toLowerCase()) ||
            user.company_name.toLowerCase().includes(search.toLowerCase())
    );

    const handleOpenModal = (user?: User) => {
        if (user) {
            setEditingUser(user);
            setFormData({ name: user.name, email: user.email, password: "" });
        } else {
            setEditingUser(null);
            setFormData({ name: "", email: "", password: "" });
        }
        setIsModalOpen(true);
    };

    // ✅ Handle Save (Add/Edit)
    const handleSaveUser = async () => {
        // Frontend validation
        if (!formData.name.trim()) {
            showWarning("Name is required.");
            return;
        }
        if (!formData.email.trim()) {
            showWarning("Email is required.");
            return;
        }
        if (!editingUser && !formData.password.trim()) {
            showWarning("Password is required for new users.");
            return;
        }

        setSaving(true);
        try {
            const endpoint = editingUser
                ? `/api/users/${editingUser.id}`
                : "/api/users";
            const method = editingUser ? putRequest : postRequest;
            const res: any = await method(endpoint, formData, true);

            if (res?.success) {
                showSuccess(
                    editingUser
                        ? "User updated successfully!"
                        : "User added successfully!"
                );
                setIsModalOpen(false);
                fetchUsers();
            } else {
                // Handle structured backend error
                const message =
                    res?.message ||
                    res?.error ||
                    "Failed to save user. Please check your input.";
                showError(message);
            }
        } catch (error: any) {
            console.error("Error saving user:", error);
            const msg =
                error?.response?.data?.message ||
                error?.message ||
                "Something went wrong while saving user.";
            showError(msg);
        } finally {
            setSaving(false);
        }
    };

    return (
        <div className="mx-4 mb-4">
            {/* 🔹 Header & Search */}
            <div className="flex items-center justify-between my-4">
                <h1 className="text-2xl font-semibold tracking-tight">Users</h1>
                <div className="flex items-center space-x-2">
                    <div className="relative w-64">
                        <Search className="absolute left-3 top-2.5 h-4 w-4 opacity-50" />
                        <Input
                            placeholder="Search users..."
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                            className="pl-9"
                        />
                    </div>
                    <Button onClick={() => handleOpenModal()}>
                        <Plus className="w-4 h-4 mr-1" /> Add User
                    </Button>
                </div>
            </div>

            {/* 🔹 Users Table */}
            <Card className="rounded-2xl shadow-sm">
                <CardContent>
                    {loading ? (
                        <div className="flex justify-center py-10">
                            <Loader2 className="animate-spin w-6 h-6" />
                        </div>
                    ) : filteredUsers.length === 0 ? (
                        <div className="text-center py-10 text-sm text-muted-foreground">
                            No users found.
                        </div>
                    ) : (
                        <div className="overflow-x-auto">
                            <Table>
                                <TableHeader>
                                    <TableRow>
                                        <TableHead>#</TableHead>
                                        <TableHead>Name</TableHead>
                                        <TableHead>Email</TableHead>
                                        <TableHead className="text-center">Flows</TableHead>
                                        <TableHead>Action</TableHead>
                                    </TableRow>
                                </TableHeader>
                                <TableBody>
                                    {filteredUsers.map((user, index) => (
                                        <TableRow key={user.id}>
                                            <TableCell>{index + 1}</TableCell>
                                            <TableCell className="font-medium">{user.name}</TableCell>
                                            <TableCell>{user.email}</TableCell>
                                            <TableCell className="text-center">
                                                {user.flows_count ?? 0}
                                            </TableCell>
                                            <TableCell>
                                                <Button
                                                    variant="outline"
                                                    size="sm"
                                                    onClick={() => handleOpenModal(user)}
                                                >
                                                    Edit
                                                </Button>
                                            </TableCell>
                                        </TableRow>
                                    ))}
                                </TableBody>
                            </Table>
                        </div>
                    )}
                </CardContent>
            </Card>

            {/* 🔹 Add/Edit Modal */}
            <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>
                            {editingUser ? "Edit User" : "Add New User"}
                        </DialogTitle>
                    </DialogHeader>

                    <div className="space-y-4">
                        <div>
                            <Label>Name</Label>
                            <Input
                                value={formData.name}
                                onChange={(e) =>
                                    setFormData({ ...formData, name: e.target.value })
                                }
                            />
                        </div>
                        <div>
                            <Label>Email</Label>
                            <Input
                                type="email"
                                value={formData.email}
                                onChange={(e) =>
                                    setFormData({ ...formData, email: e.target.value })
                                }
                            />
                        </div>
                        <div>
                            <Label>Password</Label>
                            <Input
                                type="password"
                                value={formData.password}
                                placeholder={editingUser ? "(leave blank to keep current)" : ""}
                                onChange={(e) =>
                                    setFormData({ ...formData, password: e.target.value })
                                }
                            />
                        </div>

                        <Button
                            onClick={handleSaveUser}
                            disabled={saving}
                            className="w-full"
                        >
                            {saving && <Loader2 className="animate-spin w-4 h-4 mr-2" />}
                            {editingUser ? "Update User" : "Create User"}
                        </Button>
                    </div>
                </DialogContent>
            </Dialog>
        </div>
    );
}
