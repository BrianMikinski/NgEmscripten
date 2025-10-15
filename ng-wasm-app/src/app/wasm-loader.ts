import { Injectable } from '@angular/core';

interface HelloModule {
  ccall: (
    ident: string,
    returnType: string | null,
    argTypes: string[],
    args: unknown[]
  ) => any;
  UTF8ToString: (ptr: number) => string;
}

declare global {
  interface Window {
    createHelloModule?: () => Promise<HelloModule>;
  }
}

@Injectable({
  providedIn: 'root'
})
export class WasmLoader {
  private module: HelloModule | null = null;
  private moduleReady: Promise<HelloModule> | null = null;

  loadModule(): Promise<HelloModule> {
    if (this.moduleReady) {
      return this.moduleReady;
    }

    this.moduleReady = new Promise((resolve, reject) => {
      const script = document.createElement('script');
      script.src = 'wasm/hello.js';
      script.onload = () => {
        if (window.createHelloModule) {
          window.createHelloModule().then((module) => {
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

  getModule(): HelloModule | null {
    return this.module;
  }
}
