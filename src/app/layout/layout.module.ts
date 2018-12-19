import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AppRoutingModule } from '../app-routing.module';
import { ClarityModule } from '@clr/angular';

import { HeaderComponent } from './header/header.component';
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
  declarations: [ HeaderComponent,
    SidebarComponent,
    LayoutComponent,
    SubbarComponent
  ]
})
export class LayoutModule {
}
