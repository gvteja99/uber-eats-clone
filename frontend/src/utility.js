export const capsStrFirstChar = (str) => {
    return str?.charAt(0).toUpperCase() + str?.slice(1);
}


export const random = (min, max) => { // min and max included 
    return Math.floor(Math.random() * (max - min + 1) + min)
}
  