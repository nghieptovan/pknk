import React, { Component, PropTypes } from 'react';
import { Router, Route, browserHistory } from 'react-router';
import './index.scss';
import logoImg from '../../assets/logologin.png';
import {renderField, renderMaterialField, renderFieldAsync} from "../ReduxField";
import { Field, reduxForm, formValueSelector, change } from 'redux-form';
import { validateWidgetForm } from './../../utils/formValidation';
import asyncValidate from './../../utils/asyncValidate';
import { getCurrentUser } from './../../utils/common';
import { connect } from 'react-redux';
import * as DashboardActions from '../../redux/actions/dashboard';
import moment from 'moment';
import Modal from 'react-modal';
import TagsInput from 'react-tagsinput';
import 'react-tagsinput/react-tagsinput.css';
import { TagBox } from 'react-tag-box';
import classNames from 'classnames';
import ReactLoading from 'react-loading';
import _ from 'lodash';
import {hostname} from '../../config';
import { Link } from 'react-router';
import {s3URL} from '../../config';
import hospital from '../../assets/hospital.png';
import TextField from 'material-ui/TextField';
import FlatButton from 'material-ui/FlatButton';

const validate = values => {
  return validateWidgetForm(values, false);
};

const selector = formValueSelector('widget');

@connect(
  state => ({
    dashboard: state.dashboard,
    form: state.form,
    fields: selector(state, 'firstName', 'description', 'lastName', 'email', 'hashTags')
  }),
  ({
    getBill: () => DashboardActions.getBill()
  }
  )
)
export default class Dashboard extends Component {
  constructor(props) {
    super(props);
    
  }
  componentWillMount(){
    this.props.getBill();
  }
  
  render() {   
    return (
      <div id="login">
        <div className="img-background">
        <img src={hospital} />
        </div>
      <div className="login-page">
        
        <div className="form">
          <form className="login-form">            
            <TextField name="username" fullWidth={true} floatingLabelText="Username" type="text" />
            <TextField name="password" fullWidth={true} floatingLabelText="Password" type="password"/>
            <FlatButton type="submit" className="login-button" label="Login" fullWidth={true} />
          </form>
        </div>
      </div>
    </div>

    )
}
}
Dashboard = reduxForm({
  form: 'widget',
  validate,
  asyncValidate
})(Dashboard);