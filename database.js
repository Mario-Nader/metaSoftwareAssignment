const mysql = require("mysql2")
const bcrypt = require('bcrypt');
const pool = mysql.createPool({
    host:process.env.host,
    user:process.env.user,
    password:process.env.password,
    database:process.env.database,
    port:process.env.dataBasePort

}).promise()

async function getTasks(userID){
    const [rows] = await pool.query(`
        select *
        from Tasks
        where UserID = ?
        `,[userID])
    return rows
}

async function getTask(taskID){
const [rows] = await pool.query(`
    select *
    from Tasks
    where ID = ?
    `,
[taskID])
if(rows[0].length != 0){
return rows[0];
}else{
    return null;
}
}

async function convertTaskToDone(taskID){
await pool.query(`
    UPDATE Tasks
    SET Status = 'Done'
    WHERE ID = ?;
    `,[taskID])

await log(taskID,'Done')
}
//['To Do', 'In Progress', 'Done']
async function convertTaskToInProgress(taskID){
await pool.query(`
    UPDATE Tasks
    SET Status = 'In Progress'
    WHERE ID = ?;
    `,[taskID])
    await log(taskID,'In Progress')
}

async function convertTaskToToDo(taskID){
await pool.query(`
    UPDATE Tasks
    SET Status = 'To Do'
    WHERE ID = ?;
    `,[taskID])
    await log(taskID,'To Do')
}

async function updateStatus(taskID,status){
    if(status == 'To Do'){
        await convertTaskToToDo(taskID)
    }else if(status ==  'In Progress'){
        await convertTaskToInProgress(taskID)
    }else{
        await convertTaskToDone(taskID)
    }
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
    const hashedPassword = await bcrypt.hash(password,process.env.salt)
    try{ 
const [user] = await pool.query(`
    insert into Users (Username, PasswordHash)
    values(?,?)
    `,[name,hashedPassword])
return user.insertId
}catch(err){
    console.log(err.message)
    return null;
}
}

async function createTask(title,description,dueDate,UserID){
    await pool.query(`
    insert into Tasks (Title,Description,DueDate,UserID)
    values(?,?,?,?)
    `,[title,description,dueDate,UserID])
}

async function getUserByID(userID){
const [row] = await pool.query(`
    select *
    from Users
    where ID = ?
    `,
[userID])
if(row.length === 0){
    return null
}else{
return row[0]
}
}



async function updateWholeTask(id,title,description,dueDate){
await pool.query(`
    update Tasks
    set Title = ?,
        Description = ?,
        DueDate = ?
    where ID = ?;
    `,[title,description,dueDate,id])
}


async function getUserByName(name){
    const [rows] = await pool.query(`
    select *
    from Users
    where Username = ?
    `,
[name])
if(rows.length === 0){
    return null
}else{
    return rows
}
}

async function deleteTaskByID(id){//returns true if it finds and delete the task successfuly and false if the task doesn't exist
const [row] = await pool.query(
    `
    SELECT 1
    FROM Tasks
    WHERE ID = ?
    LIMIT 1
    `,
    [id]
  );

  if (row.length > 0){
    await pool.query(`
        delete 
        from Tasks
        where ID = ?
        `,[id])
        return true;
    }else{
        return false;
    }
}
module.exports = {getTasks,getTask,userOwnsTask,log,createUser,createTask,getUserByID,getUserByName,updateStatus,deleteTaskByID,updateWholeTask}