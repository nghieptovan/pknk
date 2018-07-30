import React, {Component, PropTypes} from 'react';
import {Router, Route, browserHistory} from 'react-router';
import {connect} from 'react-redux';
import * as ClientActions from '../../redux/actions/client';
import NavHeader from '../NavHeader/NavHeaderCreator';
import BrandBody from './BrandBody';
import Upload from './Upload';
import constructionImg from '../../assets/page_construction.jpg';
import _ from 'lodash';
import { getCurrentUser } from '../../utils/common';
import ReactLoading from 'react-loading';
import Modal from 'react-modal';
import history from '../../index';
@connect(
  state => ({
    client: state.client  
  }),
  ({
    getList: (token,page,maxRecords) => ClientActions.getListLiveChallenge(token, page, maxRecords),
    changeSubscriptionStatus: (token,data) => ClientActions.changeSubscriptionStatus(token, data)
  }
  )
)
export default class Brand extends Component {
  constructor(props){
    super(props);
    this.state = {
      openUpload: false,
      idChallengeSet: 0,   
      loadingUpload: null,
      listClient: []
    }
  }
  static propTypes = { 
    challenge: PropTypes.object   
  };

  componentWillMount(){
    //token , page, maxRecords (10000) for old page
    const errorCode = sessionStorage.getItem('errorStatus');
    if (errorCode == 201) {
      this.props.getList('', 0, 10000);   
    } else {
    let {token } = getCurrentUser();
    this.props.getList(!token ? '' : token, 0, 10000);      
    }
    this.setState({loadingUpload: true});
  }
  componentWillReceiveProps(nextProps){
    const { client } = this.props;
    const { client : nextClient } = nextProps;
    client.loadingSub != nextClient.loadingSub && client.changeStatus != nextClient.changeStatus && nextClient.changedInfo ?
    this.setState({listClient : nextClient.changedInfo}, this.showSuccessModal()) : '';
    client.loadingSub != nextClient.loadingSub && nextClient.loadingSub == 1 ? this.setState({loadingUpload2: true}): '';
    client.loadingSub != nextClient.loadingSub && nextClient.loadingSub != 1 ? this.setState({loadingUpload2: false}): '';
    client.loadingGetLiveChallenge != nextClient.loadingGetLiveChallenge && nextClient.loadingGetLiveChallenge == 1 ? this.setState({loadingUpload : true}) : '';
    client.loadingGetLiveChallenge != nextClient.loadingGetLiveChallenge && nextClient.loadingGetLiveChallenge == 2 ? this.setState({loadingUpload : false, listClient : nextClient.listClient}) : '';
    client.loadingGetLiveChallenge != nextClient.loadingGetLiveChallenge && nextClient.loadingGetLiveChallenge == 3 ? this.setState({loadingUpload : false}) : '';
    const errorCode = sessionStorage.getItem('errorStatus');
    errorCode == 201 || errorCode == 501 ? this.setState({loadingUpload: false}) : ''; 
  }
  openUpload = (idChallenge) => {
    this.setState({openUpload: true, idChallengeSet: idChallenge});
  }
  showSuccessModal = () => {
    this.setState({openModal: true, loadingUpload: false});
    this.startTimer(); 
  }
  startTimer = () => {
    this.setState({ timeCountDown: 1000 });
    setTimeout(() => {
      this.closeSuccessModal();
    }, 1000);
  }
  closeSuccessModal = () => {
    this.setState({openModal: false});
  }
  closeModal = () => {
    this.setState({openUpload: false});
  }
  changeStatus= (clientId, isSubscribed) =>{
    const {token, id} = getCurrentUser();
    let data = { creatorId: id, clientId, isSubscribed};
    this.setState({status: isSubscribed ? 'Subscribed' : 'Unsubscribed'});
    this.props.changeSubscriptionStatus(token, data);
  }
  render() {    
    const { client: {listClient} } = this.props;    
    return (
      <div id="container">        
          <NavHeader openUpload={false}/>
          <BrandBody changeStatus={this.changeStatus} loadingUpload={this.state.loadingUpload} loadingUpload2={this.state.loadingUpload2} openUpload={ this.openUpload} listClient={this.state.listClient} />     
          <Modal
          isOpen={this.state.openModal}
          onRequestClose={this.closeSuccessModal}
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
                <span className='title-confirm-popup'>{this.state.status} successfully!</span>
              </div>
            </div>
          </form>
        </Modal>
        </div>
    );
  }
}