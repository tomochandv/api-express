import { mysql } from '../common/mysql'

export class InitDatabase {
  async createTable() {
    try {
      let qry = `DROP TABLE IF EXISTS user_info;`
      await mysql(qry)
      qry = `
            CREATE TABLE user_info
            (
                user_idx   INT            NOT NULL    AUTO_INCREMENT, 
                user_name  VARCHAR(20)    NOT NULL, 
                user_type  VARCHAR(2)     NOT NULL, 
                 PRIMARY KEY (user_idx)
            );`
      await mysql(qry)
      qry = `DROP TABLE IF EXISTS workout_info;`
      await mysql(qry)
      qry = ` CREATE TABLE workout_info
            (
                wi_idx      INT           NOT NULL    AUTO_INCREMENT, 
                user_idx    INT           NOT NULL, 
                wi_type     VARCHAR(10)    NOT NULL, 
                created_at  DATETIME      NOT NULL    DEFAULT NOW(),
                 PRIMARY KEY (wi_idx)
            );`
      await mysql(qry)
      qry = `DROP TABLE IF EXISTS workout_img;`
      await mysql(qry)
      qry = ` CREATE TABLE workout_img
            (
                img_idx INT           NOT NULL    AUTO_INCREMENT, 
                wi_idx      INT           NOT NULL  , 
                filename    VARCHAR(200)  NOT NULL,
                created_at  DATETIME      NOT NULL    DEFAULT NOW(),
                 PRIMARY KEY (img_idx)
            );`
      await mysql(qry)
      qry = `DROP TABLE IF EXISTS workout_comment;`
      await mysql(qry)
      qry = ` CREATE TABLE workout_comment
      (
          comment_idx  INT    NOT NULL    AUTO_INCREMENT, 
          wi_idx      INT    NOT NULL,
          user_idx   INT    NOT NULL, 
          comment VARCHAR(200) NOT NULL,
          created_at  DATETIME      NOT NULL    DEFAULT NOW(), 
           PRIMARY KEY (comment_idx)
      );`
      await mysql(qry)
      qry = `insert into user_info(user_name, user_type) values(?, ?)`
      await mysql(qry, ['admin', 'A'])
      await mysql(qry, ['user1', 'U'])
      await mysql(qry, ['user2', 'U'])
      await mysql(qry, ['user3', 'U'])
      await mysql(qry, ['user4', 'U'])
    } catch (err) {
      console.log(err)
      throw err
    }
  }
}
