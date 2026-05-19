import { useState } from 'react'

export function AdminStandManager({
  loading,
  onAddSlot,
  onAddStand,
  onCancelReservation,
  onDeleteSlot,
  onDeleteStand,
  stands,
}) {
  const [newStand, setNewStand] = useState('')
  const [newStandEmoji, setNewStandEmoji] = useState('🎪')
  const [newSlotByStand, setNewSlotByStand] = useState({})

  const submitStand = async (event) => {
    event.preventDefault()
    await onAddStand({ emoji: newStandEmoji, name: newStand })
    setNewStand('')
    setNewStandEmoji('🎪')
  }

  const submitSlot = async (event, standId) => {
    event.preventDefault()
    await onAddSlot(standId, newSlotByStand[standId])
    setNewSlotByStand({ ...newSlotByStand, [standId]: '' })
  }

  return (
    <div className="admin-manager">
      <form className="inline-form" onSubmit={submitStand}>
        <input
          aria-label="Emoji du stand"
          className="emoji-input"
          maxLength={4}
          placeholder="🎪"
          value={newStandEmoji}
          onChange={(event) => setNewStandEmoji(event.target.value)}
        />

        <input
          placeholder="Nom du stand"
          value={newStand}
          onChange={(event) => setNewStand(event.target.value)}
        />

        <button className="button button-primary" disabled={loading || !newStand}>
          Ajouter
        </button>
      </form>

      <div className="admin-stand-list">
        {stands.map((stand) => (
          <article className="admin-stand" key={stand.id}>
            <div className="admin-stand-heading">
              <h3>
                <span aria-hidden="true">{stand.emoji}</span> {stand.name}
              </h3>

              <button
                className="button button-danger"
                disabled={loading}
                onClick={() => onDeleteStand(stand.id)}
              >
                Supprimer stand
              </button>
            </div>

            <form
              className="inline-form"
              onSubmit={(event) => submitSlot(event, stand.id)}
            >
              <input
                placeholder="14h00 - 14h30"
                value={newSlotByStand[stand.id] || ''}
                onChange={(event) =>
                  setNewSlotByStand({
                    ...newSlotByStand,
                    [stand.id]: event.target.value,
                  })
                }
              />

              <button
                className="button button-success"
                disabled={loading || !newSlotByStand[stand.id]}
              >
                Ajouter créneau
              </button>
            </form>

            <div className="admin-slot-list">
              {stand.slots.map((slot) => (
                <div className="admin-slot" key={slot.id}>
                  <div>
                    <strong>{slot.time}</strong>
                    <p>
                      {slot.reservation
                        ? slot.reservation.parentName
                        : 'Disponible'}
                    </p>
                  </div>

                  <div className="slot-actions">
                    {slot.reservation && (
                      <button
                        className="button button-warning"
                        disabled={loading}
                        onClick={() => onCancelReservation(slot.reservation.id)}
                      >
                        Libérer
                      </button>
                    )}

                    <button
                      className="button button-danger"
                      disabled={loading}
                      onClick={() => onDeleteSlot(slot.id)}
                    >
                      X
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </article>
        ))}
      </div>
    </div>
  )
}
