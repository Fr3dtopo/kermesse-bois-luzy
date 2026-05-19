export function SlotRow({ onReserve, slot }) {
  const reserved = Boolean(slot.reservation)

  return (
    <div className="slot-row">
      <div>
        <strong>{slot.time}</strong>
        <div className={reserved ? 'status reserved' : 'status available'}>
          {reserved ? 'Réservé' : 'Disponible'}
        </div>
      </div>

      {!reserved && (
        <button className="button button-pink" onClick={onReserve}>
          Réserver
        </button>
      )}
    </div>
  )
}
