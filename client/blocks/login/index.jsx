/**
 * External dependencies
 */
import React, { Component, PropTypes } from 'react';
import { connect } from 'react-redux';

/**
 * Internal dependencies
 */
import config from 'config';
import { createFormAndSubmit } from 'lib/form';
import LoginForm from './login-form';
import TwoFactorAuthentication from './two-factor-authentication';
import { isTwoFactorEnabled } from 'state/login/selectors';

class Login extends Component {
	static propTypes = {
		title: PropTypes.string,
		redirectLocation: PropTypes.string,
		twoFactorEnabled: PropTypes.bool,
	};

	handleValidUsernamePassword = ( { usernameOrEmail, password, redirectLocation, rememberMe } ) => {
		if ( ! this.props.twoFactorEnabled ) {
			createFormAndSubmit( config( 'login_url' ), {
				log: usernameOrEmail,
				pwd: password,
				redirect_to: redirectLocation || window.location.origin,
				rememberme: rememberMe ? 1 : 0,
			} );
		}
	};

	handleValid2FACode = ( { twoStepCode, rememberMe } ) => {
		twoStepCode; rememberMe;
	};

	render() {
		const {
			title,
			twoFactorEnabled,
		} = this.props;

		return twoFactorEnabled
			? ( <TwoFactorAuthentication
					onSuccess={ this.handleValid2FACode } /> )
			: ( <LoginForm
					title={ title }
					onSuccess={ this.handleValidUsernamePassword }
				/> );
	}
}

export default connect(
	( state ) => ( {
		twoFactorEnabled: isTwoFactorEnabled( state )
	} ),
)( Login );
