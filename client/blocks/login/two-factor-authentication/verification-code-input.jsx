/**
 * External dependencies
 */
import React, { Component } from 'react';
import { connect } from 'react-redux';
import classNames from 'classnames';

/**
 * Internal dependencies
 */
import ExternalLink from 'components/external-link';
import FormButtonsBar from 'components/forms/form-buttons-bar';
import FormButton from 'components/forms/form-button';
import FormTextInput from 'components/forms/form-text-input';
import FormFieldset from 'components/forms/form-fieldset';
import FormCheckbox from 'components/forms/form-checkbox';
import FormLabel from 'components/forms/form-label';
import FormInputValidation from 'components/forms/form-input-validation';
import Card from 'components/card';
import { localize } from 'i18n-calypso';
import { loginUserWithTwoFactorVerificationCode } from 'state/login/actions';
import {
	getTwoFactorAuthId,
	getTwoFactorAuthNonce,
	getVerificationCodeSubmissionError,
	isLoginSuccessful
} from 'state/login/selectors';

class VerificationCodeInput extends Component {
	state = {
		twoStepCode: '',
		rememberMe: false,
		error: null
	};

	onChangeField = ( event ) => {
		if ( event.target.type === 'checkbox' ) {
			this.setState( {
				[ event.target.name ]: event.target.checked
			} );
			return;
		}
		// Reset the error state if the user updates the field after an error coming
		// from the state
		this.setState( {
			[ event.target.name ]: event.target.value,
			error: null
		} );
	};

	onCodeSubmit = ( event ) => {
		const { twoStepId, twoStepNonce } = this.props;
		const { twoStepCode, remember } = this.state;
		event.preventDefault();
		this.props.loginUserWithTwoFactorVerificationCode( twoStepId, twoStepCode, twoStepNonce, remember ).then( () => {
			this.props.onSuccess( this.state );
		} );
	};

	componentWillMount() {
		this.setState( {
			error: this.props.error
		} );
	}

	componentWillReceiveProps( newProps ) {
		this.setState( {
			error: newProps.error
		} );
	}

	componentDidUpdate() {
		if ( this.props.isLoginSuccessful ) {
			window.location.href = ( this.props.redirectLocation || '/' );
		}
	}

	render() {
		const { translate } = this.props;
		const isError = !! this.state.error;
		let errorText = this.state.error;
		if ( isError ) {
			errorText = translate( 'Invalid verification code' );
		}
		return (
			<div>
				<form onSubmit={ this.onCodeSubmit }>
					<Card>
						<p>
							{ translate( 'Please enter the verification code generated' +
								' by your Authenticator mobile application.' ) }
						</p>
						<FormFieldset>
							<FormLabel htmlFor="twoStepCode">
								{ translate( 'Verification Code' ) }
							</FormLabel>
							<FormTextInput
								onChange={ this.onChangeField }
								className={ classNames( { 'is-error': isError } ) }
								name="twoStepCode" />
							{ isError && (
								<FormInputValidation isError={ isError } text={ errorText } />
							) }
						</FormFieldset>
						<FormFieldset>
							<FormLabel htmlFor="rememberMe">
								<FormCheckbox
									name="rememberMe"
									onChange={ this.onChangeField } />
								<span>
									{ translate( 'Remember for 30 days' ) }
								</span>
							</FormLabel>
						</FormFieldset>
						<FormButtonsBar>
							<FormButton onClick={ this.onSubmit } primary>{ translate( 'Log in' ) }</FormButton>
						</FormButtonsBar>
					</Card>
				</form>
				<p>
					<ExternalLink
						icon={ true }
						target="_blank"
						href="http://en.support.wordpress.com/security/two-step-authentication/">
						{ translate( 'Help' ) }
					</ExternalLink>
				</p>
				<hr />
				<p>
					<a href="#">{ translate( 'Send recovery code via text' ) }</a>
				</p>
			</div>
		);
	}
}

export default connect(
	( state ) => ( {
		twoStepId: getTwoFactorAuthId( state ),
		twoStepNonce: getTwoFactorAuthNonce( state ),
		error: getVerificationCodeSubmissionError( state ),
		isLoginSuccessful: isLoginSuccessful( state )
	} ),
	{
		loginUserWithTwoFactorVerificationCode,
	}
)( localize( VerificationCodeInput ) );
