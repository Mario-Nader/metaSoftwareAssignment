const mysql = require("mysql2")
const { use } = require("react")

const pool = mysql.createPool({
    host:process.env.host,
    user:process.env.user,
    password:process.env.password,
    database:process.env.database

}).promise()

async function getTasks(userID){
    const [rows] = await pool.query(`
        select *
        from tasks
        where UserID = ?
        `,[userID])
    return rows
}

async function getTask(taskID){
const [rows] = await pool.query(`
    select *
    from tasks
    where ID = ?
    `,
[taskID])
return rows[0]
}

async function convertTaskToDone(taskID){
await pool.query(`
    UPDATE Tasks
    SET Status = 'Done'
    WHERE ID = ?;
    `,[taskID])
}

async function convertTaskToInProgress(taskID){
await pool.query(`
    UPDATE Tasks
    SET Status = 'In Progress'
    WHERE ID = ?;
    `,[taskID])
}

async function convertTaskToToDo(taskID){
await pool.query(`
    UPDATE Tasks
    SET Status = 'To Do'
    WHERE ID = ?;
    `,[taskID])
}

async function userOwnsTask(taskID,userID){
  const [rows] =  await pool.query(`
    select *
    from tasks
    where ID = ? and userID = ?
        `,[taskID,userID])
    if (rows.length == 0){
        return false;
    }else{
        return true;
    }
}