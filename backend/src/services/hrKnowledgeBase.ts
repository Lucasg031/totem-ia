export interface RoleInfo {
  title: string
  responsibilities: string[]
  salaryRange: string
  workHours: string
  workModel: string
  leveling: string
}

export interface BenefitInfo {
  name: string
  description: string
  details: string
}

export interface CompanyInfo {
  name: string
  mission: string
  values: string[]
  totalEmployees: number
  foundedYear: number
  culture: string
}

export const companyInfo: CompanyInfo = {
  name: 'TechCorp Soluções',
  mission: 'Transformar a vida das pessoas através da tecnologia com propósito e inovação.',
  values: [
    'Pessoas em primeiro lugar',
    'Inovação com responsabilidade',
    'Transparência e confiança',
    'Diversidade e inclusão',
    'Sustentabilidade',
  ],
  totalEmployees: 1250,
  foundedYear: 2018,
  culture:
    'Ambiente colaborativo, horizontal e focado em aprendizado contínuo. ' +
    'Incentivamos autonomia, feedback aberto e crescimento profissional.',
}

export const benefits: BenefitInfo[] = [
  {
    name: 'Plano de Saúde',
    description: 'Saúde e bem-estar',
    details:
      'Plano médico e odontológico nacional (Unimed/Amil) sem coparticipação. ' +
      'Cobertura para titular + dependentes legais.',
  },
  {
    name: 'Vale Refeição / Alimentação',
    description: 'Alimentação diária',
    details:
      'R$ 1.200/mês em cartão Flash ou Ticket Restaurante. ' +
      'Crédito disponível todo dia 1º do mês.',
  },
  {
    name: 'Vale Transporte',
    description: 'Deslocamento',
    details:
      'Vale transporte integral ou voucher mobilidade de R$ 350/mês ' +
      'para quem opta por meios alternativos (bike, carona,步行).',
  },
  {
    name: 'Auxílio Home Office',
    description: 'Trabalho remoto',
    details:
      'R$ 200/mês para despesas de internet, energia e estrutura em casa. ' +
      'Equipamento fornecido: notebook + monitor + headset.',
  },
  {
    name: 'Seguro de Vida',
    description: 'Proteção',
    details:
      'Seguro de vida em grupo com cobertura de 24x o salário anual. ' +
      'Inclui assistência funeral e auxílio invalidez.',
  },
  {
    name: 'Previdência Privada',
    description: 'Futuro financeiro',
    details:
      'Plano de previdência complementar com contribuição match de até 5% do salário. ' +
      'Carência de 90 dias para adesão.',
  },
  {
    name: 'Gympass / TotalPass',
    description: 'Saúde e lazer',
    details:
      'Acesso a academias, studios e esportes em todo o Brasil. ' +
      'Planos Platinum e Gold com subsídio de 80%.',
  },
  {
    name: 'Licença Parental Estendida',
    description: 'Família',
    details:
      '180 dias de licença maternidade e 30 dias de licença paternidade. ' +
      'Auxílio creche de R$ 800/mês até 2 anos.',
  },
  {
    name: 'Programa de Educação',
    description: 'Desenvolvimento',
    details:
      'Subsídio de 70% para cursos, pós-graduação e certificações (até R$ 8.000/ano). ' +
      'Biblioteca interna com acesso a Alura, Udemy Business e livros técnicos.',
  },
  {
    name: 'Day Off Aniversário',
    description: 'Folga especial',
    details:
      'Dia de folga no mês do aniversário para comemorar com quem você ama.',
  },
  {
    name: 'Participação nos Lucros (PLR)',
    description: 'Remuneração variável',
    details:
      'Programa anual de participação nos lucros e resultados. ' +
      'Meta: até 2 salários adicionais por ano, pago em duas parcelas.',
  },
]

export const roles: Record<string, RoleInfo> = {
  'desenvolvedor júnior': {
    title: 'Desenvolvedor Júnior',
    responsibilities: [
      'Desenvolver e manter funcionalidades sob supervisão de seniors',
      'Escrever testes unitários e participar de code reviews',
      'Corrigir bugs e melhorar a qualidade do código existente',
      'Participar de cerimônias ágeis (daily, planning, retrospectiva)',
      'Estudar e aplicar as melhores práticas do time',
    ],
    salaryRange: 'R$ 4.500 – R$ 7.000',
    workHours: '40h semanais (seg a sex, 08h–18h com 1h almoço)',
    workModel: 'Híbrido (3x escritório / 2x remoto)',
    leveling:
      'Plano de carreira técnica: Júnior (1–2 anos) → Pleno (2–4 anos) → Sênior (4+)',
  },
  'desenvolvedor pleno': {
    title: 'Desenvolvedor Pleno',
    responsibilities: [
      'Desenvolver funcionalidades complexas de forma autônoma',
      'Liderar code reviews e mentorar desenvolvedores júniores',
      'Participar do planejamento técnico e estimativas',
      'Propor melhorias de arquitetura e processo',
      'Colaborar com designers e product managers nas definições',
    ],
    salaryRange: 'R$ 8.000 – R$ 14.000',
    workHours: '40h semanais (seg a sex, horário flexível)',
    workModel: 'Híbrido (2x escritório / 3x remoto)',
    leveling:
      'Plano de carreira técnica: Júnior → Pleno (2–4 anos) → Sênior (4+)',
  },
  'desenvolvedor sênior': {
    title: 'Desenvolvedor Sênior',
    responsibilities: [
      'Arquitetar soluções técnicas de alto impacto',
      'Mentorar o time e promover boas práticas de engenharia',
      'Liderar projetos multidisciplinares',
      'Realizar entrevistas técnicas e contribuir com a cultura de engenharia',
      'Avaliar e introduzir novas tecnologias quando relevante',
    ],
    salaryRange: 'R$ 15.000 – R$ 22.000',
    workHours: '40h semanais (seg a sex, horário 100% flexível)',
    workModel: 'Remoto ou Híbrido (a escolher)',
    leveling:
      'Plano de carreira técnica: Pleno → Sênior → Staff → Principal',
  },
  'designer': {
    title: 'Designer (UI/UX)',
    responsibilities: [
      'Criar e prototipar interfaces para produtos digitais',
      'Conduzir pesquisas com usuários e testes de usabilidade',
      'Manter e evoluir o design system da empresa',
      'Colaborar com product managers e desenvolvedores',
      'Criar fluxos, wireframes e entregáveis de alta fidelidade',
    ],
    salaryRange: 'R$ 6.000 – R$ 12.000',
    workHours: '40h semanais (seg a sex, 09h–18h flexível)',
    workModel: 'Híbrido (3x escritório / 2x remoto)',
    leveling:
      'Plano de carreira: Designer Júnior → Pleno → Sênior → Lead',
  },
  'product manager': {
    title: 'Product Manager',
    responsibilities: [
      'Definir visão, estratégia e roadmap do produto',
      'Conduzir descoberta de produto e validação com clientes',
      'Priorizar backlog e alinhar expectativas com stakeholders',
      'Analisar métricas e dados para guiar decisões de produto',
      'Liderar squads multidisciplinares (devs, design, negócios)',
    ],
    salaryRange: 'R$ 14.000 – R$ 22.000',
    workHours: '40h semanais (seg a sex, horário flexível)',
    workModel: 'Híbrido (2x escritório / 3x remoto)',
    leveling:
      'Plano de carreira: PM Jr → PM Pleno → PM Sênior → Head de Produto → CPO',
  },
  'analista de rh': {
    title: 'Analista de RH',
    responsibilities: [
      'Realizar processos de recrutamento e seleção',
      'Conduzir onboarding e integração de novos colaboradores',
      'Gerenciar benefícios e folha de pagamento',
      'Acompanhar indicadores de clima organizacional e turnover',
      'Promover ações de desenvolvimento e treinamento',
    ],
    salaryRange: 'R$ 5.000 – R$ 9.000',
    workHours: '40h semanais (seg a sex, 08h–18h)',
    workModel: 'Presencial (escritório)',
    leveling:
      'Plano de carreira: Analista Jr → Pleno → Sênior → Coordenador → Gerente',
  },
  'estagiário': {
    title: 'Estagiário',
    responsibilities: [
      'Apoiar o time em atividades operacionais e projetos',
      'Participar de treinamentos e programas de desenvolvimento',
      'Aprender sobre a cultura, processos e ferramentas da empresa',
      'Executar tarefas sob supervisão de um mentor designado',
      'Contribuir com ideias e trazer uma visão nova para o time',
    ],
    salaryRange: 'R$ 1.800 – R$ 2.800 + vale transporte',
    workHours: '30h semanais (seg a sex, 6h/dia em horário comercial)',
    workModel: 'Presencial ou Híbrido (a depender do time)',
    leveling:
      'Programa de estágio com duração de 1 a 2 anos. Possibilidade de efetivação como Júnior.',
  },
  'analista de dados': {
    title: 'Analista de Dados',
    responsibilities: [
      'Extrair, tratar e analisar dados para gerar insights de negócio',
      'Criar dashboards e relatórios (Power BI, Metabase, Looker)',
      'Trabalhar com squads para definir métricas e OKRs',
      'Realizar análises exploratórias e testes de hipótese',
      'Documentar processos e manter a qualidade dos dados',
    ],
    salaryRange: 'R$ 6.500 – R$ 12.000',
    workHours: '40h semanais (seg a sex, horário flexível)',
    workModel: 'Remoto ou Híbrido',
    leveling:
      'Plano de carreira: Analista Jr → Pleno → Sênior → Cientista de Dados / Engenheiro de Dados',
  },
  'tech lead': {
    title: 'Tech Lead',
    responsibilities: [
      'Liderar tecnicamente um ou mais squads de desenvolvimento',
      'Definir arquitetura, padrões e boas práticas de engenharia',
      'Realizar code reviews e garantir qualidade técnica das entregas',
      'Mentorar desenvolvedores e promover crescimento do time',
      'Participar de decisões estratégicas de tecnologia com a liderança',
    ],
    salaryRange: 'R$ 20.000 – R$ 28.000',
    workHours: '40h semanais (seg a sex, horário 100% flexível)',
    workModel: 'Remoto',
    leveling:
      'Plano de carreira: Sênior → Tech Lead → Engineering Manager → CTO',
  },
  'ux researcher': {
    title: 'UX Researcher',
    responsibilities: [
      'Planejar e conduzir pesquisas qualitativas e quantitativas',
      'Realizar entrevistas, testes de usabilidade e surveys',
      'Sintetizar dados em relatórios e apresentações acionáveis',
      'Definir personas, jornadas do usuário e mapas de empatia',
      'Trabalhar lado a lado com designers e product managers',
    ],
    salaryRange: 'R$ 7.000 – R$ 13.000',
    workHours: '40h semanais (seg a sex, horário flexível)',
    workModel: 'Híbrido (2x escritório / 3x remoto)',
    leveling:
      'Plano de carreira: Researcher Jr → Pleno → Sênior → Lead → Head de Research',
  },
}

export const policies = {
  ferias: '30 dias corridos de férias após 12 meses de trabalho. ' +
    'Possibilidade de vender 1/3 do período. ' +
    'Época de férias definida em comum acordo com gestor.',
  licencaMedica: 'Atestados médicos de até 15 dias são abonados. ' +
    'Acima disso, encaminhamento ao INSS. ' +
    'Apresentar atestado em até 48h pelo portal do colaborador.',
  licencaMaternidade: '180 dias de licença maternidade remunerada. ' +
    'Estabilidade de 6 meses após retorno.',
  licencaPaternidade: '30 dias de licença paternidade remunerada.',
  avisoPrevio: 'Aviso prévio de 30 dias (trabalhado ou indenizado conforme CLT). ' +
    'Acréscimo de 3 dias por ano completo de serviço (máx 90 dias).',
  decimoTerceiro: '13º salário pago em 2 parcelas: ' +
    '1ª parcela até 30 de novembro, 2ª parcela até 20 de dezembro.',
  jornadaPadrao: 'Jornada padrão de 40h/semana (8h/dia) com 1h de almoço. ' +
    'Horário flexível com core hours das 10h às 16h. ' +
    'Banco de horas com compensação semanal.',
  pontoEletronico: 'Registro de ponto digital via sistema interno (app + web). ' +
    'Marcação de entrada, almoço (mín 1h, máx 2h) e saída. ' +
    'Tolerância de 10 min para atrasos.',
  homeOffice: 'Política de home office flexível dependendo do cargo. ' +
    'Auxílio home office de R$ 200/mês. ' +
    'Equipamento corporativo fornecido (notebook, monitor, headset).',
  dressCode: 'Dress code livre e casual. ' +
    'Use o que te faz sentir confortável e profissional. ' +
    'Recomendamos traje adequado para reuniões com clientes externos.',
  programaIndicacao: 'Programa de indicação de talentos: R$ 3.000 de bônus ' +
    'por candidato indicado e contratado (após 3 meses de experiência).',
}

export function findRole(query: string): RoleInfo | null {
  const lower = query.toLowerCase()
  for (const [key, role] of Object.entries(roles)) {
    if (lower.includes(key) || lower.includes(role.title.toLowerCase())) {
      return role
    }
  }
  return null
}

export function findBenefits(query: string): BenefitInfo[] {
  const lower = query.toLowerCase()
  const keywords = {
    saude: ['saúde', 'medico', 'médico', 'plano de saúde', 'hospital'],
    alimentacao: ['refeição', 'alimentação', 'comida', 'vale', 'vr', 'va'],
    transporte: ['transporte', 'condução', 'ônibus', 'metro', 'metrô'],
    homeoffice: ['home office', 'remoto', 'escritório em casa', 'auxílio home'],
    educacao: ['educação', 'curso', 'faculdade', 'estudo', 'certificação', 'alura'],
    academia: ['academia', 'ginástica', 'exercício', 'esporte', 'gympass'],
    plr: ['plr', 'lucro', 'bonus', 'bônus', 'participação'],
  }

  const matched: BenefitInfo[] = []
  for (const [, words] of Object.entries(keywords)) {
    if (words.some((w) => lower.includes(w))) {
      words.forEach((w) => {
        const benefit = benefits.find(
          (b) =>
            b.name.toLowerCase().includes(w) ||
            b.description.toLowerCase().includes(w) ||
            b.details.toLowerCase().includes(w)
        )
        if (benefit && !matched.includes(benefit)) matched.push(benefit)
      })
    }
  }

  return matched.length > 0 ? matched : [...benefits]
}

export function findPolicy(query: string): { topic: string; content: string } | null {
  const lower = query.toLowerCase()
  const policyMap: Record<string, string> = {
    ferias: policies.ferias,
    férias: policies.ferias,
    atestado: policies.licencaMedica,
    medico: policies.licencaMedica,
    médico: policies.licencaMedica,
    licenca: policies.licencaMaternidade,
    licença: policies.licencaMaternidade,
    maternidade: policies.licencaMaternidade,
    paternidade: policies.licencaPaternidade,
    'aviso prévio': policies.avisoPrevio,
    'aviso previo': policies.avisoPrevio,
    '13º': policies.decimoTerceiro,
    'decimo terceiro': policies.decimoTerceiro,
    'décimo': policies.decimoTerceiro,
    'jornada': policies.jornadaPadrao,
    'horário': policies.jornadaPadrao,
    'horario': policies.jornadaPadrao,
    'hora': policies.jornadaPadrao,
    'ponto': policies.pontoEletronico,
    'home office': policies.homeOffice,
    'homeoffice': policies.homeOffice,
    'roupa': policies.dressCode,
    'dress code': policies.dressCode,
    'indicacao': policies.programaIndicacao,
    'indicação': policies.programaIndicacao,
  }

  for (const [keyword, content] of Object.entries(policyMap)) {
    if (lower.includes(keyword)) {
      return { topic: keyword, content }
    }
  }
  return null
}
