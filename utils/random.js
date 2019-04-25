module.exports = (min, max) => {
    console.log(this);
    const rand = Math.round(
        min - 0.5 + Math.random() * (max - min + 1)
    );
    
    return rand;
};