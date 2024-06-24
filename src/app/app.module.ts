import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { RouterModule,Routes} from '@angular/router';
import { FormsModule } from '@angular/forms';
import { ReactiveFormsModule } from '@angular/forms';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { HttpClientModule } from '@angular/common/http';

import { AppComponent } from './app.component';
  import { LoginPageComponent } from './login-page/login-page.component';
  import { DatabaseCommunicatorComponent } from './database-communicator/database-communicator.component';
  import { MainPageComponent } from './main-page/main-page.component';

    import { MedicineComponent } from './main-page/modeB/controller/medicine/medicine.component';
    import { ReminderBComponent } from './main-page/modeB/controller/reminderB/reminderB.component';

    import { ReminderAComponent } from './main-page/modeA/controller/reminderA/reminderA.component';
      import { ReminderAAddComponent } from './main-page/modeA/controller/reminderA/reminderA-add/reminderA-add.component';
      import { ReminderAUpdateComponent } from './main-page/modeA/controller/reminderA/reminderA-update/reminderA-update.component';
      import { ReminderADeleteComponent } from './main-page/modeA/controller/reminderA/reminderA-delete/reminderA-del.component';

  import { UsersComponent } from './main-page/users/users.component';
  import { ReminderAStatsComponent } from './main-page/modeA/controller/reminderAstats/reminderAstats.component';
  import { SetupComponent } from './main-page/setup/setup.component';
  import { ReminderBStatsComponent } from './main-page/modeB/controller/reminderBstats/reminderBstats.component';



  const appRoutes:Routes=[
    {
      path:'User',
      component: UsersComponent
    },
    {
      path:'ReminderAStats',
      component:ReminderAStatsComponent
    },
    {
      path:'Setup',
      component:SetupComponent
    },
    {
      path:'ReminderA',
      component: ReminderAComponent,
      children:[
        {path:'add',component:ReminderAAddComponent},
        {path:'update',component:ReminderAUpdateComponent},
        {path:'delete',component:ReminderADeleteComponent}
      ]
    },
    {
      path:'ReminderB',
      component:ReminderBComponent,
      children:[{
        path:'Medicines',
        component:MedicineComponent,
      }]
    },
    {
      path:'ReminderBStats',
      component:ReminderBStatsComponent
    },
    {
      path:'Medicines',
      component:MedicineComponent, 
    },
  
  ];

@NgModule({
  declarations: [
    AppComponent,
    LoginPageComponent,
    SetupComponent,
    DatabaseCommunicatorComponent,
    MainPageComponent,
    UsersComponent,

    ReminderAComponent,
    ReminderAAddComponent,
    ReminderAUpdateComponent,
    ReminderADeleteComponent,

    ReminderBComponent,
    
    MedicineComponent,

    ReminderAStatsComponent,
    ReminderBStatsComponent,
    
  ],
  imports: [
    BrowserModule,
    FormsModule,
    HttpClientModule,
    RouterModule.forRoot(appRoutes),
    ReactiveFormsModule,
    BrowserAnimationsModule,
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
