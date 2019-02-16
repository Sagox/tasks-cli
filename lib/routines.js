const tasksApi  = require('./tasksApi');
const inquirer = require('./inquirer');
var columnify = require('columnify');
const chalk = require('chalk');
const clear = require('clear');
const figlet = require('figlet');

module.exports = {
  addTask: async (tasklists, service) => {
    return new Promise(async (resolve, reject) => {
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
      resolve();
    });
  },
  displayTasks: async (tasklists, service) => {
      return new Promise(async (resolve, reject) => {
      var tasklist = await inquirer.getTasklist(tasklists);
      var tasklist_titles = tasklists.map(tasklist => tasklist.title);
      var tasklistID = tasklists[tasklist_titles.indexOf(tasklist.option)].id;
      if(tasklist_titles.includes(tasklist.option)) {
        tasks = await tasksApi.getTasks(tasklistID, service);
        tasks = tasks.map(task => {
          return {
            title: task.title,
            details: task.details,
            due: task.due,
          }
        });
        console.log('\n'+columnify(tasks, {
           columnSplitter: ' | '
         })+'\n');
      }
      resolve();
    });
  },
  deleteTask: async (tasklists, service) => {
    return new Promise(async (resolve, reject) => {
      var tasklist = await inquirer.getTasklist(tasklists);
      var tasklist_titles = tasklists.map(tasklist => tasklist.title);
      var tasklistID = tasklists[tasklist_titles.indexOf(tasklist.option)].id;
      var tasks = await tasksApi.getTasks(tasklistID, service);
      var task = await inquirer.getTask(tasks);;
      var task_titles = tasks.map(task => task.title);
      // console.log(task_titles);
      var taskID = tasks[task_titles.indexOf(task.option)].id;
      await tasksApi.deleteTask(tasklistID, taskID, service);
      resolve();
    });
  },
  fresh: async() => {
    return new Promise((resolve, reject) => {
      clear();
      console.log(
        chalk.cyan(
          figlet.textSync('Tasks', { horizontalLayout: 'full' })
        )
      );
      resolve();
    });
  }
}