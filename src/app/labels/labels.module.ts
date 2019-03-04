import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { LabelsService } from './labels.service';
import { LabelsSocket } from './labels.socket';
import { BrowserModule } from '@angular/platform-browser';
import { HttpClientModule } from '@angular/common/http';

@NgModule({
  declarations: [],
  imports: [
    BrowserModule,
    HttpClientModule
  ],
  providers: [ LabelsService, LabelsSocket ]
})
export class LabelsModule {
}
