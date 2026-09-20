import React, { useState } from 'react';
import {
  Receipt,
  DollarSign,
  Calendar,
  CheckCircle2,
  Clock,
  Search,
  Download,
  Plus,
  ArrowUpRight
} from 'lucide-react';

interface InvoiceRecord {
  id: string;
  client: string;
  project: string;
  issueDate: string;
  dueDate: string;
  amount: number;
  terms: string;
  status: 'Paid' | 'Pending' | 'Overdue';
}

const INITIAL_INVOICES: InvoiceRecord[] = [
  {
    id: 'INV-2024-104',
    client: 'Turner Construction Company',
    project: 'Metro Heights Tower (Phase 2 QTO)',
    issueDate: '2024-08-01',
    dueDate: '2024-08-31',
    amount: 142000,
    terms: 'Net 30',
    status: 'Paid',
  },
  {
    id: 'INV-2024-105',
    client: 'Clark Construction Group',
    project: 'St. Jude Expansion BIM Modeling',
    issueDate: '2024-08-05',
    dueDate: '2024-09-04',
    amount: 88500,
    terms: 'Net 30',
    status: 'Pending',
  },
  {
    id: 'INV-2024-106',
    client: 'Skanska USA Building Inc.',
    project: 'Biotech Innovation Lab Peer Audit',
    issueDate: '2024-08-10',
    dueDate: '2024-09-09',
    amount: 62000,
    terms: 'Net 30',
    status: 'Pending',
  },
  {
    id: 'INV-2024-107',
    client: 'Balfour Beatty Construction',
    project: 'Harbor Logistics Warehouse Pre-Con',
    issueDate: '2024-07-20',
    dueDate: '2024-08-19',
    amount: 94000,
    terms: 'Net 30',
    status: 'Paid',
  },
  {
    id: 'INV-2024-108',
    client: 'Webcor Builders',
    project: 'Mission Bay Life Science Park',
    issueDate: '2024-08-15',
    dueDate: '2024-09-14',
    amount: 55000,
    terms: 'Net 30',
    status: 'Pending',
  },
];

export const InvoicesArView: React.FC = () => {
  const [invoices, setInvoices] = useState<InvoiceRecord[]>(INITIAL_INVOICES);
  const [searchTerm, setSearchTerm] = useState('');

  const totalOutstanding = invoices
    .filter((inv) => inv.status === 'Pending')
    .reduce((sum, inv) => sum + inv.amount, 0);

  const totalPaid = invoices
    .filter((inv) => inv.status === 'Paid')
    .reduce((sum, inv) => sum + inv.amount, 0);

  const filtered = invoices.filter(
    (inv) =>
      inv.client.toLowerCase().includes(searchTerm.toLowerCase()) ||
      inv.project.toLowerCase().includes(searchTerm.toLowerCase()) ||
      inv.id.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-1.5 font-mono text-[10px] tracking-wider uppercase text-[#86948a] mb-1">
            <span>BILLING & RECEIVABLES</span>
            <span>/</span>
            <span>ACCOUNTS RECEIVABLE (AR)</span>
            <span className="w-1.5 h-1.5 rounded-full bg-[#4edea3] ml-1" />
          </div>
          <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-white">
            Invoices & Accounts Receivable
          </h1>
          <p className="text-xs sm:text-sm text-[#86948a] mt-0.5">
            General contractor progress billings, milestone fee schedules, and payment collections
          </p>
        </div>

        <div className="flex items-center gap-2.5 flex-wrap">
          <button
            onClick={() => {
              const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(invoices, null, 2));
              const downloadAnchor = document.createElement('a');
              downloadAnchor.setAttribute("href", dataStr);
              downloadAnchor.setAttribute("download", "bid_exact_invoices_ar.json");
              document.body.appendChild(downloadAnchor);
              downloadAnchor.click();
              downloadAnchor.remove();
            }}
            className="h-9 px-3.5 bg-[#171f33] hover:bg-[#222a3d] border border-[#2d3449] rounded-md text-xs font-mono text-[#dae2fd] font-medium flex items-center gap-1.5 transition-colors cursor-pointer"
          >
            <Download className="w-3.5 h-3.5 text-[#86948a]" />
            <span>Export Invoices</span>
          </button>
          <button
            onClick={() => {
              const newInv: InvoiceRecord = {
                id: `INV-2024-${109 + Math.floor(Math.random() * 50)}`,
                client: 'Turner Construction Company',
                project: 'Commercial Takeoff Milestone Batch',
                issueDate: new Date().toISOString().split('T')[0],
                dueDate: new Date(Date.now() + 30 * 86400000).toISOString().split('T')[0],
                amount: 75000,
                terms: 'Net 30',
                status: 'Pending',
              };
              setInvoices([newInv, ...invoices]);
            }}
            className="h-9 px-4 bg-[#4edea3] hover:bg-[#40cf95] active:scale-[0.98] text-[#003824] rounded-md text-xs font-semibold flex items-center gap-1.5 shadow-sm transition-all cursor-pointer"
          >
            <Plus className="w-4 h-4 stroke-[2.5]" />
            <span>+ Issue New Progress Invoice</span>
          </button>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
        <div className="bg-[#131b2e] border border-[#222a3d] rounded-lg p-4">
          <div className="text-xs font-mono text-[#86948a] uppercase font-semibold mb-1">
            Total Outstanding (AR)
          </div>
          <div className="text-2xl font-bold font-mono text-[#4edea3]">
            ${totalOutstanding.toLocaleString()}
          </div>
          <div className="text-[11px] text-[#86948a] mt-2">
            100% current &lt;30 days
          </div>
        </div>

        <div className="bg-[#131b2e] border border-[#222a3d] rounded-lg p-4">
          <div className="text-xs font-mono text-[#86948a] uppercase font-semibold mb-1">
            Collected (This Quarter)
          </div>
          <div className="text-2xl font-bold font-mono text-white">
            ${totalPaid.toLocaleString()}
          </div>
          <div className="text-[11px] text-[#4edea3] mt-2">
            Avg collection cycle: 22.4 days
          </div>
        </div>

        <div className="bg-[#131b2e] border border-[#222a3d] rounded-lg p-4">
          <div className="text-xs font-mono text-[#86948a] uppercase font-semibold mb-1">
            Overdue Balance
          </div>
          <div className="text-2xl font-bold font-mono text-white">
            $0.00
          </div>
          <div className="text-[11px] text-[#4edea3] mt-2">
            Zero delinquency across all accounts
          </div>
        </div>

        <div className="bg-[#131b2e] border border-[#222a3d] rounded-lg p-4">
          <div className="text-xs font-mono text-[#86948a] uppercase font-semibold mb-1">
            Payment Term Default
          </div>
          <div className="text-2xl font-bold font-mono text-white">
            Net 30 Days
          </div>
          <div className="text-[11px] text-[#86948a] mt-2">
            MSA standard rate lock
          </div>
        </div>
      </div>

      {/* Table Container */}
      <div className="bg-[#131b2e] border border-[#222a3d] rounded-lg overflow-hidden">
        <div className="p-4 border-b border-[#222a3d] flex flex-col sm:flex-row items-center justify-between gap-3">
          <div className="relative w-full sm:w-80">
            <Search className="w-4 h-4 text-[#86948a] absolute left-3 top-2.5" />
            <input
              type="text"
              placeholder="Search invoice #, client, or project..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-9 pr-3 py-1.5 bg-[#0b1326] border border-[#222a3d] rounded text-xs text-white placeholder-[#86948a] focus:outline-none focus:border-[#4edea3]"
            />
          </div>
          <div className="text-xs font-mono text-[#86948a]">
            Showing {filtered.length} Invoices
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left font-mono text-xs">
            <thead className="bg-[#0b1326] text-[#86948a] uppercase text-[10px] tracking-wider border-b border-[#222a3d]">
              <tr>
                <th className="p-3">Invoice #</th>
                <th className="p-3">Client / General Contractor</th>
                <th className="p-3">Project Description</th>
                <th className="p-3">Issue Date</th>
                <th className="p-3">Due Date</th>
                <th className="p-3 text-right">Amount</th>
                <th className="p-3 text-center">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#222a3d] text-[#dae2fd]">
              {filtered.map((inv) => (
                <tr key={inv.id} className="hover:bg-[#171f33]/70 transition-colors">
                  <td className="p-3 font-semibold text-[#4edea3]">{inv.id}</td>
                  <td className="p-3 font-sans font-medium text-white">{inv.client}</td>
                  <td className="p-3 font-sans text-xs text-[#bbcabf]">{inv.project}</td>
                  <td className="p-3 text-[#86948a]">{inv.issueDate}</td>
                  <td className="p-3 text-white">{inv.dueDate}</td>
                  <td className="p-3 text-right font-bold text-white">
                    ${inv.amount.toLocaleString()}
                  </td>
                  <td className="p-3 text-center">
                    <span
                      className={`px-2 py-0.5 rounded text-[10px] ${
                        inv.status === 'Paid'
                          ? 'bg-[#4edea3]/10 text-[#4edea3] border border-[#4edea3]/20'
                          : 'bg-[#3b82f6]/10 text-[#adc6ff] border border-[#3b82f6]/20'
                      }`}
                    >
                      {inv.status}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
