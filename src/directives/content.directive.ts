import {ViewContainerRef, Directive} from '@angular/core';

@Directive({
  selector: 'edp-directive-content',
})
export class ContentDirective  {
  constructor(public viewContainerRef: ViewContainerRef) {
  }
}
