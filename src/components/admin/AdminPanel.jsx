import { exportReservationsToExcel } from '../../utils/exportExcel.js'
import { AdminStandManager } from './AdminStandManager.jsx'
import { ReservationsTable } from './ReservationsTable.jsx'

export function AdminPanel({
  loading,
  onAddSlot,
  onAddStand,
  onCancelReservation,
  onDeleteSlot,
  onDeleteStand,
  onRefresh,
  reservations,
  stands,
}) {
  return (
    <section className="admin-layout">
      <div className="panel">
        <div className="section-header">
          <div>
            <p className="eyebrow">Gestion</p>
            <h2>Stands et créneaux</h2>
          </div>

          <button className="button button-secondary" onClick={onRefresh}>
            Actualiser
          </button>
        </div>

        <AdminStandManager
          loading={loading}
          onAddSlot={onAddSlot}
          onAddStand={onAddStand}
          onCancelReservation={onCancelReservation}
          onDeleteSlot={onDeleteSlot}
          onDeleteStand={onDeleteStand}
          stands={stands}
        />
      </div>

      <div className="panel">
        <div className="section-header">
          <div>
            <p className="eyebrow">Synthèse</p>
            <h2>Réservations</h2>
          </div>

          <button
            className="button button-primary"
            disabled={!reservations.length}
            onClick={() => exportReservationsToExcel(reservations)}
          >
            Exporter Excel
          </button>
        </div>

        <ReservationsTable reservations={reservations} />
      </div>
    </section>
  )
}
