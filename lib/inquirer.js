const inquirer   = require('inquirer');
inquirer.registerPrompt('datetime', require('inquirer-datepicker-prompt'))

module.exports = {

  taskForm: (tasklists) => {
    const questions = [
      {
        name: 'tasklist',
        type: 'list',
        prefix: '#',
        message: 'Enter name of the tasklist:',
        choices: tasklists.map(tasklist => tasklist.title)
        // validate: function( value ) {
        //   if (value.length) {
        //     return true;
        //   } else {
        //     return 'Please enter a valid string.';
        //   }
        // }
      },
      {
        name: 'title',
        type: 'input',
        prefix: '#',
        message: 'Enter title of the task:',
        validate: function(value) {
          if (value.length) {
            return true;
          } else {
            return 'Please enter a valid string.';
          }
        }
      },
      {
        name: 'notes',
        type: 'input',
        prefix: '#',
        message: 'Enter some details:',
        validate: function(value) {
          // if (value.length) {
          //   return true;
          // } else {
          //   return 'Please enter a valid string.';
          // }
          return true;
        }
      },
      {
        name: 'due',
        type: 'datetime',
        prefix: '#',
        message: 'Enter due date:',
        format: ['dd', '/', 'mm', '/', 'yyyy'],
        initial: new Date(new Date().getTime() + 5*60*60*1000)
      }
    ];
    return inquirer.prompt(questions);
  },
  getTasks: (tasklists) => {
    const questions = [
    {
      name: 'option',
      prefix: '#',
      message: 'Select one of the following',
      type: 'list',
      choices: tasklists.map(tasklist => tasklist.title)
    }
    ];
    return inquirer.prompt(questions);
  }
}