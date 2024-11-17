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
    deleteMedAddress : environment.config+'/modeB/medicine/delete/',

    getESPAddress : environment.config+'/modeB/esp/get_esp_ip',
    setESPAddress : environment.config+'/modeB/esp/set_esp_ip',
    attempESPConn : environment.config+'/modeB/esp/att_esp_cn',
    ESP_test      : environment.config+'/modeB/esp/esp_test',

    testAddress : environment.config+'/modeB/test',


  };

  export const modeA = {
    ServerAddress         : environment.config,
    getAllRemindersAddress: environment.config+"/modeA/all",
    addReminderAddress    : environment.config+"/modeA/add",
    deleteReminderAddress : environment.config+'/modeA/delete',
    updateReminderAddress : environment.config+'/modeA/update',
  }



  