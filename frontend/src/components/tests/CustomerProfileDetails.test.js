import React from 'react';
import { shallow, mount, render } from 'enzyme';

import CustomerProfileDetails from '../CustomerProfileDetails';

describe('Our test suite', () => {

    it('renders restaurant name', () => {
        const location = {
            state: {
                customer: {
                    first_name: "Ayush",
                    last_name: "Gupta",
                    email: "aygupta@gmail.com",
                    profile_pic: ""
                }
            }
        }
        const wrapper = shallow(<CustomerProfileDetails location={location} />);

        expect(wrapper.find('.email').length).toEqual(1);
    });

});