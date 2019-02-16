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
var program = require('commander');
var Spinner = CLI.Spinner;
var countdown = new Spinner('Authentication ...');
program
  .option('-s, --show', 'Show my tasks')
  .option('-d, --delete', 'Delete a task')
  .parse(process.argv);

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
    if(program.show) {
      routines.displayTasks(tasklists, service);
    }
    else if(program.delete) {
      routines.deleteTask(tasklists, service);
    }
    else {
      routines.addTask(tasklists, service);
    } 
  }
  await run();
};
