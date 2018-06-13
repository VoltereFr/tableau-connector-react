import React from 'react';
import { shallow , configure } from 'enzyme'
import Adapter from 'enzyme-adapter-react-16';
import BraincubeSelector from '../../../../src/components/Selectors/BraincubeSelector/BraincubeSelector';

configure({ adapter: new Adapter() });
describe('<BraincubeSelector />', () => {
    let selector;
    let onChangeSpy;
    beforeEach(() => {
        onChangeSpy = jest.fn();
        const list = [{id:'test1', value:'1'}, {id:'test2', value:'2'}, {id:'test3', value:'3'}];
        selector = shallow(<BraincubeSelector onChange={onChangeSpy} tab={list} />);
    });

    it('Should call func on change', () => {
        selector.simulate('change');
        expect(onChangeSpy).toHaveBeenCalledTimes(1);
    });

    it('Should display the right list', () => {
        // expect(selector.find('select')).toEqual(3);
        expect(selector.find('select')).toHaveLength(1);
        expect(selector.find('input')).toHaveLength(0);
    });
});