declare var require: any;

import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';

import * as Quill from 'quill';
import Y from 'yjs';
import yWebsocketsClient from 'y-websockets-client';
import yMemory from 'y-memory';
import yArray from 'y-array';
import yRichText from 'y-richtext';
Y.extend(yWebsocketsClient, yMemory, yArray, yRichText);

@Component({
  selector: 'app-quill',
  templateUrl: './quill.component.html',
  styleUrls: ['./quill.component.scss']
})
export class QuillComponent implements OnInit {

  @ViewChild('editor') editorNode: ElementRef;

  editor: Quill.Quill;

  constructor(
  ) { }

  ngOnInit(): void {
    const quillOptions = {
      formats: ['bold', 'italic', 'underline'],
      modules: {
        toolbar: ['bold', 'italic', 'underline'],
      },
      placeholder: 'Enter text here...',
      theme: 'bubble',
    };
    this.editor = new Quill(this.editorNode.nativeElement, quillOptions);

    Y({
      db: {
        name: 'memory'
      },
      connector: {
        name: 'websockets-client',
        room: 'richtext-example'
      },
      share: {
        richtext: 'Richtext'
      }
    }).then(this.bindQuillToY.bind(this));
  }

  bindQuillToY(y): void  {
    console.log('something');
    (<any>window).yquill = y;

    (<any>window).quill = this.editor;

    // bind quill to richtext type
    y.share.richtext.bindQuill((<any>window).quill);
  }
}
