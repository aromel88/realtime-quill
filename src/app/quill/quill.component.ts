import { AfterViewInit, Component, ElementRef, OnInit, ViewChild } from '@angular/core';

import * as Gun from 'gun';
import * as Quill from 'quill';

@Component({
  selector: 'app-quill',
  templateUrl: './quill.component.html',
  styleUrls: ['./quill.component.scss']
})
export class QuillComponent implements OnInit, AfterViewInit {

  @ViewChild('editor') editorNode: ElementRef;

  editor: Quill.Quill;
  gun = new Gun('http://localhost:8080/gun');

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
  }

  ngAfterViewInit(): void {
    this.editor.on('editor-change', this.editorChange.bind(this));
    this.gun.get('1234').on((data) => {
      const currentBody = JSON.stringify(this.editor.getContents());
      if (data.bodyAsDeltas !== currentBody) {
        const selection = this.editor.getSelection();
        const newBody = JSON.parse(data.bodyAsDeltas);
        this.editor.setContents(newBody, 'user');
        this.editor.setSelection(selection);
      }
    });
  }

  /**
   * handle change events that happen in the quill editor
   * @param name { string } the name of the event
   * @param args { array<any> } arguments passed by event
   */
  editorChange(name, ...args): void {
    if (name === 'text-change') {
      const deltaString = JSON.stringify(this.editor.getContents());
      const delta = {
        bodyAsDeltas: deltaString
      };
      this.gun.get('1234').put(delta);
    }
  }
}
