import OpenAI from 'openai'
import type { SentimentLevel, AIMessage, OnboardingPhase } from '../types'
import { classifySentiment } from './sentimentService'
import { companyInfo, benefits, roles, policies, findRole, findBenefits, findPolicy } from './hrKnowledgeBase'

const openai = process.env.OPENAI_API_KEY
  ? new OpenAI({ apiKey: process.env.OPENAI_API_KEY })
  : null

function getPhaseContext(phase: OnboardingPhase): string {
  const phaseContexts: Record<OnboardingPhase, string> = {
    1: 'O colaborador está no primeiro dia. Seja acolhedor, explique o básico da empresa, cultura e primeiros passos.',
    7: 'O colaborador está na primeira semana. Ajude com dúvidas operacionais, sistemas, equipe e integração.',
    30: 'O colaborador está com 30 dias. Faça um check-in de adaptação, feedback inicial e ajustes.',
    90: 'O colaborador está com 90 dias. Avalie a experiência, coleta de feedback estruturado e próximos passos.',
  }
  return phaseContexts[phase]
}

function getRoleContext(roleTitle: string | null): string {
  if (!roleTitle) return ''

  const normalizedRole = roleTitle.toLowerCase()
  const role = findRole(normalizedRole) || roles[normalizedRole]

  if (!role) return ''

  return `
INFORMAÇÕES DO CARGO DO COLABORADOR:
Cargo: ${role.title}
Faixa Salarial: ${role.salaryRange}
Jornada: ${role.workHours}
Modelo: ${role.workModel}
Plano de Carreira: ${role.leveling}
Responsabilidades:
${role.responsibilities.map((r, i) => `${i + 1}. ${r}`).join('\n')}

BENEFÍCIOS DISPONÍVEIS:
${benefits.map((b) => `- ${b.name}: ${b.description} — ${b.details}`).join('\n')}

POLÍTICAS DA EMPRESA:
- Férias: ${policies.ferias}
- Jornada padrão: ${policies.jornadaPadrao}
- Home Office: ${policies.homeOffice}
- Dress Code: ${policies.dressCode}
- 13º Salário: ${policies.decimoTerceiro}
`
}

function getCompanyContext(): string {
  return `
INFORMAÇÕES DA EMPRESA:
Nome: ${companyInfo.name}
Missão: ${companyInfo.mission}
Valores: ${companyInfo.values.join(', ')}
Total de Funcionários: ${companyInfo.totalEmployees}
Fundação: ${companyInfo.foundedYear}
Cultura: ${companyInfo.culture}

BENEFÍCIOS GLOBAIS:
${benefits.map((b) => `- **${b.name}**: ${b.details}`).join('\n')}
`
}

function getSystemPrompt(phase: OnboardingPhase, roleTitle: string | null): string {
  return `Você é o Totem IA, o assistente virtual de RH e onboarding da ${companyInfo.name}.
Seu tom é humano, calmo, direto e profissional. Responda de forma curta e útil.
Nunca julgue. Acolha emoções negativas com empatia.

${getPhaseContext(phase)}

${getCompanyContext()}

${getRoleContext(roleTitle)}

REGRAS IMPORTANTES:
- Respostas curtas (máximo 3 parágrafos), em português
- Seja direto e prático
- Se o colaborador perguntar sobre funções, salário, benefícios, jornada, ou qualquer tema de RH, responda com as informações exatas da base de conhecimento fornecida acima
- Se o colaborador perguntar algo que você não sabe, direcione ao RH presencial
- Se o colaborador demonstrar desconforto ou estresse, ofereça suporte e valide o sentimento
- Para sinais de crise (desespero, pensamentos negativos graves), recomende procurar o RH ou suporte profissional imediatamente
- SEMPRE adapte as respostas ao cargo do colaborador quando relevante`
}

const mockResponses: Record<SentimentLevel, string[]> = {
  normal: [
    'Que bom te ver por aqui! Como posso ajudar hoje?',
    'Entendo! Vou anotar isso para te ajudar melhor.',
    'Ótimo! Seguindo em frente com seu onboarding.',
    'Legal! Tem mais alguma dúvida?',
    'Perfeito, estou aqui para isso!',
  ],
  attention: [
    'Percebo que você parece um pouco preocupado. Quer conversar sobre isso?',
    'Entendo que essa parte pode ser desafiadora. Vamos com calma.',
    'Não se preocupe, é normal sentir isso no começo. Estou aqui para ajudar.',
    'Se quiser, podemos marcar um momento para focar nisso com calma.',
  ],
  critical: [
    'Sinto que você está passando por um momento difícil. Quer que eu acione o RH para te apoiar?',
    'Sua saúde é o mais importante. Posso conectar você com alguém do RH que pode ajudar.',
    'Não tenha medo de pedir ajuda. Estou aqui e o RH está disponível para você.',
  ],
}

function getMockResponse(sentiment: SentimentLevel): string {
  const responses = mockResponses[sentiment]
  return responses[Math.floor(Math.random() * responses.length)]
}

function generateSmartMockReply(userMessage: string, roleTitle: string | null): string | null {
  const lower = userMessage.toLowerCase()

  // Role-specific questions
  const role = roleTitle ? findRole(roleTitle) || roles[roleTitle.toLowerCase()] : null

  if (role) {
    if (lower.includes('salário') || lower.includes('salario') || lower.includes('quanto ganha') || lower.includes('quanto eu ganho') || lower.includes('remuneração') || lower.includes('faixa')) {
      return `A faixa salarial para **${role.title}** é de **${role.salaryRange}**. Esse valor pode variar conforme experiência e avaliação de desempenho. Além disso, você tem direito a PLR (Participação nos Lucros e Resultados) de até 2 salários adicionais por ano. Quer saber mais sobre os benefícios?`
    }

    if (lower.includes('função') || lower.includes('funcoes') || lower.includes('funções') || lower.includes('responsabilidade') || lower.includes('o que eu faço') || lower.includes('o que vou fazer') || lower.includes('atividades') || lower.includes('atribuições') || lower.includes('atribuicoes')) {
      return `Como **${role.title}**, suas principais responsabilidades são:\n${role.responsibilities.map((r, i) => `${i + 1}. ${r}`).join('\n')}\n\nSe quiser detalhar alguma delas, é só me perguntar!`
    }

    if (lower.includes('jornada') || lower.includes('horário') || lower.includes('horario') || lower.includes('hora') || lower.includes('trabalho') || lower.includes('expediente') || lower.includes('carga horária') || lower.includes('carga horaria')) {
      return `Sua jornada de trabalho como **${role.title}** é de **${role.workHours}**. O modelo de trabalho é **${role.workModel}**. Lembrando que temos horário flexível com core hours das 10h às 16h.`
    }

    if (lower.includes('carreira') || lower.includes('crescer') || lower.includes('promoção') || lower.includes('promocao') || lower.includes('plano de carreira') || lower.includes('próximo nível') || lower.includes('proximo nivel') || lower.includes('crescimento')) {
      return `O plano de carreira para **${role.title}** é: **${role.leveling}**. Temos programas de mentoria, subsídio educacional de até R$ 8.000/ano e avaliações de desempenho semestrais para acompanhar seu desenvolvimento.`
    }
  }

  // Benefits
  if (lower.includes('benefício') || lower.includes('beneficio') || lower.includes('vantagem') || lower.includes('o que a empresa oferece')) {
    const benefitList = benefits.map((b) => `- **${b.name}**: ${b.details}`).join('\n')
    return `Aqui estão todos os benefícios que oferecemos:\n\n${benefitList}\n\nQuer saber mais detalhes de algum específico?`
  }

  // Specific benefit queries
  if (lower.includes('saúde') || lower.includes('medico') || lower.includes('médico') || lower.includes('plano de saúde') || lower.includes('hospital')) {
    const b = benefits.find(x => x.name === 'Plano de Saúde')
    return b ? `**${b.name}**: ${b.details}` : null
  }

  if (lower.includes('alimentação') || lower.includes('alimentacao') || lower.includes('refeição') || lower.includes('refeicao') || lower.includes('vr') || lower.includes('va') || lower.includes('comida')) {
    const b = benefits.find(x => x.name === 'Vale Refeição / Alimentação')
    return b ? `**${b.name}**: ${b.details}` : null
  }

  if (lower.includes('educação') || lower.includes('educacao') || lower.includes('curso') || lower.includes('faculdade') || lower.includes('certificação') || lower.includes('certificacao') || lower.includes('estudo')) {
    const b = benefits.find(x => x.name === 'Programa de Educação')
    return b ? `**${b.name}**: ${b.details}` : null
  }

  if (lower.includes('home office') || lower.includes('homeoffice') || lower.includes('remoto') || lower.includes('auxílio home')) {
    const b = benefits.find(x => x.name === 'Auxílio Home Office')
    return b ? `**${b.name}**: ${b.details}` : null
  }

  // Company info
  if (lower.includes('empresa') || lower.includes('sobre a') || lower.includes('missão') || lower.includes('missao') || lower.includes('valores') || lower.includes('cultura') || lower.includes('funcionários') || lower.includes('funcionarios') || lower.includes('quantas pessoas')) {
    return `A **${companyInfo.name}** foi fundada em ${companyInfo.foundedYear} e hoje conta com **${companyInfo.totalEmployees} colaboradores**.\n\nNossa missão: *"${companyInfo.mission}"*\n\nNossos valores: ${companyInfo.values.join(', ')}\n\nCultura: ${companyInfo.culture}`
  }

  // Policies
  if (lower.includes('férias') || lower.includes('ferias') || lower.includes('tirar férias')) {
    return `**Política de Férias**: ${policies.ferias}`
  }

  if (lower.includes('atestado') || lower.includes('médico') || lower.includes('medico') || lower.includes('doente') || lower.includes('saúde') || lower.includes('licença médica') || lower.includes('licenca medica')) {
    return `**Licença Médica**: ${policies.licencaMedica}`
  }

  if (lower.includes('ponto') || lower.includes('bater ponto') || lower.includes('registrar ponto') || lower.includes('horário') || lower.includes('horario')) {
    return `**Registro de Ponto**: ${policies.pontoEletronico}`
  }

  if (lower.includes('decimo') || lower.includes('décimo') || lower.includes('13º') || lower.includes('13o')) {
    return `**13º Salário**: ${policies.decimoTerceiro}`
  }

  if (lower.includes('vale') && (lower.includes('transporte') || lower.includes('condução') || lower.includes('conducao'))) {
    const b = benefits.find(x => x.name === 'Vale Transporte')
    return b ? `**${b.name}**: ${b.details}` : null
  }

  if (lower.includes('licença maternidade') || lower.includes('licenca maternidade') || lower.includes('maternidade') || lower.includes('bebe') || lower.includes('bebê') || lower.includes('filho')) {
    return `**Licença Parental**: ${policies.licencaMaternidade}\n\n**Licença Paternidade**: ${policies.licencaPaternidade}`
  }

  return null
}

async function callOpenAI(
  messages: AIMessage[],
  sentiment: SentimentLevel,
  phase: OnboardingPhase,
  roleTitle: string | null
): Promise<string> {
  const systemPrompt = getSystemPrompt(phase, roleTitle)
  const sentimentContext =
    sentiment === 'attention'
      ? 'O usuário parece estar em estado de atenção (estresse ou preocupação). Responda com empatia extra.'
      : sentiment === 'critical'
      ? 'ALERTA: O usuário pode estar em crise. Priorize acolhimento e sugira contato com RH ou suporte profissional imediatamente.'
      : ''

  if (!openai) {
    const smartReply = generateSmartMockReply(
      messages[messages.length - 1]?.content || '',
      roleTitle
    )
    if (smartReply) return smartReply
    return getMockResponse(sentiment)
  }

  try {
    const completion = await openai.chat.completions.create({
      model: 'gpt-4o-mini',
      messages: [
        { role: 'system', content: systemPrompt + '\n' + sentimentContext },
        ...messages,
      ],
      max_tokens: 500,
      temperature: 0.7,
    })

    return completion.choices[0]?.message?.content || getMockResponse(sentiment)
  } catch {
    const smartReply = generateSmartMockReply(
      messages[messages.length - 1]?.content || '',
      roleTitle
    )
    if (smartReply) return smartReply
    return getMockResponse(sentiment)
  }
}

export interface ProcessMessageResult {
  reply: string
  sentiment: SentimentLevel
}

export async function processMessage(
  userMessage: string,
  history: AIMessage[],
  phase: OnboardingPhase,
  roleTitle: string | null
): Promise<ProcessMessageResult> {
  const sentiment = classifySentiment(userMessage)
  const reply = await callOpenAI(
    [...history, { role: 'user', content: userMessage }],
    sentiment,
    phase,
    roleTitle
  )

  return { reply, sentiment }
}
