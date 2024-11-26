import { AfterViewInit, ElementRef, EventEmitter, OnChanges, OnDestroy, SimpleChanges } from '@angular/core';
import * as i0 from "@angular/core";
export declare class DrawChartsComponent implements OnChanges, AfterViewInit, OnDestroy {
    typeChart: any;
    chatId: any;
    chartDesc: any;
    selectedChart: any;
    chartData: {
        labels: string[];
        dataset: any[];
        options?: any;
    };
    chartTitle: string;
    legendPosition: 'top' | 'left' | 'bottom' | 'right';
    chartHeight: number;
    graphDetail: any;
    currentChart: number | null;
    displaySettingsMenu: boolean | null;
    showRobot: boolean;
    dateText: string;
    emitTypeChart: EventEmitter<any>;
    emitXAxis: EventEmitter<any>;
    emitYAxis: EventEmitter<any>;
    emitDimension: EventEmitter<any>;
    emitDesc: EventEmitter<any>;
    barChartCanvas: ElementRef<HTMLCanvasElement>;
    openDrawer: boolean;
    private chart;
    ngAfterViewInit(): void;
    ngOnChanges(changes: SimpleChanges): void;
    ngOnDestroy(): void;
    openSetting(): void;
    /** create chart function - To draw chart following by data */
    createChart(): void;
    /**
     * Change Type function - This function is used for emiting to parent component
     *
     * @param {*} type
     */
    changeType(type: any): void;
    /**
     * Change X Axis function - This function is used for emiting to parent component
     *
     * @param {*} xAxis
     */
    changeXAxis(xAxis: any): void;
    /**
     * Change Dimension function - This function is used for emiting to parent component
     *
     * @param {*} xAxis
     */
    changeDimension(xAxis: any): void;
    /**
     * Change Description function - This function is used for emiting to parent component
     *
     * @param {*} desc
     */
    changeDesc(desc: any): void;
    /**
     * Change Y Axis function - This function is used for emiting to parent component
     *
     * @param {*} yAxis
     */
    changeYAxis(yAxis: any): void;
    onClick(event: MouseEvent): void;
    static ɵfac: i0.ɵɵFactoryDeclaration<DrawChartsComponent, never>;
    static ɵcmp: i0.ɵɵComponentDeclaration<DrawChartsComponent, "lib-draw-charts", never, { "typeChart": { "alias": "typeChart"; "required": false; }; "chatId": { "alias": "chatId"; "required": false; }; "chartDesc": { "alias": "chartDesc"; "required": false; }; "selectedChart": { "alias": "selectedChart"; "required": false; }; "chartData": { "alias": "chartData"; "required": false; }; "chartTitle": { "alias": "chartTitle"; "required": false; }; "legendPosition": { "alias": "legendPosition"; "required": false; }; "chartHeight": { "alias": "chartHeight"; "required": false; }; "graphDetail": { "alias": "graphDetail"; "required": false; }; "currentChart": { "alias": "currentChart"; "required": false; }; "displaySettingsMenu": { "alias": "displaySettingsMenu"; "required": false; }; "showRobot": { "alias": "showRobot"; "required": false; }; "dateText": { "alias": "dateText"; "required": false; }; }, { "emitTypeChart": "emitTypeChart"; "emitXAxis": "emitXAxis"; "emitYAxis": "emitYAxis"; "emitDimension": "emitDimension"; "emitDesc": "emitDesc"; }, never, never, false, never>;
}
