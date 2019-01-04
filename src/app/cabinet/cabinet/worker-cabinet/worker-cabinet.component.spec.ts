import {async, ComponentFixture, TestBed} from '@angular/core/testing';

import {WorkerCabinetComponent} from './worker-cabinet.component';

describe('WorkerCabinetComponent', () => {
  let component: WorkerCabinetComponent;
  let fixture: ComponentFixture<WorkerCabinetComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ WorkerCabinetComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(WorkerCabinetComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
