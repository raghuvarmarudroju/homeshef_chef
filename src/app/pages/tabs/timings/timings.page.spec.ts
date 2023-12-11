import { ComponentFixture, TestBed } from '@angular/core/testing';
import { TimingsPage } from './timings.page';

describe('TimingsPage', () => {
  let component: TimingsPage;
  let fixture: ComponentFixture<TimingsPage>;

  beforeEach(async(() => {
    fixture = TestBed.createComponent(TimingsPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
