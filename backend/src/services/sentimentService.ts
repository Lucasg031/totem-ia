import type { SentimentLevel } from '../types'

function extractKeywords(text: string): { negative: number; distress: number; crisis: number } {
  const lower = text.toLowerCase()

  const distressWords = [
    'stress', 'stressed', 'ansiedade', 'ansioso', 'preocupado', 'sobrecarregado',
    'pressão', 'pressao', 'cansado', 'exausto', 'esgotado', 'não sei',
    'dificil', 'difícil', 'complicado', 'confuso', 'perdido', 'inseguro',
  ]

  const crisisWords = [
    'suicídio', 'suicidio', 'morrer', 'morte', 'desespero', 'desesperado',
    'ajuda', 'urgente', 'preciso de ajuda', 'nao aguento', 'não aguento',
    'quero desistir', 'vou desistir', 'acabar com tudo', 'sem saida', 'sem saída',
    'depressão', 'depressao', 'crise', 'pânico', 'panico',
  ]

  let distress = 0
  let crisis = 0

  for (const w of distressWords) {
    if (lower.includes(w)) distress++
  }

  for (const w of crisisWords) {
    if (lower.includes(w)) crisis++
  }

  return { negative: distress + crisis * 2, distress, crisis }
}

export function classifySentiment(text: string): SentimentLevel {
  const { crisis, distress, negative } = extractKeywords(text)
  if (crisis > 0 || negative >= 4) return 'critical'
  if (distress > 0 || negative >= 2) return 'attention'
  return 'normal'
}
