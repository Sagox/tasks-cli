const tasksApi  = require('./tasksApi');
const inquirer = require('./inquirer');
var columnify = require('columnify');

module.exports = {
  addTask: async (tasklists, service) => {
    var task = await inquirer.taskForm(tasklists);
    var tasklist_titles = tasklists.map(tasklist => tasklist.title);

    if(tasklist_titles.includes(task.tasklist))
      task.tasklistID = tasklists[tasklist_titles.indexOf(task.tasklist)].id;
    else {
      task.tasklistID  = (await tasksApi.createNewTaskList(task.tasklist, service)).id;
    }
    service.tasks.insert({
      tasklist: task.tasklistID,
      resource: {
        title: task.title,
        notes: task.notes,
        due: task.due
      }
    },(err, res) => {
      if(err)
        console.log(err);
      });
  },
  displayTasks: async (tasklists, service) => {
    var tasklist = await inquirer.getTasklist(tasklists);
  	var tasklist_titles = tasklists.map(tasklist => tasklist.title);
  	var tasklistID = tasklists[tasklist_titles.indexOf(tasklist.option)].id;
    if(tasklist_titles.includes(tasklist.option)) {
      tasks = await tasksApi.getTasks(tasklistID, service);
      console.log(columnify(tasks, {
         columnSplitter: ' | '
       }));
  	}
  },
  deleteTask: async (tasklists, service) => {
    var tasklist = await inquirer.getTasklist(tasklists);
    var tasklist_titles = tasklists.map(tasklist => tasklist.title);
    var tasklistID = tasklists[tasklist_titles.indexOf(tasklist.option)].id;
    var tasks = await tasksApi.getTasks(tasklistID, service);
    var task = await inquirer.getTask(tasks);;
    var task_titles = tasks.map(task => task.title);
    // console.log(task_titles);
    var taskID = tasks[task_titles.indexOf(task.option)].id;
    await tasksApi.deleteTask(tasklistID, taskID, service);
  }
}