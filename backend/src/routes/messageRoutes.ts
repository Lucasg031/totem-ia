import { Router } from 'express'
import { handleMessage, getMessages } from '../controllers/messageController'

const router = Router()
router.post('/', handleMessage)
router.get('/:userId', getMessages)

export default router
