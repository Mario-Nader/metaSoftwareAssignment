const mysql = require("mysql2")
const { use } = require("react")
const bcrypt = require('bcrypt');
const { describe } = require("node:test");

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

// async function userOwnsTask(taskID,userID){
//   const [rows] =  await pool.query(`
//     select *
//     from tasks
//     where ID = ? and userID = ?
//         `,[taskID,userID])
//     if (rows.length == 0){
//         return false;
//     }else{
//         return true;
//     }
// } 
//takes more time than the newer version below but kept in code for reference

async function userOwnsTask(taskID, userID) {
  const [rows] = await pool.query(
    `
    SELECT 1
    FROM Tasks
    WHERE ID = ? AND UserID = ?
    LIMIT 1
    `,
    [taskID, userID]
  );

  return rows.length > 0;
}

async function log(taskID,newState){
const [row] = await pool.query(
    `
    select ID , status,UserID
    from Tasks
    where ID = ?
    `
,[taskID])
if(row.length !== 0){
const oldState = row[0].status
const UserID = row[0].UserID
await pool.query(
    `
    insert into logs ( TaskID,UserID, oldState, newState)
    values(?,?,?,?)
    `
,[taskID,UserID,oldState,newState])
return true;
}else{
    return false;
}
}

async function createUser(name,password){
await pool.query(`
    insert into Users (Username, PasswordHash)
    values(?,?)
    `[name,bcrypt.hash(password,process.env.salt)])
}

async function createTask(title,description,dueDate,UserID){
    await pool.query(`
    insert into Tasks (Title,Description,DueDate,UserID)
    values(?,?,?,?)
    `[title,description,dueDate,UserID])
}