/* tslint:disable:no-unused-variable */
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { DebugElement } from '@angular/core';

import { OmniauthComponent } from './omniauth.component';

describe('OmniauthComponent', () => {
  let component: OmniauthComponent;
  let fixture: ComponentFixture<OmniauthComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ OmniauthComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(OmniauthComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});