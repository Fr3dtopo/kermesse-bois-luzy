import { useCallback, useState } from 'react'
import {
  createReservation,
  createSlot,
  createStand,
  deleteReservation,
  deleteSlotById,
  deleteStandById,
  fetchStandsWithReservations,
} from '../services/kermesseService.js'

const formatError = (error) => {
  if (error.message === 'Failed to fetch') {
    return 'Impossible de contacter Supabase. Vérifie VITE_SUPABASE_URL, VITE_SUPABASE_ANON_KEY et que le projet Supabase existe bien.'
  }

  return error.message
}

export function useKermesseData() {
  const [stands, setStands] = useState([])
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState('')
  const [successMessage, setSuccessMessage] = useState('')

  const loadData = useCallback(async () => {
    setLoading(true)
    setError('')

    try {
      const data = await fetchStandsWithReservations()
      setStands(data)
    } catch (loadError) {
      setError(formatError(loadError))
    } finally {
      setLoading(false)
    }
  }, [])

  const runMutation = useCallback(
    async (action, success) => {
      setSaving(true)
      setError('')
      setSuccessMessage('')

      try {
        await action()
        await loadData()
        setSuccessMessage(success)
      } catch (mutationError) {
        setError(formatError(mutationError))
      } finally {
        setSaving(false)
      }
    },
    [loadData],
  )

  const reserveSlot = (slotId, formData) =>
    runMutation(
      () => createReservation(slotId, formData),
      'Créneau réservé avec succès.',
    )

  const cancelReservation = (reservationId) =>
    runMutation(
      () => deleteReservation(reservationId),
      'Réservation libérée.',
    )

  const addStand = ({ emoji, name }) =>
    runMutation(() => createStand({ emoji, name }), 'Stand ajouté.')

  const deleteStand = (standId) =>
    runMutation(() => deleteStandById(standId), 'Stand supprimé.')

  const addSlot = (standId, time) =>
    runMutation(() => createSlot(standId, time), 'Créneau ajouté.')

  const deleteSlot = (slotId) =>
    runMutation(() => deleteSlotById(slotId), 'Créneau supprimé.')

  return {
    addSlot,
    addStand,
    cancelReservation,
    deleteSlot,
    deleteStand,
    error,
    loadData,
    loading,
    reserveSlot,
    saving,
    stands,
    successMessage,
  }
}
