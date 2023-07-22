import express from 'express'
import { LoginService } from '../service/login.service'

const router = express.Router()
const loginService = new LoginService()

router.post('/', async (req, res) => {
  const result = await loginService.login(req.body.userName)
  res.send(result)
})

export default router
