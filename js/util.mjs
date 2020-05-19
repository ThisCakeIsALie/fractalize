export const randomChoice = list => {
    return list[Math.floor(Math.random() * list.length)];
};

export const download = (name, file) => {
    const linkElem = document.createElement('a');
    linkElem.setAttribute('download', name);
    linkElem.setAttribute('href', file);
    linkElem.click();
};