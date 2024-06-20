export const environment = {
    production: false,
    config: 'http://localhost:8080',
    ESPAddress: '',
  };
  
  export const modeB = {
    ServerAddress         : environment.config,
    getAllRemindersAddress: environment.config+"/modeB/reminders/all",
    addReminderAddress    : environment.config+"/modeB/reminder/add",

    getAllMedsAddress: environment.config+"/modeB/medicines/all",
    addMedAddress    : environment.config+"/modeB/medicine/add",
    updateMedAddress : environment.config+'/modeB/medicine/update',
    deleteMedAddress : environment.config+'/modeB/medicine/delete',

    testAddress : environment.config+'/modeB/test'
  };

  export const modeA = {
    ServerAddress         : environment.config,
    getAllRemindersAddress: environment.config+"/modeA/all",
    addReminderAddress    : environment.config+"/modeA/add",
    deleteReminderAddress : environment.config+'/modeA/delete',
    updateReminderAddress : environment.config+'/modeA/update',
  }



  