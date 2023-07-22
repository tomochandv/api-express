import { mysql } from '../common/mysql'

export class WorkoutDac {
  async addWorkoutInfo(userIdx, workoutType) {
    try {
      const result = await mysql(`insert into workout_info(user_idx, wi_type) value(?, ?)`, [userIdx, workoutType])
      return result
    } catch (err) {
      console.log(err)
      throw err
    }
  }

  async removeWorkoutInfo(wiIdx) {
    try {
      const result = await mysql(`delete from workout_info where wi_idx = ?`, [wiIdx])
      return result
    } catch (err) {
      console.log(err)
      throw err
    }
  }

  async removeWorkoutImage(wiIdx) {
    try {
      const result = await mysql(`delete from workout_img where wi_idx = ?`, [wiIdx])
      return result
    } catch (err) {
      console.log(err)
      throw err
    }
  }

  async addWorkoutImage(wiIdx, filename) {
    try {
      const result = await mysql(`insert into workout_img(wi_idx, filename) values(?, ?)`, [wiIdx, filename])
      return result
    } catch (err) {
      console.log(err)
      throw err
    }
  }

  async editWorkoutInfo(wiIdx, workoutType) {
    try {
      const result = await mysql(`update workout_info set wi_type = ? where wi_idx = ?`, [workoutType, wiIdx])
      return result
    } catch (err) {
      console.log(err)
      throw err
    }
  }

  async getWorkOutInfoByIdx(wiIdx) {
    try {
      const list = await mysql(
        `select a.*, b.user_name from workout_info a
        inner join user_info b on a.user_idx = b.user_idx
        where a.wi_idx = ?`,
        [wiIdx],
      )
      return list
    } catch (err) {
      console.log(err)
      throw err
    }
  }

  async getWorkOutImgByIdx(wiIdx) {
    try {
      const list = await mysql(`select * from workout_img where wi_idx = ?`, [wiIdx])
      return list
    } catch (err) {
      console.log(err)
      throw err
    }
  }

  async getWorkOutInfoList(start, rows, type, sortType, sort) {
    try {
      let qry = `select a.wi_idx, a.user_idx , b.user_name , a.wi_type
        from workout_info a 
        inner join user_info b on a.user_idx = b.user_idx
        left outer join workout_comment c on a.wi_idx = c.wi_idx`
      if (type !== 'A') {
        qry += ` where a.wi_type = '${type}'`
      }
      qry += ` order by ${sortType === 'C' ? 'c.created_at' : 'a.created_at'} ${sort === 'A' ? 'asc' : 'desc'} `
      qry += ` limit ${start}, ${rows}`
      let list = await mysql(qry)
      return list
    } catch (err) {
      console.log(err)
      throw err
    }
  }

  async getWorkOutInfoListTotal(type) {
    try {
      let qry = `select count(a.wi_idx) as total
        from workout_info a 
        inner join user_info b on a.user_idx = b.user_idx
        left outer join workout_comment c on a.wi_idx = c.wi_idx`
      if (type !== 'A') {
        qry += ` where a.wi_type = '${type}'`
      }

      let list = await mysql(qry)
      return list
    } catch (err) {
      console.log(err)
      throw err
    }
  }

  async getWorkOutImage(wiIdx) {
    try {
      let qry = `select * from workout_img where wi_idx = ?`
      let list = await mysql(qry, [wiIdx])
      return list
    } catch (err) {
      console.log(err)
      throw err
    }
  }
}
