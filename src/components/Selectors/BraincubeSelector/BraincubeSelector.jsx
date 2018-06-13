import PropTypes from 'prop-types';
import React, { Component } from 'react';
import 'babel-polyfill';

export default class BraincubeSelector extends Component {
    render() {
        const options = [];
        this.props.tab.map((value) => {  // eslint-disable-line array-callback-return
            options.push(<option key={value.id}>{value.name}</option>);
        });

        return (
            <select onChange={this.props.onChange}>{options}</select>
        );
    }
}

BraincubeSelector.propTypes = {
    /** La function qui indique l'action à effectuer au changement de selection */
    onChange: PropTypes.func.isRequired,
    /** Un tableau contenant les éléments à afficher */
    tab: PropTypes.array.isRequired
};
