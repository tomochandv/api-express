import jwt from 'jsonwebtoken'
import dotenv from 'dotenv'
dotenv.config()

export class Utill {
  /**
   * 토큰 생성
   * @param data 데이터
   * @returns
   */
  async createToken(data) {
    try {
      const token = jwt.sign(data, process.env.KEY, {
        expiresIn: '3000d',
      })
      return token
    } catch (err) {
      throw err
    }
  }

  /**
   * 토큰 디크립트
   * @param data 토큰
   * @returns
   */
  async verifyToken(data) {
    try {
      const token = jwt.verify(data, process.env.KEY)
      return token
    } catch (err) {
      throw err
    }
  }
}
