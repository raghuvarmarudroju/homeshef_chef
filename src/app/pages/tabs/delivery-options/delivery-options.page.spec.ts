import { ComponentFixture, TestBed } from '@angular/core/testing';
import { DeliveryOptionsPage } from './delivery-options.page';

describe('DeliveryOptionsPage', () => {
  let component: DeliveryOptionsPage;
  let fixture: ComponentFixture<DeliveryOptionsPage>;

  beforeEach(async(() => {
    fixture = TestBed.createComponent(DeliveryOptionsPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
