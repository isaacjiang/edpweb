import {ViewContainerRef, Directive,ElementRef,Renderer} from '@angular/core';

@Directive({
  selector: 'edp-directive-status',
})
export class StatusDirective  {
  constructor(public viewContainerRef: ViewContainerRef) {
  }
}
