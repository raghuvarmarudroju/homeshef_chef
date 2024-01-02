import { ComponentFixture, TestBed } from '@angular/core/testing';
import { EditItemPage } from './edit-item.page';

describe('EditItemPage', () => {
  let component: EditItemPage;
  let fixture: ComponentFixture<EditItemPage>;

  beforeEach(async(() => {
    fixture = TestBed.createComponent(EditItemPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
