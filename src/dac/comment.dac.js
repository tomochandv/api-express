import { mysql } from '../common/mysql'
export class CommentDac {
  async addComment(wiIdx, userIdx, comment) {
    try {
      const result = await mysql(`insert into workout_comment(wi_idx, user_idx, comment) values(?, ?)`, [wiIdx, userIdx, comment])
      return result
    } catch (err) {
      console.log(err)
      throw err
    }
  }

  async getComment(wiIdx, start, rows) {
    try {
      const result = await mysql(
        `select a.user_idx, b.user_name, a.comment, a.created_at
      from workout_comment a 
      inner join user_info b on a.user_idx = b.user_idx
      order by a.created_at desc limit ?, ?`,
        [userIdx, comment, start, rows],
      )
      return result
    } catch (err) {
      console.log(err)
      throw err
    }
  }
}
