import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AssessorComponent } from './assessor.component';

describe('AssessorComponent', () => {
  let component: AssessorComponent;
  let fixture: ComponentFixture<AssessorComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AssessorComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(AssessorComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
