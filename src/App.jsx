import React, { useState, useEffect } from 'react'
import * as XLSX from 'xlsx'
import { saveAs } from 'file-saver'
import logo from './assets/logo_bois_luzy_blanc.png'

export default function App() {
  const defaultStands = [
    {
      id: 1,
      name: 'Pêche aux canards',
      emoji: '🦆',
      slots: [
        { id: 101, time: '10h00 - 10h30', reserved: false },
        { id: 102, time: '10h30 - 11h00', reserved: false },
      ],
    },
    {
      id: 2,
      name: 'Tir à l’arc',
      emoji: '🎯',
      slots: [
        { id: 201, time: '11h00 - 11h30', reserved: false },
        { id: 202, time: '11h30 - 12h00', reserved: false },
      ],
    },
  ]

  const [stands, setStands] = useState(() => {
    const saved = localStorage.getItem('boisluzy-stands')
    return saved ? JSON.parse(saved) : defaultStands
  })

  const [adminMode, setAdminMode] = useState(false)
  const [selectedStand, setSelectedStand] = useState(null)
  const [selectedSlot, setSelectedSlot] = useState(null)
  const [showForm, setShowForm] = useState(false)

const [formData, setFormData] = useState({
  parent: '',
  telephone: '',
  lien: '',
  enfant: '',
  maitresse: '',
})

  const [newStand, setNewStand] = useState('')
  const [newSlot, setNewSlot] = useState('')

  useEffect(() => {
    localStorage.setItem('boisluzy-stands', JSON.stringify(stands))
  }, [stands])

  const reserveSlot = () => {
    const updated = stands.map((stand) => {
      if (stand.id === selectedStand.id) {
        return {
          ...stand,
          slots: stand.slots.map((slot) => {
            if (slot.id === selectedSlot.id) {
              return {
                ...slot,
                reserved: true,
                parent: formData,
              }
            }
            return slot
          }),
        }
      }
      return stand
    })

    setStands(updated)
    setShowForm(false)

    alert('Créneau réservé avec succès !')

setFormData({
  parent: '',
  telephone: '',
  lien: '',
  enfant: '',
  maitresse: '',
})
  }

  const addStand = () => {
    if (!newStand) return

    const stand = {
      id: Date.now(),
      name: newStand,
      emoji: '🎪',
      slots: [],
    }

    setStands([...stands, stand])
    setNewStand('')
  }

  const deleteStand = (id) => {
    setStands(stands.filter((s) => s.id !== id))
  }

  const addSlot = (standId) => {
    if (!newSlot) return

    setStands(
      stands.map((stand) => {
        if (stand.id === standId) {
          return {
            ...stand,
            slots: [
              ...stand.slots,
              {
                id: Date.now(),
                time: newSlot,
                reserved: false,
              },
            ],
          }
        }
        return stand
      })
    )

    setNewSlot('')
  }

  const deleteSlot = (standId, slotId) => {
    setStands(
      stands.map((stand) => {
        if (stand.id === standId) {
          return {
            ...stand,
            slots: stand.slots.filter((slot) => slot.id !== slotId),
          }
        }
        return stand
      })
    )
  }

  const cancelReservation = (standId, slotId) => {
    setStands(
      stands.map((stand) => {
        if (stand.id === standId) {
          return {
            ...stand,
            slots: stand.slots.map((slot) => {
              if (slot.id === slotId) {
                return {
                  ...slot,
                  reserved: false,
                  parent: null,
                }
              }
              return slot
            }),
          }
        }
        return stand
      })
    )
  }

  const reservations = stands.flatMap((stand) =>
    stand.slots
      .filter((slot) => slot.reserved)
      .map((slot) => ({
        stand: stand.name,
        time: slot.time,
        parent: slot.parent,
      }))
  )

const exportToExcel = () => {
  const data = reservations.map((reservation) => ({
    Stand: reservation.stand,
    Horaire: reservation.time,
    Parent: reservation.parent.parent,
    Enfant: reservation.parent.enfant,
    Maitresse: reservation.parent.maitresse,
    Telephone: reservation.parent.telephone,
  }))

  const worksheet = XLSX.utils.json_to_sheet(data)

  const workbook = XLSX.utils.book_new()

  XLSX.utils.book_append_sheet(
    workbook,
    worksheet,
    'Reservations'
  )

  const excelBuffer = XLSX.write(workbook, {
    bookType: 'xlsx',
    type: 'array',
  })

  const fileData = new Blob([excelBuffer], {
    type: 'application/octet-stream',
  })

  saveAs(fileData, 'reservations-kermesse.xlsx')
}
  
  return (
    <div
      style={{
        minHeight: '100vh',
        background: '#fef3f2',
        padding: 20,
        fontFamily: 'Arial',
      }}
    >
      <div
        style={{
          background: 'white',
          borderRadius: 20,
          padding: 20,
          marginBottom: 20,
        }}
      >
<div
  style={{
    display: 'flex',
    alignItems: 'center',
    gap: 20,
    flexWrap: 'wrap',
  }}
>
  <img
    src={logo}
    alt='Logo Bois Luzy'
    style={{
      width: 120,
      borderRadius: 20,
    }}
  />

  <div>
    <h1 style={{ color: '#2563eb', fontSize: 40 }}>
      🎪 Kermesse 2026
    </h1>


  </div>
</div>

        <h2 style={{ color: '#ec4899' }}>
          École maternelle de Bois Luzy
        </h2>

        <button
          onClick={() => setAdminMode(!adminMode)}
          style={{
            marginTop: 20,
            background: '#22c55e',
            color: 'white',
            border: 'none',
            padding: '12px 20px',
            borderRadius: 10,
            cursor: 'pointer',
            fontWeight: 'bold',
          }}
        >
          {adminMode ? 'Mode Parents' : 'Mode Admin'}
        </button>
      </div>

      {!adminMode && (
        <div
          style={{
            display: 'grid',
            gap: 20,
          }}
        >
          {stands.map((stand) => (
            <div
              key={stand.id}
              style={{
                background: 'white',
                borderRadius: 20,
                padding: 20,
              }}
            >
              <h2 style={{ fontSize: 30 }}>
                {stand.emoji} {stand.name}
              </h2>

              {stand.slots.map((slot) => (
                <div
                  key={slot.id}
                  style={{
                    border: '1px solid #ddd',
                    borderRadius: 10,
                    padding: 15,
                    marginTop: 10,
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                  }}
                >
                  <div>
                    <strong>{slot.time}</strong>

                    <div
                      style={{
                        color: slot.reserved ? 'red' : 'green',
                        fontWeight: 'bold',
                      }}
                    >
                      {slot.reserved ? 'Réservé' : 'Disponible'}
                    </div>
                  </div>

                  {!slot.reserved && (
                    <button
                      onClick={() => {
                        setSelectedStand(stand)
                        setSelectedSlot(slot)
                        setShowForm(true)
                      }}
                      style={{
                        background: '#ec4899',
                        color: 'white',
                        border: 'none',
                        padding: '10px 15px',
                        borderRadius: 10,
                        cursor: 'pointer',
                      }}
                    >
                      Réserver
                    </button>
                  )}
                </div>
              ))}
            </div>
          ))}
        </div>
      )}

      {showForm && (
        <div
          style={{
            position: 'fixed',
            inset: 0,
            background: 'rgba(0,0,0,0.5)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            padding: 20,
          }}
        >
          <div
            style={{
              background: 'white',
              borderRadius: 20,
              padding: 20,
              width: '100%',
              maxWidth: 500,
            }}
          >
            <h2>Réservation</h2>

            <p>
              <strong>
                {selectedStand?.name} — {selectedSlot?.time}
              </strong>
            </p>

            <div
              style={{
                display: 'grid',
                gap: 10,
                marginTop: 20,
              }}
            >
              <input
				placeholder='Nom et prénom du parent'
				value={formData.parent}
				onChange={(e) =>
					setFormData({ ...formData, parent: e.target.value })
				}
			  />

              <input
                placeholder='Téléphone'
                value={formData.telephone}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    telephone: e.target.value,
                  })
                }
              />

              <input
                placeholder="Lien avec l'enfant"
                value={formData.lien}
                onChange={(e) =>
                  setFormData({ ...formData, lien: e.target.value })
                }
              />

              <input
                placeholder="Prénom de l'enfant"
                value={formData.enfant}
                onChange={(e) =>
                  setFormData({ ...formData, enfant: e.target.value })
                }
              />

              <input
                placeholder='Prénom de la maîtresse'
                value={formData.maitresse}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    maitresse: e.target.value,
                  })
                }
              />
            </div>

            <div
              style={{
                display: 'flex',
                gap: 10,
                marginTop: 20,
              }}
            >
              <button
                onClick={() => setShowForm(false)}
                style={{
                  flex: 1,
                  padding: 12,
                }}
              >
                Annuler
              </button>

              <button
                onClick={reserveSlot}
                style={{
                  flex: 1,
                  padding: 12,
                  background: '#22c55e',
                  color: 'white',
                  border: 'none',
                }}
              >
                Confirmer
              </button>
            </div>
          </div>
        </div>
      )}

      {adminMode && (
        <div
          style={{
            background: 'white',
            borderRadius: 20,
            padding: 20,
            marginTop: 20,
          }}
        >
          <h2>Administration</h2>

          <div
            style={{
              display: 'flex',
              gap: 10,
              marginTop: 20,
            }}
          >
            <input
              placeholder='Nom du stand'
              value={newStand}
              onChange={(e) => setNewStand(e.target.value)}
            />

            <button
              onClick={addStand}
              style={{
                background: '#2563eb',
                color: 'white',
                border: 'none',
                padding: '10px 15px',
              }}
            >
              Ajouter
            </button>
          </div>

          {stands.map((stand) => (
            <div
              key={stand.id}
              style={{
                border: '1px solid #ddd',
                borderRadius: 10,
                padding: 15,
                marginTop: 20,
              }}
            >
              <h3>
                {stand.emoji} {stand.name}
              </h3>

              <div
                style={{
                  display: 'flex',
                  gap: 10,
                  marginTop: 10,
                }}
              >
                <input
                  placeholder='14h00 - 14h30'
                  value={newSlot}
                  onChange={(e) => setNewSlot(e.target.value)}
                />

                <button
                  onClick={() => addSlot(stand.id)}
                  style={{
                    background: '#22c55e',
                    color: 'white',
                    border: 'none',
                    padding: '10px 15px',
                  }}
                >
                  Ajouter créneau
                </button>

                <button
                  onClick={() => deleteStand(stand.id)}
                  style={{
                    background: 'red',
                    color: 'white',
                    border: 'none',
                    padding: '10px 15px',
                  }}
                >
                  Supprimer stand
                </button>
              </div>

              {stand.slots.map((slot) => (
                <div
                  key={slot.id}
                  style={{
                    marginTop: 10,
                    padding: 10,
                    background: '#f3f4f6',
                    borderRadius: 10,
                    display: 'flex',
                    justifyContent: 'space-between',
                  }}
                >
                  <div>
                    <strong>{slot.time}</strong>

                    <div>
                      {slot.reserved
                        ? `${slot.parent?.parent}`
                        : 'Disponible'}
                    </div>
                  </div>

                  <div style={{ display: 'flex', gap: 10 }}>
                    {slot.reserved && (
                      <button
                        onClick={() =>
                          cancelReservation(stand.id, slot.id)
                        }
                        style={{
                          background: 'orange',
                          border: 'none',
                          color: 'white',
                          padding: '8px 12px',
                        }}
                      >
                        Libérer
                      </button>
                    )}

                    <button
                      onClick={() =>
                        deleteSlot(stand.id, slot.id)
                      }
                      style={{
                        background: 'red',
                        border: 'none',
                        color: 'white',
                        padding: '8px 12px',
                      }}
                    >
                      X
                    </button>
                  </div>
                </div>
              ))}
            </div>
          ))}

          <div style={{ marginTop: 40 }}>
            <div
  style={{
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
  }}
>
  <h2>Vue synthétique</h2>

  <button
    onClick={exportToExcel}
    style={{
      background: '#2563eb',
      color: 'white',
      border: 'none',
      padding: '10px 15px',
      borderRadius: 10,
      cursor: 'pointer',
    }}
  >
    Exporter en Excel
  </button>
</div>

            <table
              style={{
                width: '100%',
                borderCollapse: 'collapse',
                marginTop: 20,
              }}
            >
              <thead>
                <tr>
                  <th>Stand</th>
                  <th>Horaire</th>
                  <th>Parent</th>
                  <th>Enfant</th>
                  <th>Téléphone</th>
                </tr>
              </thead>

              <tbody>
                {reservations.map((reservation, index) => (
                  <tr key={index}>
                    <td>{reservation.stand}</td>
                    <td>{reservation.time}</td>
                    <td>
                      {reservation.parent.parent}
                    </td>
                    <td>{reservation.parent.enfant}</td>
                    <td>{reservation.parent.telephone}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  )
}