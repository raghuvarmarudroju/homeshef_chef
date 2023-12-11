import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { ChefComponent } from './chef.component';

describe('ChefComponent', () => {
  let component: ChefComponent;
  let fixture: ComponentFixture<ChefComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ChefComponent ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(ChefComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
