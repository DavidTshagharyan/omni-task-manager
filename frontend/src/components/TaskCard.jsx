import React from 'react'
import { updateTaskStatus, deleteTask } from '../api/tasks'

const statusColors = {
  pending: '#FFA500',
  in_progress: '#3498db',
  completed: '#2ecc71'
}

const statusLabels = {
  pending: '⏳ Pending',
  in_progress: '🔄 In Progress',
  completed: '✅ Completed'
}

const nextStatus = {
  pending: 'in_progress',
  in_progress: 'completed',
  completed: 'pending'
}

export default function TaskCard({ task, onUpdate }) {
  const handleStatusChange = async () => {
    await updateTaskStatus(task.id, nextStatus[task.status])
    onUpdate()
  }

  const handleDelete = async () => {
    await deleteTask(task.id)
    onUpdate()
  }

  return (
    <div style={{
      background: 'white',
      borderRadius: '8px',
      padding: '16px',
      marginBottom: '12px',
      boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
      borderLeft: `4px solid ${statusColors[task.status]}`
    }}>
      <h3 style={{ margin: '0 0 8px 0' }}>{task.title}</h3>
      {task.description && (
        <p style={{ margin: '0 0 12px 0', color: '#666', fontSize: '14px' }}>
          {task.description}
        </p>
      )}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <button
          onClick={handleStatusChange}
          style={{
            background: statusColors[task.status],
            color: 'white',
            border: 'none',
            borderRadius: '4px',
            padding: '4px 12px',
            cursor: 'pointer',
            fontSize: '12px'
          }}
        >
          {statusLabels[task.status]}
        </button>
        <button
          onClick={handleDelete}
          style={{
            background: '#e74c3c',
            color: 'white',
            border: 'none',
            borderRadius: '4px',
            padding: '4px 12px',
            cursor: 'pointer',
            fontSize: '12px'
          }}
        >
          🗑️ Delete
        </button>
      </div>
    </div>
  )
}