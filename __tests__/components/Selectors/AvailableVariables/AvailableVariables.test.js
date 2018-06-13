import React from 'react';
import { shallow , configure } from 'enzyme'
import Adapter from 'enzyme-adapter-react-16';
import AvailableVariables from '../../../../src/components/Selectors/AvailableVariables/AvailableVariables';
import ListBox from '@braincube/react-components/lib/ListBox';

configure({ adapter: new Adapter() });
describe('<AvailableVariables />', () => {
    let variables;
    beforeEach(() => {
        const list = {1 : 'coucou', 2: 'non', 3: 'ok'};
        variables = shallow(<AvailableVariables tab={list} />);
    });

    it('Should display the right list', () => {
        expect(variables.find(ListBox).props().list).toEqual(
            [{"key": "1", "value": "coucou"}, {"key": "2", "value": "non"}, {"key": "3", "value": "ok"}]
        );
    });
});
