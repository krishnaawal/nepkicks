"use client";

import { useMemo, useState } from "react";
import { RefreshCcw, Search, ShieldCheck } from "lucide-react";
import { formatMoney } from "@/lib/product";
import { orderStatuses, type OrderStatus } from "@/lib/order-status";

type OrderRecord = {
  orderId: string;
  date: string;
  customerName: string;
  email: string;
  phone: string;
  address: string;
  productName: string;
  size: string;
  color: string;
  quantity: number;
  price: number;
  total: number;
  status: OrderStatus;
};

export default function AdminDashboard() {
  const [password, setPassword] = useState("");
  const [orders, setOrders] = useState<OrderRecord[]>([]);
  const [query, setQuery] = useState("");
  const [filter, setFilter] = useState<OrderStatus | "All">("All");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  async function loadOrders() {
    setLoading(true);
    setError("");
    const response = await fetch("/api/orders", {
      headers: { "x-admin-password": password }
    });
    const data = await response.json();
    setLoading(false);
    if (!response.ok) {
      setError(data.error || "Unable to load orders.");
      return;
    }
    setOrders(data.orders);
  }

  async function updateStatus(orderId: string, status: OrderStatus) {
    setError("");
    const response = await fetch(`/api/orders/${orderId}/status`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json", "x-admin-password": password },
      body: JSON.stringify({ status })
    });
    const data = await response.json();
    if (!response.ok) {
      setError(data.error || "Unable to update status.");
      return;
    }
    setOrders((current) => current.map((order) => (order.orderId === orderId ? { ...order, status } : order)));
  }

  const filteredOrders = useMemo(() => {
    const search = query.toLowerCase();
    return orders.filter((order) => {
      const matchesStatus = filter === "All" || order.status === filter;
      const matchesSearch = [order.orderId, order.customerName, order.email, order.phone, order.address, order.color, order.size].join(" ").toLowerCase().includes(search);
      return matchesStatus && matchesSearch;
    });
  }, [orders, query, filter]);

  const stats = useMemo(() => {
    const totalRevenue = orders.reduce((sum, order) => sum + Number(order.total || 0), 0);
    return {
      orders: orders.length,
      pending: orders.filter((order) => order.status === "Pending").length,
      delivered: orders.filter((order) => order.status === "Delivered").length,
      revenue: totalRevenue
    };
  }, [orders]);

  return (
    <main className="min-h-screen bg-paper px-4 py-8 sm:px-6">
      <div className="mx-auto max-w-7xl">
        <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
          <div>
            <p className="flex items-center gap-2 text-sm font-black text-clay"><ShieldCheck size={18} /> Secure Admin</p>
            <h1 className="text-4xl font-black">Nepkicks Orders</h1>
          </div>
          <div className="flex gap-2">
            <input value={password} onChange={(event) => setPassword(event.target.value)} type="password" placeholder="Admin password" className="focus-ring rounded-md border border-ink/20 px-3 py-3" />
            <button onClick={loadOrders} disabled={!password || loading} className="focus-ring inline-flex items-center gap-2 rounded-md bg-ink px-4 py-3 font-black text-white disabled:opacity-60">
              <RefreshCcw size={18} /> {loading ? "Loading" : "Load"}
            </button>
          </div>
        </div>

        {error && <p className="mt-5 rounded-md bg-clay/10 p-3 font-bold text-clay">{error}</p>}

        <div className="mt-8 grid gap-4 md:grid-cols-4">
          <Stat label="Orders" value={stats.orders.toString()} />
          <Stat label="Pending" value={stats.pending.toString()} />
          <Stat label="Delivered" value={stats.delivered.toString()} />
          <Stat label="Revenue" value={formatMoney(stats.revenue)} />
        </div>

        <div className="mt-8 flex flex-col gap-3 rounded-lg bg-white p-4 shadow-sm sm:flex-row">
          <label className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-ink/45" size={18} />
            <input value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Search orders" className="focus-ring w-full rounded-md border border-ink/20 py-3 pl-10 pr-3" />
          </label>
          <select value={filter} onChange={(event) => setFilter(event.target.value as OrderStatus | "All")} className="focus-ring rounded-md border border-ink/20 px-3 py-3">
            <option value="All">All statuses</option>
            {orderStatuses.map((status) => <option key={status} value={status}>{status}</option>)}
          </select>
        </div>

        <div className="mt-5 overflow-x-auto rounded-lg bg-white shadow-sm">
          <table className="min-w-[1100px] w-full border-collapse text-left text-sm">
            <thead className="bg-ink text-white">
              <tr>
                {["Order ID", "Date", "Customer", "Phone", "Address", "Size", "Color", "Qty", "Total", "Status"].map((heading) => (
                  <th key={heading} className="px-4 py-3 font-black">{heading}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {filteredOrders.map((order) => (
                <tr key={order.orderId} className="border-b border-black/10">
                  <td className="px-4 py-3 font-black">{order.orderId}</td>
                  <td className="px-4 py-3">{order.date ? new Date(order.date).toLocaleString() : ""}</td>
                  <td className="px-4 py-3">
                    <p className="font-black">{order.customerName}</p>
                    <p className="text-ink/60">{order.email}</p>
                  </td>
                  <td className="px-4 py-3">{order.phone}</td>
                  <td className="max-w-64 px-4 py-3">{order.address}</td>
                  <td className="px-4 py-3">{order.size}</td>
                  <td className="px-4 py-3">{order.color}</td>
                  <td className="px-4 py-3">{order.quantity}</td>
                  <td className="px-4 py-3 font-black">{formatMoney(Number(order.total || 0))}</td>
                  <td className="px-4 py-3">
                    <select value={order.status} onChange={(event) => updateStatus(order.orderId, event.target.value as OrderStatus)} className="focus-ring rounded-md border border-ink/20 px-2 py-2">
                      {orderStatuses.map((status) => <option key={status} value={status}>{status}</option>)}
                    </select>
                  </td>
                </tr>
              ))}
              {!filteredOrders.length && (
                <tr>
                  <td colSpan={10} className="px-4 py-12 text-center text-ink/60">No orders to show.</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </main>
  );
}

function Stat({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-lg bg-white p-5 shadow-sm">
      <p className="text-sm font-bold text-ink/60">{label}</p>
      <p className="mt-2 text-3xl font-black">{value}</p>
    </div>
  );
}
