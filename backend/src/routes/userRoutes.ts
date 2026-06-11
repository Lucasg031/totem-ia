import { Router } from 'express'
import { createUser, getUser, updatePhase, updateUser, getAllUsers } from '../controllers/userController'

const router = Router()
router.post('/', createUser)
router.get('/', getAllUsers)
router.get('/:id', getUser)
router.patch('/:id', updateUser)
router.patch('/:id/phase', updatePhase)

export default router
