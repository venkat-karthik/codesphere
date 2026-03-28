"use client";

import { useState, useEffect } from "react";
import { 
    Users, 
    Search, 
    Filter, 
    MoreHorizontal, 
    UserPlus, 
    Shield, 
    Mail, 
    Calendar,
    CheckCircle2,
    XCircle,
    BadgeCheck
} from "lucide-react";
import { 
    Card, 
    CardContent, 
    CardHeader, 
    CardTitle,
    CardDescription 
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { apiFetch } from "@/lib/api";
import { toast } from "sonner";

export default function UserManagementPage() {
    const [users, setUsers] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState("");

    const fetchUsers = async () => {
        try {
            const data = await apiFetch('/admin/users');
            setUsers(Array.isArray(data) ? data : []);
        } catch {
            setUsers([
                { id: "1", name: "Venkat Karthik", email: "venkat@codesphere.io", role: "admin", status: "active", joined: "2024-01-15" },
                { id: "2", name: "Sarah Chen", email: "sarah.c@gmail.com", role: "moderator", status: "active", joined: "2024-02-10" },
                { id: "3", name: "Alex Rivera", email: "arivera@tech.co", role: "user", status: "active", joined: "2024-02-28" },
                { id: "4", name: "James Wilson", email: "j.wilson@outlook.com", role: "user", status: "suspended", joined: "2024-03-05" },
                { id: "5", name: "Elena Petrova", email: "elena@design.io", role: "user", status: "active", joined: "2024-03-12" },
            ]);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => { fetchUsers(); }, []);

    const handleSuspend = async (userId: string, currentStatus: string) => {
        const action = currentStatus === 'active' ? 'suspend' : 'reactivate';
        try {
            await apiFetch(`/admin/users/${userId}/${action}`, { method: 'POST' });
            setUsers((prev) => prev.map((u) => u.id === userId ? { ...u, status: action === 'suspend' ? 'suspended' : 'active' } : u));
            toast.success(`User ${action}d successfully.`);
        } catch {
            toast.error(`Failed to ${action} user.`);
        }
    };

    const handleRoleChange = async (userId: string, newRole: string) => {
        try {
            await apiFetch(`/admin/users/${userId}/role`, { method: 'PATCH', body: JSON.stringify({ role: newRole }) });
            setUsers((prev) => prev.map((u) => u.id === userId ? { ...u, role: newRole } : u));
            toast.success(`Role updated to ${newRole}.`);
        } catch {
            toast.error("Failed to update role.");
        }
    };

    const filteredUsers = users.filter(user => 
        user.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        user.email?.toLowerCase().includes(searchTerm.toLowerCase())
    );

    return (
        <div className="space-y-6">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <h1 className="text-3xl font-bold tracking-tight">User Management</h1>
                    <p className="text-muted-foreground mt-1">
                        Manage platform access, roles, and monitor user behavior.
                    </p>
                </div>
                <Button className="gap-2">
                    <UserPlus className="w-4 h-4" />
                    Invite Admin
                </Button>
            </div>

            {/* Quick Stats */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <Card className="bg-card/40 border-border/40">
                    <CardContent className="p-6 flex items-center gap-4">
                        <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center text-primary">
                            <Users className="w-6 h-6" />
                        </div>
                        <div>
                            <div className="text-2xl font-bold">{users.length}</div>
                            <div className="text-sm text-muted-foreground">Total Registered Users</div>
                        </div>
                    </CardContent>
                </Card>
                <Card className="bg-card/40 border-border/40">
                    <CardContent className="p-6 flex items-center gap-4">
                        <div className="w-12 h-12 rounded-full bg-green-500/10 flex items-center justify-center text-green-500">
                            <CheckCircle2 className="w-6 h-6" />
                        </div>
                        <div>
                            <div className="text-2xl font-bold">{users.filter(u => u.status === 'active').length}</div>
                            <div className="text-sm text-muted-foreground">Active Accounts</div>
                        </div>
                    </CardContent>
                </Card>
                <Card className="bg-card/40 border-border/40">
                    <CardContent className="p-6 flex items-center gap-4">
                        <div className="w-12 h-12 rounded-full bg-blue-500/10 flex items-center justify-center text-blue-500">
                            <Shield className="w-6 h-6" />
                        </div>
                        <div>
                            <div className="text-2xl font-bold">{users.filter(u => u.role !== 'user').length}</div>
                            <div className="text-sm text-muted-foreground">Admins & Moderators</div>
                        </div>
                    </CardContent>
                </Card>
            </div>

            <Card className="bg-card/40 border-border/40 overflow-hidden">
                <CardHeader className="border-b border-border/40 bg-muted/20 pb-4">
                    <div className="flex flex-col md:flex-row gap-4 justify-between md:items-center">
                        <div className="relative w-full md:w-96">
                            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                            <Input 
                                placeholder="Search by name or email..." 
                                className="pl-10 bg-background/50 border-border/40"
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                            />
                        </div>
                        <div className="flex gap-2">
                            <Button variant="outline" size="sm" className="gap-2">
                                <Filter className="w-4 h-4" />
                                Filter
                            </Button>
                        </div>
                    </div>
                </CardHeader>
                <CardContent className="p-0">
                    <div className="overflow-x-auto">
                        <table className="w-full text-left border-collapse">
                            <thead>
                                <tr className="border-b border-border/40 bg-muted/10">
                                    <th className="p-4 text-sm font-semibold">User</th>
                                    <th className="p-4 text-sm font-semibold">Role</th>
                                    <th className="p-4 text-sm font-semibold">Status</th>
                                    <th className="p-4 text-sm font-semibold">Joined</th>
                                    <th className="p-4 text-sm font-semibold text-right">Actions</th>
                                </tr>
                            </thead>
                            <tbody>
                                {loading ? (
                                    <tr>
                                        <td colSpan={5} className="p-8 text-center text-muted-foreground">
                                            <div className="flex items-center justify-center gap-2">
                                                <div className="w-4 h-4 border-2 border-primary border-t-transparent rounded-full animate-spin" />
                                                Loading users...
                                            </div>
                                        </td>
                                    </tr>
                                ) : filteredUsers.length === 0 ? (
                                    <tr>
                                        <td colSpan={5} className="p-8 text-center text-muted-foreground">
                                            No users found matching your search.
                                        </td>
                                    </tr>
                                ) : (
                                    filteredUsers.map((user) => (
                                        <tr key={user.id} className="border-b border-border/40 hover:bg-muted/5 transition-colors group">
                                            <td className="p-4">
                                                <div className="flex items-center gap-3">
                                                    <div className="w-9 h-9 rounded-full bg-gradient-to-br from-slate-700 to-slate-800 flex items-center justify-center font-bold text-xs border border-white/5">
                                                        {user.name?.slice(0, 2).toUpperCase()}
                                                    </div>
                                                    <div>
                                                        <div className="font-medium text-sm flex items-center gap-1">
                                                            {user.name}
                                                            {user.role === 'admin' && <BadgeCheck className="w-3.5 h-3.5 text-primary" />}
                                                        </div>
                                                        <div className="text-xs text-muted-foreground">{user.email}</div>
                                                    </div>
                                                </div>
                                            </td>
                                            <td className="p-4">
                                                <Badge 
                                                    variant="secondary" 
                                                    className={`capitalize font-medium ${
                                                        user.role === 'admin' ? 'bg-primary/10 text-primary border-primary/20' : 
                                                        user.role === 'moderator' ? 'bg-purple-500/10 text-purple-400 border-purple-500/20' :
                                                        'bg-slate-500/10 text-slate-400 border-slate-500/20'
                                                    }`}
                                                >
                                                    {user.role}
                                                </Badge>
                                            </td>
                                            <td className="p-4">
                                                <div className="flex items-center gap-1.5">
                                                    <div className={`w-1.5 h-1.5 rounded-full ${user.status === 'active' ? 'bg-green-500' : 'bg-red-500'}`} />
                                                    <span className="text-sm capitalize">{user.status}</span>
                                                </div>
                                            </td>
                                            <td className="p-4 text-sm text-muted-foreground">
                                                {new Date(user.joined).toLocaleDateString()}
                                            </td>
                                            <td className="p-4 text-right">
                                                <DropdownMenu>
                                                    <DropdownMenuTrigger asChild>
                                                        <Button variant="ghost" size="icon" className="w-8 h-8 opacity-0 group-hover:opacity-100 transition-opacity">
                                                            <MoreHorizontal className="w-4 h-4" />
                                                        </Button>
                                                    </DropdownMenuTrigger>
                                                    <DropdownMenuContent align="end" className="bg-popover/90 backdrop-blur-md border-border/40">
                                                        <DropdownMenuLabel>Actions</DropdownMenuLabel>
                                                        <DropdownMenuItem className="gap-2" onClick={() => window.open(`mailto:${user.email}`)}>
                                                            <Mail className="w-4 h-4" /> Email User
                                                        </DropdownMenuItem>
                                                        <DropdownMenuItem className="gap-2" onClick={() => handleRoleChange(user.id, user.role === 'user' ? 'moderator' : 'user')}>
                                                            <Shield className="w-4 h-4" /> {user.role === 'user' ? 'Make Moderator' : 'Remove Moderator'}
                                                        </DropdownMenuItem>
                                                        <DropdownMenuSeparator className="bg-border/40" />
                                                        {user.status === 'active' ? (
                                                            <DropdownMenuItem className="gap-2 text-red-400 focus:text-red-300" onClick={() => handleSuspend(user.id, 'active')}>
                                                                <XCircle className="w-4 h-4" /> Suspend Account
                                                            </DropdownMenuItem>
                                                        ) : (
                                                            <DropdownMenuItem className="gap-2 text-green-400 focus:text-green-300" onClick={() => handleSuspend(user.id, 'suspended')}>
                                                                <CheckCircle2 className="w-4 h-4" /> Reactivate Account
                                                            </DropdownMenuItem>
                                                        )}
                                                    </DropdownMenuContent>
                                                </DropdownMenu>
                                            </td>
                                        </tr>
                                    ))
                                )}
                            </tbody>
                        </table>
                    </div>
                </CardContent>
            </Card>
        </div>
    );
}
