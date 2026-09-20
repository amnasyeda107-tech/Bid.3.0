import React, { useState } from 'react';
import {
  DollarSign,
  Calendar,
  CheckCircle2,
  Clock,
  ArrowUpRight,
  ShieldCheck,
  Building2,
  Plus,
  Search,
  Download,
  AlertCircle,
  FileText,
  CreditCard,
  X,
  Printer
} from 'lucide-react';
import { EmployeeItem, PayrollRunItem, CashTransaction } from '../../types';

interface SalaryPayrollViewProps {
  employees: EmployeeItem[];
  payrollRuns: PayrollRunItem[];
  onRunPayroll: (run: PayrollRunItem, outflowTxn: CashTransaction) => void;
  onNavigateToHr: () => void;
}

export const SalaryPayrollView: React.FC<SalaryPayrollViewProps> = ({
  employees,
  payrollRuns,
  onRunPayroll,
  onNavigateToHr,
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedPaystubEmp, setSelectedPaystubEmp] = useState<EmployeeItem | null>(null);
  const [isRunModalOpen, setIsRunModalOpen] = useState(false);

  // Totals for current pay period (bi-weekly = monthly / 2)
  const periodGrossTotal = employees.reduce((sum, e) => sum + (e.monthlyGross / 2), 0);
  const periodFedTaxTotal = employees.reduce((sum, e) => sum + (e.deductions.federalTax / 2), 0);
  const periodStateTaxTotal = employees.reduce((sum, e) => sum + (e.deductions.stateTax / 2), 0);
  const periodFicaTotal = employees.reduce((sum, e) => sum + (e.deductions.ficaMedicare / 2), 0);
  const period401kTotal = employees.reduce((sum, e) => sum + (e.deductions.retirement401k / 2), 0);
  const periodHealthTotal = employees.reduce((sum, e) => sum + (e.deductions.healthInsurance / 2), 0);
  const periodNetPayTotal = employees.reduce((sum, e) => sum + (e.netPay / 2), 0);
  const totalTaxes = periodFedTaxTotal + periodStateTaxTotal + periodFicaTotal;

  const filteredEmployees = employees.filter((e) =>
    e.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    e.role.toLowerCase().includes(searchTerm.toLowerCase()) ||
    e.id.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleExecutePayroll = () => {
    const runId = `RUN-2024-${payrollRuns.length + 19}`;
    const todayStr = new Date().toISOString().slice(0, 10);

    const newRun: PayrollRunItem = {
      id: runId,
      period: 'Sep 16 - Sep 30, 2024 (Active Cycle)',
      payDate: todayStr,
      totalGross: Math.round(periodGrossTotal),
      totalTaxesWithheld: Math.round(totalTaxes),
      totalDeductions: Math.round(period401kTotal + periodHealthTotal),
      totalNetPaid: Math.round(periodNetPayTotal),
      employeeCount: employees.length,
      status: 'Paid',
    };

    const outflowTxn: CashTransaction = {
      id: `TXN-2024-${Math.floor(2000 + Math.random() * 8000)}`,
      date: todayStr,
      description: `Payroll Run #${payrollRuns.length + 19} Direct Deposits (${employees.length} Staff)`,
      category: 'Payroll & Salaries (W-2)',
      counterparty: 'Gusto Direct Deposit ACH',
      type: 'outflow',
      amount: Math.round(periodGrossTotal),
      status: 'reconciled',
      paymentMethod: 'Direct Debit ACH',
      account: 'Chase Payroll Reserve ••2041',
      referenceNumber: runId,
    };

    onRunPayroll(newRun, outflowTxn);
    setIsRunModalOpen(false);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-1.5 font-mono text-[10px] tracking-wider uppercase text-[#86948a] mb-1">
            <span>COMPENSATION & PAYROLL</span>
            <span>/</span>
            <span>DIRECT DEPOSIT DISBURSEMENT</span>
            <span className="w-1.5 h-1.5 rounded-full bg-[#4edea3] ml-1" />
          </div>
          <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-white">
            Salary Structure & Payroll Processing
          </h1>
          <p className="text-xs sm:text-sm text-[#86948a] mt-0.5">
            Bi-weekly salary schedules, federal/state tax withholdings, 401(k) matches, and direct ACH disbursements
          </p>
        </div>

        <div className="flex items-center gap-2.5 flex-wrap">
          <button
            onClick={onNavigateToHr}
            className="h-9 px-3.5 bg-[#171f33] hover:bg-[#222a3d] border border-[#2d3449] rounded-md text-xs font-mono text-[#dae2fd] font-medium flex items-center gap-1.5 transition-colors cursor-pointer"
          >
            <Building2 className="w-3.5 h-3.5 text-[#86948a]" />
            <span>Workforce Directory</span>
          </button>
          <button
            onClick={() => setIsRunModalOpen(true)}
            className="h-9 px-4 bg-[#4edea3] hover:bg-[#40cf95] active:scale-[0.98] text-[#003824] rounded-md text-xs font-semibold flex items-center gap-1.5 shadow-sm transition-all cursor-pointer"
          >
            <CreditCard className="w-4 h-4 stroke-[2.5]" />
            <span>Execute Payroll Batch</span>
          </button>
        </div>
      </div>

      {/* 4 Payroll KPIs */}
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
        <div className="bg-[#131b2e] border border-[#222a3d] rounded-lg p-4">
          <div className="text-xs font-mono text-[#86948a] uppercase font-semibold mb-1">
            Current Period Gross Liability
          </div>
          <div className="text-2xl font-bold font-mono text-white">
            ${Math.round(periodGrossTotal).toLocaleString()}
          </div>
          <div className="text-[11px] text-[#4edea3] mt-2 flex items-center gap-1">
            <CheckCircle2 className="w-3.5 h-3.5" />
            <span>100% pre-funded in Chase Payroll Reserve</span>
          </div>
        </div>

        <div className="bg-[#131b2e] border border-[#222a3d] rounded-lg p-4">
          <div className="text-xs font-mono text-[#86948a] uppercase font-semibold mb-1">
            Net Direct Deposit Take-Home
          </div>
          <div className="text-2xl font-bold font-mono text-[#4edea3]">
            ${Math.round(periodNetPayTotal).toLocaleString()}
          </div>
          <div className="text-[11px] text-[#86948a] mt-2">
            Disbursed across {employees.length} employee bank accounts
          </div>
        </div>

        <div className="bg-[#131b2e] border border-[#222a3d] rounded-lg p-4">
          <div className="text-xs font-mono text-[#86948a] uppercase font-semibold mb-1">
            Taxes & Statutory Escrow
          </div>
          <div className="text-2xl font-bold font-mono text-[#ffb4ab]">
            ${Math.round(totalTaxes).toLocaleString()}
          </div>
          <div className="text-[11px] text-[#86948a] mt-2">
            IRS 941, FICA Medicare, and State Withholding
          </div>
        </div>

        <div className="bg-[#131b2e] border border-[#222a3d] rounded-lg p-4">
          <div className="text-xs font-mono text-[#86948a] uppercase font-semibold mb-1">
            Next Scheduled Pay Date
          </div>
          <div className="text-2xl font-bold font-mono text-white">
            Sep 30, 2024
          </div>
          <div className="text-[11px] text-[#adc6ff] mt-2 flex items-center gap-1">
            <Clock className="w-3.5 h-3.5" />
            <span>Bi-weekly Friday direct deposit window</span>
          </div>
        </div>
      </div>

      {/* Salary & Compensation Matrix Table */}
      <div className="bg-[#131b2e] border border-[#222a3d] rounded-lg overflow-hidden">
        <div className="p-4 border-b border-[#222a3d] flex flex-col sm:flex-row items-center justify-between gap-3">
          <div>
            <h3 className="text-sm font-bold text-white">Individual Compensation & Deductions</h3>
            <p className="text-[11px] text-[#86948a]">Click any team member to view & print their certified pay stub</p>
          </div>

          <div className="relative w-full sm:w-64">
            <Search className="w-4 h-4 text-[#86948a] absolute left-3 top-2.5" />
            <input
              type="text"
              placeholder="Search employee..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-9 pr-3 py-1.5 bg-[#0b1326] border border-[#222a3d] rounded text-xs text-white placeholder-[#86948a] focus:outline-none focus:border-[#4edea3]"
            />
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-[#0b1326] text-[#86948a] font-mono border-b border-[#222a3d]">
              <tr>
                <th className="py-2.5 px-4">Employee / ID</th>
                <th className="py-2.5 px-4">Annual Base</th>
                <th className="py-2.5 px-4">Bi-Weekly Gross</th>
                <th className="py-2.5 px-4">Fed + State Tax</th>
                <th className="py-2.5 px-4">FICA / Med</th>
                <th className="py-2.5 px-4">401(k) / Health</th>
                <th className="py-2.5 px-4 text-right">Net Direct Deposit</th>
                <th className="py-2.5 px-4 text-center">Paystub</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#222a3d]">
              {filteredEmployees.map((emp) => {
                const biWeeklyGross = emp.monthlyGross / 2;
                const fedTax = emp.deductions.federalTax / 2;
                const stateTax = emp.deductions.stateTax / 2;
                const fica = emp.deductions.ficaMedicare / 2;
                const ret = emp.deductions.retirement401k / 2;
                const health = emp.deductions.healthInsurance / 2;
                const net = emp.netPay / 2;

                return (
                  <tr
                    key={emp.id}
                    className="hover:bg-[#171f33]/60 transition-colors cursor-pointer"
                    onClick={() => setSelectedPaystubEmp(emp)}
                  >
                    <td className="py-3 px-4">
                      <div className="font-semibold text-white">{emp.name}</div>
                      <div className="text-[11px] font-mono text-[#86948a]">{emp.id} • {emp.role}</div>
                    </td>

                    <td className="py-3 px-4 font-mono font-medium text-[#dae2fd]">
                      ${emp.annualSalary.toLocaleString()}
                    </td>

                    <td className="py-3 px-4 font-mono font-bold text-white">
                      ${Math.round(biWeeklyGross).toLocaleString()}
                    </td>

                    <td className="py-3 px-4 font-mono text-[#ffb4ab]">
                      -${Math.round(fedTax + stateTax).toLocaleString()}
                    </td>

                    <td className="py-3 px-4 font-mono text-[#ffb4ab]">
                      -${Math.round(fica).toLocaleString()}
                    </td>

                    <td className="py-3 px-4 font-mono text-[#86948a]">
                      -${Math.round(ret + health).toLocaleString()}
                    </td>

                    <td className="py-3 px-4 text-right font-mono font-bold text-[#4edea3]">
                      ${Math.round(net).toLocaleString()}
                    </td>

                    <td className="py-3 px-4 text-center">
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          setSelectedPaystubEmp(emp);
                        }}
                        className="p-1 text-[#86948a] hover:text-[#4edea3] rounded hover:bg-[#222a3d] transition-colors"
                        title="View Official Paystub"
                      >
                        <FileText className="w-4 h-4" />
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* Historical Payroll Runs List */}
      <div className="bg-[#131b2e] border border-[#222a3d] rounded-lg p-5">
        <h3 className="text-sm font-bold text-white mb-1 flex items-center gap-2">
          <Clock className="w-4 h-4 text-[#4edea3]" />
          Executed Direct Deposit Batch Runs
        </h3>
        <p className="text-[11px] text-[#86948a] mb-4">
          Audit trail of historical salary settlements with ACH batch reference numbers
        </p>

        <div className="space-y-3">
          {payrollRuns.map((run) => (
            <div
              key={run.id}
              className="p-4 bg-[#0b1326] border border-[#222a3d] rounded-lg flex flex-col sm:flex-row sm:items-center justify-between gap-3"
            >
              <div>
                <div className="flex items-center gap-2">
                  <span className="font-mono text-xs font-bold text-white">{run.id}</span>
                  <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-[#4edea3]/10 text-[#4edea3] border border-[#4edea3]/20">
                    {run.status}
                  </span>
                </div>
                <div className="text-xs text-[#dae2fd] mt-1">{run.period}</div>
                <div className="text-[11px] text-[#86948a] mt-0.5">
                  Executed on {run.payDate} for {run.employeeCount} full-time personnel
                </div>
              </div>

              <div className="flex items-center gap-6 font-mono text-xs">
                <div>
                  <div className="text-[10px] text-[#86948a]">Total Gross</div>
                  <div className="font-bold text-white">${run.totalGross.toLocaleString()}</div>
                </div>
                <div>
                  <div className="text-[10px] text-[#86948a]">Tax Escrow</div>
                  <div className="font-bold text-[#ffb4ab]">${run.totalTaxesWithheld.toLocaleString()}</div>
                </div>
                <div>
                  <div className="text-[10px] text-[#86948a]">Net Paid</div>
                  <div className="font-bold text-[#4edea3]">${run.totalNetPaid.toLocaleString()}</div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Paystub Modal */}
      {selectedPaystubEmp && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-xs">
          <div className="bg-[#131b2e] border border-[#222a3d] rounded-xl w-full max-w-xl shadow-2xl overflow-hidden animate-in fade-in zoom-in-95 duration-150">
            {/* Paystub Header */}
            <div className="p-5 border-b border-[#222a3d] flex items-center justify-between bg-[#0b1326]">
              <div>
                <div className="flex items-center gap-2">
                  <span className="text-sm font-bold text-white">Bid Exact LLC</span>
                  <span className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-[#4edea3]/20 text-[#4edea3] font-bold">
                    OFFICIAL PAYSTUB
                  </span>
                </div>
                <p className="text-[11px] text-[#86948a]">Pay Period: Sep 01 - Sep 15, 2024 • Direct Deposit</p>
              </div>
              <button
                onClick={() => setSelectedPaystubEmp(null)}
                className="p-1.5 rounded-md hover:bg-[#222a3d] text-[#86948a] hover:text-white"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Paystub Body */}
            <div className="p-6 space-y-5 text-xs">
              {/* Employee & Company Metadata */}
              <div className="grid grid-cols-2 gap-4 p-3.5 bg-[#0b1326] border border-[#222a3d] rounded">
                <div>
                  <div className="text-[10px] text-[#86948a] uppercase font-mono">Employee Name</div>
                  <div className="font-bold text-white text-sm">{selectedPaystubEmp.name}</div>
                  <div className="text-[#86948a]">{selectedPaystubEmp.role}</div>
                  <div className="font-mono text-[11px] text-[#86948a] mt-1">ID: {selectedPaystubEmp.id}</div>
                </div>
                <div>
                  <div className="text-[10px] text-[#86948a] uppercase font-mono">Disbursement Info</div>
                  <div className="text-[#dae2fd]">{selectedPaystubEmp.directDeposit}</div>
                  <div className="text-[11px] text-[#86948a]">Pay Date: Sep 15, 2024</div>
                  <div className="text-[11px] text-[#86948a]">Tax Filing: Single / 0 Allowances</div>
                </div>
              </div>

              {/* Earnings & Deductions Tables */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {/* Earnings */}
                <div className="space-y-2 p-3 bg-[#0b1326] border border-[#222a3d] rounded">
                  <div className="font-mono uppercase text-[11px] text-[#4edea3] font-bold">Earnings</div>
                  <div className="flex justify-between py-1 border-b border-[#222a3d]">
                    <span className="text-[#dae2fd]">Regular Salary</span>
                    <span className="font-mono text-white font-bold">
                      ${Math.round(selectedPaystubEmp.monthlyGross / 2).toLocaleString()}
                    </span>
                  </div>
                  <div className="flex justify-between py-1">
                    <span className="text-[#dae2fd]">Total Gross</span>
                    <span className="font-mono text-[#4edea3] font-bold">
                      ${Math.round(selectedPaystubEmp.monthlyGross / 2).toLocaleString()}
                    </span>
                  </div>
                </div>

                {/* Deductions */}
                <div className="space-y-1.5 p-3 bg-[#0b1326] border border-[#222a3d] rounded">
                  <div className="font-mono uppercase text-[11px] text-[#ffb4ab] font-bold">Tax Withholdings</div>
                  <div className="flex justify-between text-[11px]">
                    <span className="text-[#86948a]">Federal Income Tax:</span>
                    <span className="font-mono text-white">-${Math.round(selectedPaystubEmp.deductions.federalTax / 2).toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between text-[11px]">
                    <span className="text-[#86948a]">State Income Tax:</span>
                    <span className="font-mono text-white">-${Math.round(selectedPaystubEmp.deductions.stateTax / 2).toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between text-[11px]">
                    <span className="text-[#86948a]">FICA / Medicare (7.65%):</span>
                    <span className="font-mono text-white">-${Math.round(selectedPaystubEmp.deductions.ficaMedicare / 2).toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between text-[11px]">
                    <span className="text-[#86948a]">401(k) Employee Match:</span>
                    <span className="font-mono text-white">-${Math.round(selectedPaystubEmp.deductions.retirement401k / 2).toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between text-[11px]">
                    <span className="text-[#86948a]">Health Insurance:</span>
                    <span className="font-mono text-white">-${Math.round(selectedPaystubEmp.deductions.healthInsurance / 2).toLocaleString()}</span>
                  </div>
                </div>
              </div>

              {/* Net Pay Highlight */}
              <div className="p-4 bg-[#4edea3]/10 border border-[#4edea3]/30 rounded-lg flex items-center justify-between">
                <div>
                  <div className="text-[10px] font-mono uppercase tracking-wider text-[#4edea3] font-bold">
                    Net Direct Deposit Deposited
                  </div>
                  <div className="text-2xl font-bold font-mono text-white mt-0.5">
                    ${Math.round(selectedPaystubEmp.netPay / 2).toLocaleString(undefined, { minimumFractionDigits: 2 })}
                  </div>
                </div>
                <div className="text-right text-[11px] text-[#dae2fd]">
                  <div>ACH Status: Cleared</div>
                  <div className="text-[#86948a]">Trace #918274019</div>
                </div>
              </div>
            </div>

            <div className="p-4 border-t border-[#222a3d] bg-[#0b1326] flex items-center justify-between">
              <span className="text-[11px] text-[#86948a]">
                Generated via Gusto Payroll API • Certified Electronic Paystub
              </span>
              <button
                onClick={() => window.print()}
                className="px-3.5 py-1.5 bg-[#171f33] hover:bg-[#222a3d] text-white rounded font-medium flex items-center gap-1.5 transition-colors cursor-pointer"
              >
                <Printer className="w-3.5 h-3.5" />
                <span>Print Paystub</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Execute Payroll Confirmation Modal */}
      {isRunModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-xs">
          <div className="bg-[#131b2e] border border-[#222a3d] rounded-xl w-full max-w-md shadow-2xl overflow-hidden animate-in fade-in zoom-in-95 duration-150">
            <div className="p-4 border-b border-[#222a3d] flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="p-1.5 rounded-md bg-[#4edea3]/10 text-[#4edea3]">
                  <CreditCard className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="text-sm font-bold text-white">Execute Payroll Batch Run</h3>
                  <p className="text-[11px] text-[#86948a]">Authorize direct deposit ACH transfers</p>
                </div>
              </div>
              <button
                onClick={() => setIsRunModalOpen(false)}
                className="p-1 rounded hover:bg-[#171f33] text-[#86948a] hover:text-white"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="p-5 space-y-4 text-xs">
              <div className="p-3.5 bg-[#0b1326] border border-[#222a3d] rounded space-y-2">
                <div className="flex justify-between">
                  <span className="text-[#86948a]">Pay Period:</span>
                  <span className="text-white font-medium">Sep 16 - Sep 30, 2024</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-[#86948a]">Total Staff:</span>
                  <span className="font-mono text-white">{employees.length} Full-Time Personnel</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-[#86948a]">Gross Liability:</span>
                  <span className="font-mono text-white font-bold">${Math.round(periodGrossTotal).toLocaleString()}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-[#86948a]">Taxes Withheld:</span>
                  <span className="font-mono text-[#ffb4ab]">-${Math.round(totalTaxes).toLocaleString()}</span>
                </div>
                <div className="flex justify-between pt-2 border-t border-[#222a3d]">
                  <span className="text-[#4edea3] font-bold">Net ACH Disbursement:</span>
                  <span className="font-mono text-[#4edea3] font-bold text-sm">
                    ${Math.round(periodNetPayTotal).toLocaleString()}
                  </span>
                </div>
              </div>

              <div className="p-3 bg-[#4edea3]/5 border border-[#4edea3]/20 rounded text-[11px] text-[#dae2fd]">
                Upon confirmation, this transaction will be debited from <strong>Chase Payroll Reserve ••2041</strong> and logged as an official outflow in the company treasury.
              </div>

              <div className="pt-2 flex items-center justify-end gap-2.5">
                <button
                  type="button"
                  onClick={() => setIsRunModalOpen(false)}
                  className="px-3 py-1.5 rounded text-[#86948a] hover:text-white transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="button"
                  onClick={handleExecutePayroll}
                  className="px-4 py-1.5 bg-[#4edea3] hover:bg-[#40cf95] text-[#003824] rounded font-semibold shadow-sm transition-all cursor-pointer"
                >
                  Confirm & Disburse Payroll
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
