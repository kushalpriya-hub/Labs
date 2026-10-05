const fs = require("node:fs");
const path = require("node:path");
const vm = require("node:vm");

// Module cache
const cache = {};

function resolvePath(request, fromDir) {
    const basePath = path.resolve(fromDir, request);

    // X.js
    if (fs.existsSync(basePath) && fs.statSync(basePath).isFile()) {
        return basePath;
    }

    // X.js
    if (fs.existsSync(basePath + ".js")) {
        return basePath + ".js";
    }

    // X/index.js
    const indexPath = path.join(basePath, "index.js");

    if (fs.existsSync(indexPath)) {
        return indexPath;
    }

    throw new Error(`Cannot find module '${request}'`);
}

function miniRequire(request, fromDir) {
    // 1. Resolve module path
    const filename = resolvePath(request, fromDir);

    // 2. Check cache
    if (cache[filename]) {
        return cache[filename].exports;
    }

    // 3. Create module
    const module = {
        exports: {}
    };

    // 4. Store in cache BEFORE executing
    cache[filename] = module;

    // 5. Read source code
    const code = fs.readFileSync(filename, "utf8");

    // 6. Create CommonJS wrapper
    const wrapper = `(function (exports, require, module, __filename, __dirname) {
${code}
})`;

    // 7. Convert wrapper string into function
    const compiledWrapper = vm.runInThisContext(wrapper, {
        filename: filename
    });

    // 8. Create require function for this module
    const localRequire = (request) => {
        return miniRequire(request, path.dirname(filename));
    };

    // 9. Execute wrapper
    compiledWrapper(
        module.exports,
        localRequire,
        module,
        filename,
        path.dirname(filename)
    );

    // 10. Return module.exports
    return module.exports;
}

module.exports = miniRequire;