import {ViewContainerRef, Directive,ElementRef,Renderer} from '@angular/core';

@Directive({
  selector: 'edp-directive-message',
})
export class MessagesDirective  {
  constructor(public viewContainerRef: ViewContainerRef) {
  }
}
