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

    import { MedicineComponent } from './main-page/medicine/medicine.component';
      import { MedicineAddComponent } from './main-page/medicine/medicine-add/medicine-add.component';
      import { MedicineUpdateComponent } from './main-page/medicine/medicine-update/medicine-update.component';
      import { MedicineDeleteComponent } from './main-page/medicine/medicine-delete/medicine-delete.component';

    import { ReminderBComponent } from './main-page/reminderB/reminderB.component';
      import { ReminderBAddComponent } from './main-page/reminderB/reminderB-add/reminderB-add.component';

    import { ReminderAComponent } from './main-page/reminderA/reminderA.component';
      import { ReminderAAddComponent } from './main-page/reminderA/reminderA-add/reminderA-add.component';
      import { ReminderAUpdateComponent } from './main-page/reminderA/reminderA-update/reminderA-update.component';
      import { ReminderADeleteComponent } from './main-page/reminderA/reminderA-delete/reminderA-del.component';

  import { UsersComponent } from './main-page/users/users.component';
  import { ReminderAStatsComponent } from './main-page/reminderAstats/reminderAstats.component';
  import { SetupComponent } from './main-page/setup/setup.component';
  import { ReminderBStatsComponent } from './main-page/reminderBstats/reminderBstats.component';


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
      children:[
        {
          path:'add',
          component:ReminderBAddComponent,
          children:[{
            path:'Meds',
            component:MedicineComponent,
            children:[
              {path:'add',component:MedicineAddComponent},
              {path:'update',component:MedicineUpdateComponent},
              {path:'delete',component:MedicineDeleteComponent},
            ]
          }]
        }
      ]
    },
    {
      path:'ReminderBStats',
      component:ReminderBStatsComponent
    },
    {
      path:'Medicines',
      component:MedicineComponent, 
      children:[
        {path:'add',component:MedicineAddComponent},
        {path:'update',component:MedicineUpdateComponent},
        {path:'delete',component:MedicineDeleteComponent},
      ]
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
    ReminderBAddComponent,

    MedicineComponent,
    MedicineAddComponent,
    MedicineUpdateComponent,
    MedicineDeleteComponent,
    
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
