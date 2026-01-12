'use client'

export const dynamic = 'force-dynamic';

import { useEffect, useState } from 'react'
import { Button, Modal } from 'react-bootstrap'
import { Card, CardBody, CardHeader, Row, Col, Table, Spinner } from 'react-bootstrap'
import { toast } from 'sonner'

type UsagePreviewClient = {
  accountId: string
  name: string | null
  grossCents: number
  feeCents: number
  snapshot: null | {
    id: string
    status: 'DRAFT' | 'FINALISED' | 'CHARGED'
  }
}

async function postAction(url: string, body: any) {
  const res = await fetch(url, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(body),
  })

  if (!res.ok) {
    const data = await res.json().catch(() => ({}))
    throw new Error(data.error || 'Action failed')
  }
}

type Snapshot = {
  id: string
  period: string
  grossCents: number
  feeCents: number
  status: 'DRAFT' | 'FINALISED' | 'CHARGED'
  account: {
    id: string
    email: string
    companyName?: string | null
  }
}

export default function AdminUsagePage() {
  const [period, setPeriod] = useState('')
  const [loading, setLoading] = useState(true)
  const [snapshots, setSnapshots] = useState<Snapshot[]>([])
  const [totals, setTotals] = useState({ grossCents: 0, feeCents: 0 })
  const [actionLoading, setActionLoading] = useState(false)
  const [confirm, setConfirm] = useState<{ type: 'finalise' | 'charge'; snapshotId: string } | null>(null)

  const [previewClients, setPreviewClients] = useState<UsagePreviewClient[]>([])
  const [previewLoading, setPreviewLoading] = useState(true)

function calculatePreviewTotals(clients: UsagePreviewClient[]) {
  return clients.reduce(
    (acc, c) => {
      acc.grossCents += c.grossCents
      acc.feeCents += c.feeCents
      return acc
    },
    { grossCents: 0, feeCents: 0 }
  )
}

  useEffect(() => {
    async function load() {
      setLoading(true)
      setPreviewLoading(true)

      const [snapRes, previewRes] = await Promise.all([
        fetch(`/api/admin/usage-snapshots${period ? `?period=${period}` : ''}`),
        fetch(`/api/admin/usage-preview${period ? `?period=${period}` : ''}`)
      ])

      const snapData = await snapRes.json()
      const previewData = await previewRes.json()

      setSnapshots(snapData.snapshots || [])
      if (snapData.snapshots && snapData.snapshots.length > 0) {
        setTotals(snapData.totals || { grossCents: 0, feeCents: 0 })
      } else {
        setTotals(calculatePreviewTotals(previewData.clients || []))
      }
      setPreviewClients(previewData.clients || [])

      setLoading(false)
      setPreviewLoading(false)
    }
    load()
  }, [period])

  async function runConfirmedAction() {
    if (!confirm) return
    setActionLoading(true)
    try {
      if (confirm.type === 'finalise') {
        await postAction('/api/admin/usage-snapshots/finalise', {
          snapshotId: confirm.snapshotId,
        })
        toast.success('Snapshot finalised successfully')
      } else if (confirm.type === 'charge') {
        await postAction('/api/admin/usage-snapshots/charge', {
          snapshotId: confirm.snapshotId,
        })
        toast.success('Snapshot charged successfully')
      }

      // reload data
      const res = await fetch(
        `/api/admin/usage-snapshots${period ? `?period=${period}` : ''}`
      )
      const data = await res.json()
      setSnapshots(data.snapshots || [])
      setTotals(data.totals || { grossCents: 0, feeCents: 0 })
    } catch (error: any) {
      toast.error(error.message || 'Action failed')
    } finally {
      setActionLoading(false)
      setConfirm(null)
    }
  }

  return (
    <div className="page-content">
      <Row>
        <Col xs={12}>
          <div className="page-title-box">
            <h4 className="mb-1">Usage Billing</h4>
            <p className="text-muted mb-0">
              Monthly revenue snapshots and usage fees.
            </p>
          </div>
        </Col>
      </Row>

      <Row className="g-4">
        <Col xl={12}>
          <Card className="h-100">
            <CardHeader className="d-flex justify-content-between align-items-center">
              <h5 className="mb-0">Usage Snapshots</h5>

              <input
                type="month"
                className="form-control form-control-sm"
                style={{ width: 160 }}
                value={period}
                onChange={(e) => setPeriod(e.target.value)}
                placeholder="YYYY-MM"
              />
            </CardHeader>

            <CardBody>
              <Row className="mb-4">
                <Col md={6}>
                  <div className="p-3 rounded" style={{ background: 'var(--card-bg)', color: 'inherit' }}>
                    <div className="text-muted small">Total Gross</div>
                    <div className="fw-semibold fs-5">
                      R {(totals.grossCents / 100).toFixed(2)}
                    </div>
                  </div>
                </Col>

                <Col md={6}>
                  <div className="p-3 rounded" style={{ background: 'var(--card-bg)', color: 'inherit' }}>
                    <div className="text-muted small">Total Usage Fees</div>
                    <div className="fw-semibold fs-5">
                      R {(totals.feeCents / 100).toFixed(2)}
                    </div>
                  </div>
                </Col>
              </Row>

              {loading ? (
                <div className="text-center py-5 text-muted">
                  <Spinner size="sm" className="me-2" />
                  Loading usage snapshots…
                </div>
              ) : snapshots.length === 0 && previewClients.length > 0 ? (
                <Table responsive hover className="mb-0 align-middle">
                  <thead className="text-muted small">
                    <tr>
                      <th>Account</th>
                      <th>Gross (so far)</th>
                      <th>Usage Fee</th>
                      <th>Status</th>
                      <th>Action</th>
                    </tr>
                  </thead>
                  <tbody>
                    {previewClients.map((c) => (
                      <tr key={c.accountId}>
                        <td>
                          <div className="fw-semibold">
                            {c.name || 'Unnamed account'}
                          </div>
                        </td>
                        <td>R {(c.grossCents / 100).toFixed(2)}</td>
                        <td>R {(c.feeCents / 100).toFixed(2)}</td>
                        <td>
                          <span className="badge bg-warning text-dark">NOT CREATED</span>
                        </td>
                        <td>
                          <Button
                            size="sm"
                            variant="primary"
                            disabled={actionLoading}
                            onClick={async () => {
                              try {
                                setActionLoading(true)
                                await postAction('/api/admin/usage-snapshots/create', {
                                  accountId: c.accountId,
                                  period,
                                })
                                toast.success('Snapshot created')

                                // reload snapshots + preview
                                const [snapRes, previewRes] = await Promise.all([
                                  fetch(`/api/admin/usage-snapshots${period ? `?period=${period}` : ''}`),
                                  fetch(`/api/admin/usage-preview${period ? `?period=${period}` : ''}`)
                                ])

                                const snapData = await snapRes.json()
                                const previewData = await previewRes.json()

                                setSnapshots(snapData.snapshots || [])
                                setTotals(snapData.totals || { grossCents: 0, feeCents: 0 })
                                setPreviewClients(previewData.clients || [])
                              } catch (err: any) {
                                toast.error(err.message || 'Failed to create snapshot')
                              } finally {
                                setActionLoading(false)
                              }
                            }}
                          >
                            Create Snapshot
                          </Button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </Table>
              ) : snapshots.length === 0 ? (
                <div className="text-center text-muted py-5">
                  No snapshots for this period
                </div>
              ) : (
                <Table responsive hover className="mb-0 align-middle">
                  <thead className="text-muted small">
                    <tr>
                      <th>Account</th>
                      <th>Gross Revenue</th>
                      <th>Usage Fee</th>
                      <th>Billing Status</th>
                      <th>Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {snapshots.map((s) => (
                      <tr key={s.id}>
                        <td>
                          <div>
                            {s.account.companyName ?? '—'}
                          </div>
                          <small className="text-muted">
                            {s.account.email}
                          </small>
                        </td>
                        <td>
                          R {(s.grossCents / 100).toFixed(2)}
                        </td>
                        <td>
                          R {(s.feeCents / 100).toFixed(2)}
                        </td>
                        <td>
                          {s.status === 'DRAFT' && (
                            <span className="badge bg-secondary">DRAFT</span>
                          )}
                          {s.status === 'FINALISED' && (
                            <span className="badge bg-warning text-dark">FINALISED</span>
                          )}
                          {s.status === 'CHARGED' && (
                            <span className="badge bg-success">CHARGED</span>
                          )}
                        </td>
                        <td>
                          {s.status === 'DRAFT' && (
                            <Button
                              size="sm"
                              variant="outline-primary"
                              onClick={() => setConfirm({ type: 'finalise', snapshotId: s.id })}
                              disabled={actionLoading}
                            >
                              Finalise
                            </Button>
                          )}
                          {s.status === 'FINALISED' && (
                            <Button
                              size="sm"
                              variant="primary"
                              onClick={() => setConfirm({ type: 'charge', snapshotId: s.id })}
                              disabled={actionLoading}
                            >
                              Charge
                            </Button>
                          )}
                          {s.status === 'CHARGED' && (
                            <span
                              className="badge bg-success-subtle text-success fw-semibold"
                              title="This snapshot has already been charged and cannot be billed again"
                            >
                              Charged
                            </span>
                          )}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </Table>
              )}
            </CardBody>
          </Card>
        </Col>
      </Row>

      <Modal show={!!confirm} onHide={() => !actionLoading && setConfirm(null)} centered>
        <Modal.Header closeButton={!actionLoading}>
          <Modal.Title>
            {confirm?.type === 'finalise' ? 'Confirm Finalise' : 'Confirm Charge'}
          </Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {confirm?.type === 'finalise' && (
            <p>Finalising will lock revenue for this month.</p>
          )}
          {confirm?.type === 'charge' && (
            <p>Charging will debit the customer.</p>
          )}
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setConfirm(null)} disabled={actionLoading}>
            Cancel
          </Button>
          <Button variant="primary" onClick={runConfirmedAction} disabled={actionLoading}>
            {actionLoading ? (
              <>
                <Spinner animation="border" size="sm" className="me-2" />
                Processing…
              </>
            ) : confirm?.type === 'finalise' ? 'Finalise' : 'Charge'}
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
  )
}