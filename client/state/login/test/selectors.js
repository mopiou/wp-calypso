/**
 * External dependencies
 */
import { expect } from 'chai';

/**
 * Internal dependencies
 */
import {
	isLoginSuccessful,
	getTwoFactorAuthId,
	getTwoFactorAuthNonce,
	isTwoFactorEnabled,
	getVerificationCodeSubmissionError,
} from '../selectors';

describe( 'selectors', () => {
	describe( 'getTwoFactorAuthId()', () => {
		it( 'should return null if there is no information yet', () => {
			const id = getTwoFactorAuthId( undefined );

			expect( id ).to.be.null;
		} );

		it( 'should return the two factor auth ID if there is such', () => {
			const id = getTwoFactorAuthId( {
				login: {
					twoFactorAuth: {
						two_step_id: 123456,
					}
				}
			} );

			expect( id ).to.eql( 123456 );
		} );
	} );

	describe( 'getTwoFactorAuthNonce()', () => {
		it( 'should return null if there is no information yet', () => {
			const id = getTwoFactorAuthId( undefined );

			expect( id ).to.be.null;
		} );

		it( 'should return the two factor auth nonce if there is such', () => {
			const nonce = getTwoFactorAuthNonce( {
				login: {
					twoFactorAuth: {
						two_step_nonce: 'abcdef123456',
					}
				}
			} );

			expect( nonce ).to.eql( 'abcdef123456' );
		} );
	} );

	describe( 'isTwoFactorEnabled()', () => {
		it( 'should return null if there is no two factor information yet', () => {
			const twoFactorEnabled = isTwoFactorEnabled( undefined );

			expect( twoFactorEnabled ).to.be.null;
		} );

		it( 'should return true if the request was successful and two-factor auth is enabled', () => {
			const twoFactorEnabled = isTwoFactorEnabled( {
				login: {
					twoFactorAuth: {
						two_step_id: 123456,
						two_step_nonce: 'abcdef123456',
						result: true,
					}
				}
			} );

			expect( twoFactorEnabled ).to.be.true;
		} );

		it( 'should return false if the request was successful and two-factor auth is not', () => {
			const twoFactorEnabled = isTwoFactorEnabled( {
				login: {
					twoFactorAuth: {
						two_step_id: '',
						two_step_nonce: '',
						result: true,
					}
				}
			} );

			expect( twoFactorEnabled ).to.be.false;
		} );

		it( 'should return false if the request was unsuccessful', () => {
			const twoFactorEnabled = isTwoFactorEnabled( {
				login: {
					twoFactorAuth: {
						two_step_id: '',
						two_step_nonce: '',
						result: false,
					}
				}
			} );

			expect( twoFactorEnabled ).to.be.false;
		} );
	} );

	describe( 'getVerificationCodeSubmissionError()', () => {
		it( 'should return null if there is no error yet', () => {
			const verificationCode = getVerificationCodeSubmissionError( {
				login: {
					verificationCodeSubmissionError: null
				}
			} );

			expect( verificationCode ).to.be.null;
		} );

		it( 'should return the error if there is such', () => {
			const verificationCode = getVerificationCodeSubmissionError( {
				login: {
					verificationCodeSubmissionError: 'Incorrect verification code.'
				}
			} );

			expect( verificationCode ).to.eql( 'Incorrect verification code.' );
		} );
	} );

	describe( 'isLoginSuccessful()', () => {
		it( 'should return false if there is no login information yet', () => {
			const id = isLoginSuccessful( undefined );

			expect( id ).to.be.false;
		} );

		it( 'should return true if the login request was successful', () => {
			const id = isLoginSuccessful( {
				login: {
					requestSuccess: true,
				}
			} );

			expect( id ).to.be.true;
		} );

		it( 'should return true if the verification code submission request was successful', () => {
			const id = isLoginSuccessful( {
				login: {
					twoFactorAuth: {
						two_step_id: 123456,
						two_step_nonce: 'abcdef123456',
						result: true,
					},
					verificationCodeSubmissionSuccess: true,
				}
			} );

			expect( id ).to.be.true;
		} );

		it( 'should return false if the login request was not succesful', () => {
			const id = isLoginSuccessful( {
				login: {
					requestSuccess: false,
				}
			} );

			expect( id ).to.be.false;
		} );

		it( 'should return false if the verification code submission request was not succesful', () => {
			const id = isLoginSuccessful( {
				login: {
					twoFactorAuth: {
						two_step_id: 123456,
						two_step_nonce: 'abcdef123456',
						result: true,
					},
					verificationCodeSubmissionSuccess: false,
				}
			} );

			expect( id ).to.be.false;
		} );
	} );
} );
