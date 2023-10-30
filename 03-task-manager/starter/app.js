const express = require('express');
const app = express();
const tasks = require('./routes/tasks');

//middleware

app.use(express.json());

//routes
// get all the tasks
app.get(`/hello`, (req, res)=>{
    res.send('Task manager app');
});
app.use('/api/v1/tasks',tasks);

// create a new task
// get a single task (/:id)
// update a task (/:id)
// delete a task (/:id)

const port = 3000;

app.listen(port, console.log(`Server is listening on port ${port}`)); 