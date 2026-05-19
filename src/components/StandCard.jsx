import { SlotRow } from './SlotRow.jsx'

export function StandCard({ onReserve, stand }) {
  return (
    <article className="stand-card">
      <div className="stand-heading">
        <span className="stand-emoji" aria-hidden="true">
          {stand.emoji}
        </span>
        <h2>{stand.name}</h2>
      </div>

      <div className="slot-list">
        {stand.slots.length ? (
          stand.slots.map((slot) => (
            <SlotRow
              key={slot.id}
              onReserve={() => onReserve(stand, slot)}
              slot={slot}
            />
          ))
        ) : (
          <p className="muted">Aucun créneau pour ce stand.</p>
        )}
      </div>
    </article>
  )
}
