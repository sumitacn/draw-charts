import { Component, EventEmitter, HostListener, Input, Output, ViewChild } from '@angular/core';
import { Chart, registerables } from 'chart.js';
import * as i0 from "@angular/core";
import * as i1 from "@angular/common";
import * as i2 from "../settings-menu/settings-menu.component";
Chart.register(...registerables);
export class DrawChartsComponent {
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
    static { this.ɵcmp = i0.ɵɵngDeclareComponent({ minVersion: "17.0.0", version: "18.1.0", type: DrawChartsComponent, selector: "lib-draw-charts", inputs: { typeChart: "typeChart", chatId: "chatId", chartDesc: "chartDesc", selectedChart: "selectedChart", chartData: "chartData", chartTitle: "chartTitle", legendPosition: "legendPosition", chartHeight: "chartHeight", graphDetail: "graphDetail", currentChart: "currentChart", displaySettingsMenu: "displaySettingsMenu", showRobot: "showRobot", dateText: "dateText" }, outputs: { emitTypeChart: "emitTypeChart", emitXAxis: "emitXAxis", emitYAxis: "emitYAxis", emitDimension: "emitDimension", emitDesc: "emitDesc" }, host: { listeners: { "document:click": "onClick($event)" } }, viewQueries: [{ propertyName: "barChartCanvas", first: true, predicate: ["barChartCanvas"], descendants: true }], usesOnChanges: true, ngImport: i0, template: "\r\n<div *ngIf=\"showRobot\" class=\"user-icon\" >\r\n    <img class=\"user\" src=\"assets/img/icon/chatgpt-icon.svg\" alt=\"chatgpt-icon\" title=\"chatgpt-icon\" />\r\n</div>\r\n<div class=\"interaction-container\">\r\n    <div class=\"message\">\r\n        <div class=\"msg_content\">\r\n            <p>{{chartDesc}}</p>\r\n            <p *ngIf=\"dateText!=''\" class=\"date-text\">{{dateText}}</p>\r\n        </div>\r\n    </div>\r\n    <div class=\"chart-container\" [ngStyle]=\"{'height.px': chartHeight}\">\r\n        \r\n        <div class=\"drawer-setting\">\r\n            <button *ngIf=\"displaySettingsMenu\" class=\"float-right\" (click)=\"openSetting()\" >\r\n                <img src=\"assets/img/icon/more.svg\" alt=\"Settings\" title=\"Settings\" class=\"\" />\r\n            </button>\r\n            @if(openDrawer){\r\n                <lib-settings-menu \r\n                [selectedChart]=\"selectedChart\"\r\n                [chatId]=\"chatId\" \r\n                [graphDetail]=\"graphDetail\" \r\n                [openSetting]=\"openDrawer\"\r\n                (emitXAxis)=\"changeXAxis($event)\"\r\n                (emitTypeChart)=\"changeType($event)\"\r\n                (emitYAxis)=\"changeYAxis($event)\"\r\n                (emitDimension)=\"changeDimension($event)\"\r\n                (emitDesc)=\"changeDesc($event)\"\r\n                ></lib-settings-menu>\r\n            }\r\n            \r\n        </div>\r\n        \r\n        <canvas #barChartCanvas  height=\"192px\"></canvas>\r\n    </div>\r\n</div>\r\n\r\n\r\n", styles: [".chart-container{width:100%;position:relative}canvas{display:block;width:100%!important;height:100%!important}.date-text{color:var(--color-primary-gray-500);font-family:Graphik;font-size:10px;font-style:normal;font-weight:400;line-height:12px;letter-spacing:-.3px}\n"], dependencies: [{ kind: "directive", type: i1.NgIf, selector: "[ngIf]", inputs: ["ngIf", "ngIfThen", "ngIfElse"] }, { kind: "directive", type: i1.NgStyle, selector: "[ngStyle]", inputs: ["ngStyle"] }, { kind: "component", type: i2.SettingsMenuComponent, selector: "lib-settings-menu", inputs: ["openSetting", "chatId", "graphDetail", "selectedChart", "currentChart"], outputs: ["emitTypeChart", "emitXAxis", "emitYAxis", "emitDimension", "emitDesc"] }] }); }
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZHJhdy1jaGFydHMuY29tcG9uZW50LmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vLi4vLi4vLi4vcHJvamVjdHMvZHJhdy1jaGFydHMvc3JjL2xpYi9kcmF3LWNoYXJ0cy9kcmF3LWNoYXJ0cy5jb21wb25lbnQudHMiLCIuLi8uLi8uLi8uLi8uLi9wcm9qZWN0cy9kcmF3LWNoYXJ0cy9zcmMvbGliL2RyYXctY2hhcnRzL2RyYXctY2hhcnRzLmNvbXBvbmVudC5odG1sIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUNBLE9BQU8sRUFBaUIsU0FBUyxFQUFjLFlBQVksRUFBRSxZQUFZLEVBQUUsS0FBSyxFQUF3QixNQUFNLEVBQWlCLFNBQVMsRUFBRSxNQUFNLGVBQWUsQ0FBQztBQUNoSyxPQUFPLEVBQUUsS0FBSyxFQUFFLGFBQWEsRUFBRSxNQUFNLFVBQVUsQ0FBQzs7OztBQUdoRCxLQUFLLENBQUMsUUFBUSxDQUFDLEdBQUcsYUFBYSxDQUFDLENBQUM7QUFRakMsTUFBTSxPQUFPLG1CQUFtQjtJQU5oQztRQVFXLGNBQVMsR0FBUSxFQUFFLENBQUM7UUFDcEIsV0FBTSxHQUFRLEVBQUUsQ0FBQyxDQUFDLG1CQUFtQjtRQUNyQyxjQUFTLEdBQVEsRUFBRSxDQUFDLENBQUMsbURBQW1EO1FBQ3hFLGtCQUFhLEdBQVEsRUFBRSxDQUFDO1FBRXhCLGVBQVUsR0FBVyxhQUFhLENBQUM7UUFDbkMsbUJBQWMsR0FBd0MsUUFBUSxDQUFDO1FBQy9ELGdCQUFXLEdBQVcsR0FBRyxDQUFDO1FBRTFCLGlCQUFZLEdBQWtCLElBQUksQ0FBQztRQUNuQyx3QkFBbUIsR0FBbUIsSUFBSSxDQUFDO1FBQzNDLGNBQVMsR0FBWSxJQUFJLENBQUM7UUFDMUIsYUFBUSxHQUFXLEVBQUUsQ0FBQztRQUlyQixrQkFBYSxHQUFHLElBQUksWUFBWSxFQUFFLENBQUM7UUFDbkMsY0FBUyxHQUFHLElBQUksWUFBWSxFQUFFLENBQUM7UUFDL0IsY0FBUyxHQUFHLElBQUks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QUcsTUFBTSxDQUFDLE9BQU8sQ0FBQyxpQkFBaUIsQ0FBQyxDQUFDO1FBQ3hELElBQUcsQ0FBQyxhQUFhLEVBQUMsQ0FBQztZQUNqQixJQUFJLENBQUMsVUFBVSxHQUFHLEtBQUssQ0FBQztRQUMxQixDQUFDO0lBQ0gsQ0FBQzs4R0F4VFUsbUJBQW1CO2tHQUFuQixtQkFBbUIsaXdCQ2JoQyxnaERBc0NBOzsyRkR6QmEsbUJBQW1CO2tCQU4vQixTQUFTOytCQUNFLGlCQUFpQjs4QkFPbEIsU0FBUztzQkFBakIsS0FBSztnQkFDRyxNQUFNO3NCQUFkLEtBQUs7Z0JBQ0csU0FBUztzQkFBakIsS0FBSztnQkFDRyxhQUFhO3NCQUFyQixLQUFLO2dCQUNHLFNBQVM7c0JBQWpCLEtBQUs7Z0JBQ0csVUFBVTtzQkFBbEIsS0FBSztnQkFDRyxjQUFjO3NCQUF0QixLQUFLO2dCQUNHLFdBQVc7c0JBQW5CLEtBQUs7Z0JBQ0csV0FBVztzQkFBbkIsS0FBSztnQkFDRyxZQUFZO3NCQUFwQixLQUFLO2dCQUNHLG1CQUFtQjtzQkFBM0IsS0FBSztnQkFDRyxTQUFTO3NCQUFqQixLQUFLO2dCQUNHLFFBQVE7c0JBQWhCLEtBQUs7Z0JBSUksYUFBYTtzQkFBdEIsTUFBTTtnQkFDRyxTQUFTO3NCQUFsQixNQUFNO2dCQUNHLFNBQVM7c0JBQWxCLE1BQU07Z0JBQ0csYUFBYTtzQkFBdEIsTUFBTTtnQkFDRyxRQUFRO3NCQUFqQixNQUFNO2dCQUV5QyxjQUFjO3NCQUE3RCxTQUFTO3VCQUFDLGdCQUFnQixFQUFFLEVBQUUsTUFBTSxFQUFFLEtBQUssRUFBRTtnQkEwUjlDLE9BQU87c0JBRE4sWUFBWTt1QkFBQyxnQkFBZ0IsRUFBRSxDQUFDLFFBQVEsQ0FBQyIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCB7IENvbW1vbk1vZHVsZSB9IGZyb20gJ0Bhbmd1bGFyL2NvbW1vbic7XHJcbmltcG9ydCB7IEFmdGVyVmlld0luaXQsIENvbXBvbmVudCwgRWxlbWVudFJlZiwgRXZlbnRFbWl0dGVyLCBIb3N0TGlzdGVuZXIsIElucHV0LCBPbkNoYW5nZXMsIE9uRGVzdHJveSwgT3V0cHV0LCBTaW1wbGVDaGFuZ2VzLCBWaWV3Q2hpbGQgfSBmcm9tICdAYW5ndWxhci9jb3JlJztcclxuaW1wb3J0IHsgQ2hhcnQsIHJlZ2lzdGVyYWJsZXMgfSBmcm9tICdjaGFydC5qcyc7XHJcbmltcG9ydCB7IFNldHRpbmdzTWVudUNvbXBvbmVudCB9IGZyb20gJy4uL3NldHRpbmdzLW1lbnUvc2V0dGluZ3MtbWVudS5jb21wb25lbnQnO1xyXG5cclxuQ2hhcnQucmVnaXN0ZXIoLi4ucmVnaXN0ZXJhYmxlcyk7XHJcblxyXG5AQ29tcG9uZW50KHtcclxuICBzZWxlY3RvcjogJ2xpYi1kcmF3LWNoYXJ0cycsXHJcbiAgdGVtcGxhdGVVcmw6ICcuL2RyYXctY2hhcnRzLmNvbXBvbmVudC5odG1sJyxcclxuICBzdHlsZVVybDogJy4vZHJhdy1jaGFydC5jb21wb25lbnQuc2NzcydcclxufSlcclxuXHJcbmV4cG9ydCBjbGFzcyBEcmF3Q2hhcnRzQ29tcG9uZW50ICBpbXBsZW1lbnRzIE9uQ2hhbmdlcywgQWZ0ZXJWaWV3SW5pdCwgT25EZXN0cm95IHtcclxuXHJcbiAgQElucHV0KCkgdHlwZUNoYXJ0OiBhbnkgPSAnJztcclxuICBASW5wdXQoKSBjaGF0SWQ6IGFueSA9ICcnOyAvLyBmb3Igc2V0dGluZyBtZW51XHJcbiAgQElucHV0KCkgY2hhcnREZXNjOiBhbnkgPSAnJzsgLy8gYWJsZSB0byB1cGRhdGUgY2hhcnQgZGVzY3JpcHRpb24gYXQgc2V0dGluZyBtZW51XHJcbiAgQElucHV0KCkgc2VsZWN0ZWRDaGFydDogYW55ID0gJyc7XHJcbiAgQElucHV0KCkgY2hhcnREYXRhITogeyBsYWJlbHM6IHN0cmluZ1tdLCBkYXRhc2V0OiBhbnlbXSwgb3B0aW9ucz86IGFueSB9O1xyXG4gIEBJbnB1dCgpIGNoYXJ0VGl0bGU6IHN0cmluZyA9ICdDaGFydCBUaXRsZSc7XHJcbiAgQElucHV0KCkgbGVnZW5kUG9zaXRpb246ICd0b3AnIHwgJ2xlZnQnIHwgJ2JvdHRvbScgfCAncmlnaHQnID0gJ2JvdHRvbSc7XHJcbiAgQElucHV0KCkgY2hhcnRIZWlnaHQ6IG51bWJlciA9IDQwMDsgIFxyXG4gIEBJbnB1dCgpIGdyYXBoRGV0YWlsOiBhbnk7XHJcbiAgQElucHV0KCkgY3VycmVudENoYXJ0OiBudW1iZXIgfCBudWxsID0gbnVsbDtcclxuICBASW5wdXQoKSBkaXNwbGF5U2V0dGluZ3NNZW51OiBib29sZWFuIHwgbnVsbCA9IHRydWU7XHJcbiAgQElucHV0KCkgc2hvd1JvYm90OiBib29sZWFuID0gdHJ1ZTtcclxuICBASW5wdXQoKSBkYXRlVGV4dDogc3RyaW5nID0gJyc7XHJcbiAgXHJcbiAgXHJcblxyXG4gIEBPdXRwdXQoKSBlbWl0VHlwZUNoYXJ0ID0gbmV3IEV2ZW50RW1pdHRlcigpO1xyXG4gIEBPdXRwdXQoKSBlbWl0WEF4aXMgPSBuZXcgRXZlbnRFbWl0dGVyKCk7XHJcbiAgQE91dHB1dCgpIGVtaXRZQXhpcyA9IG5ldyBFdmVudEVtaXR0ZXIoKTtcclxuICBAT3V0cHV0KCkgZW1pdERpbWVuc2lvbiA9IG5ldyBFdmVudEVtaXR0ZXIoKTtcclxuICBAT3V0cHV0KCkgZW1pdERlc2MgPSBuZXcgRXZlbnRFbWl0dGVyKCk7XHJcblxyXG4gIEBWaWV3Q2hpbGQoJ2JhckNoYXJ0Q2FudmFzJywgeyBzdGF0aWM6IGZhbHNlIH0pIGJhckNoYXJ0Q2FudmFzITogRWxlbWVudFJlZjxIVE1MQ2FudmFzRWxlbWVudD47XHJcbiAgXHJcbiAgb3BlbkRyYXdlcjogYm9vbGVhbiA9IGZhbHNlO1xyXG5cclxuICBwcml2YXRlIGNoYXJ0OiBDaGFydCB8IHVuZGVmaW5lZDtcclxuXHJcbiAgbmdBZnRlclZpZXdJbml0KCk6IHZvaWQge1xyXG4gICAgdGhpcy5jcmVhdGVDaGFydCgpO1xyXG4gIH1cclxuXHJcbiAgXHJcbiAgbmdPbkNoYW5nZXMoY2hhbmdlczogU2ltcGxlQ2hhbmdlcyk6IHZvaWQge1xyXG4gICAgaWYoY2hhbmdlc1snc2VsZWN0ZWRDaGFydCddIHx8IGNoYW5nZXNbJ2dyYXBoRGV0YWlsJ10gfHwgY2hhbmdlc1snY2hhcnREYXRhJ10pe1xyXG4gICAgICBpZiAodGhpcy5jaGFydCkge1xyXG4gICAgICAgIHRoaXMuY2hhcnQuZGVzdHJveSgpO1xyXG4gICAgICB9XHJcbiAgICAgIHRoaXMuY3JlYXRlQ2hhcnQoKTtcclxuXHJcbiAgICB9XHJcbiAgICBcclxuICB9XHJcblxyXG4gIG5nT25EZXN0cm95KCk6IHZvaWQge1xyXG4gICAgaWYgKHRoaXMuY2hhcnQpIHtcclxuICAgICAgdGhpcy5jaGFydC5kZXN0cm95KCk7XHJcbiAgICB9XHJcbiAgfVxyXG5cclxuICBvcGVuU2V0dGluZygpIHtcclxuICAgIHRoaXMub3BlbkRyYXdlciA9ICF0aGlzLm9wZW5EcmF3ZXI7XHJcbiAgfVxyXG5cclxuICAvKiogY3JlYXRlIGNoYXJ0IGZ1bmN0aW9uIC0gVG8gZHJhdyBjaGFydCBmb2xsb3dpbmcgYnkgZGF0YSAqL1xyXG4gIGNyZWF0ZUNoYXJ0KCk6IHZvaWQge1xyXG5cclxuICAgIGlmICh0aGlzLmNoYXJ0KSB7XHJcbiAgICAgIHRoaXMuY2hhcnQuZGVzdHJveSgpO1xyXG4gICAgfVxyXG5cclxuICAgIC8vIGNvbnN0IGN0eCA9IHRoaXMuYmFyQ2hhcnRDYW52YXMubmF0aXZlRWxlbWVudC5nZXRDb250ZXh0KCcyZCcpO1xyXG4gICAgaWYodGhpcy5iYXJDaGFydENhbnZhcyl7XHJcbiAgICAgICAgY29uc3QgY2FudmFzID0gdGhpcy5iYXJDaGFydENhbnZhcy5uYXRpdmVFbGVtZW50IGFzIEhUTUxDYW52YXNFbGVtZW50O1xyXG4gICAgICAgIGNvbnN0IGN0eCA9IGNhbnZhcy5nZXRDb250ZXh0KCcyZCcpO1xyXG5cclxuICAgICAgICBpZiAoIWN0eCkge1xyXG4gICAgICAgICAgY29uc29sZS5lcnJvcignRmFpbGVkIHRvIGdldCAyRCBjb250ZXh0Jyk7XHJcbiAgICAgICAgICByZXR1cm47XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICBjYW52YXMuaGVpZ2h0ID0gdGhpcy5jaGFydEhlaWdodDtcclxuXHJcbiAgICAgICAgbGV0IGNvbG9ycyA9IFtcclxuICAgICAgICAgIFwiIzJEOTRGQlwiLCBcclxuICAgICAgICAgIFwiIzdGMzdFNVwiLCBcclxuICAgICAgICAgIFwiIzAwNUQ1RFwiLCBcclxuICAgICAgICAgIFwiIzlGMTg1M1wiLCBcclxuICAgICAgICAgIFwiI0U4NkU3NFwiLFxyXG4gICAgICAgICAgXCIjMTk4MDM4XCIsIFxyXG4gICAgICAgICAgXCIjMDAyRDlDXCIsIFxyXG4gICAgICAgICAgXCIjRUU1MzhCXCIsIFxyXG4gICAgICAgICAgXCIjQjI4NjAwXCIsXHJcbiAgICAgICAgICBcIiMwMDlEOUFcIixcclxuICAgICAgICAgIFwiIzhBMzgwMFwiLCBcclxuICAgICAgICAgIFwiIzAxMjc0OVwiLCBcclxuICAgICAgICAgIFwiIzA5QzlFNVwiLCBcclxuICAgICAgICAgIFwiIzcwREJGRlwiLFxyXG4gICAgICAgICAgXCIjQUZEN0ZEXCIsXHJcbiAgICAgICAgICBcIiNDNkM1RkJcIiwgXHJcbiAgICAgICAgICBcIiNDRUExRkZcIiwgXHJcbiAgICAgICAgICBcIiNEMjYyRkZcIiwgXHJcbiAgICAgICAgICBcIiM2OTM4RUZcIixcclxuICAgICAgICAgIFwiI0MxMTU3NFwiLFxyXG4gICAgICAgIF07XHJcblxyXG4gICAgICAgIGxldCBncmFkaWVudDogYW55O1xyXG5cclxuICAgICAgICBjb25zb2xlLmxvZygnQkFSIENIQVJUIFt0eXBlQ2hhcnRdOiAnLCB0aGlzLnR5cGVDaGFydClcclxuICAgICAgICBjb25zb2xlLmxvZygnQkFSIENIQVJUIFtjaGFydERhdGFdOiAnLCB0aGlzLmNoYXJ0RGF0YSlcclxuICAgICAgICBcclxuICAgICAgICBcclxuICAgICAgICBjb25zdCBkYXRhc2V0cyA9IHRoaXMuY2hhcnREYXRhLmRhdGFzZXQubWFwKChjaGFydCwgaW5kZXgpID0+IHtcclxuICAgICAgICAgIGdyYWRpZW50ID0gY3R4LmNyZWF0ZUxpbmVhckdyYWRpZW50KDAsIDAsIDAsIHRoaXMuY2hhcnRIZWlnaHQpO1xyXG4gICAgICAgICAgZ3JhZGllbnQuYWRkQ29sb3JTdG9wKDAsIGNvbG9yc1tpbmRleCAlIGNvbG9ycy5sZW5ndGhdKTtcclxuICAgICAgICAgIGdyYWRpZW50LmFkZENvbG9yU3RvcCgxLCAncmdiYSgyNTUsIDI1NSwgMjU1LCAwLjIpJyk7XHJcblxyXG4gICAgICAgICAgcmV0dXJuIHRoaXMudHlwZUNoYXJ0ID09ICdyYWRhcicgPyB7XHJcbiAgICAgICAgICAgIGxhYmVsOiBjaGFydC5sYWJlbCxcclxuICAgICAgICAgICAgZGF0YTogY2hhcnQuZGF0YSxcclxuICAgICAgICAgICAgZmlsbDogdHJ1ZSxcclxuICAgICAgICAgICAgYmFja2dyb3VuZENvbG9yOiB0aGlzLmNoYXJ0RGF0YS5kYXRhc2V0WzBdPy5iYWNrZ3JvdW5kQ29sb3IgPyB0aGlzLmNoYXJ0RGF0YS5kYXRhc2V0WzBdPy5iYWNrZ3JvdW5kQ29sb3IgOiBjb2xvcnNbaW5kZXggJSBjb2xvcnMubGVuZ3RoXSxcclxuICAgICAgICAgICAgYm9yZGVyQ29sb3I6IGNvbG9yc1tpbmRleCAlIGNvbG9ycy5sZW5ndGhdLFxyXG4gICAgICAgICAgICBwb2ludEJhY2tncm91bmRDb2xvcjogY29sb3JzW2luZGV4ICUgY29sb3JzLmxlbmd0aF0sXHJcbiAgICAgICAgICAgIHBvaW50Qm9yZGVyQ29sb3I6ICcjZmZmJyxcclxuICAgICAgICAgICAgcG9pbnRIb3ZlckJhY2tncm91bmRDb2xvcjogJyNmZmYnLFxyXG4gICAgICAgICAgICBwb2ludEhvdmVyQm9yZGVyQ29sb3I6IGNvbG9yc1tpbmRleCAlIGNvbG9ycy5sZW5ndGhdXHJcbiAgICAgICAgICB9IDogdGhpcy50eXBlQ2hhcnQgPT0gJ2J1YmJsZScgfHwgdGhpcy50eXBlQ2hhcnQgPT0gJ3NjYXR0ZXInID8ge1xyXG4gICAgICAgICAgICBsYWJlbDogY2hhcnQubGFiZWwsXHJcbiAgICAgICAgICAgIGRhdGE6IGNoYXJ0LmRhdGEsXHJcbiAgICAgICAgICAgIGJhY2tncm91bmRDb2xvcjogY29sb3JzW2luZGV4ICUgY29sb3JzLmxlbmd0aF0sXHJcbiAgICAgICAgICAgIFxyXG4gICAgICAgICAgfSA6IHtcclxuICAgICAgICAgICAgbGFiZWw6IGNoYXJ0LmxhYmVsLFxyXG4gICAgICAgICAgICBkYXRhOiBjaGFydC5kYXRhLFxyXG4gICAgICAgICAgICBmaWxsOiB0aGlzLnR5cGVDaGFydCA9PT0gJ2FyZWEnLFxyXG4gICAgICAgICAgICBiYWNrZ3JvdW5kQ29sb3I6IHRoaXMuY2hhcnREYXRhLmRhdGFzZXRbMF0/LmJhY2tncm91bmRDb2xvciA/IHRoaXMuY2hhcnREYXRhLmRhdGFzZXRbMF0/LmJhY2tncm91bmRDb2xvciA6ICB0aGlzLnR5cGVDaGFydCA9PT0gJ2xpbmUnIHx8IHRoaXMudHlwZUNoYXJ0ID09PSAnYmFyJyB8fCB0aGlzLnR5cGVDaGFydCA9PT0gJ2J1YmJsZScgPyBjb2xvcnNbaW5kZXggJSBjb2xvcnMubGVuZ3RoXSA6IHRoaXMudHlwZUNoYXJ0ID09PSAncGllJyB8fCB0aGlzLnR5cGVDaGFydCA9PT0gJ2RvdWdobnV0JyB8fCB0aGlzLnR5cGVDaGFydCA9PT0gJ3BvbGFyQXJlYScgPyBjb2xvcnMgOiBncmFkaWVudCxcclxuICAgICAgICAgICAgYm9yZGVyQ29sb3I6IHRoaXMudHlwZUNoYXJ0ID09PSAncGllJyB8fCB0aGlzLnR5cGVDaGFydCA9PT0gJ2RvdWdobnV0JyB8fCB0aGlzLnR5cGVDaGFydCA9PT0gJ3BvbGFyQXJlYScgPyBjb2xvcnMgOiBjb2xvcnNbaW5kZXggJSBjb2xvcnMubGVuZ3RoXSxcclxuICAgICAgICAgICAgYm9yZGVyV2lkdGg6IHRoaXMuY2hhcnREYXRhLmRhdGFzZXRbMF0/LmJvcmRlcldpZHRoID8gIHRoaXMuY2hhcnREYXRhLmRhdGFzZXRbMF0/LmJvcmRlcldpZHRoIDogMVxyXG4gICAgICAgICAgfTtcclxuICAgICAgICB9KTsgICAgXHJcblxyXG5cclxuICAgICAgICB0aGlzLmNoYXJ0ID0gbmV3IENoYXJ0KGN0eCwge1xyXG4gICAgICAgICAgdHlwZTogdGhpcy50eXBlQ2hhcnQgPT09ICdhcmVhJyA/ICdsaW5lJyA6IHRoaXMudHlwZUNoYXJ0LFxyXG4gICAgICAgICAgZGF0YTogdGhpcy50eXBlQ2hhcnQgPT09ICdidWJibGUnID8gICB7XHJcbiAgICAgICAgICAgIGRhdGFzZXRzOiBkYXRhc2V0c1xyXG5cclxuICAgICAgICAgIH0gOiBcclxuICAgICAgICAgICAge1xyXG4gICAgICAgICAgICAgIGxhYmVsczogdGhpcy5jaGFydERhdGEubGFiZWxzLFxyXG4gICAgICAgICAgICAgIGRhdGFzZXRzOiBkYXRhc2V0c1xyXG4gICAgICAgICAgICB9LFxyXG4gICAgICAgICAgb3B0aW9uczoge1xyXG4gICAgICAgICAgICByZXNwb25zaXZlOiB0cnVlLFxyXG4gICAgICAgICAgICBtYWludGFpbkFzcGVjdFJhdGlvOiBmYWxzZSxcclxuICAgICAgICAgICAgcGx1Z2luczogdGhpcy50eXBlQ2hhcnQgPT09ICdsaW5lJyB8fCB0aGlzLnR5cGVDaGFydCA9PT0gJ2JhcicgfHwgdGhpcy50eXBlQ2hhcnQgPT09ICdkb3VnaG51dCcgPyB7XHJcbiAgICAgICAgICAgICAgbGVnZW5kOiB7XHJcbiAgICAgICAgICAgICAgICBkaXNwbGF5OiB0cnVlLFxyXG4gICAgICAgICAgICAgICAgcG9zaXRpb246IHRoaXMubGVnZW5kUG9zaXRpb24sXHJcbiAgICAgICAgICAgICAgICBhbGlnbjogJ3N0YXJ0JyxcclxuICAgICAgICAgICAgICAgIGxhYmVsczoge1xyXG4gICAgICAgICAgICAgICAgICAvLyB1c2VQb2ludFN0eWxlOiB0cnVlLFxyXG4gICAgICAgICAgICAgICAgICAvLyBwb2ludFN0eWxlOiAnY2lyY2xlJyxcclxuICAgICAgICAgICAgICAgICAgZm9udDoge1xyXG4gICAgICAgICAgICAgICAgICAgIHNpemU6IDEwXHJcbiAgICAgICAgICAgICAgICAgIH0sXHJcbiAgICAgICAgICAgICAgICAgIGNvbG9yOiAnIzY2NzA4NSdcclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICB9LFxyXG4gICAgICAgICAgICAgIHRpdGxlOiB7XHJcbiAgICAgICAgICAgICAgICBkaXNwbGF5OiB0cnVlLFxyXG4gICAgICAgICAgICAgICAgYWxpZ246ICdzdGFydCcsXHJcbiAgICAgICAgICAgICAgICB0ZXh0OiB0aGlzLmNoYXJ0VGl0bGUsXHJcbiAgICAgICAgICAgICAgICBwYWRkaW5nOiB7XHJcbiAgICAgICAgICAgICAgICAgIHRvcDogMjAsXHJcbiAgICAgICAgICAgICAgICAgIGJvdHRvbTogMTBcclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICB9LFxyXG4gICAgICAgICAgICB9IDogdGhpcy50eXBlQ2hhcnQgPT09ICdhcmVhJyA/IHtcclxuICAgICAgICAgICAgICBsZWdlbmQ6IHtcclxuICAgICAgICAgICAgICAgIGRpc3BsYXk6IHRydWUsXHJcbiAgICAgICAgICAgICAgICBwb3NpdGlvbjogdGhpcy5sZWdlbmRQb3NpdGlvbixcclxuICAgICAgICAgICAgICAgIGFsaWduOiAnc3RhcnQnLFxyXG4gICAgICAgICAgICAgICAgbGFiZWxzOiB7XHJcbiAgICAgICAgICAgICAgICAgIHVzZVBvaW50U3R5bGU6IHRydWUsXHJcbiAgICAgICAgICAgICAgICAgIHBvaW50U3R5bGU6ICdyZWN0JyxcclxuICAgICAgICAgICAgICAgICAgLy8gcG9pbnRSYWRpdXM6IDAsXHJcbiAgICAgICAgICAgICAgICAgIGdlbmVyYXRlTGFiZWxzOiAoY2hhcnQ6IGFueSkgPT4ge1xyXG4gICAgICAgICAgICAgICAgICAgIC8vIEN1c3RvbSBsYWJlbCBnZW5lcmF0aW9uIHdpdGggc29saWQgY29sb3JzXHJcbiAgICAgICAgICAgICAgICAgICAgY29uc3QgZGF0YXNldHMgPSBjaGFydC5kYXRhLmRhdGFzZXRzO1xyXG4gICAgICAgICAgICAgICAgICAgIHJldHVybiBkYXRhc2V0cy5tYXAoKGRhdGFzZXQ6IGFueSwgaTogbnVtYmVyKSA9PiAoe1xyXG4gICAgICAgICAgICAgICAgICAgICAgdGV4dDogZGF0YXNldC5sYWJlbCxcclxuICAgICAgICAgICAgICAgICAgICAgIGZpbGxTdHlsZTogY29sb3JzW2kgJSBjb2xvcnMubGVuZ3RoXSwgIC8vIFVzZSBzb2xpZCBjb2xvciBmb3IgbGVnZW5kXHJcbiAgICAgICAgICAgICAgICAgICAgICBzdHJva2VTdHlsZTogZGF0YXNldC5ib3JkZXJDb2xvcixcclxuICAgICAgICAgICAgICAgICAgICAgIGxpbmVXaWR0aDogZGF0YXNldC5ib3JkZXJXaWR0aCxcclxuICAgICAgICAgICAgICAgICAgICAgIGhpZGRlbjogIWNoYXJ0LmlzRGF0YXNldFZpc2libGUoaSksXHJcbiAgICAgICAgICAgICAgICAgICAgICBpbmRleDogaSxcclxuICAgICAgICAgICAgICAgICAgICAgIHBvaW50U3R5bGU6ICdyZWN0JyxcclxuICAgICAgICAgICAgICAgICAgICB9KSk7XHJcbiAgICAgICAgICAgICAgICAgIH0sXHJcbiAgICAgICAgICAgICAgICAgIGZvbnQ6IHtcclxuICAgICAgICAgICAgICAgICAgICBzaXplOiAxMFxyXG4gICAgICAgICAgICAgICAgICB9LFxyXG4gICAgICAgICAgICAgICAgICAgIGNvbG9yOiAnIzY2NzA4NSdcclxuICAgICAgICAgICAgICAgIH0sXHJcbiAgICAgICAgICAgICAgfSxcclxuICAgICAgICAgICAgICB0aXRsZToge1xyXG4gICAgICAgICAgICAgICAgZGlzcGxheTogdHJ1ZSxcclxuICAgICAgICAgICAgICAgIGFsaWduOiAnc3RhcnQnLFxyXG4gICAgICAgICAgICAgICAgdGV4dDogdGhpcy5jaGFydFRpdGxlLFxyXG4gICAgICAgICAgICAgICAgcGFkZGluZzoge1xyXG4gICAgICAgICAgICAgICAgICB0b3A6IDIwLFxyXG4gICAgICAgICAgICAgICAgICBib3R0b206IDEwXHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgfSxcclxuICAgICAgICAgICAgfSA6IHRoaXMudHlwZUNoYXJ0ID09PSAnYnViYmxlJyA/IHtcclxuICAgICAgICAgICAgICB0b29sdGlwOiB7XHJcbiAgICAgICAgICAgICAgICBjYWxsYmFja3M6IHtcclxuICAgICAgICAgICAgICAgICAgbGFiZWw6IChjb250ZXh0OiBhbnkpID0+IHtcclxuICAgICAgICAgICAgICAgICAgICBjb25zdCB7eCwgeSwgcn0gPSBjb250ZXh0LnJhdztcclxuICAgICAgICAgICAgICAgICAgICByZXR1cm4gYCR7dGhpcy5jaGFydERhdGEubGFiZWxzW3hdfSwgJHt5fSwgJHtyICogMTB9YDtcclxuICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgfSA6IHRoaXMudHlwZUNoYXJ0ID09PSAnc2NhdHRlcicgPyB7XHJcbiAgICAgICAgICAgICAgdG9vbHRpcDoge1xyXG4gICAgICAgICAgICAgICAgY2FsbGJhY2tzOiB7XHJcbiAgICAgICAgICAgICAgICAgIGxhYmVsOiAoY29udGV4dDogYW55KSA9PiB7XHJcbiAgICAgICAgICAgICAgICAgICAgY29uc3Qge3gsIHl9ID0gY29udGV4dC5yYXc7XHJcbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuIGAke3RoaXMuY2hhcnREYXRhLmxhYmVsc1t4XX0sICR7eX19YDtcclxuICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgfSA6IHtcclxuXHJcbiAgICAgICAgICAgIH0sXHJcbiAgICAgICAgICAgIGVsZW1lbnRzOiB0aGlzLnR5cGVDaGFydCA9PT0gJ3JhZGFyJyA/IHtcclxuICAgICAgICAgICAgICBsaW5lOiB7XHJcbiAgICAgICAgICAgICAgICBib3JkZXJXaWR0aDogM1xyXG4gICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgfSA6IHt9LFxyXG4gICAgICAgICAgICBzY2FsZXM6IHRoaXMudHlwZUNoYXJ0ID09PSAnc2NhdHRlcicgPyB7XHJcbiAgICAgICAgICAgICAgeDoge1xyXG4gICAgICAgICAgICAgICAgdHlwZTogJ2NhdGVnb3J5JyxcclxuICAgICAgICAgICAgICAgIHBvc2l0aW9uOiAnYm90dG9tJyxcclxuICAgICAgICAgICAgICAgIGxhYmVsczogdGhpcy5jaGFydERhdGEubGFiZWxzLCBcclxuICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIH0gOiB0aGlzLnR5cGVDaGFydCA9PT0gJ2J1YmJsZScgPyB7XHJcbiAgICAgICAgICAgICAgeDoge1xyXG4gICAgICAgICAgICAgICAgdHlwZTogJ2NhdGVnb3J5JyxcclxuICAgICAgICAgICAgICAgIGxhYmVsczogdGhpcy5jaGFydERhdGEubGFiZWxzLCBcclxuICAgICAgICAgICAgICB9XHJcblxyXG4gICAgICAgICAgICB9IDogdGhpcy50eXBlQ2hhcnQgIT09ICdwaWUnICYmIHRoaXMudHlwZUNoYXJ0ICE9PSAnZG91Z2hudXQnICYmIHRoaXMudHlwZUNoYXJ0ICE9PSAncG9sYXJBcmVhJyAmJiB0aGlzLnR5cGVDaGFydCAhPT0gJ3JhZGFyJyAgPyB7XHJcbiAgICAgICAgICAgICAgeToge1xyXG4gICAgICAgICAgICAgICAgYmVnaW5BdFplcm86IHRydWVcclxuICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIH0gOiB7fVxyXG4gICAgICAgICAgfSxcclxuICAgICAgICB9KTtcclxuICAgIH0gZWxzZSB7XHJcbiAgICAgIGNvbnNvbGUuZXJyb3IoJ0NhbnZhcyBlbGVtZW50IGlzIG5vdCBkZWZpbmVkLicpO1xyXG4gICAgfVxyXG4gIH1cclxuXHJcbiAgLyoqXHJcbiAgICogQ2hhbmdlIFR5cGUgZnVuY3Rpb24gLSBUaGlzIGZ1bmN0aW9uIGlzIHVzZWQgZm9yIGVtaXRpbmcgdG8gcGFyZW50IGNvbXBvbmVudFxyXG4gICAqXHJcbiAgICogQHBhcmFtIHsqfSB0eXBlXHJcbiAgICovXHJcbiAgY2hhbmdlVHlwZSh0eXBlOiBhbnkpe1xyXG4gICAgdGhpcy5lbWl0VHlwZUNoYXJ0LmVtaXQodHlwZSk7XHJcbiAgfVxyXG5cclxuICAvKipcclxuICAgKiBDaGFuZ2UgWCBBeGlzIGZ1bmN0aW9uIC0gVGhpcyBmdW5jdGlvbiBpcyB1c2VkIGZvciBlbWl0aW5nIHRvIHBhcmVudCBjb21wb25lbnRcclxuICAgKlxyXG4gICAqIEBwYXJhbSB7Kn0geEF4aXNcclxuICAgKi9cclxuICBjaGFuZ2VYQXhpcyh4QXhpczogYW55KXtcclxuICAgIHRoaXMuZW1pdFhBeGlzLmVtaXQoeEF4aXMpO1xyXG4gIH1cclxuXHJcbiAgLyoqXHJcbiAgICogQ2hhbmdlIERpbWVuc2lvbiBmdW5jdGlvbiAtIFRoaXMgZnVuY3Rpb24gaXMgdXNlZCBmb3IgZW1pdGluZyB0byBwYXJlbnQgY29tcG9uZW50XHJcbiAgICpcclxuICAgKiBAcGFyYW0geyp9IHhBeGlzXHJcbiAgICovXHJcbiAgY2hhbmdlRGltZW5zaW9uKHhBeGlzOiBhbnkpe1xyXG4gICAgdGhpcy5lbWl0RGltZW5zaW9uLmVtaXQoeEF4aXMpO1xyXG4gIH1cclxuXHJcbiAgLyoqXHJcbiAgICogQ2hhbmdlIERlc2NyaXB0aW9uIGZ1bmN0aW9uIC0gVGhpcyBmdW5jdGlvbiBpcyB1c2VkIGZvciBlbWl0aW5nIHRvIHBhcmVudCBjb21wb25lbnRcclxuICAgKlxyXG4gICAqIEBwYXJhbSB7Kn0gZGVzY1xyXG4gICAqL1xyXG4gIGNoYW5nZURlc2MoZGVzYzogYW55KXtcclxuICAgIHRoaXMuY2hhcnREZXNjID0gZGVzYztcclxuICAgIHRoaXMuZW1pdERlc2MuZW1pdChkZXNjKTtcclxuICB9XHJcblxyXG4gIC8qKlxyXG4gICAqIENoYW5nZSBZIEF4aXMgZnVuY3Rpb24gLSBUaGlzIGZ1bmN0aW9uIGlzIHVzZWQgZm9yIGVtaXRpbmcgdG8gcGFyZW50IGNvbXBvbmVudFxyXG4gICAqXHJcbiAgICogQHBhcmFtIHsqfSB5QXhpc1xyXG4gICAqL1xyXG4gIGNoYW5nZVlBeGlzKHlBeGlzOiBhbnkpIHtcclxuICAgIHRoaXMuZW1pdFlBeGlzLmVtaXQoeUF4aXMpO1xyXG4gIH1cclxuXHJcbiAgXHJcbiAgQEhvc3RMaXN0ZW5lcignZG9jdW1lbnQ6Y2xpY2snLCBbJyRldmVudCddKVxyXG4gIG9uQ2xpY2soZXZlbnQ6IE1vdXNlRXZlbnQpe1xyXG4gICAgY29uc3QgdGFyZ2V0ID0gZXZlbnQudGFyZ2V0IGFzIEhUTUxFbGVtZW50O1xyXG4gICAgY29uc3QgY2xpY2tlZEluc2lkZSA9IHRhcmdldC5jbG9zZXN0KCcuZHJhd2VyLXNldHRpbmcnKTtcclxuICAgIGlmKCFjbGlja2VkSW5zaWRlKXtcclxuICAgICAgdGhpcy5vcGVuRHJhd2VyID0gZmFsc2U7XHJcbiAgICB9XHJcbiAgfVxyXG5cclxufVxyXG4iLCJcclxuPGRpdiAqbmdJZj1cInNob3dSb2JvdFwiIGNsYXNzPVwidXNlci1pY29uXCIgPlxyXG4gICAgPGltZyBjbGFzcz1cInVzZXJcIiBzcmM9XCJhc3NldHMvaW1nL2ljb24vY2hhdGdwdC1pY29uLnN2Z1wiIGFsdD1cImNoYXRncHQtaWNvblwiIHRpdGxlPVwiY2hhdGdwdC1pY29uXCIgLz5cclxuPC9kaXY+XHJcbjxkaXYgY2xhc3M9XCJpbnRlcmFjdGlvbi1jb250YWluZXJcIj5cclxuICAgIDxkaXYgY2xhc3M9XCJtZXNzYWdlXCI+XHJcbiAgICAgICAgPGRpdiBjbGFzcz1cIm1zZ19jb250ZW50XCI+XHJcbiAgICAgICAgICAgIDxwPnt7Y2hhcnREZXNjfX08L3A+XHJcbiAgICAgICAgICAgIDxwICpuZ0lmPVwiZGF0ZVRleHQhPScnXCIgY2xhc3M9XCJkYXRlLXRleHRcIj57e2RhdGVUZXh0fX08L3A+XHJcbiAgICAgICAgPC9kaXY+XHJcbiAgICA8L2Rpdj5cclxuICAgIDxkaXYgY2xhc3M9XCJjaGFydC1jb250YWluZXJcIiBbbmdTdHlsZV09XCJ7J2hlaWdodC5weCc6IGNoYXJ0SGVpZ2h0fVwiPlxyXG4gICAgICAgIFxyXG4gICAgICAgIDxkaXYgY2xhc3M9XCJkcmF3ZXItc2V0dGluZ1wiPlxyXG4gICAgICAgICAgICA8YnV0dG9uICpuZ0lmPVwiZGlzcGxheVNldHRpbmdzTWVudVwiIGNsYXNzPVwiZmxvYXQtcmlnaHRcIiAoY2xpY2spPVwib3BlblNldHRpbmcoKVwiID5cclxuICAgICAgICAgICAgICAgIDxpbWcgc3JjPVwiYXNzZXRzL2ltZy9pY29uL21vcmUuc3ZnXCIgYWx0PVwiU2V0dGluZ3NcIiB0aXRsZT1cIlNldHRpbmdzXCIgY2xhc3M9XCJcIiAvPlxyXG4gICAgICAgICAgICA8L2J1dHRvbj5cclxuICAgICAgICAgICAgQGlmKG9wZW5EcmF3ZXIpe1xyXG4gICAgICAgICAgICAgICAgPGxpYi1zZXR0aW5ncy1tZW51IFxyXG4gICAgICAgICAgICAgICAgW3NlbGVjdGVkQ2hhcnRdPVwic2VsZWN0ZWRDaGFydFwiXHJcbiAgICAgICAgICAgICAgICBbY2hhdElkXT1cImNoYXRJZFwiIFxyXG4gICAgICAgICAgICAgICAgW2dyYXBoRGV0YWlsXT1cImdyYXBoRGV0YWlsXCIgXHJcbiAgICAgICAgICAgICAgICBbb3BlblNldHRpbmddPVwib3BlbkRyYXdlclwiXHJcbiAgICAgICAgICAgICAgICAoZW1pdFhBeGlzKT1cImNoYW5nZVhBeGlzKCRldmVudClcIlxyXG4gICAgICAgICAgICAgICAgKGVtaXRUeXBlQ2hhcnQpPVwiY2hhbmdlVHlwZSgkZXZlbnQpXCJcclxuICAgICAgICAgICAgICAgIChlbWl0WUF4aXMpPVwiY2hhbmdlWUF4aXMoJGV2ZW50KVwiXHJcbiAgICAgICAgICAgICAgICAoZW1pdERpbWVuc2lvbik9XCJjaGFuZ2VEaW1lbnNpb24oJGV2ZW50KVwiXHJcbiAgICAgICAgICAgICAgICAoZW1pdERlc2MpPVwiY2hhbmdlRGVzYygkZXZlbnQpXCJcclxuICAgICAgICAgICAgICAgID48L2xpYi1zZXR0aW5ncy1tZW51PlxyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIFxyXG4gICAgICAgIDwvZGl2PlxyXG4gICAgICAgIFxyXG4gICAgICAgIDxjYW52YXMgI2JhckNoYXJ0Q2FudmFzICBoZWlnaHQ9XCIxOTJweFwiPjwvY2FudmFzPlxyXG4gICAgPC9kaXY+XHJcbjwvZGl2PlxyXG5cclxuXHJcbiJdfQ==