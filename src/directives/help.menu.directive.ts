import {ViewContainerRef, Directive} from '@angular/core';

@Directive({
  selector: 'edp-directive-menu-help',
})
export class HelpMenuDirective  {
  constructor(public viewContainerRef: ViewContainerRef) {
  }
}
