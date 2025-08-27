'use client'

import { useEffect, useState } from 'react'

type Todo = { id: number; text: string }

export default function HomePage() {
  const [todos, setTodos] = useState<Todo[]>([])
  const [text, setText] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const fetchTodos = async () => {
    try {
      setLoading(true)
      setError(null)
      const res = await fetch('/api/todos', { cache: 'no-store' })
      if (!res.ok) throw new Error('Failed to fetch todos')

      const data = await res.json()
      // ✅ Ensure always an array
      setTodos(Array.isArray(data) ? data : [])
    } catch (e: any) {
      setError(e?.message ?? 'Failed to fetch todos')
      setTodos([]) // fallback to empty
    } finally {
      setLoading(false)
    }
  }

  const addTodo = async () => {
    if (!text.trim()) return
    try {
      setLoading(true)
      setError(null)
      const res = await fetch('/api/todos', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ text }),
      })
      if (!res.ok) {
        const data = await res.json()
        throw new Error(data?.error || 'Failed to add todo')
      }
      setText('')
      await fetchTodos()
    } catch (e: any) {
      setError(e?.message ?? 'Failed to add todo')
    } finally {
      setLoading(false)
    }
  }

  const deleteTodo = async (id: number) => {
    try {
      setLoading(true)
      setError(null)
      const res = await fetch(`/api/todos/${id}`, { method: 'DELETE' })
      if (!res.ok) {
        const data = await res.json()
        throw new Error(data?.error || 'Failed to delete todo')
      }
      await fetchTodos()
    } catch (e: any) {
      setError(e?.message ?? 'Failed to delete todo')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchTodos()
  }, [])

  return (
    <div className="app">
      <h1>📝 ToDo List</h1>

      <div className="input-section">
        <input
          value={text}
          onChange={(e) => setText(e.target.value)}
          placeholder="Enter task..."
        />
        <button onClick={addTodo} disabled={loading}>
          {loading ? 'Adding...' : 'Add'}
        </button>
      </div>

      {error && <p style={{ color: 'crimson' }}>{error}</p>}
      {loading && todos.length === 0 && <p>Loading…</p>}

      <ul className="todo-list">
        {todos.map((todo) => (
          <li key={todo.id}>
            {todo.text}
            <button onClick={() => deleteTodo(todo.id)} disabled={loading}>
              ❌
            </button>
          </li>
        ))}
      </ul>
    </div>
  )
}
