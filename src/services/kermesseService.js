import { DEFAULT_STAND_EMOJI } from '../utils/constants.js'
import { supabase } from './supabaseClient.js'

const orderSlots = (slots = []) =>
  [...slots].sort((a, b) => a.time.localeCompare(b.time, 'fr'))

const normalizeStand = (stand, slots) => ({
  id: stand.id,
  name: stand.name,
  emoji: stand.emoji || DEFAULT_STAND_EMOJI,
  slots: orderSlots(slots).map((slot) => ({
    id: slot.id,
    time: slot.time,
    reservation: null,
  })),
})

const assertSupabaseResult = ({ error }) => {
  if (error) throw new Error(error.message)
}

export async function fetchStandsWithReservations() {
  const standsResult = await supabase
    .from('stands')
    .select('id, name, emoji')
    .order('name', { ascending: true })

  assertSupabaseResult(standsResult)

  const slotsResult = await supabase
    .from('slots')
    .select('id, stand_id, time')
    .order('time', { ascending: true })

  assertSupabaseResult(slotsResult)

  const slotsByStand = new Map()

  for (const slot of slotsResult.data || []) {
    const standSlots = slotsByStand.get(slot.stand_id) || []
    standSlots.push(slot)
    slotsByStand.set(slot.stand_id, standSlots)
  }

  const stands = (standsResult.data || []).map((stand) =>
    normalizeStand(stand, slotsByStand.get(stand.id) || []),
  )

  const { data: sessionData } = await supabase.auth.getSession()
  const reservations = sessionData.session
    ? await fetchAdminReservations()
    : await fetchPublicReservationStatus()

  return mergeReservations(stands, reservations)
}

async function fetchPublicReservationStatus() {
  const result = await supabase
    .from('public_reservation_status')
    .select('slot_id')

  assertSupabaseResult(result)

  return (result.data || []).map((reservation) => ({
    childName: '',
    createdAt: null,
    id: reservation.slot_id,
    parentName: '',
    phone: '',
    relationship: '',
    slotId: reservation.slot_id,
    teacherName: '',
  }))
}

async function fetchAdminReservations() {
  const result = await supabase.from('reservations').select(`
    id,
    slot_id,
    parent_name,
    phone,
    relationship,
    child_name,
    teacher_name,
    created_at
  `)

  assertSupabaseResult(result)

  return (result.data || []).map((reservation) => ({
    childName: reservation.child_name,
    createdAt: reservation.created_at,
    id: reservation.id,
    parentName: reservation.parent_name,
    phone: reservation.phone,
    relationship: reservation.relationship,
    slotId: reservation.slot_id,
    teacherName: reservation.teacher_name,
  }))
}

function mergeReservations(stands, reservations) {
  const reservationsBySlot = new Map(
    reservations.map((reservation) => [reservation.slotId, reservation]),
  )

  return stands.map((stand) => ({
    ...stand,
    slots: stand.slots.map((slot) => ({
      ...slot,
      reservation: reservationsBySlot.get(slot.id) || null,
    })),
  }))
}

export async function createReservation(slotId, formData) {
  const result = await supabase.from('reservations').insert({
    child_name: formData.childName.trim(),
    parent_name: formData.parentName.trim(),
    phone: formData.phone.trim(),
    relationship: formData.relationship.trim(),
    slot_id: slotId,
    teacher_name: formData.teacherName.trim(),
  })

  assertSupabaseResult(result)
}

export async function deleteReservation(reservationId) {
  const result = await supabase
    .from('reservations')
    .delete()
    .eq('id', reservationId)

  assertSupabaseResult(result)
}

export async function createStand({ emoji, name }) {
  const result = await supabase.from('stands').insert({
    emoji: emoji.trim() || DEFAULT_STAND_EMOJI,
    name: name.trim(),
  })

  assertSupabaseResult(result)
}

export async function deleteStandById(standId) {
  const result = await supabase.from('stands').delete().eq('id', standId)

  assertSupabaseResult(result)
}

export async function createSlot(standId, time) {
  const result = await supabase.from('slots').insert({
    stand_id: standId,
    time: time.trim(),
  })

  assertSupabaseResult(result)
}

export async function deleteSlotById(slotId) {
  const result = await supabase.from('slots').delete().eq('id', slotId)

  assertSupabaseResult(result)
}
