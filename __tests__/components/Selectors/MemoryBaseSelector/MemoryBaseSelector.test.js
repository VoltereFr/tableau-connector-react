import React from 'react';
import { shallow , configure } from 'enzyme'
import Adapter from 'enzyme-adapter-react-16';
import MemoryBaseSelector from '../../../../src/components/Selectors/MemoryBaseSelector/MemoryBaseSelector';
import ComboBox from '@braincube/react-components/lib/ComboBox';

configure({ adapter: new Adapter() });
describe('<MemoryBaseSelector />', () => {
    let selector;
    let onChangeSpy;
    beforeEach(() => {
        onChangeSpy = jest.fn();
        const list = {1:'test1', 2:'test2', 3:'test3'};
        selector = shallow(<MemoryBaseSelector onChange={onChangeSpy} tab={list} />);
    });

    it('Should display the right list', () => {
        expect(selector.find(ComboBox).props().options).toEqual(
            [{"label": "test1", "value": "1"}, {"label": "test2", "value": "2"}, {"label": "test3", "value": "3"}]
        );
    });

    it('Should select the right value', () => {
        expect(selector.find(ComboBox).props().selectedValue).toEqual(
            "1"
        );
    });

    it('Should call func on change', () => {
        selector.simulate('change');
        expect(onChangeSpy).toHaveBeenCalledTimes(1);
    });
});