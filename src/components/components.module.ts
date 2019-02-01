import { NgModule } from '@angular/core';
import { QrCodeComponent } from './qr-code/qr-code';
import { FormsModule } from '@angular/forms';
import { IonicModule } from 'ionic-angular';


@NgModule({
	declarations: [QrCodeComponent],
	imports: [FormsModule, IonicModule ],
	exports: [QrCodeComponent]
})
export class ComponentsModule {}
