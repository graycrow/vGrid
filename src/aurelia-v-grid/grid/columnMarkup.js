import {ViewSlot} from 'aurelia-framework';
import {ColumnMarkupHelper} from './columnMarkupHelper';

export class ColumnMarkup {

  constructor(element, viewCompiler, container, viewResources, htmlCache, viewSlots, columnBindingContext) {

    this.element = element;
    this.htmlCache = htmlCache;
    this.viewSlots = viewSlots;
    this.columnBindingContext = columnBindingContext;
    this.markupHelper = new ColumnMarkupHelper();
    this.viewCompiler = viewCompiler;
    this.container = container;
    this.viewResources = viewResources;

  }


  init(colConfig, overrideContext) {
    this.overrideContext = overrideContext;
    this.colConfig = colConfig;
    this.configLength = colConfig.length;
    this.markupHelper.generate(this.colConfig);
    this.updateInternalHtmlCache();
    this.generate();
  }


  updateInternalHtmlCache() {
    this.leftScroll = this.htmlCache.avg_content_left_scroll;
    this.mainScroll = this.htmlCache.avg_content_main_scroll;
    this.rightScroll = this.htmlCache.avg_content_right_scroll;
    this.groupScroll = this.htmlCache.avg_content_group_scroll;

    this.leftHeader = this.htmlCache.avg_header_left;
    this.mainHeader = this.htmlCache.avg_header_main_scroll;
    this.rightHeader = this.htmlCache.avg_header_right;


    this.leftRows = this.htmlCache.avg_left_rows;
    this.mainRows = this.htmlCache.avg_main_rows;
    this.rightRows = this.htmlCache.avg_right_rows;
    this.groupRows = this.htmlCache.avg_group_rows;


    this.rowLength = this.leftRows.length;
  }


  getRowViews(type) {
    let views = [];
    let viewMarkup = "";
    let markupArray = [];

    //group column
    if (type === "group") {
      //todo: allow template here too ?
      markupArray = [
        '<avg-col ',
        'class="avg-col-group"',
        'if.bind="rowRef.__group ===true"',
        'css="left:${rowRef.__groupLvl ? rowRef.__groupLvl *15:0}px;right:0">',
        '<i click.delegate="changeGrouping(rowRef)"',
        'class="avg-fa avg-fa-${rowRef.__groupExpanded ? ' + "'minus':'plus'" + '}-square-o"',
        'aria-hidden="true">',
        '</i>&nbsp;${rowRef.__groupName} (${rowRef.__groupTotal})',
        '</avg-col>'
      ];

      viewMarkup = markupArray.join("");
    } else {
      for (let i = 0; i < this.configLength; i++) {

        let style;
        switch (type) {
          case "left":
            style = 'css="width:${setupleft[' + i + '].width}px;left:${setupleft[' + i + '].left+ (setupgrouping * 15)}px"';
            break;
          case "main":
            style = 'css="width:${setupmain[' + i + '].width}px;left:${setupmain[' + i + '].left}px"';
            break;
          case "right":
            style = 'css="width:${setupright[' + i + '].width}px;left:${setupright[' + i + '].left}px"';
            break;
        }

        let template = this.colConfig[i].colRowTemplate;
        let colMarkup = `<avg-col class="avg-col"  if.bind="setup${type}[${i}].show && rowRef.__group !== true" ${style}>${template}</avg-col>`;
        viewMarkup = viewMarkup + colMarkup;

      }
    }


    //this is the block that puches the column from left for grouping
    let groupingBlock = "";
    if (type === "left") {
      groupingBlock = '<avg-col class="avg-col-grouping" css="left:0px;width:${rowRef.__groupLvl ? rowRef.__groupLvl *15:0}px"></avg-col>';
    }


    return this.viewCompiler.compile(`<template>${groupingBlock + viewMarkup}</template>`, this.viewResources);

  }


  createColSetupContext(type) {

    let left = 0;
    for (let i = 0; i < this.configLength; i++) {

      let width = this.colConfig[i].colWidth;
      let show = false;
      switch (type) {
        case "left":
          show = this.colConfig[i].colPinLeft;
          break;
        case "main":
          show = !this.colConfig[i].colPinLeft && !this.colConfig[i].colPinRight;
          break;
        case "right":
          show = this.colConfig[i].colPinRight;
          break;
      }

      this.columnBindingContext["setup" + type].push({
        width: width,
        show: show,
        left: left
      });
      if (show) {
        left = left + width;
      }
    }

  }


  getHeaderViews(type) {
    let views = [];
    let left = 0;
    let viewMarkup = "";


    for (let i = 0; i < this.configLength; i++) {
      let style;
      switch (type) {
        case "left":
          style = 'css="width:${setupleft[' + i + '].width}px;left:${setupleft[' + i + '].left + (setupgrouping * 15)}px"';
          break;
        case "main":
          style = 'css="width:${setupmain[' + i + '].width}px;left:${setupmain[' + i + '].left}px"';
          break;
        case "right":
          style = 'css="width:${setupright[' + i + '].width}px;left:${setupright[' + i + '].left}px"';
          break;
      }


      let template = this.colConfig[i].colHeaderTemplate;
      let colMarkup = `<avg-col avg-type="${type}" avg-config-col="${i}" class="avg-col" if.bind="setup${type}[${i}].show" ${style}>${template}</avg-col>`;
      viewMarkup = viewMarkup + colMarkup;
    }

    //this is the block that puches the column from left for grouping
    let groupingBlock = "";
    if (type === "left") {
      groupingBlock = '<avg-col class="avg-col-grouping-header" css="left:0px;width:${setupgrouping ? (setupgrouping * 15):0}px"></avg-col>';
    }

    return this.viewCompiler.compile(`<template>${groupingBlock + viewMarkup}</template>`, this.viewResources);

  }


  generate() {

    if (this.columnBindingContext.setupmain.length === 0) {
      //grid hidden by if.bind...lets keep what ever is in here
      this.createColSetupContext("left");
      this.createColSetupContext("main");
      this.createColSetupContext("right");
      this.createColSetupContext("group");
    }

    let viewFactoryLeft = this.getRowViews("left");
    let viewFactoryMain = this.getRowViews("main");
    let viewFactoryRight = this.getRowViews("right");
    let viewFactoryGroup = this.getRowViews("group");


    for (let i = 0; i < this.rowLength; i++) {
      this.viewSlots.leftRowViewSlots[i] = this.createViewSlot(this.leftRows[i], viewFactoryLeft);
      this.viewSlots.mainRowViewSlots[i] = this.createViewSlot(this.mainRows[i], viewFactoryMain);
      this.viewSlots.rightRowViewSlots[i] = this.createViewSlot(this.rightRows[i], viewFactoryRight);
      this.viewSlots.groupRowViewSlots[i] = this.createViewSlot(this.groupRows[i], viewFactoryGroup);
      this.htmlCache.rowCache[i].leftRowViewSlot = this.viewSlots.leftRowViewSlots[i];
      this.htmlCache.rowCache[i].mainRowViewSlot = this.viewSlots.mainRowViewSlots[i];
      this.htmlCache.rowCache[i].rightRowViewSlot = this.viewSlots.rightRowViewSlots[i];
      this.htmlCache.rowCache[i].groupRowViewSlot = this.viewSlots.groupRowViewSlots[i];
    }


    let viewFactoryHeaderLeft = this.getHeaderViews("left");
    let viewFactoryHeaderMain = this.getHeaderViews("main");
    let viewFactoryHeaderRight = this.getHeaderViews("right");


    this.viewSlots.leftHeaderViewSlot = this.createViewSlot(this.leftHeader, viewFactoryHeaderLeft);
    this.viewSlots.mainHeaderViewSlot = this.createViewSlot(this.mainHeader, viewFactoryHeaderMain);
    this.viewSlots.rightHeaderViewSlot = this.createViewSlot(this.rightHeader, viewFactoryHeaderRight);

  }


  createViewSlot(element, viewFactory) {

    let view = viewFactory.create(this.container); //<<< time consumer, I should rebuild ?
    let viewSlot = new ViewSlot(element, true);

    viewSlot.add(view);

    let context = {};

    //need to create a override for the overcontext that contains my column setup
    //need to include my parent context too, so people can include click listners etc
    /* let overrideContext = {
     bindingContext: this.columnBindingContext,
     parentOverrideContext: this.overrideContext
     }

     viewSlot.bind(context, { //<<<<<  time consumer, I should rebuild ?
     bindingContext: context,
     parentOverrideContext: overrideContext
     });


     viewSlot.attached();*/

    return viewSlot;
  }


  //todo delete
  getCol() {
    return this.columnBindingContext.setupmain;
  }


}
