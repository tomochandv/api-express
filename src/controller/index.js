import express from 'express'
import loginControll from './login.controll'
import workoutControll from './workout.controll'

const router = express.Router()

router.use('/login', loginControll)
router.use('/workout', workoutControll)

export default router
