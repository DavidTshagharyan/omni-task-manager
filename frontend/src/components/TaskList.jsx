import React, { useState, useEffect, useRef } from 'react'
import { getTasks, createTask } from '../api/tasks'
import TaskCard from './TaskCard'

export default function TaskList() {
  const [tasks, setTasks] = useState([])
  const [newTaskTitle, setNewTaskTitle] = useState('')
  const [loading, setLoading] = useState(true)
  const [connected, setConnected] = useState(false)
  const wsRef = useRef(null)

  const fetchTasks = async () => {
    const data = await getTasks()
    setTasks(data)
    setLoading(false)
  }

  useEffect(() => {
    fetchTasks()

    // WebSocket connection
    const ws = new WebSocket('ws://localhost:8000/ws')
    wsRef.current = ws

    ws.onopen = () => {
      console.log('WebSocket connected')
      setConnected(true)
    }

    ws.onmessage = (event) => {
      const data = JSON.parse(event.data)
      
      if (data.type === 'new_task') {
        setTasks(prev => [...prev, data.task])
      } else if (data.type === 'update_task') {
        setTasks(prev => prev.map(t => 
          t.id === data.task.id ? { ...t, status: data.task.status } : t
        ))
      } else if (data.type === 'delete_task') {
        setTasks(prev => prev.filter(t => t.id !== data.task_id))
      }
    }

    ws.onclose = () => {
      console.log('WebSocket disconnected')
      setConnected(false)
    }

    return () => ws.close()
  }, [])

  const handleCreateTask = async (e) => {
    e.preventDefault()
    if (!newTaskTitle.trim()) return
    await createTask({ title: newTaskTitle, description: 'Created via Dashboard' })
    setNewTaskTitle('')
  }

  const pending = tasks.filter(t => t.status === 'pending')
  const inProgress = tasks.filter(t => t.status === 'in_progress')
  const completed = tasks.filter(t => t.status === 'completed')

  if (loading) return <div style={{ textAlign: 'center', padding: '40px' }}>Loading...</div>

  return (
    <div style={{ padding: '24px', maxWidth: '1200px', margin: '0 auto' }}>
      <h1 style={{ textAlign: 'center', marginBottom: '8px' }}>
        🗂️ Omni Task Manager
      </h1>
      
      {/* WebSocket Status */}
      <div style={{ textAlign: 'center', marginBottom: '24px' }}>
        <span style={{
          background: connected ? '#2ecc71' : '#e74c3c',
          color: 'white',
          padding: '4px 12px',
          borderRadius: '12px',
          fontSize: '12px'
        }}>
          {connected ? '🟢 Live' : '🔴 Disconnected'}
        </span>
      </div>

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
        <div>
          <h2 style={{ color: '#FFA500', marginBottom: '16px' }}>⏳ Pending ({pending.length})</h2>
          {pending.map(task => (
            <TaskCard key={task.id} task={task} onUpdate={fetchTasks} />
          ))}
        </div>
        <div>
          <h2 style={{ color: '#3498db', marginBottom: '16px' }}>🔄 In Progress ({inProgress.length})</h2>
          {inProgress.map(task => (
            <TaskCard key={task.id} task={task} onUpdate={fetchTasks} />
          ))}
        </div>
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