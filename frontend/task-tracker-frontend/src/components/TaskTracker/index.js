import React, { Component } from 'react'
import './index.css' 

 const REACT_API=process.env.REACT_APP_BASE_URL
 console.log("REACT_API:", REACT_API)

class TaskTracker extends Component {
  state = {
    tasks: [],
    title: '',
    description: '',
    priority: 'Low',
    due_date: '',
    status: 'Open',
    filters: {
      status: '',
      priority: '',
      sort_by: '',
    },
  } 

 

  componentDidMount() {
    this.getTasks()
  }

  // Fetch tasks with filters (GET)
  getTasks = async () => {
    const { filters } = this.state
    let url = `${REACT_API}/tasks`

    let filterList = []

    if (filters.status) {
    filterList.push(`status=${filters.status}`)
    }
    if (filters.priority) {
    filterList.push(`priority=${filters.priority}`)
    }
    if (filters.sort_by) {
    filterList.push(`sort_by=${filters.sort_by}`)
    } 

    if (filterList.length > 0) {
    const queryString = filterList.join('&')
    url += `?${queryString}`
    }

    try {
      const response = await fetch(url)
      if (!response.ok) {
        throw new Error('Failed to fetch tasks')
      }
      
      const data = await response.json()
      this.setState({ tasks: data })
    } catch (error) {
      console.error('Error fetching tasks:', error)
    }
  }

  // Handle input changes
  onChangeInput = (event) => {
    this.setState({ [event.target.name]: event.target.value })
  }

  //  Handle filter changes
  onChangeFilter = (event) => {
    const { name, value } = event.target
    this.setState(
      (prevState) => ({
        filters: { ...prevState.filters, [name]: value },
      }),
      this.getTasks
    )
  }

  //  Handle form submission (POST)
  onSubmitForm = async (event) => {
    event.preventDefault()
    const { title, description, priority, due_date, status } = this.state

    const taskData = {
      title,
      description,
      priority,
      due_date,
      status,
      created_at: new Date().toISOString().split('T')[0], // today's date
    }

    try {
      const response = await fetch(`${REACT_API}/tasks/`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(taskData),
      })

      if (response.ok) {
        alert(' Task added successfully!')
        this.setState(
          {
            title: '',
            description: '',
            priority: 'Low',
            due_date: '',
            status: 'Open',
          },
          this.getTasks
        )
      } else {
        const errorText = await response.text()
        alert(' Error: ' + errorText)
      }
    } catch (error) {
      console.error('Error adding task:', error)
    }
  }

  render() {
    const {
      tasks,
      title,
      description,
      priority,
      due_date,
      status,
      filters,
    } = this.state

    return (
      <div className="task-tracker"> 
    
        <h1>Task Tracker</h1>

        {/* --- Task Form --- */} 
          <div className="task-container">
        <form className="task-form" onSubmit={this.onSubmitForm}>
          <input
            type="text"
            name="title"
            placeholder="Title"
            value={title}
            onChange={this.onChangeInput}
            required
          />

          <input
            type="text"
            name="description"
            placeholder="Description"
            value={description}
            onChange={this.onChangeInput}
            required
          />

          <select
            name="priority"
            value={priority}
            onChange={this.onChangeInput}
          >
            <option value="Low">Low</option>
            <option value="Medium">Medium</option>
            <option value="High">High</option>
          </select>

          <input
            type="date"
            name="due_date"
            value={due_date}
            onChange={this.onChangeInput}
          />

          <select name="status" value={status} onChange={this.onChangeInput}>
            <option value="Open">Open</option>
            <option value="In Progress">In Progress</option>
            <option value="Done">Done</option>
          </select>

          <button type="submit" className="button">Add Task</button>
        </form> 
        </div>

        {/* --- Filters --- */} 


        <div className="filters">
            <h1 className='filter-heading'>Filters</h1>
          <select
            name="status"
            value={filters.status}
            onChange={this.onChangeFilter}
          >
            <option value="">All Statuses</option>
            <option value="Open">Open</option>
            <option value="In Progress">In Progress</option>
            <option value="Done">Done</option>
          </select>

          <select
            name="priority"
            value={filters.priority}
            onChange={this.onChangeFilter}
          >
            <option value="">All Priorities</option>
            <option value="High">High</option>
            <option value="Medium">Medium</option>
            <option value="Low">Low</option>
          </select>

          <select
            name="sort_by"
            value={filters.sort_by}
            onChange={this.onChangeFilter}
          >
            <option value="">Sort By</option>
            <option value="due_date">Due Date</option>
          </select>
        </div>

        {/* --- Task Table --- */} 
        <h2>Task List</h2>
        <table className="task-table">
          <thead>
            <tr>
              <th>Title</th>
              <th>Description</th>
              <th>Priority</th>
              <th>Due Date</th>
              <th>Status</th>
            </tr>
          </thead>
          <tbody>
            {tasks.length > 0 ? (
              tasks.map((task) => (
                <tr key={task.id}>
                  <td>{task.title}</td>
                  <td>{task.description}</td>
                  <td>{task.priority}</td>
                  <td>{task.due_date}</td>
                  <td>{task.status}</td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="5">No tasks found</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    )
  }
}

export default TaskTracker
