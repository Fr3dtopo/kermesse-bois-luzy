const fields = [
  ['parentName', 'Nom et prénom du parent'],
  ['phone', 'Téléphone'],
  ['relationship', "Lien avec l'enfant"],
  ['childName', "Prénom de l'enfant"],
  ['teacherName', 'Prénom de la maîtresse'],
]

export function ReservationModal({
  formData,
  onChange,
  onClose,
  onConfirm,
  saving,
  selectedSlot,
}) {
  const updateField = (field, value) => {
    onChange({ ...formData, [field]: value })
  }

  const handleSubmit = (event) => {
    event.preventDefault()
    onConfirm()
  }

  return (
    <div className="modal-backdrop" role="presentation">
      <form className="modal-card" onSubmit={handleSubmit}>
        <h2>Réservation</h2>

        <p className="reservation-context">
          {selectedSlot.stand.name} - {selectedSlot.slot.time}
        </p>

        <div className="form-grid">
          {fields.map(([field, label]) => (
            <label key={field} className="field">
              <span>{label}</span>
              <input
                required={field !== 'teacherName'}
                value={formData[field]}
                onChange={(event) => updateField(field, event.target.value)}
              />
            </label>
          ))}
        </div>

        <div className="modal-actions">
          <button
            className="button button-secondary"
            disabled={saving}
            type="button"
            onClick={onClose}
          >
            Annuler
          </button>

          <button className="button button-success" disabled={saving}>
            {saving ? 'Enregistrement...' : 'Confirmer'}
          </button>
        </div>
      </form>
    </div>
  )
}
