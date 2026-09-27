import React from 'react';

export default function InvoiceModal({ invoice, user, onClose }) {
  if (!invoice) return null;

  const handlePrint = () => {
    window.print();
  };

  const amount = (invoice.amount_cents / 100).toFixed(2);

  return (
    <div className="fixed inset-0 z-50 bg-slate-900/70 backdrop-blur-sm flex items-center justify-center p-4 overflow-y-auto">
      <div className="w-full max-w-2xl rounded-3xl bg-white border border-slate-200 shadow-2xl p-6 sm:p-9 space-y-6 animate-scaleUp my-8 text-slate-900">
        
        {/* Top Actions: Print & Close */}
        <div className="flex items-center justify-between pb-4 border-b border-slate-100">
          <div className="flex items-center gap-2">
            <span className="material-symbols-outlined text-indigo-600 text-[20px]">receipt</span>
            <span className="text-xs font-bold uppercase tracking-wider text-slate-600">Tax Invoice Receipt</span>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={handlePrint}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-xs font-semibold text-slate-700 transition-colors border border-slate-200"
            >
              <span className="material-symbols-outlined text-[16px]">print</span>
              <span>Print / Save PDF</span>
            </button>
            <button
              onClick={onClose}
              className="w-8 h-8 rounded-full flex items-center justify-center text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-colors"
            >
              <span className="material-symbols-outlined text-[18px]">close</span>
            </button>
          </div>
        </div>

        {/* Invoice Printable Sheet */}
        <div className="space-y-6">
          {/* Header & Logo */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-indigo-600 via-indigo-500 to-sky-400 flex items-center justify-center text-white shadow-sm">
                <span className="material-symbols-outlined text-[22px]">auto_awesome</span>
              </div>
              <div>
                <h2 className="text-lg font-bold tracking-tight text-slate-900">ClipForge AI Inc.</h2>
                <p className="text-xs text-slate-500 font-mono">Viral Video Automation Platform</p>
              </div>
            </div>

            <div className="text-left sm:text-right">
              <span className="inline-block text-[11px] font-mono font-bold px-2.5 py-1 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200 uppercase tracking-wider">
                Paid in Full ✓
              </span>
              <p className="text-xs font-mono text-slate-500 mt-1">Invoice: <span className="font-bold text-slate-900">{invoice.invoice_number || 'INV-2026-001'}</span></p>
            </div>
          </div>

          {/* Billed To / Billed From */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 p-4 rounded-2xl bg-slate-50 border border-slate-200/80 text-xs">
            <div>
              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block mb-1">Billed To</span>
              <p className="font-bold text-slate-900 text-sm">{user?.name || invoice.email?.split('@')[0] || 'Subscriber'}</p>
              <p className="text-slate-600 font-mono mt-0.5">{invoice.email}</p>
              <p className="text-slate-500 mt-1">Payment Method: <span className="font-medium text-slate-800">{invoice.card_brand || 'Card'} •••• {invoice.card_last4 || '4242'}</span></p>
            </div>
            <div className="sm:text-right">
              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block mb-1">Invoice Details</span>
              <p className="text-slate-600">Issue Date: <span className="font-semibold text-slate-900">{invoice.created_at || 'Recent'}</span></p>
              <p className="text-slate-600 mt-0.5">Billing Cycle: <span className="font-semibold text-slate-900 capitalize">{invoice.billing_interval || 'Monthly'}</span></p>
              <p className="text-slate-600 mt-0.5">Transaction ID: <span className="font-mono text-slate-500 text-[10px]">{invoice.stripe_session_id?.slice(0, 16) || invoice.id}...</span></p>
            </div>
          </div>

          {/* Itemized Table */}
          <div className="rounded-2xl border border-slate-200 overflow-hidden text-xs">
            <table className="w-full text-left">
              <thead className="bg-slate-50 border-b border-slate-200 text-slate-600 font-bold uppercase tracking-wider text-[10px]">
                <tr>
                  <th className="p-3.5">Description</th>
                  <th className="p-3.5 text-center">Interval</th>
                  <th className="p-3.5 text-right">Amount</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-slate-700">
                <tr>
                  <td className="p-3.5">
                    <span className="font-bold text-slate-900 block">{invoice.plan} Subscription</span>
                    <span className="text-[11px] text-slate-500">Unlimited automated 9:16 re-framing, kinetic subtitles & Pro GPU rendering</span>
                  </td>
                  <td className="p-3.5 text-center font-mono capitalize">
                    {invoice.billing_interval || 'Monthly'}
                  </td>
                  <td className="p-3.5 text-right font-mono font-bold text-slate-900">
                    ${amount}
                  </td>
                </tr>
              </tbody>
            </table>
          </div>

          {/* Totals Summary */}
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-2">
            <div className="text-xs text-slate-500">
              <p className="flex items-center gap-1.5 font-medium">
                <span className="material-symbols-outlined text-emerald-600 text-[16px]">lock</span>
                <span>Processed securely through Stripe Payments</span>
              </p>
              <p className="text-[11px] text-slate-400 mt-0.5">ClipForge AI Inc. • Tax ID: US-84920491-K • All rights reserved.</p>
            </div>

            <div className="w-full sm:w-56 p-3.5 rounded-xl bg-slate-50 border border-slate-200 space-y-1.5 text-xs text-right">
              <div className="flex justify-between text-slate-500">
                <span>Subtotal:</span>
                <span className="font-mono text-slate-800">${amount}</span>
              </div>
              <div className="flex justify-between text-slate-500">
                <span>Tax (0%):</span>
                <span className="font-mono text-slate-800">$0.00</span>
              </div>
              <div className="h-[1px] bg-slate-200 my-1"></div>
              <div className="flex justify-between font-bold text-sm text-slate-900">
                <span>Total Paid:</span>
                <span className="font-mono text-indigo-600">${amount} USD</span>
              </div>
            </div>
          </div>
        </div>

        {/* Footer Close */}
        <div className="pt-2 border-t border-slate-100 flex justify-end">
          <button
            onClick={onClose}
            className="px-5 py-2.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-semibold text-xs transition-colors"
          >
            Done
          </button>
        </div>

      </div>
    </div>
  );
}
