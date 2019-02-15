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
        console.log(res);
        resolve(res.data);
      });
   });
  }
}