import { saveAs } from 'file-saver'
import * as XLSX from 'xlsx'

export function exportReservationsToExcel(reservations) {
  const rows = reservations.map((reservation) => ({
    Stand: reservation.stand,
    Horaire: reservation.time,
    Parent: reservation.parent.parentName,
    Enfant: reservation.parent.childName,
    Maitresse: reservation.parent.teacherName,
    Telephone: reservation.parent.phone,
    Lien: reservation.parent.relationship,
  }))

  const worksheet = XLSX.utils.json_to_sheet(rows)
  const workbook = XLSX.utils.book_new()

  XLSX.utils.book_append_sheet(workbook, worksheet, 'Reservations')

  const excelBuffer = XLSX.write(workbook, {
    bookType: 'xlsx',
    type: 'array',
  })

  const fileData = new Blob([excelBuffer], {
    type: 'application/octet-stream',
  })

  saveAs(fileData, 'reservations-kermesse.xlsx')
}
