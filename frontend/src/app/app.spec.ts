import { TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';
import { App } from './app';
import { routes } from './app.routes';

describe('App', () => {
  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [App],
      providers: [provideRouter(routes)],
    }).compileComponents();
  });

  it('should create the app', () => {
    const fixture = TestBed.createComponent(App);
    expect(fixture.componentInstance).toBeTruthy();
  });

  it('should render the Calvin brand in the header', async () => {
    const fixture = TestBed.createComponent(App);
    await fixture.whenStable();
    const compiled = fixture.nativeElement as HTMLElement;
    expect(compiled.querySelector('.clv-brand__text strong')?.textContent).toContain('Calvin');
  });

  it('should render the main navigation entries by entity', () => {
    const fixture = TestBed.createComponent(App);
    fixture.detectChanges();
    const navText = (fixture.nativeElement as HTMLElement).querySelector('.clv-nav')?.textContent ?? '';
    expect(navText).toContain('Räume finden');
    expect(navText).toContain('Standorte');
    expect(navText).toContain('Meine Buchungen');
  });
});
