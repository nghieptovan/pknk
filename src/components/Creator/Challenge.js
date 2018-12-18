import React, {Component, PropTypes} from 'react';
import {Router, Route, browserHistory, Link} from 'react-router';
import {connect} from 'react-redux';
import * as ClientActions from '../../redux/actions/client';
import _ from 'lodash';
import { getCurrentUser } from '../../utils/common';
import ReactLoading from 'react-loading';
import Modal from 'react-modal';
import history from '../../index';
import './Challenge.scss';
import {ScrollToTopOnMount, SectionsContainer, Section, Header, Footer} from 'react-fullpage';
import { Scrollbars } from 'react-custom-scrollbars';
import ScrollArea from 'react-scrollbar';
import logoImg from '../../assets/img/EnTribe-Logow-hite.png';
import challengeBg from '../../assets/img/challenge-bg.jpg';
import {s3URL} from '../../config';
import imgItem from '../../assets/img/no-img.png';
import moment from 'moment';
import classNames from 'classnames';
import ResponsiveMenu from 'react-responsive-navbar';
import Pagination from "react-js-pagination";
import Slider from "react-slick";
import TermsAndConditions from '../TermsAndConditions/index';
import Policy from '../TermsAndConditions/Policy';
import ModalModule from '../ModalModule';
import LinesEllipsis from 'react-lines-ellipsis';
@connect(
  state => ({
    client: state.client  
  }),
  ({
    getList: (token,page,maxRecords) => ClientActions.getListNewDashboard(token, page, maxRecords),
    changeSubscriptionStatus: (token,data) => ClientActions.changeSubscriptionStatus(token, data)
  }
  )
)

export default class Challenge extends Component {
  constructor(props){
    super(props);    
  }
  
    render() {      
   
    return (
        <div>fdsjklfdsjlkf</div>
    );
  }
}