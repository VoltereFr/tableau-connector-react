import React from 'react';
import { shallow , configure } from 'enzyme'
import Adapter from 'enzyme-adapter-react-16';
import App from '../../../src/components/App/App';
import Header from '../../../src/components/Header/Header'
import {enablePandasConnection, disablePandasConnection} from "../../../src/SessionStorageManagement";

configure({ adapter: new Adapter() });
describe('<App />', () => {
    it('Should have the right header pandas', () => {
        enablePandasConnection();
        const app = shallow(<App />);
        expect(app.find(Header).props().connectorText).toEqual('the Pandas Connector');
    });
    it('Should have the right header tableau', () => {
        disablePandasConnection();
        const app = shallow(<App />);
        expect(app.find(Header).props().connectorText).toEqual('the Tableau Connector');
    });
});
