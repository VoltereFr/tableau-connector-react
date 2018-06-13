import PropTypes from 'prop-types';
import React, { Component } from 'react';
import '@braincube/brain-font/dist/brain-font.css';
import 'babel-polyfill';

const button = {
    backgroundColor: '#fff033',
    border: 'none',
    padding: '10px 27px',
    textAlign: 'center',
    display: 'inline-block',
    fontSize: '16px',
    cursor: 'pointer',
    marginTop: '10px',
    borderRadius: '5px'
};
const mouseOverButton = {
    backgroundColor: '#ffcc00',
    border: 'none',
    color: 'white',
    padding: '10px 27px',
    textAlign: 'center',
    display: 'inline-block',
    fontSize: '16px',
    cursor: 'pointer',
    marginTop: '10px',
    borderRadius: '5px'
};

export default class Button extends Component {
    constructor(props) {
        super(props);
        this.state = { over: false };
    }

    handleOnMouseOver = () => { this.setState({ over: true }); };

    handleOnMouseOut = () => { this.setState({ over: false }); };

    render() {
        return (
            this.state.over && !this.props.disable ?
                <button
                    type="button"
                    onClick={this.props.onClick}
                    disabled={this.props.disable}
                    onMouseOver={this.handleOnMouseOver}
                    onMouseOut={this.handleOnMouseOut} style={mouseOverButton}
                >
                    {this.props.text}
                </button>
                :
                <button
                    type="button"
                    onClick={this.props.onClick}
                    disabled={this.props.disable}
                    onMouseOver={this.handleOnMouseOver}
                    onMouseOut={this.handleOnMouseOut} style={button}
                >
                    {this.props.text}
                </button>
        );
    }
}

Button.propTypes = {
    /** La function à appeler quand on clique sur le bouton */
    onClick: PropTypes.func.isRequired,
    /** Le texte à afficher dans le bouton */
    text: PropTypes.string.isRequired,
    /** L'état d'affichage du boutton*/
    disable: PropTypes.bool.isRequired
};
