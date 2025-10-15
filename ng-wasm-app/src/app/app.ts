import { Component, signal } from '@angular/core';
import { WasmLoader } from './wasm-loader';

@Component({
  selector: 'app-root',
  imports: [],
  templateUrl: './app.html',
  styleUrl: './app.css'
})
export class App {
  protected readonly title = signal('ng-wasm-app');
  protected readonly greeting = signal<string>('');
  protected readonly addResult = signal<number | null>(null);
  protected readonly isLoading = signal<boolean>(true);
  protected readonly error = signal<string>('');

  constructor(private wasmLoader: WasmLoader) {
    this.loadWasm();
  }

  private async loadWasm() {
    try {
      const module = await this.wasmLoader.loadModule();
      this.isLoading.set(false);

      // Call the getGreeting function
      const greetingPtr = module.ccall('getGreeting', 'number', [], []);
      const greeting = module.UTF8ToString(greetingPtr);
      this.greeting.set(greeting);

      // Call the add function
      const sum = module.ccall('add', 'number', ['number', 'number'], [5, 7]);
      this.addResult.set(sum);

      // Call printHello (outputs to console)
      module.ccall('printHello', null, [], []);
    } catch (err) {
      this.isLoading.set(false);
      this.error.set('Failed to load WebAssembly module: ' + err);
      console.error('Error loading WASM:', err);
    }
  }
}
