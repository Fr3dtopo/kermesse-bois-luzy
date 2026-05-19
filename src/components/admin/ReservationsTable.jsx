export function ReservationsTable({ reservations }) {
  if (!reservations.length) {
    return <p className="muted">Aucune réservation pour le moment.</p>
  }

  return (
    <div className="table-wrapper">
      <table>
        <thead>
          <tr>
            <th>Stand</th>
            <th>Horaire</th>
            <th>Parent</th>
            <th>Enfant</th>
            <th>Maîtresse</th>
            <th>Téléphone</th>
          </tr>
        </thead>

        <tbody>
          {reservations.map((reservation) => (
            <tr key={reservation.id}>
              <td>{reservation.stand}</td>
              <td>{reservation.time}</td>
              <td>{reservation.parent.parentName}</td>
              <td>{reservation.parent.childName}</td>
              <td>{reservation.parent.teacherName}</td>
              <td>{reservation.parent.phone}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}
