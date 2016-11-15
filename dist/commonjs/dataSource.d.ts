import { Selection } from "./selection";
export declare class DataSource {
    selection: Selection;
    private arrayHelper;
    key: string;
    private mainArray;
    private config;
    private eventIdCount;
    private eventCallBacks;
    entity: any;
    private collection;
    constructor(selection: Selection, config: any);
    length(): number;
    triggerEvent(event: any): void;
    addEventListener(callback: any): number;
    removeEventListener(id: number): void;
    getRowKey(row: any): any;
    getRowFromKey(key: any): number;
    setArray(array: any): void;
    select(row: any): void;
    query(options: any): void;
    orderBy(attribute: any, addToCurrentSort: any): void;
    getCurrentOrderBy(): any[];
    getCurrentFilter(): any[];
    getElement(row: any): any;
    group(grouping: any, keepExpanded: any): void;
    groupCollapse(id: any): void;
    groupExpand(id: any): void;
    getFilterOperatorName(operator: any): any;
    getGrouping(): any;
    addElement(data: any): void;
}