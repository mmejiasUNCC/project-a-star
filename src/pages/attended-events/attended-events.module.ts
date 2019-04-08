import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { AttendedEventsPage } from './attended-events';

@NgModule({
  declarations: [
    AttendedEventsPage,
  ],
  imports: [
    IonicPageModule.forChild(AttendedEventsPage),
  ],
})
export class AttendedEventsPageModule {}
