import { applyMiddleware, createStore } from 'redux';
import { reducers} from './../src/app/store';

export const testStore = (initialState) => {
    const createStoreWithMiddleware = applyMiddleware()(createStore);
    return createStoreWithMiddleware(reducers, initialState);
};

export const capsStrFirstChar = (str) => {
    return str?.charAt(0).toUpperCase() + str?.slice(1);
}


export const random = (min, max) => { // min and max included 
    return Math.floor(Math.random() * (max - min + 1) + min)
}

export const getOrderStatus = (num) => {
    const options = [ 'recieved', 'preparing', 'on the way', 'delivered', 'pickup_ready', 'picked_up', 'cancelled']
    return options[num-1]
}

export const isValidEmail = (email) => {
    var re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/; //eslint-disable-line
    // console.log('Email validity', re.test(String(email).toLowerCase()));
    return re.test(String(email).toLowerCase());
}

// export const 
  