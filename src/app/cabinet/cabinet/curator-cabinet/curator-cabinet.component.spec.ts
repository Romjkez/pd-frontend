import {async, ComponentFixture, TestBed} from '@angular/core/testing';

import {CuratorCabinetComponent} from './curator-cabinet.component';

describe('CuratorCabinetComponent', () => {
  let component: CuratorCabinetComponent;
  let fixture: ComponentFixture<CuratorCabinetComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CuratorCabinetComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CuratorCabinetComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
