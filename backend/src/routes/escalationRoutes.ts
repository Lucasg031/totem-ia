import { Router } from 'express'
import {
  listEscalations,
  resolveEscalationEndpoint,
  getDashboardStats,
} from '../controllers/escalationController'

const router = Router()
router.get('/', listEscalations)
router.get('/dashboard', getDashboardStats)
router.patch('/:id/resolve', resolveEscalationEndpoint)

export default router
