import { NgModule } from '@angular/core';

import { IonicPageModule } from 'ionic-angular';

import { Root } from './root';

@NgModule({
  declarations: [
    Root,
  ],
  imports: [
    IonicPageModule.forChild(Root)

  ],
  exports: [
    Root
  ]
})
export class RootModule { }
