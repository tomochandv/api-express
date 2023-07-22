import { UserDac } from '../dac/user.dac'
import { Payload } from '../model/payload'
import { Utill } from '../common/utill'

export class LoginService {
  #userDac
  #utill
  constructor() {
    this.#userDac = new UserDac()
    this.#utill = new Utill()
  }

  /**
   * 로그인
   * 사용자명으로만 벨리데이션 체크한다.
   * @param {string} userName
   * @returns
   */
  async login(userName) {
    const payload = new Payload()
    try {
      if (userName && userName !== '') {
        const list = await this.#userDac.getUserInfoByName(userName)
        if (list.length > 0) {
          const info = {
            userIdx: list[0].user_idx,
            userName: list[0].user_name,
            userType: list[0].user_type,
          }
          const token = await this.#utill.createToken(info)
          payload.result = true
          payload.data = { ...info, token }
        } else {
          payload.message = '존재하지 않는 사용자입니다.'
          payload.statusCode = 501
        }
      } else {
        payload.message = '사용자명을 넣어주세요.'
        payload.statusCode = 501
      }
    } catch (err) {
      payload.statusCode = 500
      payload.message = '서버에러'
    }
    return payload
  }
}
