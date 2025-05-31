import { useState, useEffect } from 'react'

interface Reminder {
  id: number
  title: string
  location?: string
  date?: string
  time?: string
}

const API_BASE_URL = 'http://localhost:3001/reminders'

function ReminderList() {
  const [reminders, setReminders] = useState<Reminder[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const fetchReminders = async () => {
    try {
      setLoading(true)
      const response = await fetch(API_BASE_URL)
      if (!response.ok) throw new Error('Erro ao buscar lembretes')
      const data = await response.json()
      setReminders(data)
      setError(null)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erro desconhecido')
    } finally {
      setLoading(false)
    }
  }

  const formatDateTime = (date?: string, time?: string) => {
    if (!date && !time) return null
    
    const parts = []
    if (date) {
      const formattedDate = new Date(date).toLocaleDateString('pt-BR')
      parts.push(formattedDate)
    }
    if (time) {
      parts.push(time)
    }
    
    return parts.join(' às ')
  }

  useEffect(() => {
    fetchReminders()
  }, [])

  if (loading) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-6">
        <h1 className="text-2xl font-bold mb-4">Lista de Lembretes</h1>
        <div className="text-gray-500">Carregando lembretes...</div>
      </div>
    )
  }

  return (
    <div className="max-w-4xl mx-auto px-4 py-6">
      <h1 className="text-2xl font-bold mb-4">Lista de Lembretes</h1>

      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
          {error}
        </div>
      )}

      <div className="space-y-3">
        {reminders.length === 0 ? (
          <div className="text-gray-500">Nenhum lembrete encontrado</div>
        ) : (
          reminders.map((reminder) => (
            <div
              key={reminder.id}
              className="bg-white border rounded-lg p-4 shadow-sm"
            >
              <h3 className="font-semibold text-gray-900 mb-2">
                {reminder.title}
              </h3>

              {reminder.location && (
                <div className="text-sm text-gray-600 mb-1">
                  📍 {reminder.location}
                </div>
              )}

              {formatDateTime(reminder.date, reminder.time) && (
                <div className="text-sm text-gray-600">
                  📅 {formatDateTime(reminder.date, reminder.time)}
                </div>
              )}
            </div>
          ))
        )}
      </div>
    </div>
  )
}

export default ReminderList
