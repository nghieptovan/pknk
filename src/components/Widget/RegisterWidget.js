import React, { Component, PropTypes } from 'react';
import './index.scss';
import { renderField, renderMaterialField, renderFieldAsync } from "../ReduxField";
import { Field, reduxForm, formValueSelector, change } from 'redux-form';
import { validateWidgetForm } from './../../utils/formValidation';
import { getCurrentUser } from './../../utils/common';
import { connect } from 'react-redux';
import * as WidgetActions from '../../redux/actions/widget';
import Modal from 'react-modal';
import ReactLoading from 'react-loading';
import _ from 'lodash';
import { hostname } from '../../config';
import { Link } from 'react-router';
import { s3URL } from '../../config';
import { instagramAppID } from '../../config';
import logoImg from '../../assets/logologin.png';
import iconCamera from '../../assets/cameraIcon.png';
const validate = values => {
    return validateWidgetForm(values, false);
};

const selector = formValueSelector('widget');
@connect(
    state => ({
        widget: state.widget,
        fields: selector(state, 'firstName', 'lastName', 'email', 'instagram', 'twitter')
    }),
    ({
        register: (data, access_time, code, url) => WidgetActions.Register(data, access_time, code, url),
        changeFieldValue: (field, value) => change('widget', field, value)
    }
    )
)
export default class RegisterWidget extends Component {
    constructor(props) {
        super(props);
        this.state = ({
            imageFileName: '',
            code: 'nocode'
        });
    }
    componentWillMount() {
        this.getLocation();
        if (window.location.href.includes('?code=')) {
            let code = window.location.href.split('?code=');
            this.setState({ code: code[1], checkInstagram: true });
            window.history.replaceState("", document.title, window.location.pathname)
        }
    }
    componentDidMount() {
        const account = JSON.parse(localStorage.getItem('account'));
        if (account) {
            this.props.changeFieldValue('email', account.email);
            this.props.changeFieldValue('firstName', account.firstName);
            this.props.changeFieldValue('lastName', account.lastName);
            localStorage.removeItem('account');
        }
    }
    componentWillReceiveProps(nextProps) {
        const { widget } = this.props;
        const { widget: nextWidget } = nextProps;
        if (widget.register == 1 && widget.register != nextWidget.register && nextWidget.registered) {
            this.setState({ openModal: true, loadingUpload: false });
            this.startTimer();
        }
        if (widget.register == 1 && widget.register != nextWidget.register && nextWidget.registerError) {
            const error = nextWidget.registerError;
            error.includes('instagram') ? this.setState({ error, loadingUpload: false, code: 'nocode', checkInstagram: false, agreeChecked: false  }, this.refs.agree.checked = false) : this.setState({ error });
        }
        if(this.state.error){
            this.setState({error: ''});
        }
    }
    closeModal = () => {
        this.props.reset();
        this.refs.agree.checked = false;
        this.setState({ openModal: false, code: 'nocode', checkInstagram: false });
    }

    startTimer = () => {
        this.setState({ timeCountDown: 2000 });
        let intervalId = setInterval(() => {
            if (this.state.timeCountDown < 0) {
                this.closeModal();
                clearInterval(intervalId);
            } else {
                let _timeCountDown = this.state.timeCountDown - 500;
                this.setState({ timeCountDown: _timeCountDown });
            }
        }, 500);
    }
    getLocation = () => {
        new Promise((resolve, reject) => {
            const xhr = new XMLHttpRequest();
            xhr.open("GET", "https://ipapi.co/json", true);
            xhr.onload = () => {
                var result = JSON.parse(xhr.response);
                this.setState({ location: result })
                resolve(xhr.responseText);
            }
            xhr.onerror = () => {
                reject(xhr.statusText);
            }
            xhr.send();
        });
    }
    handleDone = () => {
        this.setState({ firstTime: false });
    }
    handleLink = () => {        
        if (this.state.code == 'nocode') {
            const { email, firstName, lastName } = this.props.fields;
            const acc = { email, firstName, lastName };
            localStorage.setItem('account', JSON.stringify(acc));
            const redirect_uri = window.location.href;
            const url = `https://api.instagram.com/oauth/authorize/?client_id=${instagramAppID}&redirect_uri=${redirect_uri}&response_type=code&scope=public_content`;
            window.location.href = url;
        }
    }
    handleRegister = () => {
        const { email, firstName, lastName, instagram, twitter } = this.props.fields;
        let instagramUsername = instagram;
        let twitterUsername = twitter;
        let error ='';
        if(instagramUsername && instagramUsername.length > 0){
            if(!/^[a-zA-Z0-9\.\_]+$/.test(instagramUsername)){
               error= 'IG username only accept characters, dot and underscore.';
            }
        }       
        if(twitterUsername && twitterUsername.length > 0){
            if(!/^[a-zA-Z0-9\_]+$/.test(twitterUsername)){
                error= 'Twitter username only accept characters and underscore.';
            }
            if(twitterUsername.length > 15){
               error= 'Twitter username cannot be longer than 15 characters.';
            }
        }
        if(error.length > 0){
            this.refs.agree.checked = false;
            this.setState({ error });
        } else {
            let { location } = this.state;
            const code = this.state.code;
            let locationStr = location ? location.region + "-" + location.country + "-" + (location.region_code && location.region_code.length > 0 ? location.region_code : location.country) : 'nodata-ND-ND';
            let regex = /([a-z]|[A-Z]|\ )+\-([A-Z]{2})+\-([A-Z]{2})/;
            if (!regex.test(locationStr)) {
                let arr = locationStr.split("-");
                let region = arr[0], country = arr[1], region_code = arr[2];
                region.length == 0 ? region = 'nodata' : '';
                country.length == 0 ? country = 'ND' : '';
                region_code.length == 0 ? region_code = 'ND' : '';
                locationStr = region + "-" + country + "-" + region_code;
            }
            let data =  { email, firstName, lastName, location: locationStr} ;
            if (instagramUsername){
                data.instagramUsername = instagramUsername;
            }
            if( twitterUsername){
                data.twitterUsername = twitterUsername;
            }
            this.props.register(data, (new Date).getTime(), code, window.location.href);
            this.setState({loadingUpload: true});
        }        
    }
    handleAgree = () => {
        const checkbox = this.refs.agree;
        this.setState({ agreeChecked: checkbox.checked })
    }
    getLocation = () => {
        new Promise((resolve, reject) => {
            const xhr = new XMLHttpRequest();
            xhr.open("GET", "https://ipapi.co/json", true);
            xhr.onload = () => {
                var result = JSON.parse(xhr.response);
                this.setState({ location: result })
                resolve(xhr.responseText);
            }
            xhr.onerror = () => {
                reject(xhr.statusText);
            }
            xhr.send();
        });
    }
    render() {
        let btnStyle = {};
        if (this.refs.agree && !this.refs.agree.checked) {
            btnStyle = { opacity: '0.5', pointerEvents: 'none' };
        }
        let instagramStyle = {};
        let spanStyle ={}
        if (this.state.checkInstagram) {
            instagramStyle = { opacity: '0.5', pointerEvents: 'none' };
            spanStyle = { marginLeft: '23px'};
        }
        return (
            <div>
                <div className="container-fluid widget-wrap register-widget">
                    <div className="row">
                        <div className="col-md-12 col-xs-12 col-sm-12 widget-body">
                            <div className="popup">
                                <div className="user-information">
                                    <form role="form" className="material-form" >
                                        <div className="col-md-12 col-sm-12 col-xs-12 widget-row">
                                            <Field name="instagram" type="text" label="Instagram Username" component={renderField} />
                                        </div>
                                        <div className="col-md-12 col-sm-12 col-xs-12 widget-row">
                                            <Field name="twitter" type="text" label="Twitter Username" component={renderField} />
                                        </div>
                                        <div className="col-md-12 col-sm-12 col-xs-12 widget-row">
                                            <Field name="email" type="text" label="Email" component={renderField} />
                                        </div>
                                        <div className="col-md-12 col-sm-12 col-xs-12 widget-row">
                                            <Field name="firstName" type="text" label="First Name" component={renderField} />
                                        </div>
                                        <div className="col-md-12 col-sm-12 col-xs-12 widget-row">
                                            <Field name="lastName" type="text" label="Last Name" component={renderField} />
                                        </div>                                       
                                    </form>
                                    {/* <div className="col-md-12 col-sm-12 col-xs-12 agree-row">
                                        {this.state.checkInstagram ?
                                            <div className='instagram' style={instagramStyle}>
                                                <span style={spanStyle}>Instagram connected</span>
                                            </div> : <div className='instagram' style={instagramStyle} onClick={this.handleLink}>
                                                <div className='icon-camera'>
                                                    <img src={iconCamera} />
                                                </div>
                                                <span>Connect to Instagram</span>
                                            </div>}
                                    </div> */}
                                    <div className="col-md-12 col-sm-12 col-xs-12 agree-row">
                                        <input type="checkbox" ref="agree" onChange={this.handleAgree} className="form-check-input" />
                                        <span> I agree to the <Link to={`/terms`} target="_blank">Terms & Conditions*</Link></span>
                                    </div>
                                    <div className="col-md-12 col-sm-12 col-xs-12 error">
                                        {this.state.error}
                                    </div>
                                </div>
                                <div className="button-upload">
                                    <div className="col-md-12 btn-center">
                                        <button className="btn btn-primary btn-popup" style={btnStyle} onClick={this.handleRegister}>Register</button>
                                    </div>
                                </div>
                                <div className="sign">
                                    <span>Powered by </span>
                                    <img src={logoImg} alt="logo" />
                                </div>
                                {this.state.loadingUpload && <div className="loading-upload">
                                    <ReactLoading type={'spinningBubbles'} color={'#d25408'} delay={0} height={64} width={64} className="spinner-loading" />
                                </div>
                                }
                            </div>
                        </div>
                    </div>
                </div>
                <Modal
                    isOpen={this.state.openModal}
                    className={{
                        base: 'customConfirm_Modal',
                        afterOpen: 'custom_upload_widget_register_success',
                        beforeClose: 'customConfirm_before-close'
                    }}
                    overlayClassName={{
                        base: 'customConfirm_Overlay',
                        afterOpen: 'customConfirmOverlay_after-open',
                        beforeClose: 'customConfirmOverlay_before-close'
                    }}
                    contentLabel="Added Successfully Modal"
                >
                    <form className='form-confirm'>
                        <div className="row">
                            <div className="col-md-12 col-lg-12 col-sm-12 icon">
                                <button className="btn btn-success btn-circle btn-lg" type="button"><i className="fa fa-thumbs-up" aria-hidden="true"></i></button>
                            </div>
                        </div>
                        <div className="row">
                            <div className="col-md-12 col-lg-12 col-sm-12">
                                <span className='title-confirm-popup'>Your account has been created!</span>
                            </div>
                        </div>
                    </form>
                </Modal>
            </div>
        )
    }
}
RegisterWidget = reduxForm({
    form: 'widget',
    validate,
})(RegisterWidget);