"use client"

import { useEffect, useState } from "react"
import { toast } from "sonner"

export default function SettingsPage() {
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)

  const [paystackPublicKey, setPaystackPublicKey] = useState("")
  const [paystackSecretKey, setPaystackSecretKey] = useState("")

  const [accountEmail, setAccountEmail] = useState("")
  const [currentPassword, setCurrentPassword] = useState("")
  const [newPassword, setNewPassword] = useState("")
  const [confirmPassword, setConfirmPassword] = useState("")

  useEffect(() => {
    fetch("/api/settings", {
      credentials: "include",
    })
      .then(res => res.json())
      .then(data => {
        if (data.success) {
          setPaystackPublicKey(data.settings?.paystackPublicKey || "")
          setPaystackSecretKey(data.settings?.paystackSecretKey || "")
          setAccountEmail(data.settings?.email || "")
        }
      })
      .finally(() => setLoading(false))
  }, [])

  async function handleSave() {
    setSaving(true)

    try {
      const res = await fetch("/api/settings/api-keys", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({
          paystackPublicKey,
          paystackSecretKey,
        }),
      })

      const data = await res.json()
      if (!data.success) throw new Error()

      toast.success("Settings updated")
    } catch {
      toast.error("Failed to save settings")
    } finally {
      setSaving(false)
    }
  }

  async function handleSaveEmail() {
    try {
      const res = await fetch("/api/settings/account", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({ email: accountEmail }),
      })

      const data = await res.json()
      if (!data.success) throw new Error(data.error)

      toast.success("Email updated")
    } catch (err) {
      toast.error(err.message || "Failed to update email")
    }
  }

  async function handleUpdatePassword() {
    if (newPassword !== confirmPassword) {
      toast.error("Passwords do not match")
      return
    }

    try {
      const res = await fetch("/api/settings/password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({
          currentPassword,
          newPassword,
          confirmPassword,
        }),
      })

      const data = await res.json()
      if (!data.success) throw new Error(data.error)

      toast.success("Password updated")

      setCurrentPassword("")
      setNewPassword("")
      setConfirmPassword("")
    } catch (err) {
      toast.error(err.message || "Failed to update password")
    }
  }

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
        <h1 className="text-2xl fw-semibold mb-1">Settings</h1>
        <p className="text-muted mb-0">
          Configure your RevSense account.
        </p>
      </div>

      {/* Account Settings Card */}
      <div
        className="rounded-4 mt-4"
        style={{
          background: "var(--card-bg)",
          padding: 24,
          maxWidth: 640,
        }}
      >
        <div className="mb-4">
          <h5 className="mb-1">Account</h5>
          <p className="text-muted mb-0">
            Manage your account email and password.
          </p>
        </div>

        {/* Email */}
        <div className="mb-4">
          <label className="form-label">Account Email</label>
          <input
            type="email"
            className="form-control"
            value={accountEmail}
            onChange={e => setAccountEmail(e.target.value)}
            placeholder="you@company.com"
          />
        </div>

        <div className="d-flex justify-content-end mb-4">
          <button
            className="btn btn-primary px-4"
            onClick={handleSaveEmail}
          >
            Save email
          </button>
        </div>

        <hr style={{ borderColor: "rgba(255,255,255,0.06)" }} />

        {/* Password */}
        <div className="mt-4">
          <h6 className="mb-3">Change Password</h6>

          <div className="mb-3">
            <label className="form-label">Current Password</label>
            <input
              type="password"
              className="form-control"
              value={currentPassword}
              onChange={e => setCurrentPassword(e.target.value)}
            />
          </div>

          <div className="mb-3">
            <label className="form-label">New Password</label>
            <input
              type="password"
              className="form-control"
              value={newPassword}
              onChange={e => setNewPassword(e.target.value)}
            />
          </div>

          <div className="mb-4">
            <label className="form-label">Confirm New Password</label>
            <input
              type="password"
              className="form-control"
              value={confirmPassword}
              onChange={e => setConfirmPassword(e.target.value)}
            />
          </div>

          <div className="d-flex justify-content-end">
            <button
              className="btn btn-primary px-4"
              onClick={handleUpdatePassword}
            >
              Update password
            </button>
          </div>
        </div>
      </div>

      {/* API Keys Card */}
      <div
        className="rounded-4 mt-4"
        style={{
          background: "var(--card-bg)",
          padding: 24,
          maxWidth: 640,
        }}
      >
        {loading ? (
          <div className="text-muted">Loading settings…</div>
        ) : (
          <>
            <div className="mb-4">
              <h5 className="mb-1">API Keys</h5>
              <p className="text-muted mb-0">
                These keys are used to connect your Paystack account.
              </p>
            </div>

            <div className="mb-4">
              <label className="form-label">Paystack Public Key</label>
              <input
                className="form-control"
                value={paystackPublicKey}
                onChange={e => setPaystackPublicKey(e.target.value)}
                placeholder="pk_test_..."
              />
              <div className="text-muted small mt-1">
                Used on the frontend to initialize Paystack payments.
              </div>
            </div>

            <div className="mb-4">
              <label className="form-label">Paystack Secret Key</label>
              <input
                type="password"
                className="form-control"
                value={paystackSecretKey}
                onChange={e => setPaystackSecretKey(e.target.value)}
                placeholder="sk_test_..."
              />
              <div className="text-muted small mt-1">
                Keep this key private. It is never exposed to clients.
              </div>
            </div>

            <div className="d-flex justify-content-end">
              <button
                onClick={handleSave}
                disabled={saving}
                className="btn btn-primary px-4"
              >
                {saving ? "Saving…" : "Save changes"}
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  )
}