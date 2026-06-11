import { Router } from 'express'
import { createCheckin, getCheckins } from '../controllers/checkinController'

const router = Router()
router.post('/', createCheckin)
router.get('/:userId', getCheckins)

export default router
