import React from 'react';
import { shallow , configure } from 'enzyme'
import Adapter from 'enzyme-adapter-react-16';
import DateSelector from '../../../../src/components/Selectors/DateSelector/DateSelector';
import DatePicker from 'react-datepicker';
import moment from 'moment';

configure({ adapter: new Adapter() });
describe('<DateSelector />', () => {
    let date;
    let onChangeSpy;
    beforeEach(() => {
        onChangeSpy = jest.fn();
        date = shallow(<DateSelector onChange={onChangeSpy} />);
    });

    it('Should select the right default date', () => {
        expect(date.find(DatePicker).props().selected.format('YYYYMMDD_hhmm')).toEqual(moment().format('YYYYMMDD_hhmm'));
    });

    it('Should call func on change', () => {
        date.simulate('change');
        expect(onChangeSpy).toHaveBeenCalledTimes(1);
    });
});