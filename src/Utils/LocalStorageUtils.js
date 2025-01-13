export const saveMapToLocalStorage = (map) => {
    const mapObject = Object.fromEntries(map);
    localStorage.setItem('questionHintMap', JSON.stringify(mapObject));
};

export const getMapFromLocalStorage = () => {
    const mapObject = JSON.parse(localStorage.getItem('questionHintMap'));
    return new Map(Object.entries(mapObject));
};