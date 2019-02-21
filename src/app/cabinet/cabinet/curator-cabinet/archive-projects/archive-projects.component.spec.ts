import {async, ComponentFixture, TestBed} from '@angular/core/testing';

import {ArchiveProjectsComponent} from './archive-projects.component';

describe('ArchiveProjectsComponent', () => {
  let component: ArchiveProjectsComponent;
  let fixture: ComponentFixture<ArchiveProjectsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ArchiveProjectsComponent]
    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ArchiveProjectsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
