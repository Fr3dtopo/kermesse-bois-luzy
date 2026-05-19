import { StandCard } from './StandCard.jsx'

export function ParentView({ loading, onReserve, stands }) {
  if (loading) {
    return <div className="panel">Chargement des créneaux...</div>
  }

  if (!stands.length) {
    return (
      <div className="panel empty-state">
        Aucun stand n'est encore disponible.
      </div>
    )
  }

  return (
    <section className="stands-grid" aria-label="Liste des stands">
      {stands.map((stand) => (
        <StandCard key={stand.id} onReserve={onReserve} stand={stand} />
      ))}
    </section>
  )
}
