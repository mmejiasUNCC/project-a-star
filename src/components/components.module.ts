import { NgModule } from '@angular/core';
import { QrCodeComponent } from './qr-code/qr-code';
import { FormsModule } from '@angular/forms';
import { IonicModule } from 'ionic-angular';
import { EventOptionComponent } from './event-option/event-option';


@NgModule({
	declarations: [QrCodeComponent,
    EventOptionComponent],
	imports: [FormsModule, IonicModule ],
	exports: [QrCodeComponent,
    EventOptionComponent]
})
export class ComponentsModule {}
