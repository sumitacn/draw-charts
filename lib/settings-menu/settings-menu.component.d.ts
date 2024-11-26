import { EventEmitter, OnChanges, SimpleChanges } from '@angular/core';
import * as i0 from "@angular/core";
export declare class SettingsMenuComponent implements OnChanges {
    openSetting: boolean;
    chatId: any;
    graphDetail: any;
    selectedChart: any;
    currentChart: number | null;
    emitTypeChart: EventEmitter<any>;
    emitXAxis: EventEmitter<any>;
    emitYAxis: EventEmitter<any>;
    emitDimension: EventEmitter<any>;
    emitDesc: EventEmitter<any>;
    chartLists: any;
    dimensions: any;
    measures: any;
    chart_description: string;
    private textChanged;
    selectType: any;
    constructor();
    onTextInput(value: string): void;
    onTextChange(value: string): void;
    ngOnChanges(changes: SimpleChanges): void;
    isEmptyObject(obj: any): boolean;
    changeType(type: any): void;
    onSelectChange(value: string): void;
    onDimensionChange(value: string): void;
    isChecked(y_axis: string): boolean;
    onCheckboxChange(event: Event, y_axis: string): void;
    trackByYaxis(index: number, y_axis: string): string;
    close(): void;
    static ɵfac: i0.ɵɵFactoryDeclaration<SettingsMenuComponent, never>;
    static ɵcmp: i0.ɵɵComponentDeclaration<SettingsMenuComponent, "lib-settings-menu", never, { "openSetting": { "alias": "openSetting"; "required": false; }; "chatId": { "alias": "chatId"; "required": false; }; "graphDetail": { "alias": "graphDetail"; "required": false; }; "selectedChart": { "alias": "selectedChart"; "required": false; }; "currentChart": { "alias": "currentChart"; "required": false; }; }, { "emitTypeChart": "emitTypeChart"; "emitXAxis": "emitXAxis"; "emitYAxis": "emitYAxis"; "emitDimension": "emitDimension"; "emitDesc": "emitDesc"; }, never, never, false, never>;
}
