import { useEffect, useMemo, useState } from 'react'
import './App.css'
import { AdminLogin } from './components/admin/AdminLogin.jsx'
import { AdminPanel } from './components/admin/AdminPanel.jsx'
import { AppHeader } from './components/AppHeader.jsx'
import { ParentView } from './components/ParentView.jsx'
import { ReservationModal } from './components/ReservationModal.jsx'
import { StatusMessage } from './components/StatusMessage.jsx'
import { useAdminSession } from './hooks/useAdminSession.js'
import { useKermesseData } from './hooks/useKermesseData.js'
import { DEFAULT_FORM_DATA } from './utils/constants.js'

export default function App() {
  const [selectedSlot, setSelectedSlot] = useState(null)
  const [formData, setFormData] = useState(DEFAULT_FORM_DATA)
  const [mode, setMode] = useState('parents')

  const admin = useAdminSession()
  const kermesse = useKermesseData()
  const loadKermesseData = kermesse.loadData

  useEffect(() => {
    loadKermesseData()
  }, [admin.user, loadKermesseData])

  const reservations = useMemo(
    () =>
      kermesse.stands.flatMap((stand) =>
        stand.slots
          .filter((slot) => slot.reservation)
          .map((slot) => ({
            id: slot.reservation.id,
            stand: stand.name,
            time: slot.time,
            parent: slot.reservation,
          })),
      ),
    [kermesse.stands],
  )

  const showAdmin = mode === 'admin'

  const openReservation = (stand, slot) => {
    setSelectedSlot({ stand, slot })
    setFormData(DEFAULT_FORM_DATA)
  }

  const closeReservation = () => {
    setSelectedSlot(null)
    setFormData(DEFAULT_FORM_DATA)
  }

  const confirmReservation = async () => {
    if (!selectedSlot) return

    await kermesse.reserveSlot(selectedSlot.slot.id, formData)
    closeReservation()
  }

  const enterAdminMode = () => {
    setMode('admin')
  }

  const leaveAdminMode = () => {
    setMode('parents')
  }

  return (
    <main className="app-shell">
      <AppHeader
        adminUser={admin.user}
        mode={mode}
        onEnterAdmin={enterAdminMode}
        onLeaveAdmin={leaveAdminMode}
        onLogout={admin.logout}
      />

      <StatusMessage type="error" message={kermesse.error || admin.error} />
      <StatusMessage type="success" message={kermesse.successMessage} />

      {showAdmin ? (
        admin.user ? (
          <AdminPanel
            loading={kermesse.loading || kermesse.saving}
            onAddSlot={kermesse.addSlot}
            onAddStand={kermesse.addStand}
            onCancelReservation={kermesse.cancelReservation}
            onDeleteSlot={kermesse.deleteSlot}
            onDeleteStand={kermesse.deleteStand}
            onRefresh={kermesse.loadData}
            reservations={reservations}
            stands={kermesse.stands}
          />
        ) : (
          <AdminLogin
            adminEmail={admin.adminEmail}
            loading={admin.loading}
            onLogin={admin.login}
          />
        )
      ) : (
        <ParentView
          loading={kermesse.loading}
          onReserve={openReservation}
          stands={kermesse.stands}
        />
      )}

      {selectedSlot && (
        <ReservationModal
          formData={formData}
          onChange={setFormData}
          onClose={closeReservation}
          onConfirm={confirmReservation}
          saving={kermesse.saving}
          selectedSlot={selectedSlot}
        />
      )}
    </main>
  )
}
