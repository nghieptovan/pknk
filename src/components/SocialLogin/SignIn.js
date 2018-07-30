import React, {Component, PropTypes} from 'react';
import { browserHistory, Link } from 'react-router';
import {connect} from 'react-redux';
import './SignIn.scss';
import logoImg from '../../assets/logologin.png';
import fbImg from '../../assets/fb.png';
import ggImg from '../../assets/gg.png';
import bgCreator from '../../assets/img/bg-creator.jpg';
import markCreator from '../../assets/img/mark-creator.jpg';
import FacebookLogin from 'react-facebook-login';
import GoogleLogin from 'react-google-login';
import { Field, reduxForm, formValueSelector } from 'redux-form';
import {renderField, renderMaterialField} from "../ReduxField";
import {validateLoginForm} from  '../../utils/formValidation';
import * as AuthActions from '../../redux/actions/auth';
import { getCurrentUser } from '../../utils/common';
import Modal from 'react-modal';
import { facebookAppID} from '../../config';
import ReactLoading from 'react-loading';
import history from '../../index';

const validate = values => {
  return validateLoginForm(values);
};

const selector = formValueSelector('socialLoginForm');
@connect (
  state => ({userLogin: state.auth,
             userName: selector(state, 'userName'), 
             password: selector(state, 'password'),
             email: selector(state, 'email')}),            
             ({login: (user, currentType) => AuthActions.login(user, currentType), 
              loginSocial: (user, social) => AuthActions.loginSocial(user, social),
              forgotPwd: (user) => AuthActions.forgotPwd(user)})
)
export default class SignIn extends Component {
  constructor(props) {
    super(props);
  }
  componentWillMount(){    
  }

 
  render() {
    return (
        <div className="container-fluid">
          <div className="row">
            <div className="col-lg-4 col-md-4 col-sm-4 bg-area sign-up"><img src={bgCreator} /></div>
            <div className="col-lg-8 col-md-8 col-sm-8 bg-area sign-in">SignIn</div>
          </div>
        </div>
    );
  }
}


SignIn = reduxForm({
  form: 'socialLoginForm',
  validate
})(SignIn);
