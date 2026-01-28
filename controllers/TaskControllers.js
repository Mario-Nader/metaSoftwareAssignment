const DBcontrollers = require('../database')


async function addTask(req,res){
    try{
        const {title,description,dueDate} = req.body
        let date
        if (!dueDate){
            date = null
        }else{
           date = new Date(dueDate) 
           date = dueDate.toISOString().split("T")[0];
        }
        if(!title || !description){
            return res.status(400).json({"msg":"title and description are required"})
        }
        if(typeof title !== "string" || typeof description !== "string"){
            return res.status(400).json({"msg":"title and description must be strings"})
        }
        const UserID = req.id;
        await DBcontrollers.createTask(title,description,date,UserID)
        return res.status(201).json({"msg":"task created successfully"})
    }catch(err){

    }
}

async function updateTaskStatus(req,res){
    try{
        const {taskID,newState} = req.body
        if(!taskID || !newState){   
            return res.status(400).json({"msg":"taskID and newState are required"})
        }else{
            const validStates = ['To Do', 'In Progress', 'Done']
            if(!validStates.includes(newState)){
                return res.status(400).json({"msg":"newState must be one of 'To Do', 'In Progress', 'Done'"})
            }
            const ID = req.id
            const userOwnsTask = DBcontrollers.userOwnsTask(taskID,ID)
            if(userOwnsTask){
                await DBcontrollers.updateTask(taskID,newState)
            }
        }
    }catch(err){
        console.log(err.message)
        return res.status(500).json({"msg":"couldn't update task status"})
    }
}