import React, { Component, PropTypes } from 'react';
import { Router, Route, browserHistory } from 'react-router';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import _ from 'lodash';
import NavHeaderClient from '../NavHeader/NavHeaderClient';
import SidebarClient from '../Sidebar/SidebarClient';
import CreatorsBody from './CreatorsBody';
import AddCreator from './AddCreator';
import './Creators.scss';
import Modal from 'react-modal';
import moment from 'moment';
import 'react-widgets/lib/scss/react-widgets.scss';
import history from '../../index';
export default class Creators extends Component {
  constructor(props) {
    super(props);
    this.state = {
      openAddCreator: false,
      error: '',
      loading:'',
      openSideBar: false      
    }
  }
  static propTypes = {
    challenge: PropTypes.object,
    createChallenge: PropTypes.func,
  }
  componentWillMount() {
    if (!(this.props.params.shortName || '')) {
      history.push('/client');
    }
  }
  
  addCreator = () => {
    this.setState({openAddCreator: true});
  }
  
  closeModal = () =>{
    this.setState({openAddCreator: false});
  }  
  
  render() {
    const { params: { shortName } } = this.props;
    return (
      <div id="container">
        <div id="wrapper">
          <SidebarClient shortName={shortName} selected="creators" />
          <NavHeaderClient title='Creators' />
          <CreatorsBody addCreator={this.addCreator} />
        </div>   
      </div>
    );
  }
}

