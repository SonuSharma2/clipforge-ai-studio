import React, { useState, useEffect } from 'react';
import { useApp } from '../context/AppContext';
import InvoiceModal from './InvoiceModal';

export default function BillingModal({ isOpen, onClose }) {
  const { user, setCurrentPage, addToast } = useApp();
  const [billingData, setBillingData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [selectedInvoice, setSelectedInvoice] = useState(null);

  useEffect(() => {
    if (isOpen && user?.email) {
      setLoading(true);
      fetch(`http://127.0.0.1:8888/api/user/billing?email=${encodeURIComponent(user.email)}`)
        .then(res => res.json())
        .then(data => {
          setBillingData(data);
          setLoading(false);
        })
        .catch(err => {
          console.warn('Billing fetch error:', err);
          setLoading(false);
        });
    }
  }, [isOpen, user]);

  if (!isOpen) return null;

  const planName = user?.plan || billingData?.plan || 'Creator Free';
  const isPro = planName.includes('Pro');
  const isScale = planName.includes('Scale');
  const isPaid = isPro || isScale;

  return (
    <>
      <div className="fixed inset-0 z-50 bg-slate-900/70 backdrop-blur-sm flex items-center justify-center p-4 overflow-y-auto">
        <div className="w-full max-w-2xl rounded-3xl bg-white border border-slate-200 shadow-2xl p-6 sm:p-8 space-y-6 animate-scaleUp my-8 text-slate-900">
          
          {/* Header */}
          <div className="flex items-center justify-between pb-3 border-b border-slate-100">
            <div className="flex items-center gap-2.5">
              <div className="w-9 h-9 rounded-xl bg-indigo-50 border border-indigo-200 text-indigo-600 flex items-center justify-center shadow-xs">
                <span className="material-symbols-outlined text-[20px]">account_balance_wallet</span>
              </div>
              <div>
                <h3 className="font-bold text-base text-slate-900">Billing & Invoices</h3>
                <p className="text-xs text-slate-500">Manage Stripe subscription, payment methods & receipts</p>
              </div>
            </div>
            <button
              onClick={onClose}
              className="w-8 h-8 rounded-full flex items-center justify-center text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-colors"
            >
              <span className="material-symbols-outlined text-[18px]">close</span>
            </button>
          </div>

          {/* Current Subscription Card */}
          <div className="p-5 rounded-2xl bg-gradient-to-br from-slate-50 to-indigo-50/40 border border-slate-200 space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div>
                <div className="flex items-center gap-2">
                  <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">Active Plan</span>
                  <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-extrabold uppercase tracking-wider bg-emerald-100 text-emerald-800 border border-emerald-200">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-600 animate-pulse"></span>
                    Active
                  </span>
                </div>
                <h4 className="text-2xl font-extrabold text-slate-900 mt-1">{planName}</h4>
                <p className="text-xs text-slate-500 font-medium">
                  {isPaid ? 'Billed via Stripe Payments' : 'Free tier (No credit card needed)'}
                </p>
              </div>

              <div className="flex items-center gap-2">
                <button
                  onClick={() => {
                    onClose();
                    setCurrentPage('pricing');
                  }}
                  className="px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-semibold text-xs transition-colors shadow-xs"
                >
                  {isPaid ? 'Change Plan' : 'Upgrade Plan'}
                </button>
              </div>
            </div>

            {/* Metrics Breakdown */}
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 pt-2 border-t border-slate-200/60 text-xs">
              <div>
                <span className="text-slate-400 block text-[11px]">Credits Remaining:</span>
                <span className="font-bold text-emerald-600 text-sm">{user?.credits || billingData?.credits || 10} Credits</span>
              </div>
              <div>
                <span className="text-slate-400 block text-[11px]">Billing Interval:</span>
                <span className="font-semibold text-slate-800 text-sm capitalize">{billingData?.billingInterval || 'Monthly'}</span>
              </div>
              <div className="col-span-2 sm:col-span-1">
                <span className="text-slate-400 block text-[11px]">Payment Method:</span>
                <span className="font-mono text-slate-800 text-xs flex items-center gap-1 mt-0.5">
                  <span className="material-symbols-outlined text-[15px] text-indigo-600">credit_card</span>
                  •••• 4242 (Stripe)
                </span>
              </div>
            </div>
          </div>

          {/* Invoices History Table */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <h4 className="text-xs font-bold uppercase tracking-wider text-slate-600 flex items-center gap-1.5">
                <span className="material-symbols-outlined text-[16px] text-indigo-600">receipt_long</span>
                <span>Payment Invoices & Receipts</span>
              </h4>
              <span className="text-[11px] text-slate-400 font-mono">
                {billingData?.payments?.length || 0} Invoices on File
              </span>
            </div>

            {loading ? (
              <div className="py-8 text-center text-xs text-slate-500 flex items-center justify-center gap-2">
                <span className="material-symbols-outlined text-[18px] animate-spin">progress_activity</span>
                <span>Loading invoices from database...</span>
              </div>
            ) : !billingData?.payments || billingData.payments.length === 0 ? (
              <div className="p-8 rounded-2xl bg-slate-50 border border-slate-200 text-center space-y-2">
                <span className="material-symbols-outlined text-[32px] text-slate-300 block">receipt</span>
                <p className="text-xs font-semibold text-slate-700">No payment invoices yet</p>
                <p className="text-[11px] text-slate-400">Invoices will appear here automatically after your first Stripe payment.</p>
                <button
                  onClick={() => {
                    onClose();
                    setCurrentPage('pricing');
                  }}
                  className="mt-2 px-3 py-1.5 rounded-lg bg-indigo-50 text-indigo-700 text-xs font-semibold hover:bg-indigo-100 transition-colors"
                >
                  View Subscription Tiers
                </button>
              </div>
            ) : (
              <div className="rounded-2xl border border-slate-200 overflow-hidden text-xs">
                <table className="w-full text-left">
                  <thead className="bg-slate-50 border-b border-slate-200 text-slate-500 text-[10px] uppercase font-bold tracking-wider">
                    <tr>
                      <th className="p-3">Invoice #</th>
                      <th className="p-3">Date</th>
                      <th className="p-3">Plan</th>
                      <th className="p-3 text-right">Amount</th>
                      <th className="p-3 text-center">Status</th>
                      <th className="p-3 text-right">Action</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 text-slate-700">
                    {billingData.payments.map((p, idx) => (
                      <tr key={idx} className="hover:bg-slate-50/80 transition-colors">
                        <td className="p-3 font-mono font-bold text-slate-900 text-[11px]">
                          {p.invoice_number || `INV-2026-${idx + 101}`}
                        </td>
                        <td className="p-3 text-slate-500 text-[11px]">
                          {p.created_at?.split(' ')[0] || 'Recent'}
                        </td>
                        <td className="p-3 font-semibold text-slate-900">
                          {p.plan}
                        </td>
                        <td className="p-3 text-right font-mono font-bold text-slate-900">
                          ${(p.amount_cents / 100).toFixed(2)}
                        </td>
                        <td className="p-3 text-center">
                          <span className="inline-block text-[10px] font-bold text-emerald-700 bg-emerald-50 border border-emerald-200 px-2 py-0.5 rounded-full">
                            Paid ✓
                          </span>
                        </td>
                        <td className="p-3 text-right">
                          <button
                            onClick={() => setSelectedInvoice(p)}
                            className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-slate-100 hover:bg-indigo-50 hover:text-indigo-700 text-slate-700 font-semibold text-[11px] transition-colors"
                          >
                            <span className="material-symbols-outlined text-[14px]">visibility</span>
                            <span>Invoice</span>
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>

          {/* Footer */}
          <div className="pt-2 border-t border-slate-100 flex items-center justify-between">
            <span className="text-[11px] text-slate-400 font-medium flex items-center gap-1">
              <span className="material-symbols-outlined text-[15px] text-indigo-600">lock</span>
              <span>Encrypted Stripe Invoicing Service</span>
            </span>
            <button
              onClick={onClose}
              className="px-4 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold text-xs transition-colors"
            >
              Done
            </button>
          </div>

        </div>
      </div>

      {/* Printable Invoice Modal */}
      {selectedInvoice && (
        <InvoiceModal
          invoice={selectedInvoice}
          user={user}
          onClose={() => setSelectedInvoice(null)}
        />
      )}
    </>
  );
}
