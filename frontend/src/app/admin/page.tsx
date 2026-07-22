"use client";

import React from "react";
import { DashboardSidebar } from "@/widgets/dashboard-sidebar";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Breadcrumb } from "@/components/ui/breadcrumb";
import { DataTable } from "@/components/ui/table";
import { ColumnDef } from "@tanstack/react-table";
import { Users, CreditCard, Layout, TrendingUp, ShieldCheck, CheckCircle2 } from "lucide-react";

interface UserRecord {
  id: string;
  name: string;
  email: string;
  phone: string;
  role: string;
  status: string;
  createdAt: string;
}

export default function AdminDashboardPage() {
  const users: UserRecord[] = [
    {
      id: "u1",
      name: "Омар Мусин",
      email: "omar@toyga.kz",
      phone: "+7 701 111 22 33",
      role: "user",
      status: "active",
      createdAt: "2026-07-20",
    },
    {
      id: "u2",
      name: "Toyga Admin",
      email: "admin@toyga.kz",
      phone: "+7 700 000 00 00",
      role: "admin",
      status: "active",
      createdAt: "2026-07-01",
    },
  ];

  const columns: ColumnDef<UserRecord>[] = [
    {
      accessorKey: "name",
      header: "Пайдаланушы",
      cell: ({ row }) => (
        <div>
          <p className="font-bold text-white">{row.original.name}</p>
          <p className="text-xs text-white/50">{row.original.email}</p>
        </div>
      ),
    },
    {
      accessorKey: "phone",
      header: "Телефон",
      cell: ({ row }) => (
        <span className="text-xs text-white/80">{row.original.phone}</span>
      ),
    },
    {
      accessorKey: "role",
      header: "Рөл",
      cell: ({ row }) => (
        <Badge variant={row.original.role === "admin" ? "gold" : "outline"}>
          {row.original.role}
        </Badge>
      ),
    },
    {
      accessorKey: "status",
      header: "Статус",
      cell: ({ row }) => (
        <span className="inline-flex items-center space-x-1 text-teal-300 text-xs font-bold">
          <CheckCircle2 className="w-3.5 h-3.5" /> <span>Белсенді</span>
        </span>
      ),
    },
    {
      accessorKey: "createdAt",
      header: "Тіркелген күні",
      cell: ({ row }) => (
        <span className="text-xs text-white/50">{row.original.createdAt}</span>
      ),
    },
  ];

  return (
    <div className="min-h-screen bg-[#1A1A2E] text-white flex flex-row font-sans">
      <DashboardSidebar isAdmin />

      <main className="flex-1 p-6 sm:p-10 overflow-y-auto space-y-8">
        <Breadcrumb
          items={[
            { label: "Басты бет", href: "/" },
            { label: "Админ Панель" },
          ]}
        />

        {/* Header */}
        <div className="border-b border-gold/20 pb-6 flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-serif font-bold text-gold">SaaS Admin Panel</h1>
            <p className="text-sm text-white/60 mt-1">
              Toyga.kz платформасының жүйелік басқаруы мен статистикасы
            </p>
          </div>
          <Badge variant="gold">Super Admin Mode</Badge>
        </div>

        {/* Stat Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          <Card className="p-6 space-y-2 border-gold/30">
            <div className="flex items-center justify-between text-gold">
              <span className="text-xs uppercase font-semibold">Жалпы түсім</span>
              <CreditCard className="w-5 h-5" />
            </div>
            <p className="text-3xl font-serif font-bold text-white">708 580 ₸</p>
          </Card>

          <Card className="p-6 space-y-2 border-gold/30">
            <div className="flex items-center justify-between text-teal-300">
              <span className="text-xs uppercase font-semibold">Пайдаланушылар</span>
              <Users className="w-5 h-5" />
            </div>
            <p className="text-3xl font-serif font-bold text-white">1 420</p>
          </Card>

          <Card className="p-6 space-y-2 border-gold/30">
            <div className="flex items-center justify-between text-rose-300">
              <span className="text-xs uppercase font-semibold">Шақырулар</span>
              <Layout className="w-5 h-5" />
            </div>
            <p className="text-3xl font-serif font-bold text-white">850</p>
          </Card>

          <Card className="p-6 space-y-2 border-gold/30">
            <div className="flex items-center justify-between text-gold">
              <span className="text-xs uppercase font-semibold">Конверсия</span>
              <TrendingUp className="w-5 h-5" />
            </div>
            <p className="text-3xl font-serif font-bold text-white">68.4 %</p>
          </Card>
        </div>

        {/* Users Table */}
        <div className="space-y-4">
          <h3 className="font-serif font-bold text-xl text-gold">Пайдаланушылар тізімі</h3>
          <DataTable columns={columns} data={users} searchKey="name" />
        </div>
      </main>
    </div>
  );
}
