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
    this.state = {
        clientPage: 0,
        challengePage:0,
        clientMaxRecords: window.innerWidth > 767 ? 8 : 6,   
        challengeMaxRecords: 3,     
        listClient: [],
        loadingUpload: false,
        selectedClient: [],
        challengeList: [],
        total: 0, 
        totalPage: 0,
        calculated: false,
        default: true,
        pageLoaded: 0,
        activePage: 1,
        pagesLoaded: [],
        clientsLoaded: {},
        listAll: [],
        isOpen: false,
        isOpen2: false,
        openModal: false,
        typeModal: '',
        classModal: '',
        activeSection: null,
        openMenu: false
      }
  }
  componentWillReceiveProps(nextProps){     
      const { client } = this.props;
      const { client: nextClient } = nextProps;
      let { selectedClient, pagesLoaded, clientPage, clientsLoaded, listAll } = this.state;
      client.loadingIcon != nextClient.loadingIcon && nextClient.loadingIcon == 1 ? this.setState({loadingUpload: true}) :'';
      client.loadingIcon != nextClient.loadingIcon && nextClient.loadingIcon != 1 ? this.setState({loadingUpload: false}) :'';
      if(nextClient.success && nextClient.listClient.listClient.length > 0 && this.state.default){
        this.setState({default: false}, this.handleSelect(nextClient.listClient.listClient[0], 0));
        nextClient.listClient.listClient[0].selected = true;
      }
      
      if(nextClient.success && nextClient.listClient){       
        let selectedClient = this.state.selectedClient;
        const listClientNew = nextClient.listClient.listClient;
        _.forEach(listClientNew , (lcn) => { 
            lcn.page = clientPage;
        });
        selectedClient.map(data => {
           let index = _.findIndex(listClientNew, data2 => data2.id == data.id );
           index != -1 ? listClientNew[index].selected = true : '';
        })
        this.setState({
            listAll: listAll.concat(listClientNew), 
            listClient: nextClient.listClient.listClient, 
            total: nextClient.listClient.total, 
            pageLoaded: this.state.clientPage,
            clientPage,
            pagesLoaded
        });       
      }else{
        this.setState({error: nextClient.error});
      } 
    if(this.state.openMenu){
       this.handleClose();
    };
    }    
    handleSideMenu = (elem) =>{     
        this.refs.sideMenu._handleScrollCallback();
    }
  componentDidMount(){   
    this.callAPI(this.state.clientPage, this.state.clientMaxRecords);
    this.setState({loadingUpload: true, activeSection: 0});    
    const elem = document.getElementsByClassName("Navigation-Anchor");    
    //intro
    elem[0].addEventListener("click", this.handleSideMenu);
    //brand
    elem[1].addEventListener("click", this.handleSideMenu);
    //challenge
    elem[2].addEventListener("click", this.handleSideMenu);
  }

  handlePageChange = (pageNumber) => {
    const realPage = pageNumber - 1;
    const {listAll, listClient, clientPage, clientMaxRecords, pagesLoaded} = this.state;
    let selectedClientPage = [];
      if(!pagesLoaded.includes(realPage)){
            this.callAPI(realPage, clientMaxRecords);
        }else{           
            selectedClientPage = listAll.filter((data) => data.page == realPage);
        }

    this.setState({clientPage: realPage, listClient: selectedClientPage, loadingUpload: false});
  }
  callAPI = (clientPage, maxRecords) => {
    let { pagesLoaded } = this.state;
    const errorCode = sessionStorage.getItem('errorStatus');    
    if (errorCode == 201) {       
        this.props.getList('', clientPage, maxRecords);   
    } else {
        const {token } = getCurrentUser();
        const found = pagesLoaded.find((element) => {
            return element == clientPage+1;
          });
        this.props.getList(!token ? '' : token, clientPage, maxRecords);      
    }    
  }

  handleSelect = ( data, index ) => {
    let { selectedClient, challengeList, listClient } = this.state;
    let found = _.findIndex(selectedClient, data) != -1;
    if(!found){
        selectedClient.push(data);        
        challengeList.concat(data.listChallenge);
        listClient.length > 0 ? this.state.listClient[index].selected = true: '';
        _.forEach(data.listChallenge , (key) => {
            key.logo = data.logo;  
            challengeList.push(key);
        });
    }else{
        selectedClient.splice(_.findIndex(selectedClient, data), 1);
        this.state.listClient[index].selected = false;
        const evens = _.remove(challengeList, chl => {
            return chl.clientId == data.id;
        });
    }  
    this.setState({ selectedClient, challengeList });
  }
  renderClient = (data, index) => {
      let imgUrl;
      data.logo.length > 0 ? imgUrl = s3URL+data.logo : imgUrl = imgItem; 
      return (   
        <div key={data.id + "-" + index} onClick={() => this.handleSelect( data, index )}  className={ `grid_3 wow fadeInUp` } data-wow-delay="0.6s">
            <a className="thumb">
                <img src={imgUrl} alt=""/>                
                <span className={classNames( { 'thumb_overlay selected': this.state.listClient[index].selected, 'thumb_overlay': !this.state.listClient[index].selected })}><i className="icon-check-icon"></i></span>                
            </a>                                
        </div>    
      )
  }
  renderChallenge = (data, index) => {
    let imgUrl;
    let { selectedClient } = this.state;
    let brandName = selectedClient.filter(dataCl => dataCl.id == data.clientId)[0].brand_name;     
    data.imageUri ? imgUrl = s3URL+data.imageUri : imgUrl = imgItem; 
    let logoUri = data.logo ? s3URL+data.logo : imgItem; 
      return (       
        <div className="grid_4 center wow fadeIn animated" key={data.id + "-" + index}>
            <div className="card">
                <div className="card-image">
                    <img className="img-responsive" src={imgUrl} />
                    <a className="float"><img src={logoUri} /></a>
                </div>            
                <div className="card-content">
                    <span className="card-title">
                    {`${data.name} challenge`}                    
                    </span>
                    <LinesEllipsis
                        text={data.description}
                        maxLine='4'
                        ellipsis='...'
                        trimRight
                        basedOn='letters'
                        />
                </div>            
                <div className="card-action">
                    <span className="name pull-left">{brandName}</span>
                    <span className="date pull-right">{moment(data.startDate).format('ll') + ' to ' + moment(data.endDate).format('ll')}</span>
                </div>
            </div>
    </div>
      )
  }
  handlePagination = (type, e) => {
      e.preventDefault();
      let { clientPage, clientMaxRecords, listAll, pageLoaded } = this.state;
      this.setState({loadingUpload: true});
      if ( type == 'next') {
        this.handlePageChange(clientPage+2);
      } else {
        this.handlePageChange(clientPage);
      }    
     
  }
  openModalTerm = () =>{
    this.setState(prevState => ({
        openModal: !this.state.openModal,
        typeModal: 'Term',
        classModal: 'custom-modal-terms-and-condition'
    }));
  }
  openModalPolicy = () =>{
    this.setState(prevState => ({
        openModal: !this.state.openModal,
        typeModal: 'Policy',
        classModal: 'custom-modal-terms-and-condition'
    }));
  }
  openSignIn = () =>{
    this.setState(prevState => ({
        openModal: !this.state.openModal,
        typeModal: 'Login',
        classModal: 'creator-login'
    }));
  }
    closeModal = () => {
        this.setState({openModal: false});
    }   
    handleMenu = () =>{               
        this.setState({openMenu: !this.state.openMenu});
    }
    handleClose = () => {                 
        this.setState({openMenu: false}, this.refs.menu.handleClick());
    }
    render() {      
    const { listClient, total, challengeList, selectedClient, totalPage, clientMaxRecords } = this.state;
    let scrollbarStyles = {borderRadius: 5};
    let settings = {
        arrows: false,
        dots: true,
        slidesToShow: 3,
        slidesToScroll: 3,
        centerMode: false,
        autoplay: false,        
        initialSlide: 0,
        infinite: challengeList.length > 3,  
        responsive: [ 
            { breakpoint: 500, settings: { 
                slidesToShow: 2,
                slidesToScroll: 2,
                swipeToSlide: true,
                swipe: true
            } }
        ]
    }
    let options = {
        activeClass:          'active',        
        anchors:              ['intro', 'brand', 'challenge'],
        // lockAnchors: true,
        scrollBar:            false,
        navigation:            true,
        verticalAlign:        false,
        sectionPaddingTop:    '0px',
        arrowNavigation:      true,
        dragAndMove: 'fingersonly',
        activeSection: this.state.activeSection,
        scrollCallback: () => {            
            window.location.hash.length > 0 ? window.history.replaceState("", document.title, window.location.pathname + window.location.search) :'';      
        }
    };
    let styleDisableBtn = {};
    if(this.state.loadingUpload){
        styleDisableBtn.pointerEvents = 'none',
        styleDisableBtn.opacity = 0.5;
    }
    return (
        <div  id="container" style={{ background: '#fff', height: `${window.innerHeight}px` }}>
                {this.state.loadingUpload &&
                <ReactLoading type={'spinningBubbles'} color={'#d25408'} delay={0} height={64} width={64} className="spinner-loading" />
                }
            <div className="new-creator-page">
            <nav className="navbar navbar-default navbar-static-top m-b-0">
                <div className="headernav navbar-header">
                    <div className="top-left-part">
                        <a className="logo logoHeader closemarginLogo">                       
                          <a href="/index.html" target="_top"><img src={logoImg} className="dark-logo"/></a>
                        </a>
                    </div>
                    <ResponsiveMenu
                    ref="menu"
                        menuOpenButton={<div  onClick={this.handleMenu} ><i className="fa fa-bars"></i></div>}
                        menuCloseButton={<div  onClick={this.handleMenu} ><i className="icon-thick-delete-icon"></i></div>}
                        changeMenuOn="500px"
                        largeMenuClassName="large-menu"
                        smallMenuClassName="small-menu"
                        menu={
                            <ul className="nav navbar-top-links navbar-right pull-right"> 
                             <li className="link">        
                                    <a href="/index.html" target="_top">Home</a>               
                                    {/* <Link to={`/`}>Home</Link> */}
                                    {/* <a href="./">Home</a> */}
                                </li>
                                <li className="link active">                       
                                    {/* <Link to={`/challenge`}>Challenges</Link> */}
                                    <a href="#intro">Challenges</a>
                                </li>                               
                                {/* <li className="link">
                                    <a href="#brand">Brands</a>                       
                                </li>
                                <li className="link">    
                                    <a href="#challenge">Challenges</a>                      
                                </li> */}
                                <li className="link">                       
                                    <Link to={`creator`}>Sign in</Link>
                                </li>
                        </ul>
                        }
                    /> 
                </div>    
            </nav>
                            
                <div className="page" onScroll={this.handleScroll} style={{height: `${window.innerHeight - 74}px`}}>
             
                    {window.innerWidth > 200 && <SectionsContainer ref="sideMenu" {...options}>
                        <Section>
                            <div className="intro" style={{backgroundImage: "url(" + challengeBg + ")" ,height: `${window.innerHeight - 74}px`}}>
                        
                                <div className="group-step">
                                    <div className="step">
                                        <i className="icon-brand-icon"></i>
                                        <p>Select Brand</p>
                                    </div>
                                    <div className="next-step">
                                    <i className="icon-arrow-right"></i>
                                    </div>
                                    <div className="step">
                                        <i className="icon-challenge-icon"></i>
                                        <p>Choose Challenge</p>
                                    </div>
                                    <div className="next-step">
                                    <i className="icon-arrow-right"></i>
                                    </div>
                                    <div className="step">
                                        <i className="icon-upload-icon-box"></i>
                                        <p>Upload Pic/Video</p>
                                    </div>
                                    <div className="next-step">
                                    <i className="icon-arrow-right"></i>
                                    </div>
                                    <div className="step">
                                        <i className="icon-thumb-up-icon"></i>
                                        <p>Get rewarded!</p>
                                    </div>

                                </div>
                            </div>
                        </Section>
                        <Section>
                            <div className="container-fluid brand" style={{height: `${window.innerHeight - 74}px`}}>
                                <div className="header-brand">
                                    <span>Brands ({total})</span>                            
                                </div>
                                <div className="body-brand client-area">
                                    <div className="number-brand">
                                        <span className="number pull-left">{selectedClient.length} Selected</span>
                                        <span className="message pull-right">* Select as many brands as you like</span>
                                    </div>

                                    <div className="list-brand">
                                        <div className="row text-center">                 
                                        { listClient.length > 0 ? listClient.map(( data, index ) => this.renderClient(data, index)) : '' }                                  
                                        { (listClient.length == 0 && !this.state.loadingUpload) ? 'There are currently no clients available!' : '' }                                  
                                        </div>                            
                                    </div>
                                    <div className="change-list-brand">
                                        {this.state.clientPage > 0 &&                                   
                                                <a style={styleDisableBtn} className="nextPrev-btn prevbtn"><span onClick={(e) => this.handlePagination('previous', e)}>Previous</span></a>
                                        }
                                        { (total > 0 && (this.state.clientPage + 1) < Math.ceil(total/clientMaxRecords)) &&                                    
                                                <a style={styleDisableBtn} className="nextPrev-btn nextbtn"><span onClick={(e) => this.handlePagination('next', e)}>Next</span></a>
                                        }
                                        {(Math.ceil(this.state.total/this.state.clientMaxRecords) > 1) && <Pagination
                                        hideDisabled
                                        hideNavigation
                                        hideFirstLastPages={true}
                                        prevPageText={<i className='glyphicon glyphicon-menu-left'/>}
                                        nextPageText={<i className='glyphicon glyphicon-menu-right'/>}
                                        pageRangeDisplayed={Math.ceil(this.state.total/this.state.clientMaxRecords)}
                                        activeClass="item-active"
                                        itemClass="item-paging"
                                        itemsCountPerPage={this.state.clientMaxRecords}
                                        totalItemsCount={this.state.total}
                                        activePage={this.state.clientPage+1}
                                        onChange={this.handlePageChange}
                                        /> 
                                        }                                
                                        
                                    </div>
                                </div>
                                
                            </div>
                        </Section>
                        <Section>
                            <div className="container-fluid brand challenge" style={{height: `${window.innerHeight - 74}px`}}>
                                <div className="header-brand">
                                    <span>Active Challenges ({challengeList.length})</span>
                                    {selectedClient.length > 0 ?                                     
                                    <p><LinesEllipsis
                                        text={`(Selected Brands - ${selectedClient.map( (data,index) => { return data.brand_name })})`}
                                        maxLine='2'
                                        ellipsis='...'
                                        trimRight
                                        basedOn='letters'
                                        /></p> 
                                    : ''}
                                </div>
                                <div className="body-brand">
                                    <div className="list-active-challenge">
                                        <div className="row">                                
                                            {challengeList.length > 0 ?
                                                <Slider {...settings}>                                             
                                                    {challengeList.map(this.renderChallenge, this, '')}
                                                </Slider> : 
                                            'No data'}                                                        
                                        </div>                                                               
                                    </div> 
                                                        
                                </div>
                                <div className="row footer-page">
                                    <div className="col-md-7 col-sm-7 col-xs-12 footer-row">
                                        <div className="col-md-4 col-sm-5 email">
                                            <a href="mailto:info@entribe.com"><i className="icon-email-icon"></i><span>info@entribe.com</span></a>
                                        </div>
                                        <div className="col-md-4 col-sm-5 email icon-phone-footer">
                                            <a><i className="icon-phone-icon"></i><span>(510) 629-9029</span></a>
                                        </div>
                                                                    
                                    </div>
                                    <div className="col-md-5 col-sm-5 col-xs-12 footer-row">
                                    
                                        <div className="term">
                                            <span style={{cursor: 'pointer'}} onClick={this.openModalTerm}>Terms and Conditions</span>  
                                        </div>
                                        <div className="policy">
                                            <span style={{cursor: 'pointer'}} onClick={this.openModalPolicy}>Privacy Policy</span>  
                                        </div>
                                        
                                        
                                    </div>
                                </div>
                            </div>
                        </Section>
                    </SectionsContainer>
                    }
                    
                    
                    
                       
                </div>              
            </div>  
            <ModalModule type={this.state.typeModal} classModal={this.state.classModal} openModal={this.state.openModal} closeModal={this.closeModal} />             
        </div>
      
    );
  }
}