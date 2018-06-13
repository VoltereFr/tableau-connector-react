import React from 'react';
import { shallow , configure } from 'enzyme'
import Adapter from 'enzyme-adapter-react-16';
import Connected from '../../../src/components/Connected/Connected';
import BraincubeConnector from "../../../src/dataConnector/BraincubeConnector";
import JsonDownloader from "../../../src/softwareConnectors/JSONDownloader"
import Button from "../../../src/components/Button/Button"
import BraincubeSelector from "../../../src/components/Selectors/BraincubeSelector/BraincubeSelector";
import AvailableVariables from "../../../src/components/Selectors/AvailableVariables/AvailableVariables";
import MemoryBaseSelector from "../../../src/components/Selectors/MemoryBaseSelector/MemoryBaseSelector";
import TableauConnector from "../../../src/softwareConnectors/TableauDataConnector";
import PandasConnector from "../../../src/softwareConnectors/PandasConnector";

configure({ adapter: new Adapter() });
describe('<Connected />', () => {
    let connected;
    let onDisconnectSpy;
    let onSubmit;
    beforeEach(() => {
        onDisconnectSpy = jest.fn();
        onSubmit = jest.fn();
        connected = shallow(<Connected onDisconnect={onDisconnectSpy} connector={new BraincubeConnector()} softwareConnector={new JsonDownloader()} />);
    });

    it('Should call func on disconnect', () => {
        const disco = shallow(connected.find(Button).get(0));
        disco.simulate('click');
        expect(onDisconnectSpy).toHaveBeenCalledTimes(1);
    });

    it('Should call component BraincubeSelector with props', () => {
        expect(connected.find(BraincubeSelector).props().tab).toEqual(connected.state().braincube);
    });

    it('Should call component AvailableVariables with props', () => {
        expect(connected.find(AvailableVariables).props().tab).toEqual(connected.state().variables);
    });

    it('Should call component MemoryBaseSelector with props', () => {
        expect(connected.find(MemoryBaseSelector).props().tab).toEqual(connected.state().memoryBase);
    });
    it('Should have a form', () => {
        expect(connected.find('form')).toHaveLength(1);
    });
    it('Should not have a form with tableau', () => {
        const connectedTableau = shallow(<Connected onDisconnect={onDisconnectSpy} connector={new BraincubeConnector()} softwareConnector={new TableauConnector()} />);
        expect(connectedTableau.find('form')).toHaveLength(0);
    });
    it('Should not have a form with pandas', () => {
        const connectedTableau = shallow(<Connected onDisconnect={onDisconnectSpy} connector={new BraincubeConnector()} softwareConnector={new PandasConnector()} />);
        expect(connectedTableau.find('form')).toHaveLength(0);
    });
});