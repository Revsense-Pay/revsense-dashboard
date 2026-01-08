"use client";

export const dynamic = 'force-dynamic';

import { useEffect, useState } from "react";
import { Alert } from "react-bootstrap";

export default function TransactionsPage() {
  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    async function loadTransactions() {
      try {
        const res = await fetch("/api/transactions");
        const data = await res.json();

        if (!res.ok) {
          throw new Error(data.error || "Failed to load transactions");
        }

        setTransactions(data.transactions || []);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    }

    loadTransactions();
  }, []);

  return (
    <div
      className="space-y-4"
      style={{
        background: "var(--page-bg-secondary, #1f252b)",
        padding: 24,
        borderRadius: 16,
      }}
    >
      {/* Header */}
      <div>
        <h1 className="text-2xl fw-semibold mb-1">Transactions</h1>
        <p className="text-muted mb-0">
          View all processed charges and billing activity.
        </p>
      </div>

      {error && <Alert variant="danger">{error}</Alert>}

      {loading ? (
        <div className="text-center text-muted py-5">
          Loading transactions…
        </div>
      ) : transactions.length === 0 ? (
        <div
          className="border rounded-3 p-5 text-center d-flex flex-column align-items-center justify-content-center"
          style={{
            minHeight: 260,
            background: "#2b3138",
            border: "1px solid rgba(255,255,255,0.06)",
            borderRadius: 14,
            boxShadow: "0 0 0 rgba(46, 204, 113, 0)",
          }}
        >
          <div
            className="mb-3 d-flex align-items-center justify-content-center rounded-circle"
            style={{
              width: 56,
              height: 56,
              background: "rgba(220, 101, 22, 0.12)",
              boxShadow: "0 0 24px rgba(234, 89, 17, 0.35)",
            }}
          >
            <span style={{ fontSize: 26 }}>💳</span>
          </div>

          <h5 className="text-muted mb-0">No transactions yet</h5>

          <p className="text-muted mb-0" style={{ maxWidth: 420 }}>
            Charges will appear here once clients are billed.
          </p>
        </div>
      ) : (
        <div
          className="rounded-4 mt-4 overflow-hidden"
          style={{
            background: "var(--card-bg)",
          }}
        >
          <table className="table table-hover mb-0 align-middle">
            <thead className="text-muted small">
              <tr>
                <th>Client</th>
                <th>Amount</th>
                <th>Status</th>
                <th>Date</th>
                <th>Reference</th>
              </tr>
            </thead>
            <tbody>
              {transactions.map((tx) => (
                <tr key={tx.id}>
                  <td>
                    {tx.client?.name ? (
                      <>
                        <div>{tx.client.name}</div>
                        <small className="text-muted">
                          {tx.client.email}
                        </small>
                      </>
                    ) : (
                      tx.client?.email || "—"
                    )}
                  </td>

                  <td>
                    R {(tx.amount / 100).toFixed(2)}
                  </td>

                  <td>
                    {tx.status === "SUCCESS" ? (
                      <span
                        className="badge rounded-pill px-3 py-1"
                        style={{
                          background: "#2ecc71",
                          color: "#0b1f14",
                        }}
                      >
                        Success
                      </span>
                    ) : tx.status === "FAILED" ? (
                      <span
                        className="badge rounded-pill px-3 py-1"
                        style={{
                          background: "#e74c3c",
                          color: "#2b0b0b",
                        }}
                      >
                        Failed
                      </span>
                    ) : (
                      <span
                        className="badge rounded-pill px-3 py-1"
                        style={{
                          background: "#f0ad4e",
                          color: "#1f1405",
                        }}
                      >
                        Pending
                      </span>
                    )}
                  </td>

                  <td>
                    {new Date(tx.createdAt).toLocaleDateString()}
                  </td>

                  <td className="text-muted small">
                    {tx.paystackReference || "—"}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}