import React, { Component, PropTypes } from 'react';
import { Router, Route, browserHistory } from 'react-router';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import _ from 'lodash';
import Modal from 'react-modal';
import NavHeaderClient from '../NavHeader/NavHeaderClient';
import SidebarClient from '../Sidebar/SidebarClient';
import ListChallenges from './ChallengesList';
import CreateChallenge from '../CreateChallenge/CreateChallenge';
import './ChallengesDetail.scss';
import { getCurrentUser, getClientShortName } from '../../utils/common';
import * as ChallengeActions from '../../redux/actions/challenge';
import coverImg from '../../assets/img/no-img.png';
import avatar from '../../assets/img/no-img.png';
import { PieChart,Pie, LabelList , Dot, ComposedChart, Line, Cell, ReferenceLine, BarChart, AreaChart, Area, Bar, Legend, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import dataMap from '../../utils/config';
import ReactTooltip from 'react-tooltip';
import moment from 'moment';
import {s3URL} from '../../config';
import { Scrollbars } from 'react-custom-scrollbars';
import MapDashBoard from './MapDashBoard';
import {CopyToClipboard} from 'react-copy-to-clipboard';
import ReactLoading from 'react-loading';
import history from '../../index';
@connect(
    state => ({
        challenge: state.challenge
    }),
    ({
        getChallengeById: (token, id) => ChallengeActions.getChallengeById(token, id),
        getDashboard: (id, token) => ChallengeActions.getDashboard(id, token),
        changeStatusChallenge: (id, status, token, access_time) => ChallengeActions.changeStatusChallenge(id, status, token, access_time)
    }
    )
)
export default class ChallengesDetail extends Component {
    constructor(props) {
        super(props);
        this.state = {
            activeType: 'SAVED',
            currentChallenge: {},
            status: '',
            rerender:false,
            isOpenCompleted: false,
            isOpenArchived: false,
            copied: false,
            defaultUpload: 1,    
        };
    }
    static propTypes = {
        challenge: PropTypes.object,
        router: React.PropTypes.object,
        getChallengeById: PropTypes.func,
        changeStatusChallenge: PropTypes.func,
        getDashboard: PropTypes.func
    };

    componentWillMount() {
        const { token, clientId } = getCurrentUser();
        if (!clientId) {
            history.push('/client');
        } else {
            this.props.getChallengeById(token, this.props.params.challengeId)
            // LIVE SAVED COMPLETED ARCHIVED
        }

    }
    componentDidMount() {
        const { token } = getCurrentUser();
        this.props.getDashboard(this.props.params.challengeId, token);
        this.setState({loadingUpload: true});
    }
    componentWillReceiveProps(nextProps) {        
        const { challenge } = this.props;
        const { challenge: nextChallenge } = nextProps;
        if(!this.checkExpire()){
            challenge.getChallengeLoad !== nextChallenge.getChallengeLoad && nextChallenge.challengeById ? this.setState({ currentChallenge: nextChallenge.challengeById }) : '';
        challenge.edited !== nextChallenge.edited && nextChallenge.editedChallenge ? this.showUpdatedSuccessfullyModal() : '';
        challenge.getDashboard !== nextChallenge.getDashboard && nextChallenge.dashboard ? this.setState({ dashboard: nextChallenge.dashboard }) : '';
        challenge.loadingChallengeById != nextChallenge.loadingChallengeById && nextChallenge.loadingChallengeById == 1 ? this.setState({loadingUpload: true}) : '';
        challenge.loadingChallengeById != nextChallenge.loadingChallengeById && nextChallenge.loadingChallengeById != 1 ? this.setState({loadingUpload: false}) : '';
        } else {
            this.setState({ loadingUpload: false})
        }
        
    }
    checkExpire = () => {
        const errorCode = sessionStorage.getItem('errorStatus');
        if (errorCode == 201) {
            return true;
        }
        return false;
    }
    createChallenge = () => {
        this.setState({ openCreateChallenge: true });
    }
    showUpdatedSuccessfullyModal = () => {
        this.state.status === 'COMPLETED' ?  this.setState({ isOpenCompleted: true }) :  this.setState({ isOpenArchived: true });
        this.startTimer();
    }

    startTimer = () => {
        this.setState({ timeCountDown: 1500 });
        let intervalId = setInterval(() => {
            if (this.state.timeCountDown < 0) {
                this.setState({ isOpenCompleted: false, isOpenArchived: false });
                clearInterval(intervalId);
                if (this.state.status === 'COMPLETED') {
                    sessionStorage.setItem('isCompleted', true);
                } else {
                    sessionStorage.setItem('isArchived', true);
                }
                getClientShortName().then(result => history.push(`/client/${result}/challenges`));
            } else {
                let _timeCountDown = this.state.timeCountDown - 500;
                this.setState({ timeCountDown: _timeCountDown });
            }
        }, 500);
    };
    closeModal = () => {
        this.setState({ openCreateChallenge: false, isOpenCompleted: false });
    }
    closeModalCopy = () => {
        this.setState({copied: false});
    }

    handleChangeStatus = (status) => {
        this.props.changeStatusChallenge(this.props.params.challengeId, status, getCurrentUser().token, Date.now());
        this.setState({ status: status });
    }  

    renderTopCreator = (data, index) => {
        return (
        <tr key={index}>
            <td className="overflow-text text-left">{data.firstName}</td>
            <td className="overflow-text text-left">{data.lastName}</td>
            <td className="text-left">{data.country}</td>
            <td>{data.totalUploads}</td>
            <td>{data.rewards}</td>
        </tr>   )
    }
    copyToClipboard = () => {
        this.setState({copied: true});
        setTimeout(() => {
            this.closeModalCopy();
          }, 1000);
    }
    changeUpload = (type) => {
        const clientInfo = this.state.dashboard;    
        if(type === 1){
          this.setState({ currentUpload: clientInfo.monthUploads, defaultUpload: type }) 
        } else if ( type == 2){
          this.setState({ currentUpload: clientInfo.weekUploads, defaultUpload: type }) 
        } else {
          this.setState({ currentUpload: clientInfo.uploadsReach, defaultUpload: type })
        }
      }
      createCustomDot = (dotProps) => {
        const { payload } = dotProps   
        const { rate } = this.props
        let markerColor
        if(payload.from > rate) {
          markerColor = 'rgb(253,0,0)'
        }
        if(payload.to < rate) {
          markerColor = 'rgb(156,214,25)'
        }
        if(rate >= payload.from && rate <= payload.to) {
          markerColor = 'rgb(253,214,72)'
        }
        dotProps.fill = markerColor
        dotProps.fillOpacity = 1
        dotProps.r = 1
        dotProps.stroke = '#fff'
        dotProps.strokeWidth= 6
        if(!payload.notShow){
          return <Dot {...dotProps} />
        }
        
      }
    render() {
        const { challenge, params: { shortName, challengeId } } = this.props;
        const dashboard = this.state.dashboard;     
        let dataUpload = {};
        let dataKey ="";
        if(this.state.defaultUpload === 1 && dashboard){
            dataUpload= dashboard.monthlyUploads;
            dataKey = "month";
        } else if(this.state.defaultUpload === 2 && dashboard){
            dataUpload= dashboard.weeklyUploads;
            dataKey = "title";
        } else {
            dataUpload= dashboard ? dashboard.uploadsReach:{} ;
            dataKey = "date";
        }             
        const name = this.state.currentChallenge.name;
        const colors = ['#f29c11', '#2a3245'];
        const colors2 = ['#1bbc9b', '#d25400'];
        const data = this.state.dashboard && dashboard.totalBudget > 0 ? [{'text':dashboard.rewardsSpend == 0? '':'$'+dashboard.rewardsSpend , 'value':dashboard.rewardsSpend},{'notext':dashboard.totalBudget - dashboard.rewardsSpend, 'value':dashboard.totalBudget - dashboard.rewardsSpend}]:[{'notext':0, 'value':0},{'notext':0, 'value':1}];
        const data2 = this.state.dashboard ? [{'text':dashboard.images == 0 ? '' : dashboard.images, 'value':dashboard.images == 0 ? '' : dashboard.images },{'text':dashboard.videos == 0?'':dashboard.videos, 'value':dashboard.videos == 0?'':dashboard.videos }]:[{'text':0, 'value':0},{'text':0, 'value': 0}];         
        const noData = (this.state.dashboard && this.state.dashboard.images == 0 && this.state.dashboard.videos ==0);
        const dummy = [{'text':0, 'value':1}];
        let userImg;
        const itemStatus = this.state.currentChallenge.status;
        let disableArchive = itemStatus === 'COMPLETED' ? false : true;
        let disableComplete = itemStatus === 'LIVE' ? false : true;       
        this.state.currentChallenge.imageUri ? userImg = s3URL + this.state.currentChallenge.imageUri : userImg = avatar;
        const domain =`${window.location.protocol}//${window.location.hostname}${(window.location.port && window.location.port != 80 ? ":"+window.location.port :"" )+(process.env.NODE_ENV.includes('demo') ?"/demo":"")}`;
        let embeddedCode = this.state.currentChallenge && this.state.currentChallenge.id ?`<iframe src='${domain}${"/widget/"+this.state.currentChallenge.id}'></iframe>` :''
        // let shortLink =  this.state.currentChallenge &&  this.state.currentChallenge.shortenedLink ? `${domain}${'/url/'+ this.state.currentChallenge.shortenedLink}` : '';
        let currentUser = getCurrentUser();
        let shortName2 = currentUser.brandName.replace(/[^a-zA-Z0-9\ ]/g, '').toLowerCase() || '';       
        let shortLink = this.state.currentChallenge && this.state.currentChallenge.name ? `${domain}${"/"+shortName2.replace(/\s/g, '%20') + '/'+encodeURIComponent(this.state.currentChallenge.name.trim().replace(/\s/g, '%20').replace(/\./g, 'dotC'))+'/upload'}` : '';
        const CustomizedAxisTick = React.createClass({
            render () {
              const {x, y, stroke, payload, width} = this.props;
              // const positionX = payload.value.length > 3 ? x + width/12: x;
              const positionX = x;
               return (
                <g transform={`translate(${positionX},${y})`}>
                  <text x={0} y={0} dy={16} textAnchor="middle" fontSize="9px" fill="#fff">{`${payload.value}`}</text>
                </g>
              );
            }
          });
          const CustomizedYAxisTick = React.createClass({
            render () {
              const {x, y, stroke, payload} = this.props;        
               return (
                <g transform={`translate(${x},${y})`}>
                  <text x={-10} y={0}  textAnchor="middle" fontSize="9px" fill="#fff">{`${payload.value}`}</text>
                </g>
              );
            }
          });  
          const CustomTooltip  = React.createClass({
            propTypes: {
              type: PropTypes.string,
              payload: PropTypes.array,
              label: PropTypes.string,
            },      
            render() {
              const { active } = this.props;      
              if (active) {
                const { payload, label } = this.props;
                if(label){
                  return (
                    <div className="custom-tooltip">
                    <p className="label">{payload[0].payload.week ? payload[0].payload.week : (payload[0].payload.month ? payload[0].payload.month : payload[0].payload.date)}</p>
                    <p className="desc">Uploads: {`${payload[0].value}`}</p>
                  </div>
                    
                  );
                }            
              }      
              return null;
            }
          });
        return (
            <div id="container">
                <div id="wrapper">
                    <SidebarClient shortName={shortName} selected="challenges" />
                    <NavHeaderClient title='' isShowedCreateChallenge={false} createChallenge={this.createChallenge} />
                    <div id="page-wrapper">
                    {this.state.loadingUpload && 
                        <ReactLoading type={'spinningBubbles'} color={'#d25408'} delay={0} height={64} width={64} className="spinner-loading" />
                    }                    
                    <Scrollbars autoHide style={{ height: window.innerHeight - 60 }} renderThumbVertical={({ style, ...props }) =>
                  <div {...props} style={{ ...style, backgroundColor: '#fff' }}/>
                  }>
                        <div className="container-fluid" style={{paddingLeft: '20px', paddingRight: '20px'}}>
                            <div className="challenge-detail">
                                <div className="row">
                                    <div className="col-lg-12 col-md-12 col-sm-12 col-xs-12 cover"><img src={userImg} style={{ maxHeight: '200px' }} /></div>

                                </div>
                                <div className="row">
                                    <div className="col-lg-12 col-md-12 col-sm-12 col-xs-12 title">

                                        <div className="name">{this.state.currentChallenge.name}</div>
                                        <div className="description">
                                            <span className="status">{this.state.currentChallenge.status}</span>
                                            <span className="time-line">({moment(this.state.currentChallenge.startDate).format('ll')} - {moment(this.state.currentChallenge.endDate).format('ll')})</span>
                                        </div>
                                        <div className="action-group">
                                             <button
                                             disabled={disableArchive} 
                                             className={!disableArchive ? "action archived" : "action archived disabled"} 
                                             onClick={() => this.handleChangeStatus('ARCHIVED')}>
                                             ARCHIVE
                                             </button> 
                                             
                                             <button 
                                             disabled={disableComplete} 
                                             className={!disableComplete ? "action completed" : "action completed disabled"} 
                                             onClick={() => this.handleChangeStatus('COMPLETED')}>
                                             COMPLETE
                                             </button>                                           
                                        </div>
                                    </div>
                                </div>
                                <div className="row">
                                    <div className="col-lg-6 col-md-6 col-sm-12 col-xs-12 content-block content-block-left">
                                        <div className="content-chart">
                                            <div className="header-chart">                                               
                                                <span className="pull-left title">Creator Uploads</span>
                                                <div className="pull-right">
                                                    <span onClick={() => this.changeUpload(1)} className={this.state.defaultUpload === 1 ? "right-title active" : "right-title"}>
                                                    Monthly
                                                    </span>
                                                    <span onClick={() => this.changeUpload(2)} className={this.state.defaultUpload === 2 ? "right-title active" : "right-title"}>
                                                    Weekly
                                                    </span>
                                                    <span onClick={() => this.changeUpload(3)} className={this.state.defaultUpload === 3 ? "right-title active" : "right-title"}>
                                                    Daily
                                                    </span>
                                                </div>                                                        
                                            </div>
                                            <div className="body-chart" style={{ width: '100%' }}>
                                                {this.state.dashboard ? <ResponsiveContainer>                                               
                                                    <AreaChart margin={{top: 10, right: 30, left: 0, bottom: 0}} fill='#32BEF3' data={dataUpload}>
                                                        <XAxis dataKey={dataKey} fill="#32BEF3" stroke="#32BEF3" strokeWidth={1} tick={<CustomizedAxisTick/>} />
                                                        <YAxis stroke="#ffffff" fill='32BEF3' strokeWidth={1} minTickGapNumber={1} allowDecimals={false} tick={<CustomizedYAxisTick/>}  />
                                                        <Tooltip content={<CustomTooltip/>}/>
                                                        <Area dataKey='uploads' fill='#32BEF3' dot={this.createCustomDot}/>
                                                    </AreaChart>      
                                                </ResponsiveContainer> : <span className="no-data">No data</span> }                                                
                                            </div>

                                        </div>
                                    </div>
                                    <div className="col-lg-6 col-md-6 col-sm-12 col-xs-12 content-block content-block-right">
                                        <div className="content-chart">
                                            <div className="header-chart">
                                                <span></span>
                                            </div>
                                            <div className="body-chart">
                                                <div className="chart chart-left">
                                                    <span style={{width: '93px'}}>Challenge Budget ${this.state.dashboard ? dashboard.totalBudget : 0}</span>
                                                    <div className="chartarea">                                                      
                                                        <ResponsiveContainer>
                                                        <PieChart width={200} height={200}>                                                        
                                                            <Pie stroke="none" isAnimationActive={false} data={data} dataKey='value' innerRadius={57} outerRadius={70}>
                                                                {
                                                                data.map((entry, index) => (
                                                                    <Cell fill={colors[index]} key={index} />
                                                                ))
                                                                }
                                                                <LabelList dataKey='text' strokeWidth="0" stroke="#fff" position="outside" />
                                                            </Pie>                                                               
                                                        </PieChart>
                                                        </ResponsiveContainer>
                                                    </div>
                                                    <div className="textarea">
                                                        <i className="fa fa-square reward-spend" aria-hidden="true"></i> Rewards Spent
                                                    </div>
                                                </div>
                                                <div className="chart chart-right">
                                                    <span>Total Uploads {this.state.dashboard ? dashboard.totalUploads : 0}</span>
                                                    <div className="chartarea">      
                                                    {noData ?
                                                    <ResponsiveContainer>                                                  
                                                    <PieChart width={200} height={200}>                                                        
                                                        <Pie stroke="none" isAnimationActive={false} dataKey='value' data={dummy}  innerRadius={57} outerRadius={70}>
                                                            {
                                                                dummy.map((entry, index) => (
                                                                <Cell fill={colors[1]} key={index} />
                                                            ))
                                                            }
                                                        </Pie>                                                           
                                                    </PieChart>     
                                                    </ResponsiveContainer>  :
                                                    <ResponsiveContainer>                                                  
                                                    <PieChart width={200} height={200}>                                                        
                                                        <Pie stroke="none" isAnimationActive={false} dataKey='value' data={data2}  innerRadius={57} outerRadius={70}>
                                                            {
                                                            data2.map((entry, index) => (
                                                                <Cell fill={colors2[index]} key={index} />
                                                            ))
                                                            }
                                                            <LabelList dataKey='text' strokeWidth="0" stroke="#fff" position="outside" />
                                                        </Pie>                                                            
                                                    </PieChart>     
                                                    </ResponsiveContainer>  }                                                 
                                                    </div>
                                                    <div className="textarea">
                                                        <i className="fa fa-square image-upload" aria-hidden="true"></i>Photos
                                                        <i className="fa fa-square video-upload" aria-hidden="true"></i>Videos
                                                    </div>
                                                </div>
                                            </div>

                                        </div>

                                    </div>
                                </div>
                                <div className="row">
                                    <div className="col-lg-6 col-md-6 col-sm-12 col-xs-12 content-block content-block-left">
                                        <div className="chart-block">     
                                            <div className="content-chart">
                                                <div className="header-chart">
                                                    <span className="pull-left title">Uploads by Location</span>
                                                    <span className="pull-right"></span>
                                                </div>
                                                <div className="body-chart">
                                                   {this.state.dashboard && <MapDashBoard dataSet={this.state.dashboard ?dashboard.location:[]} height="260" />}
                                                </div>                                            
                                            </div>
                                        </div>
                                    </div>
                                    <div className="col-lg-6 col-md-6 col-sm-12 col-xs-12 content-block content-block-right">
                                        <div className="content-chart">
                                            <div className="header-chart">
                                                <span>Top Creators</span>
                                            </div>
                                            <div className="body-chart">
                                                <div className="table-responsive scroll-peihgn">
                                                {this.state.dashboard? 
                                                <table className="table">
                                                        <thead>
                                                            <tr>
                                                                <th className="text-left">First Name</th>
                                                                <th className="text-left">Last Name</th>
                                                                <th className="text-left">Country</th>
                                                                <th>Total Uploads</th>
                                                                <th>Rewards</th>
                                                            </tr>
                                                        </thead>
                                                        <tbody>
                                                           {this.state.dashboard.topCreators.map(this.renderTopCreator, this, '')}                                                         
                                                        </tbody>
                                                    </table> 
                                                    :
                                                    <table className='table'>
                                                        <thead>
                                                            <tr>
                                                                <th>No data</th>
                                                            </tr>
                                                        </thead>
                                                    </table> }
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                                <div className="row">
                                    <div className="col-lg-6 col-md-6 col-sm-12 col-xs-12 content-block content-block-left"
                                        style={{height: '185px'}}>                                                                             
                                            <div className="content-embededcode">
                                                <div className="header-embededcode">
                                                    <span className="pull-left title">Widget Embed code</span>
                                                </div>
                                                <CopyToClipboard text={embeddedCode}
                                                    onCopy={() => this.copyToClipboard()}>
                                                    <button className="btn btn-large btn-embedded">Copy Embed Code</button>
                                                    </CopyToClipboard>
                                                <div className="body-embededcode">
                                                    <div className="detail">
                                                        <span>{embeddedCode}</span>                                                        
                                                    </div>                                                                                                        
                                                </div>                                            
                                            </div>                        
                                    </div>
                                    <div className="col-lg-6 col-md-6 col-sm-12 col-xs-12 content-block content-block-right"
                                        style={{height: '185px'}}>                                                                             
                                            <div className="content-embededcode">
                                                <div className="header-embededcode">
                                                    <span className="pull-left title">Webpage Link</span>
                                                </div>
                                                <CopyToClipboard text={shortLink}
                                                    onCopy={() => this.copyToClipboard()}>
                                                    <button className="btn btn-large btn-embedded">Copy Webpage Link</button>
                                                </CopyToClipboard>
                                                <div className="body-embededcode">
                                                    <div className="detail">
                                                        <span>{shortLink}</span>                                                        
                                                    </div>                                                                                                        
                                                </div>                                            
                                            </div>                        
                                    </div>
                                </div>
                                </div>
                        </div>
                    </Scrollbars>
                    </div>
                </div>
                <CreateChallenge shortName={shortName} openCreateChallenge={this.state.openCreateChallenge} closeModal={this.closeModal} />
                <Modal
                    isOpen={this.state.isOpenCompleted}
                    onAfterOpen={this.afterOpenModal}
                    onRequestClose={this.closeModal}
                    className={{
                        base: 'customConfirm_Modal',
                        afterOpen: 'customConfirm_after-open',
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
                                <span className='title-confirm-popup'>{"Challenge has been completed!"}</span>
                            </div>
                        </div>
                    </form>
                </Modal>
                <Modal
                    isOpen={this.state.isOpenArchived}
                    onAfterOpen={this.afterOpenModal}
                    onRequestClose={this.closeModal}
                    className={{
                        base: 'customConfirm_Modal',
                        afterOpen: 'customConfirm_after-open',
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
                                <span className='title-confirm-popup'>{"Challenge has been archived!"}</span>
                            </div>
                        </div>
                    </form>
                </Modal>
                <Modal
                    isOpen={this.state.copied}
                    onRequestClose={this.closeModalCopy}
                    className={{
                        base: 'customConfirm_Modal',
                        afterOpen: 'customConfirm_after-open',
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
                                <span className='title-confirm-popup'>Copied</span>
                            </div>
                        </div>
                    </form>
                </Modal>
            </div>
        );
    }
}
