import { ComponentFixture, TestBed } from '@angular/core/testing';

import { IndexCategoriesComponent } from './index-categories.component';

describe('IndexCategoriesComponent', () => {
  let component: IndexCategoriesComponent;
  let fixture: ComponentFixture<IndexCategoriesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ IndexCategoriesComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(IndexCategoriesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
