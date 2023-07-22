import { Utill } from '../common/utill'

export const loginCheck = async (req, res, next) => {
  try {
    const utill = new Utill()
    const headers = req.headers
    const token = headers['auth']
    if (req.url.includes('/login')) {
      next()
    } else {
      if (token) {
        const info = await utill.verifyToken(token)
        if (info.email !== '') {
          req.user = info
          next()
        } else {
          res.status(400)
          res.send('❌ not auth')
        }
      } else {
        res.status(400)
        res.send('❌ not auth')
      }
    }
  } catch (error) {
    res.status(400)
    res.send('❌ not auth')
  }
}

export default loginCheck
