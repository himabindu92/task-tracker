# Task Tracker Application (Using Node.js,express.js,react.js,sqlite3(database))



******* Backend ********

**Required Packages ** 
# npm install 
# npm install express cors 
# npm install sqlite3 
# npm install nodemon --save-dev

Given `server.js` file and  database file `databaseTracker.db` with a tasks table 

Table** 

| Column      | Type        |
| --------    | -------     |   
| id          | INTEGER(Pk) |
| title       | TEXT        |
| description | TEXT        |
| priority    | TEXT        |
| due_date    | DATE        |
| status      | TEXT        | 
| created_at  | DATE        |




Use `date-fns` format function to format the date.

 `POST` Method Add new Task to the table 
#### Path: `/tasks/`
#### Method: `POST`

 `GET` Method Retrive the Records from the Task table with filter Options 
#### Path: `/tasks/`
#### Method: `GET`

 `PATCH` Method Update Status or Priority 
 #### Path: `/tasks/`
#### Method: `PATCH` 

** Export the express instance using the default export syntax. **

** Use Common JS module syntax. **



******* frontend ********

created `react-app` 

`index.js` is a given file name which path is `src/components/TasktTracker/index.js`

->Craete a class Component 
->fetch a data from componentDidMount url is
`URL => 'http://localhost:5000/tasks'` which is backend running on this portal 
->Make filters with(`status,priprity,due-date`)
->call eventListeners `this.OnchangeInput` for read the input value `this.onChangeFilter` for filter the values 
->craete a form and click on `this.onsubmitForm`, using `POST` Method new task details are stored in `datbaseTracker.db` 


## Connenct Frontewnd to backend ##### 
install core modules in backend server.js file 

## RUN simultaneously frontend and Backend ## 
Run this command in your root project directory (not inside frontend or backend) 

`npm install concurrently --save-dev` 

update root package.json 

 "scripts": {
  "backend": "cd backend && nodemon server.js",
  "frontend": "cd frontend/task-tracker && npm start",
  "start": "concurrently \"npm run backend\" \"npm run frontend\""
}  

-> RUN:`npm start` in terminal to see the output
