import { mysql } from '../common/mysql'
export class UserDac {
  async getUserInfoByName(userName) {
    try {
      const result = await mysql(`select * from user_info where user_name = ?`, [userName])
      return result
    } catch (err) {
      console.log(err)
      throw err
    }
  }
}
