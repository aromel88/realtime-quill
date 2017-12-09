import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { QuillComponent } from './quill.component';

@NgModule({
  imports: [
    CommonModule
  ],
  declarations: [ QuillComponent ],
  exports: [ QuillComponent ]
})
export class QuillModule { }
