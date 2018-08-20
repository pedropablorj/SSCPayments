const decimals = (value) => {
    const valueFloat = parseFloat(value);
    if(Math.floor(valueFloat) === valueFloat) return 0;
    return value.split('.')[1].length || 0;
};

module.exports = {
    decimals
};
