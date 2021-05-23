import { ComponentFixture, TestBed } from '@angular/core/testing';

import { K8sStatusComponent } from './k8s-status.component';

describe('K8sStatusComponent', () => {
  let component: K8sStatusComponent;
  let fixture: ComponentFixture<K8sStatusComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ K8sStatusComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(K8sStatusComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
