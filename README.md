# NgEmscripten

Proof of Concept: Integrating C++ via WebAssembly and Emscripten with Angular 20

![Demo Screenshot](https://github.com/user-attachments/assets/36f2b68a-1907-4a39-895d-d2173ecee3a1)

This repository demonstrates how to compile C++ code to WebAssembly using Emscripten and integrate it with an Angular 20 web application.

## 📁 Project Structure

```
NgEmscripten/
├── wasm/                      # WebAssembly source code
│   ├── hello.cpp             # C++ source with exported functions
│   ├── hello.js              # Emscripten-generated JavaScript glue code
│   └── hello.wasm            # Compiled WebAssembly binary
└── ng-wasm-app/              # Angular 20 application
    ├── public/wasm/          # WebAssembly assets served by Angular
    └── src/app/
        ├── wasm-loader.ts    # Service to load WebAssembly modules
        ├── app.ts            # Main component using WASM
        └── app.html          # UI displaying WASM function results
```

## 🚀 Features

This PoC demonstrates three types of C++ functions called from Angular:

1. **getGreeting()** - Returns a string from C++
2. **add(a, b)** - Performs arithmetic in C++ and returns result
3. **printHello()** - Outputs to browser console from C++

## 📋 Prerequisites

- Node.js 20+ and npm
- Emscripten SDK (emcc)
- Angular CLI 20+

### Installing Emscripten

**On Ubuntu/Debian:**
```bash
sudo apt-get install emscripten
```

**On macOS:**
```bash
brew install emscripten
```

**Using Emscripten SDK:**
```bash
git clone https://github.com/emscripten-core/emsdk.git
cd emsdk
./emsdk install latest
./emsdk activate latest
source ./emsdk_env.sh
```

## 🔨 Building the Project

### Step 1: Compile C++ to WebAssembly

```bash
cd wasm
emcc hello.cpp -o hello.js \
  -s EXPORTED_FUNCTIONS='["_add","_getGreeting","_printHello"]' \
  -s EXPORTED_RUNTIME_METHODS='["ccall","cwrap","UTF8ToString"]' \
  -s MODULARIZE=1 \
  -s EXPORT_NAME='createHelloModule' \
  -s ENVIRONMENT='web'
```

This generates two files:
- `hello.js` - JavaScript glue code
- `hello.wasm` - WebAssembly binary

### Step 2: Copy WASM files to Angular app

```bash
cp hello.js hello.wasm ../ng-wasm-app/public/wasm/
```

### Step 3: Install Angular dependencies

```bash
cd ../ng-wasm-app
npm install
```

### Step 4: Run the Angular application

**Development server:**
```bash
npm start
```
Then open http://localhost:4200/

**Production build:**
```bash
npm run build
```
The build artifacts will be in `dist/ng-wasm-app/browser/`

## 🔧 How It Works

### C++ Side (hello.cpp)

The C++ code uses Emscripten's `EMSCRIPTEN_KEEPALIVE` macro to export functions:

```cpp
#include <emscripten/emscripten.h>

EMSCRIPTEN_KEEPALIVE
int add(int a, int b) {
    return a + b;
}
```

### Angular Side (app.ts)

The Angular component loads the WASM module using a service and calls the exported functions:

```typescript
const module = await this.wasmLoader.loadModule();
const sum = module.ccall('add', 'number', ['number', 'number'], [5, 7]);
```

### Integration Service (wasm-loader.ts)

The service dynamically loads the Emscripten-generated JavaScript, which in turn loads the WebAssembly binary:

```typescript
loadModule(): Promise<any> {
  const script = document.createElement('script');
  script.src = 'wasm/hello.js';
  // ... handles module initialization
}
```

## 📚 Resources

- [WebAssembly Overview](https://developer.mozilla.org/en-US/docs/WebAssembly)
- [Emscripten Documentation](https://emscripten.org/)
- [Compiling C to WebAssembly](https://developer.mozilla.org/en-US/docs/WebAssembly/Guides/C_to_Wasm)
- [Angular Documentation](https://angular.dev/)

## 📄 License

MIT License - see [LICENSE](LICENSE) file for details
