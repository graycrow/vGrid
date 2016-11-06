import {ViewSlot} from 'aurelia-framework';
import {MainMarkupHtmlString} from './mainMarkupHtmlString';

export class MainMarkup {


  constructor(element, viewCompiler, container, viewResources, htmlHeightWidth, viewSlots) {

    this.element = element;

    this.viewCompiler = viewCompiler;
    this.container = container;
    this.viewResources = viewResources;

    this.htmlHeightWidth = htmlHeightWidth;
    this.viewSlots = viewSlots;

  }


  generateMainMarkup() {

    this.viewFactory = this.viewCompiler.compile('<template>' + MainMarkupHtmlString + '</template>', this.viewResources);
    this.view = this.viewFactory.create(this.container);
    this.viewSlots.mainViewSlot = new ViewSlot(this.element, true);
    this.viewSlots.mainViewSlot.add(this.view);

    this.viewSlots.mainViewSlot.bind(this, {
      bindingContext: this,
      parentOverrideContext: this.htmlHeightWidth
    });

    this.viewSlots.mainViewSlot.attached();

  }


}
