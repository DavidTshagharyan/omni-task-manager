import React, { useState, useEffect } from 'react'
import { getTasks, createTask } from '../api/tasks'
import TaskCard from './TaskCard'

export default function TaskList() {
  const [tasks, setTasks] = useState([])
  const [newTaskTitle, setNewTaskTitle] = useState('')
  const [loading, setLoading] = useState(true)

  const fetchTasks = async () => {
    const data = await getTasks()
    setTasks(data)
    setLoading(false)
  }

  useEffect(() => {
    fetchTasks()
  }, [])

  const handleCreateTask = async (e) => {
    e.preventDefault()
    if (!newTaskTitle.trim()) return
    await createTask({ title: newTaskTitle, description: 'Created via Dashboard' })
    setNewTaskTitle('')
    fetchTasks()
  }

  const pending = tasks.filter(t => t.status === 'pending')
  const inProgress = tasks.filter(t => t.status === 'in_progress')
  const completed = tasks.filter(t => t.status === 'completed')

  if (loading) return <div style={{ textAlign: 'center', padding: '40px' }}>Loading...</div>

  return (
    <div style={{ padding: '24px', maxWidth: '1200px', margin: '0 auto' }}>
      <h1 style={{ textAlign: 'center', marginBottom: '24px' }}>
        🗂️ Omni Task Manager
      </h1>

      {/* Create Task Form */}
      <form onSubmit={handleCreateTask} style={{
        display: 'flex',
        gap: '12px',
        marginBottom: '32px',
        justifyContent: 'center'
      }}>
        <input
          type="text"
          value={newTaskTitle}
          onChange={(e) => setNewTaskTitle(e.target.value)}
          placeholder="New task title..."
          style={{
            padding: '10px 16px',
            borderRadius: '6px',
            border: '1px solid #ddd',
            width: '400px',
            fontSize: '16px'
          }}
        />
        <button type="submit" style={{
          background: '#3498db',
          color: 'white',
          border: 'none',
          borderRadius: '6px',
          padding: '10px 24px',
          cursor: 'pointer',
          fontSize: '16px'
        }}>
          ➕ Add Task
        </button>
      </form>

      {/* Kanban Board */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '24px' }}>
        {/* Pending Column */}
        <div>
          <h2 style={{ color: '#FFA500', marginBottom: '16px' }}>⏳ Pending ({pending.length})</h2>
          {pending.map(task => (
            <TaskCard key={task.id} task={task} onUpdate={fetchTasks} />
          ))}
        </div>

        {/* In Progress Column */}
        <div>
          <h2 style={{ color: '#3498db', marginBottom: '16px' }}>🔄 In Progress ({inProgress.length})</h2>
          {inProgress.map(task => (
            <TaskCard key={task.id} task={task} onUpdate={fetchTasks} />
          ))}
        </div>

        {/* Completed Column */}
        <div>
          <h2 style={{ color: '#2ecc71', marginBottom: '16px' }}>✅ Completed ({completed.length})</h2>
          {completed.map(task => (
            <TaskCard key={task.id} task={task} onUpdate={fetchTasks} />
          ))}
        </div>
      </div>
    </div>
  )
}