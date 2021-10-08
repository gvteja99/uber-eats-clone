import React from 'react';
import { shallow } from 'enzyme';

import RestaurantCard from '../RestaurantCard';

describe('Res Name present', () => {

    it('renders restaurant name', () => {
        const wrapper = shallow(<RestaurantCard res={{name: "Avacado"}} />);

        expect(wrapper.find('.resName').exists()).toBe(true);
    });
});


describe('Go to Res Menu fn called', () => {

    it('Should call removeItem function when clicked', ()=>{
        const onResItemClick = jest.fn();
        const wrapper = shallow(<RestaurantCard res={{name: "Avacado"}} onResClick={onResItemClick}/>);
        wrapper.find('#resMenu').simulate('click');
        expect(onResItemClick).toHaveBeenCalled();
    })
});