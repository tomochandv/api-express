import express from 'express'
import { WorkoutService } from '../service/workout.service'

const router = express.Router()
const workoutService = new WorkoutService()

router.post('/add', async (req, res) => {
  const result = await workoutService.addWorkout(req.user.userIdx, req.body.type, req.files)
  res.send(result)
})

router.post('/edit', async (req, res) => {
  const result = await workoutService.updateWorkout(req.user.userIdx, req.user.userType, req.body.wiIdx, req.body.type, req.files)
  res.send(result)
})

router.get('/', async (req, res) => {
  const { page, rows, type, sortType, sort } = req.query
  const result = await workoutService.getWorkoutList(page, rows, type, sortType, sort)
  res.send(result)
})

router.get('/:wiIdx', async (req, res) => {
  console.log(req.params)
  const result = await workoutService.getWorkoutImage(req.params.wiIdx)
  res.send(result)
})

router.delete('/remove', async (req, res) => {
  const result = await workoutService.removeWorkout(req.user.userType, req.query.wiIdx)
  res.send(result)
})

export default router
