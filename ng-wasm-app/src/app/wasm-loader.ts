import { Injectable } from '@angular/core';

declare global {
  interface Window {
    createHelloModule: any;
  }
}

@Injectable({
  providedIn: 'root'
})
export class WasmLoader {
  private module: any = null;
  private moduleReady: Promise<any> | null = null;

  loadModule(): Promise<any> {
    if (this.moduleReady) {
      return this.moduleReady;
    }

    this.moduleReady = new Promise((resolve, reject) => {
      const script = document.createElement('script');
      script.src = 'wasm/hello.js';
      script.onload = () => {
        if (window.createHelloModule) {
          window.createHelloModule().then((module: any) => {
            this.module = module;
            resolve(module);
          }).catch(reject);
        } else {
          reject(new Error('createHelloModule not found'));
        }
      };
      script.onerror = reject;
      document.body.appendChild(script);
    });

    return this.moduleReady;
  }

  getModule(): any {
    return this.module;
  }
}
