import bodyParser from 'body-parser'
import cors from 'cors'
import express from 'express'
import fileUpload from 'express-fileupload'
import fs from 'fs'
import path from 'path'
import conroller from './controller/index'
import { InitDatabase } from './dac/init'
import { loginCheck } from './middleware/login.middleware'

const app = express()
app.use(bodyParser.json())
app.use(
  bodyParser.urlencoded({
    extended: true,
  }),
)
app.use(cors())

const publicPath = path.join(__dirname, '../public')
console.log(publicPath)
app.use('/img', express.static(publicPath))

app.use(fileUpload())

app.use(loginCheck)
app.use(conroller)

app.listen('3000', () => {
  console.log(`✅  Server start : http://localhost:3000`)
})

/** 테이블 생성및 초기 데이터 insert */
// const dir = path.join(__dirname, '../public')
// const isExists = fs.existsSync(dir)
// if (!isExists) {
//   fs.mkdirSync(dir, { recursive: true })
// } else {
//   // 개발시 지우고 생성을 위해
//   fs.rmdirSync(dir, { recursive: true })
//   fs.mkdirSync(dir, { recursive: true })
// }
// new InitDatabase()
//   .createTable()
//   .then(() => {
//     console.log('데이터 생성 완료')
//   })
//   .catch(() => {
//     console.log(`데이터 생성 에러`)
//   })
