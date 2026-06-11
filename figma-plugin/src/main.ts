/// <reference types="@figma/plugin-typings" />

figma.showUI(__html__, { width: 380, height: 600 })

figma.ui.onmessage = async (msg: { type: string; payload?: any }) => {
  if (msg.type === 'send-message') {
    const { userId, content, history } = msg.payload
    try {
      const res = await fetch('http://localhost:3001/api/messages', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userId, content, history }),
      })
      const data = await res.json()
      figma.ui.postMessage({ type: 'message-response', payload: data })
    } catch (err) {
      figma.ui.postMessage({
        type: 'message-response',
        payload: { reply: 'Erro ao conectar com o backend.', sentiment: 'normal' },
      })
    }
  }

  if (msg.type === 'create-checkin') {
    const { userId, mood, note, isOffRecord } = msg.payload
    try {
      const res = await fetch('http://localhost:3001/api/checkins', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userId, mood, note, isOffRecord }),
      })
      const data = await res.json()
      figma.ui.postMessage({ type: 'checkin-response', payload: data })
    } catch (err) {
      figma.ui.postMessage({
        type: 'checkin-response',
        payload: { message: 'Erro ao conectar com o backend.' },
      })
    }
  }

  if (msg.type === 'create-user') {
    const { name, email, role } = msg.payload
    try {
      const res = await fetch('http://localhost:3001/api/users', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, email, role }),
      })
      const data = await res.json()
      figma.ui.postMessage({ type: 'user-created', payload: data })
    } catch (err) {
      figma.ui.postMessage({
        type: 'user-created',
        payload: { error: 'Erro ao criar usuário.' },
      })
    }
  }
}
