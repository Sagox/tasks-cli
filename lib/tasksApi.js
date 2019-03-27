module.exports = {
  getTaskLists: (service) => {
    return new Promise((resolve, reject) => {
      service.tasklists.list((err, res) => {
      tasklists = res.data.items;
      resolve(tasklists)
      });
    });
  },
  createNewTaskList: (title, service) => {
    return new Promise((resolve, reject) => {
      service.tasklists.insert({
        resource: {
          title: title
        }
      }, (err, res) => {
        if(err)
          console.log(err);
        resolve(res.data);
      });
   });
  },
  getTasks: (tasklistID, service) => {
    return new Promise((resolve, reject) => {
      service.tasks.list({
        tasklist: tasklistID
      },(err,res) => {
        if(err)
          throw err;
        if(!res.data.items)
          resolve(0);
        else {
          tasks = res.data.items.map(task => {
            return {
              title: task.title,
              details: task.notes,
              due: task.due,
              id: task.id
            }
          });
          resolve(tasks);
        }

      });
    });
  },
  deleteTask: (tasklistID, taskID, service) => {
    return new Promise((resolve, reject) => {
      service.tasks.delete({
        tasklist: tasklistID,
        task: taskID
      }, (err, res) => {
        if(err)
          throw err;
        else
          resolve(res.status);
      });
    });
  },
  deleteTasklist: (tasklistID, service) => {
    return new Promise((resolve, reject) => {
      service.tasklists.delete({
        tasklist: tasklistID
      }, (err, res) => {
        if(err)
          throw err;
        else
          resolve(res.status);
      });
    });
  }
}