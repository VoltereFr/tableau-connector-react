import '@braincube/brain-font/dist/brain-font.css';
import NotificationManager from '@braincube/react-components/lib/NotificationManager';
import PropTypes from 'prop-types';
import 'babel-polyfill';
import React, { Component } from 'react';
import Loader from '@braincube/react-components/lib/Loader';
import BraincubeConnector from '../../dataConnector/BraincubeConnector';
import Button from '../Button/Button';
import Connected from '../Connected/Connected';
import { disableClosePandasServer, enableClosePandasServer } from '../../SessionStorageManagement';

export default class Content extends Component {
    constructor(props) {
        super(props);
        this._refNotificationManager = new NotificationManager();
        this.connector = new BraincubeConnector();
        this.handleConnect = this.handleConnect.bind(this);
        this.state = {
            isLogged: false,
            isLoading: true
        };
    }
    async componentDidMount() {
        try {
            disableClosePandasServer();
            const connected = await this.connector.isConnected();
            this.setState({ isLogged: connected, isLoading: false }); // eslint-disable-line react/no-did-mount-set-state
            enableClosePandasServer();
        } catch (e) {
            this._refNotificationManager.error('Connection error to Braincube');
        }
    }

    async handleConnect() {
        disableClosePandasServer();
        this.setState({ isLoading: true });
        try {
            const connected = await this.connector.connectToBraincube();
            this.setState({ isLogged: connected });
            enableClosePandasServer();
        } catch (e) {
            this._refNotificationManager.error('Unable to connect to your Braincube account');
        }
    }

    handleDisconnect = () => {
        this.setState({ isLogged: this.connector.disconnectFromBraincube() });
    };

    render() {
        return (
            <div>
                <NotificationManager
                    ref={(elt) => {
                        this._refNotificationManager = elt;
                    }}
                    scrollbarThickness={30}
                    zIndex={120}
                />
                {this.state.isLogged ?
                    <Connected
                        onDisconnect={this.handleDisconnect}
                        connector={this.connector}
                        softwareConnector={this.props.softwareConnector}
                    />
                    :
                    <Button onClick={this.handleConnect} text={'Connect via Braincube.com!'} disable={this.state.isLoading} />
                }
                {this.state.isLoading ?
                    <div style={{ marginLeft: 'calc(50% - 50px)' }}>
                        <Loader
                            loaderSize={40}
                            mainColor="#CCCCCC"
                            spinnerColor="#999999"
                            containerHeight={100}
                            containerWidth={100}
                        />
                    </div>
                    :
                    <div />
                }
            </div>
        );
    }
}

Content.propTypes = {
    /** L'objet faisant le lien avec Tableau, de classe TableauConnector */
    softwareConnector: PropTypes.object.isRequired
};
