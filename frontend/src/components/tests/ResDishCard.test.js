import React from 'react';
import { shallow, mount, render } from 'enzyme';

import ResDishCard from '../ResDishCard';

const addToCartClick = jest.fn();

const props = {
    dish: {},
    res: {},
    onAddToCartClick: addToCartClick
}


describe('Res Name present', () => {

    it('renders restaurant name', () => {
        const wrapper = shallow(<ResDishCard {...props} />);

        expect(wrapper.find('.dishName').exists()).toBe(true);
    });
});


describe('Go to Res Menu fn called', () => {

    it('Should call removeItem function when clicked', ()=>{
        const wrapper = shallow(<ResDishCard {...props} />);
        wrapper.find('#addCartBtn').simulate('click');
        expect(addToCartClick).toHaveBeenCalled();
    })
});