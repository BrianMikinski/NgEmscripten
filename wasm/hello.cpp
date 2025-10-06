#include <emscripten/emscripten.h>
#include <stdio.h>

#ifdef __cplusplus
extern "C" {
#endif

EMSCRIPTEN_KEEPALIVE
int add(int a, int b) {
    return a + b;
}

EMSCRIPTEN_KEEPALIVE
const char* getGreeting() {
    return "Hello from WebAssembly!";
}

EMSCRIPTEN_KEEPALIVE
void printHello() {
    printf("Hello, World from C++!\n");
}

#ifdef __cplusplus
}
#endif
