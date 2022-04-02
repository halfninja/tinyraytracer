
export function log(...args) {
    console.log(...args);
}

export function success(...args) {
    return log('🎉', ...args);
}

export function failure(...args) {
    return log('🥒', ...args);
}