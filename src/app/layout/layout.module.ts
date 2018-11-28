import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HeaderComponent } from './header/header.component';
import { ClarityModule } from '@clr/angular';

import { AppRoutingModule } from '../app-routing.module';
import { SidebarComponent } from './sidebar/sidebar.component';
import { LayoutComponent } from './layout/layout.component';
import { SubbarComponent } from './subbar/subbar.component';

@NgModule({
  imports: [
    CommonModule,
    ClarityModule,
    AppRoutingModule
  ],
  exports: [
    LayoutComponent,
    SidebarComponent
  ],
  declarations: [HeaderComponent, SidebarComponent, LayoutComponent, SubbarComponent]
})
export class LayoutModule {
}
