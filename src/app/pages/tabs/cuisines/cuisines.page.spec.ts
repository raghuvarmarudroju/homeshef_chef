import { ComponentFixture, TestBed } from '@angular/core/testing';
import { CuisinesPage } from './cuisines.page';

describe('CuisinesPage', () => {
  let component: CuisinesPage;
  let fixture: ComponentFixture<CuisinesPage>;

  beforeEach(async(() => {
    fixture = TestBed.createComponent(CuisinesPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
