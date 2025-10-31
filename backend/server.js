const express = require('express');
const core = require('cors');
const server = express();
server.use(express.json());
server.use(core());

const {format ,parse}=require('date-fns');
const {isValid}=require('date-fns');


const PORT = 5000;

const{open} = require('sqlite');
const sqlite3 = require('sqlite3');
const path = require('path'); 
const  databasepath = path.join(__dirname,'databaseTracker.db');

let db=null ; 
const initializeDBAndServer = async() => {
    try{
        db = await open({
            filename: databasepath,
            driver: sqlite3.Database,
        });
        server.listen(PORT,()=>{
            console.log(`Server Running at http://localhost:${PORT}/`);
        });
    }catch(e){
        console.log(`DB Error: ${e.message}`);
        process.exit(1);
    }
};
initializeDBAndServer();



//Request Body Validation Middleware 

const checkRequestBody= (request,response,next) => {
    const{id,title,description,priority,due_date,status,created_at} = request.body;
    const {taskid} = request.params 
    
    if(priority !== undefined){
        priorityValues = ["High","Medium","Low"];
        isPriorityArray = priorityValues.includes(priority);
        if(isPriorityArray === true){
            request.priority = priority;
            console.log(request.priority);
        }else{
            response.status(400);
            response.send("Invalid Task Priority");
            return;
        }
    } 

    if (status !== undefined) {
    statusArray = ['Open', 'In Progress', 'Done']
    statusIsArray = statusArray.includes(status)

    if (statusIsArray === true) {
      request.status = status
    } else {
      response.status(400)
      response.send('Invalid Task Status')
      return
    }
  }

    if(due_date !== undefined){
        const parsedDate = parse(due_date,'yyyy-MM-dd',new Date());
        const isValidDate = isValid(parsedDate);
        if(isValidDate === true){
           request.due_date = format(parsedDate,'yyyy-MM-dd');
        }else{
             response.status(400);
            response.send("Invalid Due Date");
            return;
        }
        
    }  

    if(created_at !== undefined){
        const parsedDate = parse(created_at,'yyyy-MM-dd',new Date());
        const isValidDate = isValid(parsedDate);
        if(isValidDate === true){
           request.created_at = format(parsedDate,'yyyy-MM-dd');
        }else{
             response.status(400);
            response.send("Invalid Created At Date");
            return;
        }
        
    } 

    request.taskid = taskid;
    request.description = description;
    request.title = title;
    next();
} 

//Post Task  (Create Task)
server.post('/tasks/',checkRequestBody, async (request, response) => {
    const{title,description,priority,due_date,status,created_at} = request.body;
    
    const addTaskQuery = `
         INSERT INTO tasks(title,description,priority,due_date,status,created_at)
         VALUES('${title}','${description}','${priority}','${due_date}','${status}','${created_at}');`;
    const createUser = await db.run(addTaskQuery);
    console.log(createUser);
    response.send("Task Successfully Added");
}); 

//Uopdate Task API  (Update Task)

server.patch('/tasks/:taskid/',checkRequestBody, async (request, response) => {
    const {taskid} = request.params;
    const{title,priority,due_date,status,description} = request.body; 
    console.log(title,priority,due_date,status,description);    

    switch (true) {
    case status !== undefined:
      updateTaskQuery = `
        UPDATE tasks
        SET status = '${status}'
        WHERE id = ${taskid};
      `
      await db.run(updateTaskQuery)
      response.send('Status Updated')
      break 

      case priority !== undefined:
        updateTaskQuery = `
        UPDATE tasks SET priority = '${priority}' 
        WHERE id = ${taskid};`;
        await db.run(updateTaskQuery);
        response.send("Priority Updated");
        break

        case title !== undefined:
        updateTaskQuery = `
        UPDATE tasks SET title = '${title}' 
        WHERE id = ${taskid};`;
        await db.run(updateTaskQuery);
        response.send("Title Updated");
        break 

        case due_date !== undefined:
        updateTaskQuery = `
        UPDATE tasks SET due_date = '${due_date}' 
        WHERE id = ${taskid};`;
        await db.run(updateTaskQuery);
        response.send("Due Date Updated");
        break

        case description !== undefined:
        updateTaskQuery = `
        UPDATE tasks SET description = '${description}' 
        WHERE id = ${taskid};`;
        await db.run(updateTaskQuery);
        response.send("Description Updated");
        break
    }
 }); 

//get Task API 1 (Retrive All Records)

 server.get('/tasks/all', async (request, response) => {    
//   const getTasksQuery = `
//     SELECT *
//     FROM tasks
//   `;

//   const tasks = await db.all(getTasksQuery);
//   response.send(tasks);
 });

//Get Task API 2 (Retrive Single Record)

server.get('/tasks/:taskid/', async (request, response) => {
    const {taskid} = request.params;
    const getTaskQuery = `
        SELECT *
        FROM tasks
        WHERE id = ${taskid};`;

    const task = await db.get(getTaskQuery);
    response.send(task);
}); 


//Get Tasks API 3 (Retrive Multiple Records with Filters)

server.get('/tasks', async (request, response) => {
  const { status, priority, sort_by } = request.query
  console.log("queryparams", request.query)

  let getTaskQuery = `
    SELECT
      *
    FROM tasks
  `

  switch (true) {
    case status !== undefined && priority === undefined:
      getTaskQuery += ` WHERE status = '${status}'`
      break

    case priority !== undefined && status === undefined:
      getTaskQuery += ` WHERE priority = '${priority}'`
      break

    case status !== undefined && priority !== undefined:
      getTaskQuery += ` WHERE status = '${status}' AND priority = '${priority}'`
      break

    default:
      console.log("NO filters applied")
      break
  } 

     if (sort_by === 'due_date') {
    getTaskQuery += ` ORDER BY due_date`
  }

  const tasks = await db.all(getTaskQuery)
  response.send(tasks)
})




 //Delete Task API 4 
 server.delete('/tasks/:taskid/', async (request, response) => {
    const {taskid} = request.params;
    const deleteTaskQuery = `
        DELETE FROM tasks
        WHERE id = ${taskid};`;

    await db.run(deleteTaskQuery);
    response.send("Task Deleted");
}); 


module.exports = server;