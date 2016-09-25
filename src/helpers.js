"use strict";

function object_has(source, key) {
    var keys = key.split(".");

    while (keys.length > 0) {
        var segment = keys.shift();

        if (typeof source[segment] === "undefined") {
            return false;
        }

        source = source[segment];
    }

    return true;
}

function object_get(source, key, defaultValue) {
    var keys = key.split("."),
        value = source;

    while (keys.length > 0) {
        var segment = keys.shift();

        if (typeof value[segment] === "undefined") {
            return defaultValue;
        }

        value = value[segment];
    }

    return value;
}

function object_set(source, key, value) {
    var keys = key.split(".");

    while (keys.length > 1) {
        var segment = keys.shift();

        if (typeof source[segment] !== "object") {
            source[segment] = {};
        }

        source = source[segment];
    }

    source[keys.shift()] = value;
}

function object_forget(source, key) {
    var keys = key.split(".");

    while (keys.length > 1) {
        var segment = keys.shift();

        if (typeof source[segment] !== "object") {
            source[segment] = {};
        }

        source = source[segment];
    }

    delete source[keys.shift()];
}

function object_merge(object, data) {
    for (var k in data) {
        object[k] = data[k];
    }
}

function object_extend(object, data) {
    if (typeof data === "object") {
        for (var k in data) {
            if (typeof object[k] === "object") {
                object_extend(object[k], data[k]);
            } else if (typeof object[k] === "undefined") {
                object[k] = data[k];
            }
        }
    }
}

function async(fn) {
    var generator = fn.apply(this, arguments);

    return new Promise((resolve, reject) => {
        function step(key, data) {
            try {
                var generated = generator[key](data);
                var value = generated.value;
            } catch (error) {
                reject(error);

                return;
            }

            if (generated.done) {
                resolve(value);
            } else {
                return Promise.resolve(value).then((value) => {
                    return step("next", value);
                }, function (error) {
                    return step("throw", error);
                });
            }
        }

        return step("next");
    });
}

function trim(string, char = " ") {
    string = trim_start(string, char);
    string = trim_end(string, char);

    return string;
}

function trim_start(string, char = " ") {
    if (string.charAt(0) == char) {
        string = string.substr(1, string.length - 1);
    }

    return string;
}

function trim_end(string, char = " ") {
    if (string.charAt(string.length - 1) == char) {
        string = string.substr(0, string.length - 1);
    }

    return string;
}

export {
    object_has,
    object_get,
    object_set,
    object_forget,
    object_merge,
    object_extend,
    async,
    trim,
    trim_start,
    trim_end
};