import React, { Component } from 'react';
import PropTypes from 'prop-types';
import Constants from '@braincube/react-components/lib/Constants';
import Image from '@braincube/react-components/lib/Image';
import braincubeLogo from '../../braincube.png';

export default class Header extends Component {
    getStyle() {
        return {
            backgroundColor: Constants.Colors.STANDARD,
            height: 50,
            padding: 0,
            color: Constants.Colors.GreyScale.WHITE
        };
    }

    render() {
        return (
            <div data-test-tag="header" style={this.getStyle()}>
                <header
                    style={{
                        display: 'flex',
                        justifyContent: 'space-between',
                        alignItems: 'center'
                    }}
                >
                    <Image src={braincubeLogo} width={50} height={50} />
                    <div style={{ marginLeft: '30px', fontSize: '20px', flex: '2', textAlign: 'left' }}>
                        Data Connector
                    </div>
                    <p style={{ marginRight: '10px' }}>
                        You are currently using {this.props.connectorText}.
                    </p>
                </header>
            </div>
        );
    }
}

Header.propTypes = {
    /** Message to know what connector is actually used*/
    connectorText: PropTypes.string.isRequired
};
