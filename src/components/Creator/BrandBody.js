import React, {Component, PropTypes} from 'react';
import {Router, Route, useRouterHistory} from 'react-router';
import {connect} from 'react-redux';
import * as ChallengeActions from '../../redux/actions/challenge';
import './DashboardBody.scss';
import constructionImg from '../../assets/page_construction.jpg';
import imgItem from '../../assets/img/no-img.png';
import _ from 'lodash';
import { getCurrentUser } from '../../utils/common';
import moment from 'moment';
import LazyLoad from 'react-lazy-load';
import randomColor from 'randomcolor'; 
import Rewarded from './Rewarded';
import {s3URL} from '../../config';
import { Scrollbars } from 'react-custom-scrollbars';
import ReactLoading from 'react-loading';
import ReactTooltip from 'react-tooltip';
import history from '../../index';

export default class BrandBody extends Component {
  constructor(props) {
    super(props);   
  }  
  goToLiveChallenge = (clientId, clientName) => {
    const nameClient = clientName.toLowerCase().replace(/\s+/g, '');;
    sessionStorage.setItem('clientId', (clientId || ''));
    sessionStorage.setItem('clientName', (nameClient || ''));    
    history.push('/creator/dashboard');
  }
  handleSubcribe = (id, status, e) => {
    e.preventDefault();
    this.props.changeStatus(id, status);
   
  }
  renderItemBrand = (client, data) => {
    const {token} = getCurrentUser();
    let liveChallenges, imgUrl;
    client.liveChallenges ? liveChallenges = client.liveChallenges : liveChallenges = 0;    
    client.logo ? imgUrl = s3URL+client.logo : imgUrl = imgItem;
    const colorList = ["#B71C1C",	"#2979FF",	"#827717","#C62828","#01579B",
     "#9E9D24", "#E91E63", "#0091EA", "#F57F17", "#D81B60", "#00B8D4",
     "#FF6F00", "#C2185B", "#00838F",	"#E65100", "#9C27B0",	"#004D40", 
     "#EF6C00", "#8E24AA", "#00695C",	"#F57C00", "#673AB7",	"#00796B",	
     "#FF3D00", "#3F51B5", "#1B5E20",	"#DD2C00", "#3F51B5",	"#2E7D32",
     "#424242", "#1976D2"	,"#33691E",	"#37474F"]
    const color = colorList[Math.floor(Math.random() * colorList.length)];   
    let btnSub = { cursor: 'pointer', color: '#a79f93' };
    let btnUnsub = { cursor: 'pointer', color: '#ffa101' };    
    if(this.props.loadingUpload2){
      btnSub.pointerEvents = 'none';
      btnUnsub.pointerEvents = 'none';
    }  
    return (
      <div className="col-lg-3 col-md-3 col-sm-4 col-xs-6 item" key={client.brand_name + client.id}>
      <div className="content-item-brand">
        <div className="header-item">
          <div className="item-left">
            <p>Total live challenges: {liveChallenges}</p>
          </div>
          {client.isSubscribed != null && token &&<div className="item-right">
              {client.isSubscribed ? 
              <span style={btnUnsub} onClick={(e) => this.handleSubcribe(client.id, false, e)} className="glyphicon glyphicon-bell" data-tip='Click to UnSubscribe' data-for='global'></span> :
              <span style={btnSub} onClick={(e) => this.handleSubcribe(client.id, true, e)} className="glyphicon glyphicon-bell" data-tip='Click to Subscribe' data-for='global'></span>}
          </div>}                   
        </div>
        <div className="body-item" onClick={() => this.goToLiveChallenge(client.id, client.brand_name)}>
        <LazyLoad height={170}>
            <img src={imgUrl} />
        </LazyLoad>
        </div>
        <div className="footer-item"  onClick={() => this.goToLiveChallenge(client.id, client.brand_name)} style={{background: color}}>
          <span className="name">{client.brand_name}</span> 
        </div>                  
      </div>
      
      </div>
    )
  }
  
  render() {  
    const { listClient } = this.props;
    const { token } = getCurrentUser();    
    return (      
      <div id="wrapper">
      <div className="creator-dashboard" style={{ height: window.innerHeight - 60 + 'px'}}>
        <div className="container-fluid">
          {this.props.loadingUpload &&
          <ReactLoading type={'spinningBubbles'} color={'#d25408'} delay={0} height={64} width={64} className="spinner-loading" />
          }
          {this.props.loadingUpload2 &&
          <ReactLoading type={'spinningBubbles'} color={'#d25408'} delay={0} height={64} width={64} className="spinner-loading" />
          }
          {!this.props.loadingUpload && 
          <div className="row content">          
            <Scrollbars autoHide style={{ height: window.innerHeight - 60, overflowX: 'hidden'}} renderThumbVertical={({ style, ...props }) =>
                    <div {...props} style={{ ...style, backgroundColor: '#fba05d', overflowX: 'hidden' }}/>
                    }>
              <div  className={token ? `col-lg-8 col-md-8 col-sm-8 col-xs-12 left-side` : 'col-lg-12 col-md-12 col-sm-12 col-xs-12 left-side'}>
                <div className="title-block">Choose Brand</div>
                <div className="row content-block scroll-nghiep" style={{ height: window.innerHeight - 105 + 'px'}}>      
                {listClient && listClient.map(this.renderItemBrand, this, '')}
                {listClient.length == 0 && 'There are currently no clients available'}
                </div>   
                <ReactTooltip ReactTooltip id='global' aria-haspopup='true' role='example' />
              </div>
              {token && <Rewarded />}
              </Scrollbars>                 
          </div>   
          }         
        </div>        
      </div>
      </div>
    );
  }
}