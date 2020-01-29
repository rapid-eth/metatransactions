function setMetaType(object, type) {
    Object.defineProperty(object, '_ethersMetaType', { configurable: false, value: type, writable: false });
}
exports.setMetaType = setMetaType;
function isMetaType(object, type) {
    return (object && object._ethersMetaType === type);
}
exports.isMetaType = isMetaType;
