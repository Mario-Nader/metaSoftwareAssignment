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
            const userOwnsTask = await  DBcontrollers.userOwnsTask(taskID,ID)
            if(userOwnsTask){
                await DBcontrollers.updateStatus(taskID,newState)
            }
        }
    }catch(err){
        console.log(err.message)
        return res.status(500).json({"msg":"couldn't update task status"})
    }
}


async function deleteTask(req,res){
    try{
        const {taskID} = req.body
        if(await DBcontrollers.userOwnsTask(taskID,req.id)){
            const deleted = await DBcontrollers.deleteTaskByID(taskID)
            if(deleted){
                return res.status(200).json({message:"task was deleted successfully"})
            }else{
                return res.status(404).json({message:"task ID is invalid"})
            }
        }else{
            return res.status(403).json({message:"autherization error"})
        }

    }catch(err){
        console.log(err.message)
        res.status(500).json({message:"problem deleting the task"});
    }
}


async function updateTaskDetails(req,res){
    try{
        const {taskID,title,description,dueDate} = req.body
        let date
        if (!dueDate){
            date = null
        }else{
           date = new Date(dueDate) 
           date = dueDate.toISOString().split("T")[0];
        }
        if((title && typeof title !== "string") || (description && typeof description !== "string")){
            return res.status(400).json({"msg":"title and description must be strings"})
        }
        const Userid = req.id
        if(await DBcontrollers.userOwnsTask(taskID,Userid)){//this will be rejected if the taskId is invalid or if the user doesn't own the task
            let task = await DBcontrollers.getTask(taskID)
            if(title){
                task.Title = title
            }
            if(description){
                task.Description
            }
            if(dueDate){
                task.DueDate = dueDate
            }
            await DBcontrollers.updateWholeTask(taskID,task.Title,task.Description,task.DueDate)
        }else{
            res.status(400).json({message:"cannot access this task"})
        }
    }catch(err){
        console.log(err.message)
        res.status(500).json({message:"error while updating the task"});
    }

}

module.exports = {addTask,updateTaskStatus,deleteTask,updateTaskDetails}