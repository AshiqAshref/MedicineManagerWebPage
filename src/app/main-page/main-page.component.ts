
import { animate, state, style, transition, trigger } from '@angular/animations';
import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';



@Component({
  selector: 'app-main-page',
  templateUrl: './main-page.component.html',
  styleUrls: ['./main-page.component.css'],
  animations:[
    trigger('sidebarState',[
      state('true',style({
        'max-width':'65px',
      })),
      state('false',style({
        'max-width':'200px',
      })),
      transition('true <=> false',animate(90)),
    ]),
    trigger('sidebarTextState',[
      state('true',style({
        'max-width':'0px',
        'display':'none'

      })),
      state('false',style({
        'max-width':'150px',
        'display':'block'
      })),
      transition('true <=> false',animate(900)),
      
    ])

  ]
})

export class MainPageComponent implements OnInit {
  toggleSidebarButton:string='true';
  mode:boolean=false; //true= modeA, false= modeB
  

  constructor(private router: Router){
    // router.events
    // .pipe(map((response: any) => response))
    // .subscribe((val)=>{
    //   try{
    //     let url:String=val.url
    //     if(url!=undefined){
    //       if((url.includes("add"))){
    //         console.log();
    //       }
    //     }     
    //   }catch(error){
    //     console.log(error)
    //   }
    // })
  }
  ngOnInit(): void {
    // this.router.navigate(['/Setup']);
    // this.router.navigate(['/ReminderB']);
    this.router.navigate(['/Medicines']); 
    // this.router.navigate(['/ReminderA/add']);
    // this.router.navigate(['/']);
  } 

  toggleSidebar(){
    this.toggleSidebarButton=='true'? this.toggleSidebarButton='false' : this.toggleSidebarButton='true';
  }
  openSidebar(){
    this.toggleSidebarButton='false';
  }
  closeSidebar(){
    this.toggleSidebarButton='true';
  }

  toggleMode(event:any){
    this.mode=!(event.target.checked);
  }


}


