const tasksApi  = require('./tasksApi');
var columnify = require('columnify');

module.exports = {
  addTask: async (task, tasklists, service) => {
    var task;
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
  getTasks: async (tasklist, tasklists, service) => {
  	var tasklist_titles = tasklists.map(tasklist => tasklist.title);
  	// var id = tasklists[tasklist_titles.indexOf(tasklist)].id;
  	if(tasklist_titles.includes(tasklist.option)) {
  		service.tasks.list({
  			tasklist: tasklists[tasklist_titles.indexOf(tasklist.option)].id
  		},(err,res) => {
  			if(err)
  				throw err;
        // console.log(res.data.items);
  			tasks = res.data.items.map(task => {
          return {
            title: task.title,
            details: task.notes,
            due: task.due
          }
        });
        // tasks = res.data.items.map(task => task.title);
        // console.log(tasks);
  			console.log(columnify(tasks, {
           columnSplitter: ' | '
         }));
  		});
  	}
  }
}