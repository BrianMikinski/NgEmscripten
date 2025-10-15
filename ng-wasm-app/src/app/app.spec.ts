import { TestBed } from '@angular/core/testing';
import { App } from './app';

// Note: WebAssembly loading tests require e2e testing environment
// as the WASM files need to be served by a web server
describe('App', () => {
  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [App],
    }).compileComponents();
  });

  it('should create the app', () => {
    const fixture = TestBed.createComponent(App);
    const app = fixture.componentInstance;
    expect(app).toBeTruthy();
  });

  it('should have title signal', () => {
    const fixture = TestBed.createComponent(App);
    const app = fixture.componentInstance;
    expect(app['title']()).toBe('ng-wasm-app');
  });
});
