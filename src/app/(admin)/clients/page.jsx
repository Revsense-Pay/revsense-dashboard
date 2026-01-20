'use client';

// Uses theme CSS variables:
// --card-bg
// --card-inset-shadow
// --border-subtle
// --status-active-bg
// --status-active-text
// --status-active-glow
// --status-pending-bg
// --status-pending-text
// --status-pending-glow

export const dynamic = 'force-dynamic';

import { useState, useEffect } from 'react';
import { Button, Alert, Form, Modal } from 'react-bootstrap';
import IconifyIcon from '@/components/wrapper/IconifyIcon';

export default function ClientsPage() {
  const [loading, setLoading] = useState(false);
  const [clientEmail, setClientEmail] = useState('');
  const [clientName, setClientName] = useState('');
  const [subscriptionLink, setSubscriptionLink] = useState(null);
  const [error, setError] = useState(null);
  const [showModal, setShowModal] = useState(false);

  const [clients, setClients] = useState([]);
  const [loadingClients, setLoadingClients] = useState(true);

  useEffect(() => {
    async function loadClients() {
      try {
        const res = await fetch('/api/clients');
        const data = await res.json();
        setClients(data.clients || []);
      } catch {
        setClients([]);
      } finally {
        setLoadingClients(false);
      }
    }
    loadClients();
  }, []);

  async function handleAddClient() {
    setLoading(true);
    setError(null);
    setSubscriptionLink(null);

    if (!clientEmail) {
      setError('Please enter a client email');
      setLoading(false);
      return;
    }

    try {
      const res = await fetch('/api/clients/create-subscription-link', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          clientEmail,
          clientName,
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || 'Failed to generate subscription link');
      }

      setSubscriptionLink(data.url);

      // Re-fetch clients to update list including pending clients
      setLoadingClients(true);
      try {
        const resClients = await fetch('/api/clients');
        const dataClients = await resClients.json();
        setClients(dataClients.clients || []);
      } catch {
        setClients([]);
      } finally {
        setLoadingClients(false);
      }

      setClientEmail('');
      setClientName('');
      setShowModal(false);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="clients-page space-y-4">

      {/* Header */}
      <div className="d-flex justify-content-between align-items-center">
        <div>
          <h1 className="text-2xl fw-semibold mb-1">Clients</h1>
          <p className="text-muted mb-0">
            Manage clients and their billing profiles.
          </p>
        </div>

        <Button
          variant="primary"
          onClick={() => setShowModal(true)}
          disabled={loading}
        >
          <IconifyIcon
            icon="solar:user-plus-outline"
            className="me-2"
          />
          Add Client
        </Button>
      </div>

      {/* Error */}
      {error && (
        <Alert variant="danger">
          {error}
        </Alert>
      )}

      {loadingClients ? (
        <div className="text-center text-muted py-5">Loading clients…</div>
      ) : clients.length === 0 ? (
        <div
          className="border rounded-3 p-5 text-center"
          style={{
            minHeight: 240,
            background: '#2b3138',
            border: '1px solid rgba(255,255,255,0.06)',
            borderRadius: 12
          }}
        >
          <IconifyIcon
            icon="solar:users-group-rounded-outline"
            className="text-muted mb-3"
            style={{ fontSize: 48 }}
          />
          <h5 className="mb-2 text-light">No clients yet</h5>
          <p className="text-muted mb-4">
            Add a client to start charging them via Paystack.
          </p>
          <Button
            variant="outline-primary"
            onClick={() => setShowModal(true)}
            disabled={loading}
          >
            Add your first client
          </Button>
        </div>
      ) : (
        <div
          className="rounded-4 mt-4 clients-table-wrapper"
          style={{ background: 'var(--card-bg)' }}
        >
          <div className="table-responsive">
            <table
              className="table table-hover mb-0 align-middle"
            >
            <thead
              className="text-muted small"
            >
              <tr>
                <th>Name</th>
                <th>Status</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {clients.map((client, idx) => (
                <tr
                  key={idx}
                >
                  <td>
                    {client.name ? (
                      <>
                        <div>{client.name}</div>
                        <small className="text-muted">{client.email}</small>
                      </>
                    ) : (
                      client.email
                    )}
                  </td>
                  <td>
                    {client.status === 'ACTIVE' ? (
                      <span
                        className="badge rounded-pill px-3 py-1"
                        style={{
                          background: '#2ecc71',
                          color: '#0b1f14'
                        }}
                      >
                        Active
                      </span>
                    ) : (
                      <span
                        className="badge rounded-pill px-3 py-1"
                        style={{
                          background: '#f0ad4e',
                          color: '#1f1405'
                        }}
                      >
                        Pending
                      </span>
                    )}
                  </td>
                  <td>
                    {client.status === 'PENDING' && client.subscriptionUrl ? (
                      <Button
                        variant="primary"
                        size="sm"
                        className="px-3"
                        onClick={() => navigator.clipboard.writeText(client.subscriptionUrl)}
                      >
                        Copy link
                      </Button>
                    ) : (
                      <span className="text-muted">–</span>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
            </table>
          </div>
        </div>
      )}

      <Modal show={showModal} onHide={() => { setShowModal(false); setClientEmail(''); setClientName(''); setError(null); }} centered>
        <Modal.Header closeButton>
          <Modal.Title>Add Client</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form.Group controlId="clientName" className="mb-3">
            <Form.Label>Client Name (optional)</Form.Label>
            <Form.Control
              type="text"
              placeholder="Enter client name"
              value={clientName}
              onChange={(e) => setClientName(e.target.value)}
              disabled={loading}
              autoFocus
            />
          </Form.Group>
          <Form.Group controlId="clientEmail">
            <Form.Label>Client Email</Form.Label>
            <Form.Control
              type="email"
              placeholder="Enter client email"
              value={clientEmail}
              onChange={(e) => setClientEmail(e.target.value)}
              disabled={loading}
              autoFocus={!clientName}
            />
          </Form.Group>
          {error && (
            <Alert variant="danger" className="mt-3">
              {error}
            </Alert>
          )}
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => { setShowModal(false); setClientEmail(''); setClientName(''); setError(null); }} disabled={loading}>
            Cancel
          </Button>
          <Button variant="primary" onClick={handleAddClient} disabled={loading}>
            {loading ? 'Generating link…' : 'Add Client'}
          </Button>
        </Modal.Footer>
      </Modal>

    </div>
  );
}