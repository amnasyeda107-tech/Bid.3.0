import React, { useState } from 'react';
import {
  Landmark,
  DollarSign,
  TrendingDown,
  Calendar,
  CreditCard,
  Plus,
  CheckCircle2,
  AlertCircle,
  Clock,
  ArrowDownRight,
  ShieldCheck,
  Calculator,
  X
} from 'lucide-react';
import { LoanItem, LoanPaymentRecord, CashTransaction } from '../../types';

interface LoanManagementViewProps {
  loans: LoanItem[];
  payments: LoanPaymentRecord[];
  onRecordPayment: (payment: LoanPaymentRecord, updatedLoan: LoanItem, outflowTxn: CashTransaction) => void;
  onAddLoan: (loan: LoanItem) => void;
}

export const LoanManagementView: React.FC<LoanManagementViewProps> = ({
  loans,
  payments,
  onRecordPayment,
  onAddLoan,
}) => {
  const [selectedLoanId, setSelectedLoanId] = useState<string>(loans[0]?.id || '');
  const [isPaymentModalOpen, setIsPaymentModalOpen] = useState(false);
  const [isNewLoanModalOpen, setIsNewLoanModalOpen] = useState(false);

  // Extra Principal Payoff Simulation State
  const [extraPayment, setExtraPayment] = useState<number>(500);

  // Payment Form State
  const [payLoanId, setPayLoanId] = useState<string>(loans[0]?.id || '');
  const [payAmount, setPayAmount] = useState<string>('');
  const [payMethod, setPayMethod] = useState<string>('Chase Operating Auto-Debit');

  // New Loan Form State
  const [newLoanName, setNewLoanName] = useState('');
  const [newLender, setNewLender] = useState('');
  const [newType, setNewType] = useState<LoanItem['type']>('Line of Credit');
  const [newPrincipal, setNewPrincipal] = useState('');
  const [newRate, setNewRate] = useState('');
  const [newMonthlyPmt, setNewMonthlyPmt] = useState('');
  const [newMaturity, setNewMaturity] = useState('2026-12-31');

  // Metrics
  const totalDebtBalance = loans.reduce((sum, l) => sum + l.currentBalance, 0);
  const totalMonthlyDebtService = loans.reduce((sum, l) => sum + l.monthlyPayment, 0);
  const totalPrincipalOriginated = loans.reduce((sum, l) => sum + l.principalAmount, 0);
  const weightedRate =
    totalDebtBalance > 0
      ? loans.reduce((sum, l) => sum + l.interestRate * l.currentBalance, 0) / totalDebtBalance
      : 0;

  const activeLoan = loans.find((l) => l.id === selectedLoanId) || loans[0];

  // Payoff calculation simulation for selected loan
  const simBalance = activeLoan ? activeLoan.currentBalance : 0;
  const simRate = activeLoan ? activeLoan.interestRate / 100 / 12 : 0.05 / 12;
  const simBasePmt = activeLoan ? activeLoan.monthlyPayment : 2000;
  const simTotalPmt = simBasePmt + extraPayment;

  // Approximate remaining months
  const standardMonths =
    simRate > 0 && simBasePmt > simBalance * simRate
      ? Math.ceil(
          Math.log(simBasePmt / (simBasePmt - simBalance * simRate)) / Math.log(1 + simRate)
        )
      : 36;

  const acceleratedMonths =
    simRate > 0 && simTotalPmt > simBalance * simRate
      ? Math.ceil(
          Math.log(simTotalPmt / (simTotalPmt - simBalance * simRate)) / Math.log(1 + simRate)
        )
      : 24;

  const monthsSaved = Math.max(0, standardMonths - acceleratedMonths);
  const interestSaved = Math.round(
    Math.max(0, standardMonths * simBasePmt - acceleratedMonths * simTotalPmt)
  );

  const handlePaymentSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const amountNum = parseFloat(payAmount);
    if (isNaN(amountNum) || amountNum <= 0) return;

    const targetLoan = loans.find((l) => l.id === payLoanId);
    if (!targetLoan) return;

    // Estimate interest portion (monthly rate * balance)
    const monthlyRate = targetLoan.interestRate / 100 / 12;
    const interestPortion = Math.min(amountNum * 0.4, targetLoan.currentBalance * monthlyRate);
    const principalPortion = amountNum - interestPortion;
    const newBalance = Math.max(0, targetLoan.currentBalance - principalPortion);

    const paymentRecord: LoanPaymentRecord = {
      id: `LPMT-${Math.floor(100 + Math.random() * 900)}`,
      loanId: targetLoan.id,
      loanName: targetLoan.name,
      date: new Date().toISOString().slice(0, 10),
      amount: amountNum,
      principalPaid: Math.round(principalPortion),
      interestPaid: Math.round(interestPortion),
      remainingBalance: Math.round(newBalance),
      method: payMethod,
    };

    const updatedLoan: LoanItem = {
      ...targetLoan,
      currentBalance: Math.round(newBalance),
      status: newBalance === 0 ? 'Paid Off' : 'Active',
    };

    const outflowTxn: CashTransaction = {
      id: `TXN-2024-${Math.floor(3000 + Math.random() * 7000)}`,
      date: new Date().toISOString().slice(0, 10),
      description: `Loan Debt Service - ${targetLoan.name} (Prin $${Math.round(principalPortion)} + Int $${Math.round(interestPortion)})`,
      category: 'Debt Service & Loans',
      counterparty: targetLoan.lender,
      type: 'outflow',
      amount: amountNum,
      status: 'reconciled',
      paymentMethod: payMethod,
      account: 'Chase Operating ••8491',
      referenceNumber: paymentRecord.id,
    };

    onRecordPayment(paymentRecord, updatedLoan, outflowTxn);
    setIsPaymentModalOpen(false);
    setPayAmount('');
  };

  const handleNewLoanSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const principalNum = parseFloat(newPrincipal);
    const rateNum = parseFloat(newRate);
    const pmtNum = parseFloat(newMonthlyPmt);
    if (isNaN(principalNum) || isNaN(rateNum) || isNaN(pmtNum)) return;

    const newLoanObj: LoanItem = {
      id: `LOAN-0${loans.length + 1}`,
      name: newLoanName,
      lender: newLender,
      type: newType,
      principalAmount: principalNum,
      currentBalance: principalNum,
      interestRate: rateNum,
      monthlyPayment: pmtNum,
      originationDate: new Date().toISOString().slice(0, 10),
      maturityDate: newMaturity,
      nextPaymentDue: '2024-10-15',
      autoPay: true,
      status: 'Active',
      notes: 'Commercial credit facility supporting operations and working capital.',
    };

    onAddLoan(newLoanObj);
    setIsNewLoanModalOpen(false);

    // Reset
    setNewLoanName('');
    setNewLender('');
    setNewPrincipal('');
    setNewRate('');
    setNewMonthlyPmt('');
  };

  return (
    <div className="space-y-6">
      {/* Top Header */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-1.5 font-mono text-[10px] tracking-wider uppercase text-[#86948a] mb-1">
            <span>FINANCING & LIABILITIES</span>
            <span>/</span>
            <span>COMMERCIAL DEBT & LOAN MANAGEMENT</span>
            <span className="w-1.5 h-1.5 rounded-full bg-[#4edea3] ml-1" />
          </div>
          <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-white">
            Loan & Debt Facility Management
          </h1>
          <p className="text-xs sm:text-sm text-[#86948a] mt-0.5">
            Commercial lines of credit, SBA term loans, hardware equipment leases, and amortization schedules
          </p>
        </div>

        <div className="flex items-center gap-2.5 flex-wrap">
          <button
            onClick={() => setIsNewLoanModalOpen(true)}
            className="h-9 px-3.5 bg-[#171f33] hover:bg-[#222a3d] border border-[#2d3449] rounded-md text-xs font-mono text-[#dae2fd] font-medium flex items-center gap-1.5 transition-colors cursor-pointer"
          >
            <Plus className="w-3.5 h-3.5 text-[#86948a]" />
            <span>Add Credit Facility</span>
          </button>
          <button
            onClick={() => {
              if (activeLoan) {
                setPayLoanId(activeLoan.id);
                setPayAmount(activeLoan.monthlyPayment.toString());
              }
              setIsPaymentModalOpen(true);
            }}
            className="h-9 px-4 bg-[#4edea3] hover:bg-[#40cf95] active:scale-[0.98] text-[#003824] rounded-md text-xs font-semibold flex items-center gap-1.5 shadow-sm transition-all cursor-pointer"
          >
            <CreditCard className="w-4 h-4 stroke-[2.5]" />
            <span>Record Loan Repayment</span>
          </button>
        </div>
      </div>

      {/* 4 Loan KPIs */}
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
        <div className="bg-[#131b2e] border border-[#222a3d] rounded-lg p-4">
          <div className="text-xs font-mono text-[#86948a] uppercase font-semibold mb-1">
            Total Outstanding Debt
          </div>
          <div className="text-2xl font-bold font-mono text-white">
            ${totalDebtBalance.toLocaleString()}
          </div>
          <div className="text-[11px] text-[#86948a] mt-2">
            Originated: ${totalPrincipalOriginated.toLocaleString()} (Paid: ${(totalPrincipalOriginated - totalDebtBalance).toLocaleString()})
          </div>
        </div>

        <div className="bg-[#131b2e] border border-[#222a3d] rounded-lg p-4">
          <div className="text-xs font-mono text-[#86948a] uppercase font-semibold mb-1">
            Monthly Debt Service (EMI)
          </div>
          <div className="text-2xl font-bold font-mono text-[#ffb4ab]">
            ${totalMonthlyDebtService.toLocaleString()} / mo
          </div>
          <div className="text-[11px] text-[#4edea3] mt-2 flex items-center gap-1">
            <CheckCircle2 className="w-3.5 h-3.5" />
            <span>100% current on payments • 0 defaults</span>
          </div>
        </div>

        <div className="bg-[#131b2e] border border-[#222a3d] rounded-lg p-4">
          <div className="text-xs font-mono text-[#86948a] uppercase font-semibold mb-1">
            Weighted Average APR
          </div>
          <div className="text-2xl font-bold font-mono text-white">
            {weightedRate.toFixed(2)}%
          </div>
          <div className="text-[11px] text-[#adc6ff] mt-2">
            Favorable commercial rate environment
          </div>
        </div>

        <div className="bg-[#131b2e] border border-[#222a3d] rounded-lg p-4">
          <div className="text-xs font-mono text-[#86948a] uppercase font-semibold mb-1">
            Active Debt Facilities
          </div>
          <div className="text-2xl font-bold font-mono text-[#4edea3]">
            {loans.length} Active Lines
          </div>
          <div className="text-[11px] text-[#86948a] mt-2">
            All secured by receivables & equipment
          </div>
        </div>
      </div>

      {/* Facilities Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {loans.map((loan) => {
          const paidRatio =
            loan.principalAmount > 0
              ? ((loan.principalAmount - loan.currentBalance) / loan.principalAmount) * 100
              : 0;

          return (
            <div
              key={loan.id}
              onClick={() => setSelectedLoanId(loan.id)}
              className={`p-5 rounded-lg border transition-all cursor-pointer ${
                selectedLoanId === loan.id
                  ? 'bg-[#171f33] border-[#4edea3]/50 shadow-md'
                  : 'bg-[#131b2e] border-[#222a3d] hover:border-[#334155]'
              }`}
            >
              <div className="flex items-start justify-between gap-3 mb-2">
                <div>
                  <div className="flex items-center gap-2">
                    <span className="font-mono text-xs font-bold text-white">{loan.name}</span>
                    <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-[#4edea3]/10 text-[#4edea3] border border-[#4edea3]/20">
                      {loan.type}
                    </span>
                  </div>
                  <div className="text-xs text-[#86948a] mt-0.5">Lender: {loan.lender}</div>
                </div>

                <div className="text-right font-mono">
                  <div className="text-lg font-bold text-white">${loan.currentBalance.toLocaleString()}</div>
                  <div className="text-[10px] text-[#86948a]">of ${loan.principalAmount.toLocaleString()}</div>
                </div>
              </div>

              {/* Progress bar */}
              <div className="space-y-1 my-3">
                <div className="flex justify-between text-[11px] font-mono">
                  <span className="text-[#86948a]">Principal Repaid</span>
                  <span className="text-[#4edea3] font-semibold">{paidRatio.toFixed(1)}%</span>
                </div>
                <div className="w-full h-1.5 bg-[#0b1326] rounded-full overflow-hidden">
                  <div
                    className="h-full bg-[#4edea3] rounded-full transition-all duration-300"
                    style={{ width: `${paidRatio}%` }}
                  />
                </div>
              </div>

              <div className="grid grid-cols-3 gap-2 pt-3 border-t border-[#222a3d] text-xs font-mono">
                <div>
                  <div className="text-[10px] text-[#86948a]">Interest Rate</div>
                  <div className="font-bold text-white">{loan.interestRate}% APR</div>
                </div>
                <div>
                  <div className="text-[10px] text-[#86948a]">Monthly EMI</div>
                  <div className="font-bold text-[#ffb4ab]">${loan.monthlyPayment.toLocaleString()}</div>
                </div>
                <div className="text-right">
                  <div className="text-[10px] text-[#86948a]">Next Payment</div>
                  <div className="font-bold text-[#dae2fd]">{loan.nextPaymentDue}</div>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Payoff Simulation & Amortization Calculator */}
      {activeLoan && (
        <div className="bg-[#131b2e] border border-[#222a3d] rounded-lg p-5">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-4">
            <div>
              <h3 className="text-sm font-bold text-white flex items-center gap-2">
                <Calculator className="w-4 h-4 text-[#4edea3]" />
                Accelerated Amortization & Early Payoff Simulator
              </h3>
              <p className="text-[11px] text-[#86948a]">
                Simulating extra principal payments for: <strong>{activeLoan.name}</strong>
              </p>
            </div>

            <div className="flex items-center gap-2 text-xs font-mono">
              <span className="text-[#86948a]">Extra Monthly Payoff:</span>
              <div className="flex items-center gap-1 bg-[#0b1326] border border-[#222a3d] rounded px-2 py-1">
                <span className="text-[#4edea3]">$</span>
                <input
                  type="number"
                  step="100"
                  value={extraPayment}
                  onChange={(e) => setExtraPayment(Math.max(0, parseFloat(e.target.value) || 0))}
                  className="w-20 bg-transparent text-white font-bold focus:outline-none"
                />
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 p-4 bg-[#0b1326] border border-[#222a3d] rounded-lg">
            <div>
              <div className="text-[11px] font-mono text-[#86948a]">Standard Payoff Term</div>
              <div className="text-xl font-bold font-mono text-white mt-1">
                {standardMonths} Months ({ (standardMonths / 12).toFixed(1) } yrs)
              </div>
              <div className="text-[11px] text-[#86948a] mt-1">At base ${activeLoan.monthlyPayment}/mo</div>
            </div>

            <div>
              <div className="text-[11px] font-mono text-[#86948a]">Accelerated Payoff Term</div>
              <div className="text-xl font-bold font-mono text-[#4edea3] mt-1">
                {acceleratedMonths} Months ({ (acceleratedMonths / 12).toFixed(1) } yrs)
              </div>
              <div className="text-[11px] text-[#4edea3] mt-1 font-semibold">
                Saves {monthsSaved} months of payments!
              </div>
            </div>

            <div>
              <div className="text-[11px] font-mono text-[#86948a]">Estimated Cumulative Interest Saved</div>
              <div className="text-xl font-bold font-mono text-white mt-1">
                ${interestSaved.toLocaleString()}
              </div>
              <div className="text-[11px] text-[#86948a] mt-1">Retained corporate capital</div>
            </div>
          </div>
        </div>
      )}

      {/* Payment History Log */}
      <div className="bg-[#131b2e] border border-[#222a3d] rounded-lg p-5">
        <h3 className="text-sm font-bold text-white mb-1 flex items-center gap-2">
          <Clock className="w-4 h-4 text-[#4edea3]" />
          Disbursed Debt Service Ledger
        </h3>
        <p className="text-[11px] text-[#86948a] mb-4">
          Historical principal & interest payments debited from company accounts
        </p>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-[#0b1326] text-[#86948a] font-mono border-b border-[#222a3d]">
              <tr>
                <th className="py-2.5 px-4">Payment ID / Date</th>
                <th className="py-2.5 px-4">Loan Facility</th>
                <th className="py-2.5 px-4">Payment Method</th>
                <th className="py-2.5 px-4">Principal Paid</th>
                <th className="py-2.5 px-4">Interest Paid</th>
                <th className="py-2.5 px-4 text-right">Total Disbursed</th>
                <th className="py-2.5 px-4 text-right">Balance After</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#222a3d]">
              {payments.map((pmt) => (
                <tr key={pmt.id} className="hover:bg-[#171f33]/60 transition-colors">
                  <td className="py-3 px-4 font-mono">
                    <div className="font-semibold text-white">{pmt.id}</div>
                    <div className="text-[11px] text-[#86948a]">{pmt.date}</div>
                  </td>
                  <td className="py-3 px-4">
                    <div className="font-medium text-white">{pmt.loanName}</div>
                  </td>
                  <td className="py-3 px-4 font-mono text-[11px] text-[#dae2fd]">
                    {pmt.method}
                  </td>
                  <td className="py-3 px-4 font-mono text-[#4edea3]">
                    ${pmt.principalPaid.toLocaleString()}
                  </td>
                  <td className="py-3 px-4 font-mono text-[#ffb4ab]">
                    ${pmt.interestPaid.toLocaleString()}
                  </td>
                  <td className="py-3 px-4 text-right font-mono font-bold text-white">
                    ${pmt.amount.toLocaleString()}
                  </td>
                  <td className="py-3 px-4 text-right font-mono text-[#86948a]">
                    ${pmt.remainingBalance.toLocaleString()}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Record Loan Repayment Modal */}
      {isPaymentModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-xs">
          <div className="bg-[#131b2e] border border-[#222a3d] rounded-xl w-full max-w-md shadow-2xl overflow-hidden animate-in fade-in zoom-in-95 duration-150">
            <div className="p-4 border-b border-[#222a3d] flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="p-1.5 rounded-md bg-[#4edea3]/10 text-[#4edea3]">
                  <CreditCard className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="text-sm font-bold text-white">Record Loan Repayment</h3>
                  <p className="text-[11px] text-[#86948a]">Debit debt service payment to creditor</p>
                </div>
              </div>
              <button
                onClick={() => setIsPaymentModalOpen(false)}
                className="p-1 rounded hover:bg-[#171f33] text-[#86948a] hover:text-white"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handlePaymentSubmit} className="p-5 space-y-4 text-xs">
              <div>
                <label className="block text-[11px] font-mono text-[#86948a] mb-1">Credit Facility*</label>
                <select
                  value={payLoanId}
                  onChange={(e) => {
                    setPayLoanId(e.target.value);
                    const l = loans.find((item) => item.id === e.target.value);
                    if (l) setPayAmount(l.monthlyPayment.toString());
                  }}
                  className="w-full px-3 py-2 bg-[#0b1326] border border-[#222a3d] rounded text-white focus:outline-none focus:border-[#4edea3]"
                >
                  {loans.map((l) => (
                    <option key={l.id} value={l.id}>
                      {l.name} (Balance: ${l.currentBalance.toLocaleString()})
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-[11px] font-mono text-[#86948a] mb-1">Repayment Amount ($ USD)*</label>
                <input
                  type="number"
                  step="0.01"
                  required
                  placeholder="e.g. 3850"
                  value={payAmount}
                  onChange={(e) => setPayAmount(e.target.value)}
                  className="w-full px-3 py-2 bg-[#0b1326] border border-[#222a3d] rounded text-white font-mono focus:outline-none focus:border-[#4edea3]"
                />
              </div>

              <div>
                <label className="block text-[11px] font-mono text-[#86948a] mb-1">Funding Account & Method</label>
                <select
                  value={payMethod}
                  onChange={(e) => setPayMethod(e.target.value)}
                  className="w-full px-3 py-2 bg-[#0b1326] border border-[#222a3d] rounded text-white focus:outline-none focus:border-[#4edea3]"
                >
                  <option value="Chase Operating Auto-Debit">Chase Operating ••8491 (Auto-Debit)</option>
                  <option value="Wire Transfer Direct">Wire Transfer Direct</option>
                  <option value="Corporate Amex Direct">Corporate Amex Direct</option>
                </select>
              </div>

              <div className="pt-3 border-t border-[#222a3d] flex items-center justify-end gap-2.5">
                <button
                  type="button"
                  onClick={() => setIsPaymentModalOpen(false)}
                  className="px-3 py-1.5 rounded text-[#86948a] hover:text-white transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-1.5 bg-[#4edea3] hover:bg-[#40cf95] text-[#003824] rounded font-semibold shadow-sm transition-all cursor-pointer"
                >
                  Execute Payment
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Add New Loan Modal */}
      {isNewLoanModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-xs">
          <div className="bg-[#131b2e] border border-[#222a3d] rounded-xl w-full max-w-md shadow-2xl overflow-hidden animate-in fade-in zoom-in-95 duration-150">
            <div className="p-4 border-b border-[#222a3d] flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="p-1.5 rounded-md bg-[#4edea3]/10 text-[#4edea3]">
                  <Landmark className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="text-sm font-bold text-white">Add Credit Facility</h3>
                  <p className="text-[11px] text-[#86948a]">Enroll commercial loan or credit line</p>
                </div>
              </div>
              <button
                onClick={() => setIsNewLoanModalOpen(false)}
                className="p-1 rounded hover:bg-[#171f33] text-[#86948a] hover:text-white"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleNewLoanSubmit} className="p-5 space-y-4 text-xs">
              <div>
                <label className="block text-[11px] font-mono text-[#86948a] mb-1">Facility Name*</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. PNC Equipment Financing Note"
                  value={newLoanName}
                  onChange={(e) => setNewLoanName(e.target.value)}
                  className="w-full px-3 py-2 bg-[#0b1326] border border-[#222a3d] rounded text-white focus:outline-none focus:border-[#4edea3]"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-[11px] font-mono text-[#86948a] mb-1">Lender / Institution*</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. PNC Bank"
                    value={newLender}
                    onChange={(e) => setNewLender(e.target.value)}
                    className="w-full px-3 py-2 bg-[#0b1326] border border-[#222a3d] rounded text-white focus:outline-none focus:border-[#4edea3]"
                  />
                </div>
                <div>
                  <label className="block text-[11px] font-mono text-[#86948a] mb-1">Facility Type</label>
                  <select
                    value={newType}
                    onChange={(e) => setNewType(e.target.value as any)}
                    className="w-full px-3 py-2 bg-[#0b1326] border border-[#222a3d] rounded text-white focus:outline-none focus:border-[#4edea3]"
                  >
                    <option value="Line of Credit">Line of Credit</option>
                    <option value="SBA 7(a) Term">SBA 7(a) Term</option>
                    <option value="Equipment Lease">Equipment Lease</option>
                    <option value="Working Capital">Working Capital</option>
                    <option value="Founder Bridge">Founder Bridge</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-3 gap-3">
                <div>
                  <label className="block text-[11px] font-mono text-[#86948a] mb-1">Principal ($)*</label>
                  <input
                    type="number"
                    required
                    placeholder="100000"
                    value={newPrincipal}
                    onChange={(e) => setNewPrincipal(e.target.value)}
                    className="w-full px-3 py-2 bg-[#0b1326] border border-[#222a3d] rounded text-white font-mono focus:outline-none focus:border-[#4edea3]"
                  />
                </div>
                <div>
                  <label className="block text-[11px] font-mono text-[#86948a] mb-1">Interest APR (%)*</label>
                  <input
                    type="number"
                    step="0.01"
                    required
                    placeholder="6.5"
                    value={newRate}
                    onChange={(e) => setNewRate(e.target.value)}
                    className="w-full px-3 py-2 bg-[#0b1326] border border-[#222a3d] rounded text-white font-mono focus:outline-none focus:border-[#4edea3]"
                  />
                </div>
                <div>
                  <label className="block text-[11px] font-mono text-[#86948a] mb-1">Monthly EMI ($)*</label>
                  <input
                    type="number"
                    required
                    placeholder="2500"
                    value={newMonthlyPmt}
                    onChange={(e) => setNewMonthlyPmt(e.target.value)}
                    className="w-full px-3 py-2 bg-[#0b1326] border border-[#222a3d] rounded text-white font-mono focus:outline-none focus:border-[#4edea3]"
                  />
                </div>
              </div>

              <div>
                <label className="block text-[11px] font-mono text-[#86948a] mb-1">Maturity Date</label>
                <input
                  type="date"
                  value={newMaturity}
                  onChange={(e) => setNewMaturity(e.target.value)}
                  className="w-full px-3 py-2 bg-[#0b1326] border border-[#222a3d] rounded text-white focus:outline-none focus:border-[#4edea3]"
                />
              </div>

              <div className="pt-3 border-t border-[#222a3d] flex items-center justify-end gap-2.5">
                <button
                  type="button"
                  onClick={() => setIsNewLoanModalOpen(false)}
                  className="px-3 py-1.5 rounded text-[#86948a] hover:text-white transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-1.5 bg-[#4edea3] hover:bg-[#40cf95] text-[#003824] rounded font-semibold shadow-sm transition-all cursor-pointer"
                >
                  Enroll Facility
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
