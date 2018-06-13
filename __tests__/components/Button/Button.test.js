import React from 'react';
import { shallow , configure } from 'enzyme'
import Adapter from 'enzyme-adapter-react-16';
import Button from '../../../src/components/Button/Button';

configure({ adapter: new Adapter() });
describe('<Button />', () => {
    let onClickSpy;
    let content;
    let disable;
    beforeEach(() => {
        onClickSpy = jest.fn();
        content = shallow(<Button onClick={onClickSpy} text={'test'} disable={false} />);
        disable = shallow(<Button onClick={onClickSpy} text={'test'} disable={true} />);
    });

    it('Should set isHover state to true when mouseover and to false when mouseout', () => {
        content.simulate('mouseover');
        expect(content.state().over).toBeTruthy();

        content.simulate('mouseout');
        expect(content.state().over).toBeFalsy();
    });

    it('Know how to click', () => {
        content.simulate('click');
        expect(onClickSpy).toHaveBeenCalledTimes(1);
    });

    it('Sould by disable when the props is true', () => {
        expect(content.find('button').props().disabled).toBeFalsy();
        expect(disable.find('button').props().disabled).toBeTruthy();
    });

    it('Sould have the right text', () => {
        expect(content.find('button').text()).toEqual('test');
    });
});
