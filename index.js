#!/usr/bin/env node

const chalk = require('chalk');
const clear = require('clear');
const figlet = require('figlet');
const {google} = require('googleapis');
const CLI = require('clui')
const credentials = (require('./credentials.js').credentials)
const inquirer = require('./lib/inquirer');
const authorize = require('./lib/auth');
const tasksApi  = require('./lib/tasksApi');
const routines = require('./lib/routines');
// var program = require('commander');
var Spinner = CLI.Spinner;
var countdown = new Spinner('Authentication ...');
// program
//   .option('-s, --show', 'Show my tasks')
//   .option('-d, --delete', 'Delete a task')
//   .parse(process.argv);

clear();
console.log(
  chalk.cyan(
    figlet.textSync('Tasks', { horizontalLayout: 'full' })
  )
);
countdown.start();
authorize(credentials, main);

async function main(auth) {
  const service = google.tasks({version: 'v1', auth});
  var tasklists = await tasksApi.getTaskLists(service);
  countdown.stop();
  var run = async () => {
    while(true) {
      choice = await inquirer.begin();
      if (choice.option[0] =='S')
        await routines.displayTasks(tasklists, service);
      else if (choice.option[0] == 'D' && choice.option[16] != 't')
        await routines.deleteTask(tasklists, service);
      else if(choice.option[0] == 'A')
        await routines.addTask(tasklists, service);
      else if(choice.option[16] == 't') {
        // console.log("Hey!");
        await routines.deleteTasklist(tasklists, service);
        tasklists = await tasksApi.getTaskLists(service);
      }
      else if(choice.option[0] == 'N') {
        await routines.addTasklist(tasklists, service);
        tasklists = await tasksApi.getTaskLists(service);
      }
      else if(choice.option[0] == 'F') {
        routines.fresh();
      }
      else
        break;
    }
    console.log('Bye :)\n');
  }
  await run();
};
