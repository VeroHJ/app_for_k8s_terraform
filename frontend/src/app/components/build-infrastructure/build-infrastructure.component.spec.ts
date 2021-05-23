import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BuildInfrastructureComponent } from './build-infrastructure.component';

describe('BuildInfrastructureComponent', () => {
  let component: BuildInfrastructureComponent;
  let fixture: ComponentFixture<BuildInfrastructureComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ BuildInfrastructureComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(BuildInfrastructureComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
