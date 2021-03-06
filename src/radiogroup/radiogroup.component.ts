/*
 * Copyright 2016-2017 the original author or authors.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *      http://www.apache.org/licenses/LICENSE-2.0
 *
 * Author - Ketan Gote, Pratik Kelwalkar, Dattaram Gawas
 *
 */

import {OnInit, SimpleChange, Input, Output, EventEmitter, Component} from "@angular/core";
import {CommonHttpService} from "../common.http.service";

export const COLUMN_SIZE = 'col-lg-';
@Component({
    selector : 'amexio-radio-group',
    template : `

        <ng-container  *ngIf="enableBoxStyle">
            <div class="form-group">
                <br>
                <label  [attr.for]="elementId">{{fieldLabel}}</label>

                <div class="" [ngClass]="{'row':column || column!='','list-group':!column ||column==''}">
                    <li class="list-group-item col-sm-12" *ngIf="searchBox"><span class="col-sm-12">
              <input [(ngModel)]="textValue" type="text" class="form-control" placeholder="Please select" (keyup)="filterData($event)">
            </span></li>
                    <li class="list-group-item" [ngClass]="calculatedColSize"  *ngFor="let row of viewData;let i = index">
                        <label class="custom-control custom-radio">
                            <input class="custom-control-input" [attr.id]="elementId+'CNT'+i" type="radio" [required]="allowBlank ? true: null"  [attr.name] = "fieldName" (click)="setSelectedRadio(row)">
                            <span class="custom-control-indicator"></span>
                            <span class="custom-control-description">{{row[displayField]}}</span>
                        </label>
                    </li>
                </div>

            </div>
        </ng-container>

        <ng-container *ngIf="!enableBoxStyle">
            <div class="form-group">
                <br>
                <label  [attr.for]="elementId">{{fieldLabel}}</label>

                <div class="" [ngClass]="{'row':column || column!='','list-group':!column ||column==''}">
            <span class="col-sm-12" *ngIf="searchBox"><span class="col-sm-12">
              <input [(ngModel)]="textValue" type="text" class="form-control" placeholder="Please select" (keyup)="filterData($event)">
            </span></span>
                    <span class="" [ngClass]="calculatedColSize"  *ngFor="let row of viewData;let i = index">
              <label class="custom-control custom-radio">
                <input class="custom-control-input" [attr.id]="elementId+'CNT'+i" type="radio" [required]="allowBlank ? true: null"  [attr.name] = "fieldName" (click)="setSelectedRadio(row)">
                <span class="custom-control-indicator"></span>
                <span class="custom-control-description">{{row[displayField]}}</span>
              </label>
            </span>
                </div>

            </div>
        </ng-container>



    `,
    styles: [`/**
 A Style Sheet for all form inputs common used classes
 */

    /** Form Validations & Icon Positioning **/
    .has-feedback-custom {
        position: relative;
    }
    .has-feedback-custom .form-control {
        padding-right: 47.5px;
    }

    .form-control-feedback-custom {
        position: absolute;
        top: 0;
        right: 0;
        z-index: 2;
        display: block;
        width: 38px;
        height: 38px;
        line-height: 38px;
        text-align: center;
        pointer-events: none;
    }

    .has-feedback-custom label ~ .form-control-feedback-custom {
        top: 32px;
    }
    .has-feedback-custom label.sr-only ~ .form-control-feedback-custom {
        top: 0;
    }`]
})

export class RadioGroupComponent implements  OnInit{

    @Input()    enableBoxStyle: boolean = false;

    @Input()    fieldLabel : string;

    @Input()    fieldName : string;

    @Input()    allowBlank : boolean;

    @Input()    dataReader : string;

    @Input()    httpMethod : string;

    @Input()    httpUrl : string;

    @Input()    displayField : string;

    @Input()    valueField : string;

    @Input()    radioGroupBindData : any;

    @Input()    searchBox : boolean;

    @Input()    column: string;

    @Output()   selectedValue : any = new EventEmitter<any>();

    elementId : string;

    data : any[];

    viewData : any[];

    textValue : string;

    responseData : any;

    calculatedColSize : any;


    constructor(private amxHttp: CommonHttpService) {
        this.elementId = "radio-group-"+Math.floor(Math.random()*90000) + 10000;

    }

    ngOnInit() {
        this.calculatedColSize = COLUMN_SIZE+this.column;
        if(this.httpMethod && this.httpUrl){
            this.amxHttp.fetchData(this.httpUrl,this.httpMethod).subscribe(
                response=>{
                    this.responseData = response.json();
                },
                error=>{
                },
                ()=>{
                    this.setData(this.responseData);
                }
            );
        }else if(this.radioGroupBindData){
            this.setData(this.radioGroupBindData);
        }
    }

    ngAfterViewInit(){

    }

    setData(httpResponse: any){
        this.data = this.getResponseData(httpResponse);
        this.viewData = this.getResponseData(httpResponse);
    }


    getResponseData(httpResponse : any){
        let responsedata = httpResponse;
        if(this.dataReader != null){
            let dr = this.dataReader.split(".");
            if(dr!=null){
                for(let ir = 0 ; ir<dr.length; ir++){
                    responsedata = responsedata[dr[ir]];
                }
            }
        }
        else{
            responsedata = httpResponse;
        }

        return responsedata;
    }

    filterData(event : any){
        if(this.textValue.length>0){
            this.viewData = [];
            for(let vd = 0 ; vd<this.data.length;vd++){
                let displayData = this.data[vd][this.displayField];
                if(displayData.toLowerCase().startsWith(this.textValue)){
                    this.viewData.push(this.data[vd]);
                }
            }
        }else{
            this.viewData = this.data;
        }

    }

    setSelectedRadio(rowData: any) {
        this.selectedValue.emit(rowData);
    }
}
