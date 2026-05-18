export default function KermesseBoisLuzy() {
  const { useState, useEffect } = React;

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
  ];

  const [stands, setStands] = useState(() => {
    const saved = localStorage.getItem('boisluzy-stands');
    return saved ? JSON.parse(saved) : defaultStands;
  });

  const [adminMode, setAdminMode] = useState(false);
  const [selectedStand, setSelectedStand] = useState(null);
  const [selectedSlot, setSelectedSlot] = useState(null);
  const [showForm, setShowForm] = useState(false);

  const [formData, setFormData] = useState({
    nom: '',
    prenom: '',
    telephone: '',
    lien: '',
    enfant: '',
    maitresse: '',
  });

  const [newStand, setNewStand] = useState('');
  const [newSlot, setNewSlot] = useState('');

  useEffect(() => {
    localStorage.setItem('boisluzy-stands', JSON.stringify(stands));
  }, [stands]);

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
              };
            }
            return slot;
          }),
        };
      }
      return stand;
    });

    setStands(updated);
    setShowForm(false);

    alert('Créneau réservé avec succès !');

    setFormData({
      nom: '',
      prenom: '',
      telephone: '',
      lien: '',
      enfant: '',
      maitresse: '',
    });
  };

  const addStand = () => {
    if (!newStand) return;

    const stand = {
      id: Date.now(),
      name: newStand,
      emoji: '🎪',
      slots: [],
    };

    setStands([...stands, stand]);
    setNewStand('');
  };

  const deleteStand = (id) => {
    setStands(stands.filter((s) => s.id !== id));
  };

  const addSlot = (standId) => {
    if (!newSlot) return;

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
          };
        }
        return stand;
      })
    );

    setNewSlot('');
  };

  const deleteSlot = (standId, slotId) => {
    setStands(
      stands.map((stand) => {
        if (stand.id === standId) {
          return {
            ...stand,
            slots: stand.slots.filter((slot) => slot.id !== slotId),
          };
        }
        return stand;
      })
    );
  };

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
                };
              }
              return slot;
            }),
          };
        }
        return stand;
      })
    );
  };

  const reservations = stands.flatMap((stand) =>
    stand.slots
      .filter((slot) => slot.reserved)
      .map((slot) => ({
        stand: stand.name,
        time: slot.time,
        parent: slot.parent,
        standId: stand.id,
        slotId: slot.id,
      }))
  );

  return (
    <div className="min-h-screen bg-gradient-to-b from-pink-100 to-blue-100 p-6">
      <div className="max-w-7xl mx-auto">
        <div className="bg-white rounded-3xl shadow-xl p-6 mb-6">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-4">
              <img
                src="https://placehold.co/120x120?text=Bois+Luzy"
                className="rounded-2xl"
              />

              <div>
                <h1 className="text-4xl font-black text-blue-700">
                  Kermesse 2026
                </h1>
                <p className="text-xl text-pink-600 font-bold">
                  École maternelle de Bois Luzy
                </p>
              </div>
            </div>

            <button
              onClick={() => setAdminMode(!adminMode)}
              className="bg-green-500 hover:bg-green-600 text-white px-6 py-3 rounded-2xl font-bold"
            >
              {adminMode ? 'Mode Parents' : 'Mode Admin'}
            </button>
          </div>
        </div>

        {!adminMode && (
          <>
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {stands.map((stand) => (
                <div
                  key={stand.id}
                  className="bg-white rounded-3xl p-6 shadow-lg"
                >
                  <div className="text-6xl mb-4 text-center">{stand.emoji}</div>

                  <h2 className="text-2xl font-black text-center mb-4 text-blue-700">
                    {stand.name}
                  </h2>

                  <div className="space-y-3">
                    {stand.slots.map((slot) => (
                      <div
                        key={slot.id}
                        className="border rounded-2xl p-3 flex items-center justify-between"
                      >
                        <div>
                          <p className="font-bold">{slot.time}</p>

                          <p
                            className={`text-sm font-bold ${
                              slot.reserved
                                ? 'text-red-500'
                                : 'text-green-500'
                            }`}
                          >
                            {slot.reserved ? 'Réservé' : 'Disponible'}
                          </p>
                        </div>

                        {!slot.reserved && (
                          <button
                            onClick={() => {
                              setSelectedStand(stand);
                              setSelectedSlot(slot);
                              setShowForm(true);
                            }}
                            className="bg-pink-500 hover:bg-pink-600 text-white px-4 py-2 rounded-xl font-bold"
                          >
                            Réserver
                          </button>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>

            {showForm && (
              <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
                <div className="bg-white rounded-3xl p-6 w-full max-w-lg">
                  <h2 className="text-3xl font-black text-blue-700 mb-4">
                    Réservation
                  </h2>

                  <div className="bg-yellow-100 rounded-2xl p-4 mb-4 font-bold">
                    {selectedStand?.name} — {selectedSlot?.time}
                  </div>

                  <div className="grid gap-3">
                    <input
                      placeholder="Nom"
                      className="border rounded-xl p-3"
                      value={formData.nom}
                      onChange={(e) =>
                        setFormData({ ...formData, nom: e.target.value })
                      }
                    />

                    <input
                      placeholder="Prénom"
                      className="border rounded-xl p-3"
                      value={formData.prenom}
                      onChange={(e) =>
                        setFormData({ ...formData, prenom: e.target.value })
                      }
                    />

                    <input
                      placeholder="Téléphone"
                      className="border rounded-xl p-3"
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
                      className="border rounded-xl p-3"
                      value={formData.lien}
                      onChange={(e) =>
                        setFormData({ ...formData, lien: e.target.value })
                      }
                    />

                    <input
                      placeholder="Prénom de l'enfant"
                      className="border rounded-xl p-3"
                      value={formData.enfant}
                      onChange={(e) =>
                        setFormData({ ...formData, enfant: e.target.value })
                      }
                    />

                    <input
                      placeholder="Classe / Maîtresse"
                      className="border rounded-xl p-3"
                      value={formData.maitresse}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          maitresse: e.target.value,
                        })
                      }
                    />
                  </div>

                  <div className="flex gap-3 mt-6">
                    <button
                      onClick={() => setShowForm(false)}
                      className="flex-1 bg-gray-200 py-3 rounded-xl font-bold"
                    >
                      Annuler
                    </button>

                    <button
                      onClick={reserveSlot}
                      className="flex-1 bg-green-500 text-white py-3 rounded-xl font-bold"
                    >
                      Confirmer
                    </button>
                  </div>
                </div>
              </div>
            )}
          </>
        )}

        {adminMode && (
          <div className="space-y-6">
            <div className="bg-white rounded-3xl p-6 shadow-lg">
              <h2 className="text-3xl font-black text-blue-700 mb-6">
                Administration
              </h2>

              <div className="flex gap-3 mb-6">
                <input
                  placeholder="Nom du stand"
                  className="border rounded-xl p-3 flex-1"
                  value={newStand}
                  onChange={(e) => setNewStand(e.target.value)}
                />

                <button
                  onClick={addStand}
                  className="bg-blue-500 text-white px-6 rounded-xl font-bold"
                >
                  Ajouter
                </button>
              </div>

              <div className="grid gap-4">
                {stands.map((stand) => (
                  <div
                    key={stand.id}
                    className="border rounded-2xl p-4"
                  >
                    <div className="flex items-center justify-between mb-4">
                      <h3 className="text-2xl font-bold">
                        {stand.emoji} {stand.name}
                      </h3>

                      <button
                        onClick={() => deleteStand(stand.id)}
                        className="bg-red-500 text-white px-4 py-2 rounded-xl"
                      >
                        Supprimer
                      </button>
                    </div>

                    <div className="flex gap-3 mb-4">
                      <input
                        placeholder="Ex : 14h00 - 14h30"
                        className="border rounded-xl p-3 flex-1"
                        value={newSlot}
                        onChange={(e) => setNewSlot(e.target.value)}
                      />

                      <button
                        onClick={() => addSlot(stand.id)}
                        className="bg-green-500 text-white px-6 rounded-xl font-bold"
                      >
                        Ajouter créneau
                      </button>
                    </div>

                    <div className="grid md:grid-cols-2 gap-3">
                      {stand.slots.map((slot) => (
                        <div
                          key={slot.id}
                          className="bg-gray-50 rounded-xl p-3 flex items-center justify-between"
                        >
                          <div>
                            <p className="font-bold">{slot.time}</p>
                            <p>
                              {slot.reserved
                                ? `${slot.parent?.prenom} ${slot.parent?.nom}`
                                : 'Disponible'}
                            </p>
                          </div>

                          <div className="flex gap-2">
                            {slot.reserved && (
                              <button
                                onClick={() =>
                                  cancelReservation(stand.id, slot.id)
                                }
                                className="bg-orange-400 text-white px-3 py-2 rounded-xl"
                              >
                                Libérer
                              </button>
                            )}

                            <button
                              onClick={() =>
                                deleteSlot(stand.id, slot.id)
                              }
                              className="bg-red-500 text-white px-3 py-2 rounded-xl"
                            >
                              X
                            </button>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="bg-white rounded-3xl p-6 shadow-lg overflow-auto">
              <h2 className="text-3xl font-black text-pink-600 mb-6">
                Vue synthétique des réservations
              </h2>

              <table className="w-full">
                <thead>
                  <tr className="border-b text-left">
                    <th className="p-3">Stand</th>
                    <th className="p-3">Horaire</th>
                    <th className="p-3">Parent</th>
                    <th className="p-3">Enfant</th>
                    <th className="p-3">Téléphone</th>
                  </tr>
                </thead>

                <tbody>
                  {reservations.map((reservation, index) => (
                    <tr key={index} className="border-b">
                      <td className="p-3">{reservation.stand}</td>
                      <td className="p-3">{reservation.time}</td>
                      <td className="p-3">
                        {reservation.parent.prenom}{' '}
                        {reservation.parent.nom}
                      </td>
                      <td className="p-3">
                        {reservation.parent.enfant}
                      </td>
                      <td className="p-3">
                        {reservation.parent.telephone}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
