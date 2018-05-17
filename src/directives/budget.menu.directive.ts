import {ViewContainerRef, Directive} from '@angular/core';

@Directive({
  selector: 'edp-directive-menu-budget',
})
export class BudgetMenuDirective  {
  constructor(public viewContainerRef: ViewContainerRef) {
  }
}
