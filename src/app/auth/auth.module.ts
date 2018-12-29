import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ClarityModule } from '@clr/angular';
import { FormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';

import { LoginComponent } from './login.component';

@NgModule({
  declarations: [ LoginComponent ],
  imports: [
    CommonModule,
    ClarityModule,
    FormsModule,
    HttpClientModule
  ]
})
export class AuthModule {
}
