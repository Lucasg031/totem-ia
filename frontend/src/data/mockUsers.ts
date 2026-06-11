export interface MockUser {
  employeeId: string
  name: string
  password: string
  role?: string
}

export const mockUsers: MockUser[] = [
  { employeeId: 'PRJ-0001', name: 'projetoTotemMaua', password: '1234', role: 'Product Manager' },
  { employeeId: 'NAT-0002', name: 'Natã', password: '1234', role: 'Desenvolvedor Pleno' },
  { employeeId: 'EMP-3841', name: 'Carlos Silva', password: '1234', role: 'Desenvolvedor Sênior' },
  { employeeId: 'EMP-9182', name: 'Mariana Souza', password: '1234', role: 'Designer' },
  { employeeId: 'EMP-7720', name: 'Lucas Almeida', password: '1234', role: 'Analista de Dados' },
  { employeeId: 'EMP-5501', name: 'Fernanda Lima', password: '1234', role: 'Tech Lead' },
  { employeeId: 'EMP-1209', name: 'Rafael Costa', password: '1234', role: 'UX Researcher' },
  { employeeId: 'EMP-6633', name: 'Juliana Rocha', password: '1234', role: 'Analista de RH' },
  { employeeId: 'EMP-4410', name: 'Bruno Martins', password: '1234', role: 'Estagiário' },
  { employeeId: 'EMP-9908', name: 'Ana Ferreira', password: '1234', role: 'Desenvolvedor Júnior' },
]

export function authenticate(employeeId: string, password: string): MockUser | null {
  const user = mockUsers.find((u) => u.employeeId === employeeId && u.password === password)
  return user || null
}
