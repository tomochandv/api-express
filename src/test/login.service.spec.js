jest.mock('../common/mysql')
import { mysql } from '../common/mysql'
import { LoginService } from '../service/login.service'

afterEach(() => {
  mysql.mockClear()
})

describe('login.service', () => {
  it('login - 값이 없을때', async () => {
    const service = new LoginService()
    const result = await service.login('')
    expect(result).toEqual({ data: null, message: '사용자명을 넣어주세요.', result: false, statusCode: 501 })
  })

  it('login - 없는 사용자', async () => {
    const service = new LoginService()
    const result = await service.login('')
    expect(result).toEqual({ data: null, message: '사용자명을 넣어주세요.', result: false, statusCode: 501 })
  })

  it('login - 성공', async () => {
    mysql.mockResolvedValue([{ user_idx: 1, user_name: '관리자', user_type: 'A' }])
    const service = new LoginService()
    const result = await service.login('관리자')
    expect(result.result).toEqual(true)
    expect(result.statusCode).toEqual(200)
  })
})
