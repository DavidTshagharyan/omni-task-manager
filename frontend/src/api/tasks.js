import axios from 'axios'

const api = axios.create({
  baseURL: 'http://localhost:8000'
})

export const getTasks = async () => {
  const response = await api.get('/tasks/')
  return response.data
}

export const createTask = async (task) => {
  const response = await api.post('/tasks/', task)
  return response.data
}

export const updateTaskStatus = async (taskId, status) => {
  const response = await api.patch(`/tasks/${taskId}`, { status })
  return response.data
}

export const deleteTask = async (taskId) => {
  const response = await api.delete(`/tasks/${taskId}`)
  return response.data
}