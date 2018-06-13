import React, { Component } from 'react';
import Header from './../Header/Header';
import Content from './../Content/Content';
import './App.css';
import TableauConnector from '../../softwareConnectors/TableauDataConnector';
import PandasConnector from '../../softwareConnectors/PandasConnector';
import JSONDownloader from '../../softwareConnectors/JSONDownloader';
import {
    enableClosePandasServer,
    closeServer,
    enablePandasConnection,
    pandasIsActive,
    disablePandasConnection,
    getQueryValue
} from '../../SessionStorageManagement';
/**
 * This is the main component of our application, it manages the assembly and communication between our various components
 */
export default class App extends Component {
    constructor(props) {
        super(props);
        let connector;
        let text;
        window.addEventListener('beforeunload', this.closePandasServer);
        /** Close the python local server if the user close the window before selecting his data */
        enableClosePandasServer();
        if (getQueryValue('pandas')) {
            enablePandasConnection();
        }
        if (pandasIsActive()) {
            connector = new PandasConnector();
            text = 'the Pandas Connector';
        } else {
            connector = new JSONDownloader();
            text = 'the Json Downloader';
        }
        this.state = {
            softwareConnector: connector,
            connectorText: text
        };
    }

    componentWillMount() {
        /** Tableau connector launch if the page is called by tableau, else choose the right connector on constructor */
        this.prepareTableauConnector();
    }

    componentWillUnmount() {
        window.removeEventListener('beforeunload', this.closePandasServer);
    }
    closePandasServer = () => {
        if (closeServer() && pandasIsActive()) {
            fetch('http://localhost:5000/close');
            disablePandasConnection();
        }
    };
    initTableau = (initCallback) => {
        initCallback();
        this.setState({
            softwareConnector: new TableauConnector(),
            connectorText: 'the Tableau Connector'
        });
    };
    prepareTableauConnector() {
        const tableauConnector = new TableauConnector();
        const connector = tableau.makeConnector(); // eslint-disable-line no-undef
        connector.getSchema = tableauConnector.getSchema;
        connector.getData = tableauConnector.getData;
        /**
         * Need to wait until the connector has been registered by Tableau before
         * displaying the view allowing access to information*/
        connector.init = (initCallBack) => {
            this.initTableau(initCallBack);
        };
        tableau.registerConnector(connector); // eslint-disable-line no-undef
    }
    render() {
        return (
            <div data-test-tag="app-wrapper" style={{ textAlign: 'center' }}>
                <Header connectorText={this.state.connectorText} />
                {(this.state.softwareConnector !== undefined) ?
                    <Content softwareConnector={this.state.softwareConnector} />
                    :
                    <h1>Third party software required to access this page</h1>
                }
            </div>
        );
    }
}
