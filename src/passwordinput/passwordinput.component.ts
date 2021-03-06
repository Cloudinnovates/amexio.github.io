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

import {Input, OnInit, forwardRef, Component, AfterViewInit} from "@angular/core";
import {ControlValueAccessor, NG_VALUE_ACCESSOR} from "@angular/forms";
import {FormInputBase} from "../baseclass/form.base.class";
declare var $;
const noop = () => {
};

export const CUSTOM_PASSWORD_INPUT_CONTROL_VALUE_ACCESSOR: any = {
    provide: NG_VALUE_ACCESSOR,
    useExisting: forwardRef(() => PasswordInputComponent),
    multi: true
};

export const BASE_IMPL_PASSWORD_INPUT : any = {
  provide : FormInputBase,
  useExisting: forwardRef(() => PasswordInputComponent)
};

@Component({
    selector: 'amexio-password-input',
    template : `

        <div [attr.class]="divCss">

            <ng-container *ngIf="hasLabel">
                <label [attr.for]="elementId"
                       [style.font-style]="fontStyle"
                       [style.font-family]="fontFamily"
                       [style.font-size]="fontSize"
                       class="control-label">
                    {{fieldLabel}}
                </label>
            </ng-container>

            <input type="password"
                   (blur)="onBlur()"
                   autocomplete="off"
                   class="form-control"
                   [(ngModel)]="value"
                   [attr.fieldName] = "fieldName"
                   [attr.id]="elementId"
                   [attr.placeholder]="placeholder"
                   [attr.max]="maxLength"
                   [attr.min]="minLength"
                   [attr.disabled] = "disabled ? true: null"
                   [required]="allowBlank ? true: null"
                   [attr.data-error]="errorMsg"
                   [attr.aria-describedby]="spanId"
                   [attr.data-toggle]="popoverField" title="Info" [attr.data-placement]="popoverPlacement"  data-trigger="focus"  data-html="true"  [attr.data-content]="helpInfoMsg"
            >

            <ng-container *ngIf="iconFeedBack">
                <span [attr.class]="iconClassName" aria-hidden="true"></span>
                <span [attr.id]="spanId" class="sr-only">({{iconName}})</span>
            </ng-container>

            <ng-container *ngIf="!iconFeedBack">
                <i [class]="fieldglyphIcon"></i>
            </ng-container>

            <div class="help-block with-errors"></div>

        </div>

    `,
    providers : [CUSTOM_PASSWORD_INPUT_CONTROL_VALUE_ACCESSOR,BASE_IMPL_PASSWORD_INPUT],
    styles : [`/**
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

export class PasswordInputComponent extends FormInputBase implements OnInit,ControlValueAccessor,AfterViewInit {



    constructor() {
      super();
      this.elementId = 'input-text-' + Math.floor(Math.random()*90000) + 10000;
      this.spanId = 'span-msg-'+ Math.random();

      if(this.iconFeedBack)
        this.divCss = 'form-group has-feedback';
      else
        this.divCss = 'form-group has-feedback has-feedback-custom';
    }

    ngOnInit() {
        if(this.errorMsg)
            this.helpInfoMsg = this.errorMsg +'<br/>';

        if(this.minErrorMsg)
            this.helpInfoMsg = this.helpInfoMsg + 'Min Length: '+this.minErrorMsg+'<br/>';

        if(this.maxErrorMsg)
            this.helpInfoMsg = this.helpInfoMsg + 'Max Length: '+this.maxErrorMsg;

        if(!this.iconFeedBack)
            this.fieldglyphIcon = 'form-control-feedback glyphicon glyphicon-'+this.fieldIcon;

        //Regex check
        if(this.pattern !=null){
            this.regEx = new RegExp(this.pattern);
        }
        if (this.enablePopOver) {
          this.popoverField = 'popover';
        }
        if(this.popoverPlacement == null){
            this.popoverPlacement = 'bottom';
        }

    }

    ngAfterViewInit(){
        $('[data-toggle="popover"]').popover();
    }

    //The internal dataviews model
    private innerValue: any = '';

    //Placeholders for the callbacks which are later provided
    //by the Control Value Accessor
    private onTouchedCallback: () => void = noop;
    private onChangeCallback: (_: any) => void = noop;

    //get accessor
    get value(): any {
        return this.innerValue;
    };

    //set accessor including call the onchange callback
    set value(v: any) {
        if (v !== this.innerValue) {
            this.innerValue = v;
            this.onChangeCallback(v);
        }
    }

    //Set touched on blur
    onBlur() {
        this.onTouchedCallback();
        this.validate();
    }

    //From ControlValueAccessor interface
    writeValue(value: any) {
        if (value !== this.innerValue) {
            this.innerValue = value;
        }
    }

    //From ControlValueAccessor interface
    registerOnChange(fn: any) {
        this.onChangeCallback = fn;
    }

    //From ControlValueAccessor interface
    registerOnTouched(fn: any) {
        this.onTouchedCallback = fn;
    }


    validate(){
        this.isValid = this.isValidInput();

    }

    isValidInput(){
        var hasError = false;
        if(this.value != null){
            if((this.allowBlank && (!this.value || this.value.length==0))){
                hasError = true;
            }else if(this.minLength > this.value.length){
                hasError = true;
            }else if(this.maxLength < this.value.length){
                hasError = true;
            }
            else if(this.pattern != null && !this.regEx.test(this.value)){
                hasError = true;
            }
            if(hasError){
                this.setValidClassNames();
            }else{
                this.setInvalidatedClassNames();
            }
        }

        return hasError;
    }


    setValidClassNames(){
      this.divCss = 'form-group has-error has-feedback';
      this.iconName = 'error';
      this.iconClassName = 'glyphicon glyphicon-remove form-control-feedback';
    }

    setInvalidatedClassNames(){
      this.divCss = 'form-group has-success has-feedback';
      this.iconName = 'success';
      this.iconClassName = 'glyphicon glyphicon-ok form-control-feedback';
    }

}
