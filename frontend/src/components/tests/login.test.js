import React from 'react';
import { shallow, mount, render } from 'enzyme';

import Login from '../login';
import { testStore} from '../../utility';
import { Provider } from 'react-redux';

describe('Login Test Suite', () => {
    const store = testStore({});

    it('should render the form', () => {
        const wrapper = mount(
            <Provider store={store}>
                <Login />
            </Provider>
        )

        expect(wrapper.find('.signIn').exists()).toBe(true);
    })
})