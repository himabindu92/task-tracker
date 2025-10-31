1. Database Schema 

To store and manage multiple tasks 

Tables Used:

tasks — stores individual tasks.

Table Fileds:
id → Primary Key (auto increment).

title, description → Text fields.

priority →  TEXT (Low / Medium / High).

status →  (Open / In Progress / Done).

due_date, created_at → DATE or DATETIME.

2.Logic in backend and frontend 

backend 

Node.js + Express: Lightweight and  REST APIs.

Database Operations:

GET /tasks → Fetch tasks (supports filters like status, priority, sort_by).

POST /tasks → Add a new task.

PATCH /tasks/:id → Update status or priority only.

DELETE /tasks/:id → Remove a task. 

frontend 

React.js (Class Components):

Managed state for form inputs, tasks list, and filters.

Used componentDidMount() to fetch data 

Handled form submission using the Fetch API (POST, GET, PATCH).

Filtering and Sorting:

Used dropdowns to set filters for priority and status.

Query parameters were passed dynamically to backend.