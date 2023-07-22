import dayjs from 'dayjs'
import fs from 'fs'
import path from 'path'
import { CommentDac } from '../dac/comment.dac'
import { WorkoutDac } from '../dac/workout.dac'
import { Payload } from '../model/payload'

export class WorkoutService {
  #workoutDac
  #dir
  constructor() {
    this.#workoutDac = new WorkoutDac()
    this.#dir = path.join(__dirname, '../../public')
  }

  /**
   *  저장
   * @param {number} userIdx
   * @param {string} type
   * @param {files} files
   * @returns
   */
  async addWorkout(userIdx, type, files) {
    console.log(files)
    const payload = new Payload()
    try {
      if (!userIdx) {
        payload.message = '유요한 인증사용자가 아닙니다.'
        payload.statusCode = 501
        return payload
      }
      if (!type || type === '') {
        payload.message = '운동 타입이 없습니다.'
        payload.statusCode = 501
        return payload
      }

      if (!files || !files.imgs) {
        payload.message = '이미지 파일이 없습니다.'
        payload.statusCode = 501
        return payload
      }
      if (files.imgs.length > 5) {
        payload.message = '이미지는 최대 5개 까지 입니다.'
        payload.statusCode = 501
        return payload
      }

      const info = await this.#workoutDac.addWorkoutInfo(userIdx, type)

      if (Array.isArray(files.imgs)) {
        for (let i = 0; i < files.imgs.length; i += 1) {
          const fileName = await this.saveImage(files.imgs[i], i)
          await this.#workoutDac.addWorkoutImage(info.insertId, fileName)
        }
      } else {
        const fileName = await this.saveImage(files.imgs, 0)
        await this.#workoutDac.addWorkoutImage(info.insertId, fileName)
      }

      payload.result = true
      payload.statusCode = 200
    } catch (err) {
      console.log(err)
      payload.statusCode = 500
      payload.message = '서버에러'
    }
    return payload
  }

  /**
   * 삭제
   * @param {string} userType
   * @param {number} wiIdx
   * @returns
   */
  async removeWorkout(userType, wiIdx) {
    const payload = new Payload()
    try {
      if (!wiIdx) {
        payload.message = '게시물 아이디가 없습니다.'
        payload.statusCode = 501
        return payload
      }
      if (userType !== 'A') {
        payload.message = '삭제 권한 없습니다.'
        payload.statusCode = 501
        return payload
      }
      const info = await this.#workoutDac.getWorkOutInfoByIdx(wiIdx)
      if (info.length === 0) {
        payload.message = '게시물이 존재 하지 않습니다.'
        payload.statusCode = 501
        return payload
      }

      const imgList = await this.#workoutDac.getWorkOutImgByIdx(wiIdx)
      for (const item of imgList) {
        await fs.rmSync(path.join(this.#dir, `${item.filename}`))
      }

      await this.#workoutDac.removeWorkoutImage(wiIdx)
      await this.#workoutDac.removeWorkoutInfo(wiIdx)
      payload.result = true
      payload.statusCode = 200
    } catch (err) {
      payload.statusCode = 500
      payload.message = '서버에러'
    }
    return payload
  }

  /**
   * 수정
   * @param {number} useridx
   * @param {string} userType
   * @param {number} wiIdx
   * @param {string} type
   * @param {file} files
   * @returns
   */
  async updateWorkout(useridx, userType, wiIdx, type, files) {
    const payload = new Payload()
    try {
      if (!wiIdx) {
        payload.message = '게시물 아이디가 없습니다.'
        payload.statusCode = 501
        return payload
      }
      if (!type || type === '') {
        payload.message = '운동 타입이 없습니다.'
        payload.statusCode = 501
        return payload
      }

      if (!files || !files.imgs) {
        payload.message = '이미지 파일이 없습니다.'
        payload.statusCode = 501
        return payload
      }
      if (files.imgs.length > 5) {
        payload.message = '이미지는 최대 5개 까지 입니다.'
        payload.statusCode = 501
        return payload
      }

      const info = await this.#workoutDac.getWorkOutInfoByIdx(wiIdx)
      if (info.length === 0) {
        payload.message = '게시물이 존재 하지 않습니다.'
        payload.statusCode = 501
        return payload
      }
      if (useridx !== info[0].user_idx && userType === 'U') {
        payload.message = '권한이 없습니다.'
        payload.statusCode = 501
        return payload
      }

      const imgList = await this.#workoutDac.getWorkOutImgByIdx(wiIdx)
      for (const item of imgList) {
        await fs.rmSync(path.join(this.#dir, `${item.filename}`))
      }
      await this.#workoutDac.removeWorkoutImage(wiIdx)

      if (Array.isArray(files.imgs)) {
        for (let i = 0; i < files.imgs.length; i += 1) {
          const fileName = await this.saveImage(files.imgs[i], i)
          await this.#workoutDac.addWorkoutImage(info.insertId, fileName)
        }
      } else {
        const fileName = await this.saveImage(files.imgs, 0)
        await this.#workoutDac.addWorkoutImage(wiIdx, fileName)
      }

      await this.#workoutDac.editWorkoutInfo(wiIdx, type)
      payload.result = true
      payload.statusCode = 200
    } catch (err) {
      console.log(err)
      payload.statusCode = 500
      payload.message = '서버에러'
    }
    return payload
  }

  /**
   * 이미지 저장
   * @param {file} file
   * @param {number} sequence
   * @returns
   */
  async saveImage(file, sequence) {
    try {
      const ext = file.mimetype.replace('image/', '')
      const fileName = `${dayjs().format('YYYYMMDDHHmmss')}-${sequence}.${ext}`
      const dir = path.join(this.#dir, `${fileName}`)
      file.mv(dir)
      return fileName
    } catch (err) {
      throw err
    }
  }

  /**
   * 리스트
   * @param {number} page 패이지
   * @param {number} rows 행
   * @param {string} type 타입
   * @param {string} sortType 소팅필드
   * @param {string} sort 정렬
   * @returns
   */
  async getWorkoutList(page, rows, type, sortType, sort) {
    const payload = new Payload()
    try {
      const start = (page - 1) * rows
      const list = await this.#workoutDac.getWorkOutInfoList(start, rows, type, sortType, sort)
      const total = await this.#workoutDac.getWorkOutInfoListTotal(type)
      payload.data = {
        list,
        toal: total[0].total,
      }
      payload.result = true
      payload.statusCode = 200
    } catch (err) {
      payload.statusCode = 500
      payload.message = '서버에러'
    }
    return payload
  }

  /**
   * 상세이미지
   * @param {number} wiIdx
   * @returns
   */
  async getWorkoutImage(wiIdx) {
    const payload = new Payload()
    try {
      if (!wiIdx) {
        payload.message = '게시물 아이디가없습니다.'
        payload.statusCode = 501
        return payload
      }
      const list = await this.#workoutDac.getWorkOutImgByIdx(wiIdx)
      let newList = []
      if (list.length > 0) {
        newList = list.map((x) => {
          return {
            imgIdx: x.img_idx,
            url: `http://localhost:3000/img/${x.filename}`,
          }
        })
      }
      payload.data = newList
      payload.result = true
      payload.statusCode = 200
    } catch (err) {
      console.log(err)
      payload.statusCode = 500
      payload.message = '서버에러'
    }
    return payload
  }
}
