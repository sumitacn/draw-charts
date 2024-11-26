import * as i0 from '@angular/core';
import { Injectable, EventEmitter, Component, Input, Output, ViewChild, HostListener, NgModule } from '@angular/core';
import { Chart, registerables } from 'chart.js';
import * as i1 from '@angular/common';
import { CommonModule } from '@angular/common';
import { Subject, debounceTime } from 'rxjs';
import * as i2 from '@angular/forms';
import { FormsModule } from '@angular/forms';

class DrawChartsService {
    constructor() { }
    static { this.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "18.1.0", ngImport: i0, type: DrawChartsService, deps: [], target: i0.ɵɵFactoryTarget.Injectable }); }
    static { this.ɵprov = i0.ɵɵngDeclareInjectable({ minVersion: "12.0.0", version: "18.1.0", ngImport: i0, type: DrawChartsService, providedIn: 'root' }); }
}
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "18.1.0", ngImport: i0, type: DrawChartsService, decorators: [{
            type: Injectable,
            args: [{
                    providedIn: 'root'
                }]
        }], ctorParameters: () => [] });

class SettingsMenuComponent {
    constructor() {
        this.openSetting = false;
        this.chatId = '';
        this.graphDetail = {};
        this.selectedChart = {};
        this.currentChart = null;
        this.emitTypeChart = new EventEmitter();
        this.emitXAxis = new EventEmitter();
        this.emitYAxis = new EventEmitter();
        this.emitDimension = new EventEmitter();
        this.emitDesc = new EventEmitter();
        this.chartLists = [];
        this.dimensions = [];
        this.measures = [];
        this.chart_description = '';
        this.textChanged = new Subject();
        this.selectType = '';
        this.textChanged.pipe(debounceTime(500)).subscribe(value => this.onTextChange(value));
    }
    onTextInput(value) {
        // Emit the new value to the Subject
        this.textChanged.next(value);
    }
    onTextChange(value) {
        this.emitDesc.emit(value);
    }
    ngOnChanges(changes) {
        if (changes['selectedChart']) {
            if (!(this.isEmptyObject(this.selectedChart))) {
                this.selectType = this.selectedChart.type ?? '';
                this.chart_description = this.selectedChart.chart_description ?? '';
            }
            if (!(this.isEmptyObject(this.graphDetail))) {
                this.chartLists = [
                    { type: 'line' },
                    { type: 'area' },
                    { type: 'bar' }
                ];
                this.dimensions = this.graphDetail.dimensions ?? [];
                this.measures = this.graphDetail.measures ?? [];
            }
        }
    }
    isEmptyObject(obj) {
        return obj && Object.keys(obj).length === 0 && obj.constructor === Object;
    }
    changeType(type) {
        console.log('selectType: ', type);
        this.emitTypeChart.emit(type);
    }
    onSelectChange(value) {
        console.log('Selected value:', value);
        this.emitXAxis.emit(value);
    }
    onDimensionChange(value) {
        this.emitDimension.emit(value);
    }
    isChecked(y_axis) {
        return this.selectedChart.y_axis.includes(y_axis);
    }
    onCheckboxChange(event, y_axis) {
        const checkbox = event.target;
        if (checkbox.checked) {
            this.selectedChart.y_axis.push(y_axis);
        }
        else {
            this.selectedChart.y_axis = this.selectedChart.y_axis.filter((item) => item !== y_axis);
        }
        console.log('checkbox: ', this.selectedChart);
        this.emitYAxis.emit(this.selectedChart);
    }
    trackByYaxis(index, y_axis) {
        return y_axis;
    }
    close() {
        this.openSetting = false;
    }
    static { this.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "18.1.0", ngImport: i0, type: SettingsMenuComponent, deps: [], target: i0.ɵɵFactoryTarget.Component }); }
    static { this.ɵcmp = i0.ɵɵngDeclareComponent({ minVersion: "17.0.0", version: "18.1.0", type: SettingsMenuComponent, selector: "lib-settings-menu", inputs: { openSetting: "openSetting", chatId: "chatId", graphDetail: "graphDetail", selectedChart: "selectedChart", currentChart: "currentChart" }, outputs: { emitTypeChart: "emitTypeChart", emitXAxis: "emitXAxis", emitYAxis: "emitYAxis", emitDimension: "emitDimension", emitDesc: "emitDesc" }, usesOnChanges: true, ngImport: i0, template: "<div [ngClass]=\"!openSetting ? 'translate-x-full' : ''\" id=\"drawer-right-menu\" class=\"setting-menu-wrapper flex flex-col p-6 bg-hormel-white fixed top-[60px] right-0 z-2 h-screen  overflow-y-auto transition-transform  w-[321px] dark:bg-gray-800\" tabindex=\"-1\" aria-labelledby=\"drawer-right-menu-label\">\r\n    <div class=\"flex flex-row justify-between\">\r\n        <div class=\"text-lg text-hormel-gray-900\">Visualisation Settings</div>\r\n        <div class=\"cursor-pointer\"><img src=\"assets/img/icon/close.svg\" alt=\"Close\" title=\"Close\" (click)=\"close()\" /></div>\r\n    </div>\r\n    <div class=\"text-sm text-hormel-gray-700 my-6\">Available Visuals</div>\r\n    <ul class=\"grid w-full gap-8 md:grid-cols-3\">\r\n        @for(chart of chartLists; track chart.type; let idx = $index){\r\n            <li>\r\n                <input \r\n                    type=\"radio\" \r\n                    [id]=\"chart.type\" \r\n                    name=\"hosting\" \r\n                    [value]=\"chart.type\"\r\n                    [(ngModel)]=\"selectType\"\r\n                    (change)=\"changeType(chart.type)\"\r\n                    class=\"hidden peer\" \r\n                    required />\r\n                <label [for]=\"chart.type\" class=\"inline-flex items-center justify-between w-full py-2.5 px-5 text-gray-500 bg-white border border-2 border-hormel-gray-100 hover:border-2 hover:border-hormel-green-900 rounded-2xl cursor-pointer peer-checked:border-hormel-green-900 peer-checked:text-hormel-green-900\">                           \r\n                    <div class=\"block\">\r\n                        <img  src='{{ \"assets/img/icon/\" + chart.type + \"-chart.svg\" }}' \r\n                        [alt]=\"chart.type === 'line' ? 'Line Chart' \r\n                        : chart.type === 'area' ? 'Area Chart'\r\n                        : chart.type === 'bar' ? 'Bar Chart'\r\n                        : ''\" \r\n                        [title]=\"chart.type === 'line' ? 'Line Chart' \r\n                                : chart.type === 'area' ? 'Area Chart'\r\n                                : chart.type === 'bar' ? 'Bar Chart'\r\n                                : ''\" />\r\n                        <p class=\"text-xs pt-1 text-black\">{{ chart.type | titlecase}}</p>\r\n                    </div>\r\n                </label>\r\n            </li>\r\n        }\r\n    </ul>\r\n    \r\n    <div class=\"flex flex-col py-6\">\r\n        <div class=\"text-sm font-medium text-hormel-gray-700\">X - Axis</div>\r\n        <div class=\"pt-1.5\">\r\n            <div class=\"max-w-sm mx-auto\">\r\n                <select [(ngModel)]=\"selectedChart.x_axis\" (ngModelChange)=\"onSelectChange($event)\" id=\"countries\" class=\"border border-hormel-gray-300 text-hormel-gray-500 text-base rounded-lg bg-hormel-white w-full p-2.5 \">\r\n                    @for(x_axis of dimensions; track x_axis){\r\n                        <option [value]=\"x_axis\">{{ x_axis }}</option>\r\n                    }\r\n                </select>\r\n            </div>\r\n        </div>\r\n\r\n    </div>\r\n    <div class=\"flex flex-col\">\r\n        <div class=\"text-sm font-medium text-hormel-gray-700\">Y - Axis</div>\r\n        <div class=\"pt-1.5\">\r\n            @for(y_axis of measures; track y_axis){\r\n                <label class=\"flex items-center mb-2 custom-checkbox\">\r\n                    <input type=\"checkbox\" [checked]=\"isChecked(y_axis)\" (change)=\"onCheckboxChange($event, y_axis)\">\r\n                    <span class=\"checkmark\"></span>\r\n                    {{ y_axis }} \r\n                </label>\r\n            }\r\n        </div>\r\n    </div>\r\n    <div class=\"flex flex-col py-6\">\r\n        <div class=\"text-sm font-medium text-hormel-gray-700\">X - Axis category</div>\r\n        <div class=\"pt-1.5\">\r\n            <div class=\"max-w-sm mx-auto\">\r\n                <select [(ngModel)]=\"selectedChart.y_axis_dimension\" (ngModelChange)=\"onDimensionChange($event)\"  id=\"x_axis_category\" class=\"border border-hormel-gray-300 text-hormel-gray-500 text-base rounded-lg bg-hormel-white w-full p-2.5 \">\r\n                    <option [value]=\"null\">None</option>\r\n                    @for(x_axis_category of dimensions; track x_axis_category){\r\n                        <option [value]=\"x_axis_category\">{{ x_axis_category }}</option>\r\n                    }\r\n                </select>\r\n                </div>\r\n        </div>\r\n\r\n    </div>\r\n    <div class=\"flex flex-col\">\r\n        <div class=\"text-sm font-medium text-hormel-gray-700\">Chart Description</div>\r\n        <div class=\"pt-1.5\">\r\n            <textarea \r\n                id=\"chart_description\" \r\n                rows=\"4\" \r\n                [(ngModel)]=\"chart_description\"\r\n                (ngModelChange)=\"onTextInput($event)\" \r\n                class=\"border border-hormel-gray-300 text-hormel-gray-500 text-base rounded-lg bg-hormel-white w-full p-2.5 \" \r\n                placeholder=\"Input text here...\" ></textarea>\r\n        </div>\r\n\r\n    </div>\r\n</div>", styles: [".setting-menu-wrapper{z-index:9999;background:#fff;box-shadow:0 32px 64px -12px #10182824,0 32px 64px -12px #10182824}.custom-checkbox input[type=checkbox]{position:absolute;opacity:0;cursor:pointer}.custom-checkbox .checkmark{position:relative;height:20px;width:20px;background-color:#fff;border-radius:6px;border:1px solid var(--color-primary-gray-300);display:inline-block;vertical-align:middle;margin-right:10px}.custom-checkbox input[type=checkbox]:checked+.checkmark:after{content:\"\";position:absolute;left:6px;top:2px;width:6px;height:12px;border:solid var(--color-primary);border-width:0 2px 2px 0;transform:rotate(45deg)}.custom-checkbox input[type=checkbox]:checked+.checkmark{background-color:var(--color-primary-gray-50);border:1px solid var(--color-primary)}\n"], dependencies: [{ kind: "directive", type: i1.NgClass, selector: "[ngClass]", inputs: ["class", "ngClass"] }, { kind: "directive", type: i2.NgSelectOption, selector: "option", inputs: ["ngValue", "value"] }, { kind: "directive", type: i2.ɵNgSelectMultipleOption, selector: "option", inputs: ["ngValue", "value"] }, { kind: "directive", type: i2.DefaultValueAccessor, selector: "input:not([type=checkbox])[formControlName],textarea[formControlName],input:not([type=checkbox])[formControl],textarea[formControl],input:not([type=checkbox])[ngModel],textarea[ngModel],[ngDefaultControl]" }, { kind: "directive", type: i2.SelectControlValueAccessor, selector: "select:not([multiple])[formControlName],select:not([multiple])[formControl],select:not([multiple])[ngModel]", inputs: ["compareWith"] }, { kind: "directive", type: i2.RadioControlValueAccessor, selector: "input[type=radio][formControlName],input[type=radio][formControl],input[type=radio][ngModel]", inputs: ["name", "formControlName", "value"] }, { kind: "directive", type: i2.NgControlStatus, selector: "[formControlName],[ngModel],[formControl]" }, { kind: "directive", type: i2.RequiredValidator, selector: ":not([type=checkbox])[required][formControlName],:not([type=checkbox])[required][formControl],:not([type=checkbox])[required][ngModel]", inputs: ["required"] }, { kind: "directive", type: i2.NgModel, selector: "[ngModel]:not([formControlName]):not([formControl])", inputs: ["name", "disabled", "ngModel", "ngModelOptions"], outputs: ["ngModelChange"], exportAs: ["ngModel"] }, { kind: "pipe", type: i1.TitleCasePipe, name: "titlecase" }] }); }
}
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "18.1.0", ngImport: i0, type: SettingsMenuComponent, decorators: [{
            type: Component,
            args: [{ selector: 'lib-settings-menu', template: "<div [ngClass]=\"!openSetting ? 'translate-x-full' : ''\" id=\"drawer-right-menu\" class=\"setting-menu-wrapper flex flex-col p-6 bg-hormel-white fixed top-[60px] right-0 z-2 h-screen  overflow-y-auto transition-transform  w-[321px] dark:bg-gray-800\" tabindex=\"-1\" aria-labelledby=\"drawer-right-menu-label\">\r\n    <div class=\"flex flex-row justify-between\">\r\n        <div class=\"text-lg text-hormel-gray-900\">Visualisation Settings</div>\r\n        <div class=\"cursor-pointer\"><img src=\"assets/img/icon/close.svg\" alt=\"Close\" title=\"Close\" (click)=\"close()\" /></div>\r\n    </div>\r\n    <div class=\"text-sm text-hormel-gray-700 my-6\">Available Visuals</div>\r\n    <ul class=\"grid w-full gap-8 md:grid-cols-3\">\r\n        @for(chart of chartLists; track chart.type; let idx = $index){\r\n            <li>\r\n                <input \r\n                    type=\"radio\" \r\n                    [id]=\"chart.type\" \r\n                    name=\"hosting\" \r\n                    [value]=\"chart.type\"\r\n                    [(ngModel)]=\"selectType\"\r\n                    (change)=\"changeType(chart.type)\"\r\n                    class=\"hidden peer\" \r\n                    required />\r\n                <label [for]=\"chart.type\" class=\"inline-flex items-center justify-between w-full py-2.5 px-5 text-gray-500 bg-white border border-2 border-hormel-gray-100 hover:border-2 hover:border-hormel-green-900 rounded-2xl cursor-pointer peer-checked:border-hormel-green-900 peer-checked:text-hormel-green-900\">                           \r\n                    <div class=\"block\">\r\n                        <img  src='{{ \"assets/img/icon/\" + chart.type + \"-chart.svg\" }}' \r\n                        [alt]=\"chart.type === 'line' ? 'Line Chart' \r\n                        : chart.type === 'area' ? 'Area Chart'\r\n                        : chart.type === 'bar' ? 'Bar Chart'\r\n                        : ''\" \r\n                        [title]=\"chart.type === 'line' ? 'Line Chart' \r\n                                : chart.type === 'area' ? 'Area Chart'\r\n                                : chart.type === 'bar' ? 'Bar Chart'\r\n                                : ''\" />\r\n                        <p class=\"text-xs pt-1 text-black\">{{ chart.type | titlecase}}</p>\r\n                    </div>\r\n                </label>\r\n            </li>\r\n        }\r\n    </ul>\r\n    \r\n    <div class=\"flex flex-col py-6\">\r\n        <div class=\"text-sm font-medium text-hormel-gray-700\">X - Axis</div>\r\n        <div class=\"pt-1.5\">\r\n            <div class=\"max-w-sm mx-auto\">\r\n                <select [(ngModel)]=\"selectedChart.x_axis\" (ngModelChange)=\"onSelectChange($event)\" id=\"countries\" class=\"border border-hormel-gray-300 text-hormel-gray-500 text-base rounded-lg bg-hormel-white w-full p-2.5 \">\r\n                    @for(x_axis of dimensions; track x_axis){\r\n                        <option [value]=\"x_axis\">{{ x_axis }}</option>\r\n                    }\r\n                </select>\r\n            </div>\r\n        </div>\r\n\r\n    </div>\r\n    <div class=\"flex flex-col\">\r\n        <div class=\"text-sm font-medium text-hormel-gray-700\">Y - Axis</div>\r\n        <div class=\"pt-1.5\">\r\n            @for(y_axis of measures; track y_axis){\r\n                <label class=\"flex items-center mb-2 custom-checkbox\">\r\n                    <input type=\"checkbox\" [checked]=\"isChecked(y_axis)\" (change)=\"onCheckboxChange($event, y_axis)\">\r\n                    <span class=\"checkmark\"></span>\r\n                    {{ y_axis }} \r\n                </label>\r\n            }\r\n        </div>\r\n    </div>\r\n    <div class=\"flex flex-col py-6\">\r\n        <div class=\"text-sm font-medium text-hormel-gray-700\">X - Axis category</div>\r\n        <div class=\"pt-1.5\">\r\n            <div class=\"max-w-sm mx-auto\">\r\n                <select [(ngModel)]=\"selectedChart.y_axis_dimension\" (ngModelChange)=\"onDimensionChange($event)\"  id=\"x_axis_category\" class=\"border border-hormel-gray-300 text-hormel-gray-500 text-base rounded-lg bg-hormel-white w-full p-2.5 \">\r\n                    <option [value]=\"null\">None</option>\r\n                    @for(x_axis_category of dimensions; track x_axis_category){\r\n                        <option [value]=\"x_axis_category\">{{ x_axis_category }}</option>\r\n                    }\r\n                </select>\r\n                </div>\r\n        </div>\r\n\r\n    </div>\r\n    <div class=\"flex flex-col\">\r\n        <div class=\"text-sm font-medium text-hormel-gray-700\">Chart Description</div>\r\n        <div class=\"pt-1.5\">\r\n            <textarea \r\n                id=\"chart_description\" \r\n                rows=\"4\" \r\n                [(ngModel)]=\"chart_description\"\r\n                (ngModelChange)=\"onTextInput($event)\" \r\n                class=\"border border-hormel-gray-300 text-hormel-gray-500 text-base rounded-lg bg-hormel-white w-full p-2.5 \" \r\n                placeholder=\"Input text here...\" ></textarea>\r\n        </div>\r\n\r\n    </div>\r\n</div>", styles: [".setting-menu-wrapper{z-index:9999;background:#fff;box-shadow:0 32px 64px -12px #10182824,0 32px 64px -12px #10182824}.custom-checkbox input[type=checkbox]{position:absolute;opacity:0;cursor:pointer}.custom-checkbox .checkmark{position:relative;height:20px;width:20px;background-color:#fff;border-radius:6px;border:1px solid var(--color-primary-gray-300);display:inline-block;vertical-align:middle;margin-right:10px}.custom-checkbox input[type=checkbox]:checked+.checkmark:after{content:\"\";position:absolute;left:6px;top:2px;width:6px;height:12px;border:solid var(--color-primary);border-width:0 2px 2px 0;transform:rotate(45deg)}.custom-checkbox input[type=checkbox]:checked+.checkmark{background-color:var(--color-primary-gray-50);border:1px solid var(--color-primary)}\n"] }]
        }], ctorParameters: () => [], propDecorators: { openSetting: [{
                type: Input
            }], chatId: [{
                type: Input
            }], graphDetail: [{
                type: Input
            }], selectedChart: [{
                type: Input
            }], currentChart: [{
                type: Input
            }], emitTypeChart: [{
                type: Output
            }], emitXAxis: [{
                type: Output
            }], emitYAxis: [{
                type: Output
            }], emitDimension: [{
                type: Output
            }], emitDesc: [{
                type: Output
            }] } });

Chart.register(...registerables);
class DrawChartsComponent {
    constructor() {
        this.typeChart = '';
        this.chatId = ''; // for setting menu
        this.chartDesc = ''; // able to update chart description at setting menu
        this.selectedChart = '';
        this.chartTitle = 'Chart Title';
        this.legendPosition = 'bottom';
        this.chartHeight = 400;
        this.currentChart = null;
        this.displaySettingsMenu = true;
        this.showRobot = true;
        this.dateText = '';
        this.emitTypeChart = new EventEmitter();
        this.emitXAxis = new EventEmitter();
        this.emitYAxis = new EventEmitter();
        this.emitDimension = new EventEmitter();
        this.emitDesc = new EventEmitter();
        this.openDrawer = false;
    }
    ngAfterViewInit() {
        this.createChart();
    }
    ngOnChanges(changes) {
        if (changes['selectedChart'] || changes['graphDetail'] || changes['chartData']) {
            if (this.chart) {
                this.chart.destroy();
            }
            this.createChart();
        }
    }
    ngOnDestroy() {
        if (this.chart) {
            this.chart.destroy();
        }
    }
    openSetting() {
        this.openDrawer = !this.openDrawer;
    }
    /** create chart function - To draw chart following by data */
    createChart() {
        if (this.chart) {
            this.chart.destroy();
        }
        // const ctx = this.barChartCanvas.nativeElement.getContext('2d');
        if (this.barChartCanvas) {
            const canvas = this.barChartCanvas.nativeElement;
            const ctx = canvas.getContext('2d');
            if (!ctx) {
                console.error('Failed to get 2D context');
                return;
            }
            canvas.height = this.chartHeight;
            let colors = [
                "#2D94FB",
                "#7F37E5",
                "#005D5D",
                "#9F1853",
                "#E86E74",
                "#198038",
                "#002D9C",
                "#EE538B",
                "#B28600",
                "#009D9A",
                "#8A3800",
                "#012749",
                "#09C9E5",
                "#70DBFF",
                "#AFD7FD",
                "#C6C5FB",
                "#CEA1FF",
                "#D262FF",
                "#6938EF",
                "#C11574",
            ];
            let gradient;
            console.log('BAR CHART [typeChart]: ', this.typeChart);
            console.log('BAR CHART [chartData]: ', this.chartData);
            const datasets = this.chartData.dataset.map((chart, index) => {
                gradient = ctx.createLinearGradient(0, 0, 0, this.chartHeight);
                gradient.addColorStop(0, colors[index % colors.length]);
                gradient.addColorStop(1, 'rgba(255, 255, 255, 0.2)');
                return this.typeChart == 'radar' ? {
                    label: chart.label,
                    data: chart.data,
                    fill: true,
                    backgroundColor: this.chartData.dataset[0]?.backgroundColor ? this.chartData.dataset[0]?.backgroundColor : colors[index % colors.length],
                    borderColor: colors[index % colors.length],
                    pointBackgroundColor: colors[index % colors.length],
                    pointBorderColor: '#fff',
                    pointHoverBackgroundColor: '#fff',
                    pointHoverBorderColor: colors[index % colors.length]
                } : this.typeChart == 'bubble' || this.typeChart == 'scatter' ? {
                    label: chart.label,
                    data: chart.data,
                    backgroundColor: colors[index % colors.length],
                } : {
                    label: chart.label,
                    data: chart.data,
                    fill: this.typeChart === 'area',
                    backgroundColor: this.chartData.dataset[0]?.backgroundColor ? this.chartData.dataset[0]?.backgroundColor : this.typeChart === 'line' || this.typeChart === 'bar' || this.typeChart === 'bubble' ? colors[index % colors.length] : this.typeChart === 'pie' || this.typeChart === 'doughnut' || this.typeChart === 'polarArea' ? colors : gradient,
                    borderColor: this.typeChart === 'pie' || this.typeChart === 'doughnut' || this.typeChart === 'polarArea' ? colors : colors[index % colors.length],
                    borderWidth: this.chartData.dataset[0]?.borderWidth ? this.chartData.dataset[0]?.borderWidth : 1
                };
            });
            this.chart = new Chart(ctx, {
                type: this.typeChart === 'area' ? 'line' : this.typeChart,
                data: this.typeChart === 'bubble' ? {
                    datasets: datasets
                } :
                    {
                        labels: this.chartData.labels,
                        datasets: datasets
                    },
                options: {
                    responsive: true,
                    maintainAspectRatio: false,
                    plugins: this.typeChart === 'line' || this.typeChart === 'bar' || this.typeChart === 'doughnut' ? {
                        legend: {
                            display: true,
                            position: this.legendPosition,
                            align: 'start',
                            labels: {
                                // usePointStyle: true,
                                // pointStyle: 'circle',
                                font: {
                                    size: 10
                                },
                                color: '#667085'
                            }
                        },
                        title: {
                            display: true,
                            align: 'start',
                            text: this.chartTitle,
                            padding: {
                                top: 20,
                                bottom: 10
                            }
                        },
                    } : this.typeChart === 'area' ? {
                        legend: {
                            display: true,
                            position: this.legendPosition,
                            align: 'start',
                            labels: {
                                usePointStyle: true,
                                pointStyle: 'rect',
                                // pointRadius: 0,
                                generateLabels: (chart) => {
                                    // Custom label generation with solid colors
                                    const datasets = chart.data.datasets;
                                    return datasets.map((dataset, i) => ({
                                        text: dataset.label,
                                        fillStyle: colors[i % colors.length], // Use solid color for legend
                                        strokeStyle: dataset.borderColor,
                                        lineWidth: dataset.borderWidth,
                                        hidden: !chart.isDatasetVisible(i),
                                        index: i,
                                        pointStyle: 'rect',
                                    }));
                                },
                                font: {
                                    size: 10
                                },
                                color: '#667085'
                            },
                        },
                        title: {
                            display: true,
                            align: 'start',
                            text: this.chartTitle,
                            padding: {
                                top: 20,
                                bottom: 10
                            }
                        },
                    } : this.typeChart === 'bubble' ? {
                        tooltip: {
                            callbacks: {
                                label: (context) => {
                                    const { x, y, r } = context.raw;
                                    return `${this.chartData.labels[x]}, ${y}, ${r * 10}`;
                                }
                            }
                        }
                    } : this.typeChart === 'scatter' ? {
                        tooltip: {
                            callbacks: {
                                label: (context) => {
                                    const { x, y } = context.raw;
                                    return `${this.chartData.labels[x]}, ${y}}`;
                                }
                            }
                        }
                    } : {},
                    elements: this.typeChart === 'radar' ? {
                        line: {
                            borderWidth: 3
                        }
                    } : {},
                    scales: this.typeChart === 'scatter' ? {
                        x: {
                            type: 'category',
                            position: 'bottom',
                            labels: this.chartData.labels,
                        }
                    } : this.typeChart === 'bubble' ? {
                        x: {
                            type: 'category',
                            labels: this.chartData.labels,
                        }
                    } : this.typeChart !== 'pie' && this.typeChart !== 'doughnut' && this.typeChart !== 'polarArea' && this.typeChart !== 'radar' ? {
                        y: {
                            beginAtZero: true
                        }
                    } : {}
                },
            });
        }
        else {
            console.error('Canvas element is not defined.');
        }
    }
    /**
     * Change Type function - This function is used for emiting to parent component
     *
     * @param {*} type
     */
    changeType(type) {
        this.emitTypeChart.emit(type);
    }
    /**
     * Change X Axis function - This function is used for emiting to parent component
     *
     * @param {*} xAxis
     */
    changeXAxis(xAxis) {
        this.emitXAxis.emit(xAxis);
    }
    /**
     * Change Dimension function - This function is used for emiting to parent component
     *
     * @param {*} xAxis
     */
    changeDimension(xAxis) {
        this.emitDimension.emit(xAxis);
    }
    /**
     * Change Description function - This function is used for emiting to parent component
     *
     * @param {*} desc
     */
    changeDesc(desc) {
        this.chartDesc = desc;
        this.emitDesc.emit(desc);
    }
    /**
     * Change Y Axis function - This function is used for emiting to parent component
     *
     * @param {*} yAxis
     */
    changeYAxis(yAxis) {
        this.emitYAxis.emit(yAxis);
    }
    onClick(event) {
        const target = event.target;
        const clickedInside = target.closest('.drawer-setting');
        if (!clickedInside) {
            this.openDrawer = false;
        }
    }
    static { this.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "18.1.0", ngImport: i0, type: DrawChartsComponent, deps: [], target: i0.ɵɵFactoryTarget.Component }); }
    static { this.ɵcmp = i0.ɵɵngDeclareComponent({ minVersion: "17.0.0", version: "18.1.0", type: DrawChartsComponent, selector: "lib-draw-charts", inputs: { typeChart: "typeChart", chatId: "chatId", chartDesc: "chartDesc", selectedChart: "selectedChart", chartData: "chartData", chartTitle: "chartTitle", legendPosition: "legendPosition", chartHeight: "chartHeight", graphDetail: "graphDetail", currentChart: "currentChart", displaySettingsMenu: "displaySettingsMenu", showRobot: "showRobot", dateText: "dateText" }, outputs: { emitTypeChart: "emitTypeChart", emitXAxis: "emitXAxis", emitYAxis: "emitYAxis", emitDimension: "emitDimension", emitDesc: "emitDesc" }, host: { listeners: { "document:click": "onClick($event)" } }, viewQueries: [{ propertyName: "barChartCanvas", first: true, predicate: ["barChartCanvas"], descendants: true }], usesOnChanges: true, ngImport: i0, template: "\r\n<div *ngIf=\"showRobot\" class=\"user-icon\" >\r\n    <img class=\"user\" src=\"assets/img/icon/chatgpt-icon.svg\" alt=\"chatgpt-icon\" title=\"chatgpt-icon\" />\r\n</div>\r\n<div class=\"interaction-container\">\r\n    <div class=\"message\">\r\n        <div class=\"msg_content\">\r\n            <p>{{chartDesc}}</p>\r\n            <p *ngIf=\"dateText!=''\" class=\"date-text\">{{dateText}}</p>\r\n        </div>\r\n    </div>\r\n    <div class=\"chart-container\" [ngStyle]=\"{'height.px': chartHeight}\">\r\n        \r\n        <div class=\"drawer-setting\">\r\n            <button *ngIf=\"displaySettingsMenu\" class=\"float-right\" (click)=\"openSetting()\" >\r\n                <img src=\"assets/img/icon/more.svg\" alt=\"Settings\" title=\"Settings\" class=\"\" />\r\n            </button>\r\n            @if(openDrawer){\r\n                <lib-settings-menu \r\n                [selectedChart]=\"selectedChart\"\r\n                [chatId]=\"chatId\" \r\n                [graphDetail]=\"graphDetail\" \r\n                [openSetting]=\"openDrawer\"\r\n                (emitXAxis)=\"changeXAxis($event)\"\r\n                (emitTypeChart)=\"changeType($event)\"\r\n                (emitYAxis)=\"changeYAxis($event)\"\r\n                (emitDimension)=\"changeDimension($event)\"\r\n                (emitDesc)=\"changeDesc($event)\"\r\n                ></lib-settings-menu>\r\n            }\r\n            \r\n        </div>\r\n        \r\n        <canvas #barChartCanvas  height=\"192px\"></canvas>\r\n    </div>\r\n</div>\r\n\r\n\r\n", styles: [".chart-container{width:100%;position:relative}canvas{display:block;width:100%!important;height:100%!important}.date-text{color:var(--color-primary-gray-500);font-family:Graphik;font-size:10px;font-style:normal;font-weight:400;line-height:12px;letter-spacing:-.3px}\n"], dependencies: [{ kind: "directive", type: i1.NgIf, selector: "[ngIf]", inputs: ["ngIf", "ngIfThen", "ngIfElse"] }, { kind: "directive", type: i1.NgStyle, selector: "[ngStyle]", inputs: ["ngStyle"] }, { kind: "component", type: SettingsMenuComponent, selector: "lib-settings-menu", inputs: ["openSetting", "chatId", "graphDetail", "selectedChart", "currentChart"], outputs: ["emitTypeChart", "emitXAxis", "emitYAxis", "emitDimension", "emitDesc"] }] }); }
}
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "18.1.0", ngImport: i0, type: DrawChartsComponent, decorators: [{
            type: Component,
            args: [{ selector: 'lib-draw-charts', template: "\r\n<div *ngIf=\"showRobot\" class=\"user-icon\" >\r\n    <img class=\"user\" src=\"assets/img/icon/chatgpt-icon.svg\" alt=\"chatgpt-icon\" title=\"chatgpt-icon\" />\r\n</div>\r\n<div class=\"interaction-container\">\r\n    <div class=\"message\">\r\n        <div class=\"msg_content\">\r\n            <p>{{chartDesc}}</p>\r\n            <p *ngIf=\"dateText!=''\" class=\"date-text\">{{dateText}}</p>\r\n        </div>\r\n    </div>\r\n    <div class=\"chart-container\" [ngStyle]=\"{'height.px': chartHeight}\">\r\n        \r\n        <div class=\"drawer-setting\">\r\n            <button *ngIf=\"displaySettingsMenu\" class=\"float-right\" (click)=\"openSetting()\" >\r\n                <img src=\"assets/img/icon/more.svg\" alt=\"Settings\" title=\"Settings\" class=\"\" />\r\n            </button>\r\n            @if(openDrawer){\r\n                <lib-settings-menu \r\n                [selectedChart]=\"selectedChart\"\r\n                [chatId]=\"chatId\" \r\n                [graphDetail]=\"graphDetail\" \r\n                [openSetting]=\"openDrawer\"\r\n                (emitXAxis)=\"changeXAxis($event)\"\r\n                (emitTypeChart)=\"changeType($event)\"\r\n                (emitYAxis)=\"changeYAxis($event)\"\r\n                (emitDimension)=\"changeDimension($event)\"\r\n                (emitDesc)=\"changeDesc($event)\"\r\n                ></lib-settings-menu>\r\n            }\r\n            \r\n        </div>\r\n        \r\n        <canvas #barChartCanvas  height=\"192px\"></canvas>\r\n    </div>\r\n</div>\r\n\r\n\r\n", styles: [".chart-container{width:100%;position:relative}canvas{display:block;width:100%!important;height:100%!important}.date-text{color:var(--color-primary-gray-500);font-family:Graphik;font-size:10px;font-style:normal;font-weight:400;line-height:12px;letter-spacing:-.3px}\n"] }]
        }], propDecorators: { typeChart: [{
                type: Input
            }], chatId: [{
                type: Input
            }], chartDesc: [{
                type: Input
            }], selectedChart: [{
                type: Input
            }], chartData: [{
                type: Input
            }], chartTitle: [{
                type: Input
            }], legendPosition: [{
                type: Input
            }], chartHeight: [{
                type: Input
            }], graphDetail: [{
                type: Input
            }], currentChart: [{
                type: Input
            }], displaySettingsMenu: [{
                type: Input
            }], showRobot: [{
                type: Input
            }], dateText: [{
                type: Input
            }], emitTypeChart: [{
                type: Output
            }], emitXAxis: [{
                type: Output
            }], emitYAxis: [{
                type: Output
            }], emitDimension: [{
                type: Output
            }], emitDesc: [{
                type: Output
            }], barChartCanvas: [{
                type: ViewChild,
                args: ['barChartCanvas', { static: false }]
            }], onClick: [{
                type: HostListener,
                args: ['document:click', ['$event']]
            }] } });

class SharedChartsModule {
    static { this.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "18.1.0", ngImport: i0, type: SharedChartsModule, deps: [], target: i0.ɵɵFactoryTarget.NgModule }); }
    static { this.ɵmod = i0.ɵɵngDeclareNgModule({ minVersion: "14.0.0", version: "18.1.0", ngImport: i0, type: SharedChartsModule, declarations: [DrawChartsComponent,
            SettingsMenuComponent], imports: [CommonModule,
            FormsModule], exports: [DrawChartsComponent,
            SettingsMenuComponent] }); }
    static { this.ɵinj = i0.ɵɵngDeclareInjector({ minVersion: "12.0.0", version: "18.1.0", ngImport: i0, type: SharedChartsModule, imports: [CommonModule,
            FormsModule] }); }
}
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "18.1.0", ngImport: i0, type: SharedChartsModule, decorators: [{
            type: NgModule,
            args: [{
                    declarations: [
                        DrawChartsComponent,
                        SettingsMenuComponent
                    ],
                    imports: [
                        CommonModule,
                        FormsModule
                    ],
                    exports: [
                        DrawChartsComponent,
                        SettingsMenuComponent
                    ] // Make it accessible outside the library
                }]
        }] });

/*
 * Public API Surface of draw-charts
 */

/**
 * Generated bundle index. Do not edit.
 */

export { DrawChartsComponent, DrawChartsService, SettingsMenuComponent, SharedChartsModule };
//# sourceMappingURL=draw-charts.mjs.map
