import React, { Component, PropTypes } from 'react';
import _ from 'lodash';
import Modal from 'react-modal';
import './Uploads.scss';
import LazyLoad from 'react-lazy-load';
import classNames from 'classnames';
import { Scrollbars } from 'react-custom-scrollbars';
import { s3URL } from '../../config';
import { ReactHeight } from 'react-height';
import ReactLoading from 'react-loading';
import history from '../../index';
import 'react-tagsinput/react-tagsinput.css';
import { Field, reduxForm, formValueSelector, change } from 'redux-form';
import DatePickerCustomImport from '../DatePickerCustom/DatePickerCustomImport';
import { connect } from 'react-redux';
import './MediaPopup.scss';
import * as ClientActions from '../../redux/actions/client';
import { getCurrentUser } from '../../utils/common';
import { Checkbox, CheckboxGroup } from 'react-checkbox-group';
import moment from 'moment';
import { SelectableGroup, createSelectable } from 'react-selectable';
import MediaItem from './MediaItem';


const SelectedUploadItem = createSelectable(MediaItem);

const isNodeInRoot = (node, root) => {
  while (node) {
    if (node === root) {
      return true;
    }
    node = node.parentNode;
  }

  return false;
};

const selector = formValueSelector('searchMedia');
@connect(
    state => ({
        client: state.client,
        fields: selector(state, 'fromDate', 'toDate')
    }),
    ({
        getInstagramMedia: (clientId) => ClientActions.getInstagramMedia(clientId),
        resetExport: () => ClientActions.resetExport(),
        exportUsername: (clientId, token, users) => ClientActions.exportUsername(clientId, token, users),
        getInstagramMediaByPage: (data) => ClientActions.getInstagramMediaByPage(data),
        getHashtags: (clientId, token) => ClientActions.getHashtags(clientId, token),
        addHashtags: (clientId, token, tag) => ClientActions.addHashtags(clientId, token, tag),
        searchInstagramMedia: (data) => ClientActions.searchInstagramMedia(data),
        changeFieldValue: (field, value) => change('searchMedia', field, value),
        importFromInstagram: (clientId, access_token, access_time, listId) => ClientActions.importFromInstagram(clientId, access_token, access_time, listId)
    }
    )
)
export default class MediaPopup extends Component {
    constructor(props) {
        super(props);
        this.state = {
            tags: [],
            hashTags: '',
            hashtagsArray: [],
            fromError: '',
            toError: '',
            listMedia: [],
            selected: [],
            screen: 'media',
            hashtags: [],
            valueHashtag: '',
            inputSearch: false,
            tagAdded: false,
            defaultDate: true,
            hashTagSelect: [],
            pageIndex: 0,
            isCallAPI: false,
            socialSource: 'instagram'
        };
    }
    componentWillReceiveProps(nextProps) {
        const { client } = this.props;
        const { client: nextClient } = nextProps;    
        let { listMedia, pageIndex } = this.state;    

        (client.getStatus !== nextClient.getStatus && nextClient.getStatus === 1) ?  this.setState({loadingUpload: true}) : '';
        // (client.getStatus !== nextClient.getStatus && nextClient.getStatus === 2) ?  this.setState({loadingUpload: false, hashtags: nextClient.hashtags.split(","), originalHashtags: nextClient.hashtags.split(",")}) : '';
        (client.getStatus !== nextClient.getStatus && nextClient.getStatus === 2) ?  this.setState({loadingUpload: false }) : '';
        (client.getStatus !== nextClient.getStatus && nextClient.getStatus === 3) ?  this.setState({loadingUpload: false}) : '';

        (client.addStatus !== nextClient.addStatus && nextClient.addStatus === 1) ?  this.setState({loadingUpload: true}) : '';
        (client.addStatus !== nextClient.addStatus && nextClient.addStatus === 2) ?  this.setState({loadingUpload: false, hashtagsArray: [], tagAdded: true, hashtags: nextClient.hashtags.split(","), originalHashtags: nextClient.hashtags.split(",")}) : '';
        (client.addStatus !== nextClient.addStatus && nextClient.addStatus === 3) ?  this.setState({loadingUpload: false, error: nextClient.hashtagsError}) : '';

        (client.getInstagramStatus !== nextClient.getInstagramStatus && nextClient.getInstagramStatus === 1) ? this.setState({loadingUpload: true}) : '';

        if (client.getInstagramStatus !== nextClient.getInstagramStatus && nextClient.getInstagramStatus === 2) {
            listMedia = _.concat(listMedia, nextClient.mediaList);
            pageIndex++;
            this.setState({ listMedia, pageIndex, isCallAPI: nextClient.mediaList.length > 0 ? false : true, error: '', originalMedia: listMedia, loadingUpload: false });
        }

        if (client.importInstagramStatus !== nextClient.importInstagramStatus && nextClient.importInstagramStatus == 2 ) {
            this.props.currentChallenge ? this.props.handleSelect(this.props.currentChallenge) : '';
            this.setState({loadingUpload: false, clickImport: false});
            this.closeModal();
        }
        if (nextClient.getInstagramError || nextClient.importInstagramError) {
            if (nextClient.importInstagramError.includes("username=")){
                let msg ="Some of these creators are not registered.  We recommend sending them a DM and asking them to register.  Do you want to download a list of their IG usernames?";
                this.setState({openModal: true, msg, users: nextClient.importInstagramError.substring(9)});
                nextClient.importInstagramError = null;
            } else {
                 this.setState({ error: nextClient.getInstagramError || nextClient.importInstagramError });
            }                       
        }
        this.state.setFields ? this.validateDate() : '';
        client.exportStatus != nextClient.exportStatus && nextClient.exportResult ? this.exportUsername(nextClient.exportResult) : '';
        client.exportStatus != nextClient.exportStatus && nextClient.exportError ? this.setState({error: nextClient.exportError}) : '';
    }
    componentDidMount(){
        // this.handleSearch();
    }
    
	handleToleranceChange = (e) => {
		this.setState({
			tolerance: parseInt(e.target.value)
		});
	}
	toggleSelectOnMouseMove = () => {
		this.setState({
			selectOnMouseMove: !this.state.selectOnMouseMove
		});
	}
    closeModal = () => {
        this.props.reset();
        this.props.changeFieldValue('fromDate', '');
        this.props.changeFieldValue('toDate', '');
        this.setState({ listMedia: [], selected: [], isCallAPI: false, pageIndex: 0, hashtagsArray: [], setFields: false, valueHashtag: '', error: '', errorTag: '', errorTags: '', hashTagSelect: [], tagAdded: false });
        this.props.closePopup();
    }
    afterOpenModal = () => {
        const { clientId, startDate, token } = getCurrentUser();
        // this.props.getInstagramMedia(clientId);
        this.props.getHashtags(clientId, token); 
        this.props.reset();
        moment.locale('en-gb');
        this.props.changeFieldValue('fromDate', moment(startDate).format('ll'));
        this.props.changeFieldValue('toDate', moment().format('ll'));
        this.setState({ setFields: true, isCallAPI: false, pageIndex: 0 });
        this.callAPI(0);
    }
    validateDate = () => {
        let fromError = '';
        let toError = '';
        let requireMsg = "This field is required!";
        if (!this.props.fields.fromDate) {
            fromError = requireMsg;
        }
        if (!this.props.fields.toDate) {
            toError = requireMsg;
        }
        const fromDate = new Date(this.props.fields.fromDate).getTime();
        const toDate = new Date(this.props.fields.toDate).getTime();
        if (fromDate > toDate) {
            fromError = "From date can't be greater than to date";
        }
        this.setState({ fromError, toError });
    }
    renderUploadItem = (data) => {
        return (
            <div className="image_list col-md-3 col-sm-4 col-xs-6" key={data.id + data.mediaId}>
                <div className="image-thumb">
                    <header className="image-header hover-img">
                        {data.type && data.type.includes('video') && <div className="video-icon">
                            <i className="icon-play-icon"></i>
                        </div>}
                        <Checkbox value={data.id} key={data.id + data.mediaId} />
                        <LazyLoad height={150}>
                            <img className="lazy" src={data.type == 'video' ? data.thumbnail : data.imgUrl} />
                        </LazyLoad>
                    </header>
                </div>
            </div>
        )
    }
    handleSelect = (data) => {
        if(data.length > 20){
            this.setState({error: 'Please choose 20 contents or less per import!'})
        } else{           
            this.setState({ selected: data, error: '' });
        }       
    }
    removeTag = (data) => {
        let { hashtagsArray } = this.state;
        _.remove(hashtagsArray, obj => obj == data);
        this.setState({ hashtagsArray, error: '', tagAdded: false });
    }
    renderHashtagItem = (data, index) => {
        const checkExist = this.state.hashTagSelect.includes(data);
        return (
            data ? 
            <div className={classNames('react-tagsinput-tag', { 'selected': checkExist })} onClick={() => this.handleHashtag(data, index)} key={`addrewardlevel${data}`}>
                <span>
                    #{data}
                </span>
                <span className='delete-hashtag' onClick={() => this.removeTag(data)}>x</span>
            </div> : null
        )
    }
    renderHashtagItem2 = (data, index) => {      
        const checkExist = this.state.hashTagSelect.includes(data);         
        return (
            data ? <div className={classNames('react-tagsinput-tag', { 'selected': checkExist })} onClick={() => this.handleHashtag(data, index)} key={`addrewardlevel${index}`}>
                <span>
                    #{data}
                </span>                
            </div>
            :  null
        ) ;
    }
    callAPI = (pageIndex = 0, source = this.state.socialSource) => {     
        const maxRecords = 100;
        const { clientId } = getCurrentUser();
         let data = {
            clientId,
            maxRecords,
            pageIndex,
            source
        };
        this.props.getInstagramMediaByPage(data);
        // this.props.handleLoading(true);
    }   
    
    handleSearchMedia = () => {
        let { hashtagsArray, tags, valueHashtag, errorTag, hashTagSelect, hashtags } = this.state; 
        valueHashtag = valueHashtag ? valueHashtag.replace(/#/g, '') : '';             
        if ( valueHashtag.length > 0) {            
            let findKey = hashtags.findIndex(k => k === valueHashtag);
            if(findKey !== -1){  
                hashTagSelect.findIndex(k => k === valueHashtag) === -1 ? hashTagSelect.push(valueHashtag) : '';
            }else{
                tags.push(valueHashtag);
                hashtagsArray.push(valueHashtag);
                hashTagSelect.findIndex(k => k === valueHashtag) === -1 ? hashTagSelect.push(valueHashtag) : '';
            }
            this.setState({ hashtagsArray, tags, hashTagSelect, valueHashtag: '', errorTags: '', errorTag: '', error: '', tagAdded: false });
        }                
    }

    handleSearchMediaExist = () => {
        let { hashtagsArray, tags, valueHashtag, errorTag, hashTagSelect, hashtags } = this.state; 
        valueHashtag = valueHashtag ? valueHashtag.replace(/#/g, '') : '';             
        if ( valueHashtag.length > 0) {            
            let findKey = hashtags.findIndex(k => k === valueHashtag);
            if(findKey !== -1){  
                hashTagSelect.findIndex(k => k === valueHashtag) === -1 ? hashTagSelect.push(valueHashtag) : '';
            }else{
                tags.push(valueHashtag);
                hashtagsArray.push(valueHashtag);
                hashTagSelect.findIndex(k => k === valueHashtag) === -1 ? hashTagSelect.push(valueHashtag) : '';
            }
            this.setState({ hashtagsArray, tags, hashTagSelect, valueHashtag: '', errorTags: '', errorTag: '', error: '', tagAdded: false });
        }                
    }

    _handleKeyPress = (e) => {
        let { hashtagsArray, tags, valueHashtag, errorTag } = this.state;
        let tagPattern = new RegExp(/^[a-zA-Z0-9_]+$/);     
        errorTag = '';  
        valueHashtag = valueHashtag ? valueHashtag.replace(/#/g, '') : '';
        const index = _.findIndex(hashtagsArray, function (x) { return x.toLowerCase() === valueHashtag.toLowerCase(); })        
        if (/\s/.test(valueHashtag) && valueHashtag.trim().length > 0) {
            errorTag= "Tag can't contain spaces";
        } else if(valueHashtag.trim().length > 0 && !tagPattern.test(valueHashtag)){            
            errorTag= "Tag only contains A-z, 0-9 and _";
        } else if(index >= 0 ){
            errorTag = 'Tag is duplicate';
        }  
        else {
            if (e.key === 'Enter') {
                this.handleSearchMedia();
                e.preventDefault();
            }            
        }       
        this.setState({ errorTag });
    }
    _handleKeyPressSearch = (e) => {     
        if(!this.state.inputSearch){
            this.setState({inputSearch: true});
        }  
        if (e.key === 'Enter') {
           this.handleSearchTag();
        }       
    }
    updateInputValue = (event) => { 
        if(this.state.errorTag){
            this.setState({errorTag :''})
        }       
        this.setState({
            valueHashtag: event.target.value
        });
    }
    handleChange = (tags) => {
        this.setState({ tags });
    }
    handleSearch = () => { 
        this.callAPI();                               
    }
   
    handleImport = (e) => {
        const { clientId, token } = getCurrentUser();
        e.preventDefault();
        const listId = this.state.selected.map(data => data.id).join(",");
        const access_time = (new Date()).getTime();
        this.setState({loadingUpload: true, clickImport: true});
        this.props.importFromInstagram(clientId, token, access_time, listId);
    }
    
    handleChangeScreen = () => {        
        if(this.state.screen == 'media'){
            this.setState({screen: 'saved', valueHashtag: '', inputSearch: false, error: '', errorTag: '', hashtags: this.state.originalHashtags, errorTags: '', tagAdded: false, });
        } else {
            this.setState({screen: 'media', valueHashtag: '', error: '', errorTag: '', errorTags: '', tagAdded: false});          
        }
    }
    handleSearchTag = () => {
        const value = this.refs.tagSearch.value;
        let result = [];
        let {originalHashtags, hashtags} = this.state;
        if(!value || value.length == 0){
            result = originalHashtags;
        } else {
           result = originalHashtags.filter( data => data.toLowerCase().includes(value.toLowerCase()));
        }
        this.setState({hashtags: result});
    }
    handleHashtag = (data, index) => {   
        let { hashTagSelect } = this.state;
        let findKey = hashTagSelect.findIndex(k => k === data);        
        findKey === -1 ? hashTagSelect.push(data) : hashTagSelect.splice(findKey, 1);
        this.setState({hashTagSelect,  errorTags: '', errorTag: '', error: '' });
    }
    handleSave = () =>{
        let { hashtagsArray, valueHashtag, hashtags, hashTagSelect } = this.state;
        valueHashtag ? valueHashtag = valueHashtag.replace(/#/g, '') : '';            
        if(hashtagsArray.length == 0){
            this.handleSearch();
        }
        if(hashtagsArray.length > 0 || valueHashtag.length > 0 && !this.state.errorTag){
            const { clientId, token } = getCurrentUser();           
            let tagPattern = new RegExp(/^[a-zA-Z0-9_]+$/);  
            if(valueHashtag && valueHashtag.trim().length > 0 && !tagPattern.test(valueHashtag)){            
                errorTag= "Tag only contains A-z, 0-9 and _";
                this.setState({ errorTag });
            } else {
                let findHashtags = hashtags.findIndex(k => k === valueHashtag);
                let findHashtagsArray = hashtagsArray.findIndex(k => k === valueHashtag);
                let tagSaved = hashtagsArray.join(',');

                if(findHashtags === -1 && findHashtagsArray === -1 ){
                    tagSaved = `${tagSaved},${valueHashtag}`;
                }
                hashTagSelect.findIndex(k => k === valueHashtag) === -1 ? hashTagSelect.push(valueHashtag) : '';
                this.setState({ setFields: false, valueHashtag: '', hashTagSelect });
                this.props.addHashtags(clientId, token, tagSaved);                
            }            
        }            
    }
    handleDate = () =>{
        if(this.state.defaultDate){
            this.setState({defaultDate: false});
        }
    }
    exportUsername = (data) =>{       
        const byteCharacters = atob(data);
        const byteNumbers = new Array(byteCharacters.length);
        for (let i = 0; i < byteCharacters.length; i++) {
            byteNumbers[i] = byteCharacters.charCodeAt(i);
        }
        const byteArray = new Uint8Array(byteNumbers);
        const blob1 = new Blob([byteArray], {type: "application/octet-stream"});
        const fileName1 = `Instagram_Username_List_${moment().format('MMDDYY hhmm')}.xlsx`;        
        this.saveAs(blob1, fileName1);
    }
    saveAs = (blob, fileName) => {
        const url = window.URL.createObjectURL(blob);
        const anchorElem = document.createElement("a");
        anchorElem.style = "display: none";
        anchorElem.href = url;
        anchorElem.download = fileName;
        document.body.appendChild(anchorElem);
        anchorElem.click();
        document.body.removeChild(anchorElem);
        // On Edge, revokeObjectURL should be called only after
        // a.click() has completed, atleast on EdgeHTML 15.15048
        setTimeout(function() {
            window.URL.revokeObjectURL(url);
        }, 1000);
        }
    handleOK = (e) =>{
        e.preventDefault();
        const { clientId, token } = getCurrentUser();
        const { users } = this.state;
        this.props.exportUsername(clientId, token, users);
        this.props.client.importInstagramError = null;     
        this.closeModal2(e);
        
    }
    closeModal2 =(e) =>{
        e.preventDefault();        
        this.props.client.importInstagramError = null;     
        this.setState({msg: '', openModal: false, clickImport: false});        
        this.closeModal();
    }

    handleUpdate = (values) => { 
        if(values.top >= 0.6 && !this.state.isCallAPI ){
            this.callAPI(this.state.pageIndex);
            this.setState({isCallAPI : true});            
        } 
    }
    selectCheckbox = (data) => {
        let { selected, listMedia } = this.state;    
        let checked = false;   
        let error = '';
        let checkbox20 = this.refs.selectAll;
        if(selected.length > 0){
            let index = _.findIndex(selected, {id: data.id});  
            if(index > -1){
                _.remove(selected, {id: data.id});
                checkbox20.checked ? checkbox20.checked = false : '';
            }else{
                if(selected.length >= 20){
                    error = 'Please choose 20 contents or less per import!';
                } else {
                    selected.push(data);
                    checked = true;
                } 
            }
        } else{
            selected.push(data);
            checked = true;
        }     
        let lastest20 = listMedia.slice(0,20);
        selected = selected.sort((a,b) => a.id -b.id);
        lastest20 = lastest20.sort((a,b) => a.id -b.id);        
        if(_.isEqual(selected, lastest20)){
            checkbox20.checked = true;
        }
        const selectedItem = _.findIndex(listMedia, {id: data.id});
        this.state.listMedia[selectedItem].selectedData = checked;      
        this.setState(prevState => ({ selected, error }));  
      }
      handleSelection = (keys) => {   
        let { selected, listMedia } = this.state;      
        let error = '';      
        if(selected.length >= 20 || keys.length >= 20){
            error = 'Please choose 20 contents or less per import!';
        } else {
            _.forEach(keys , (key) => {            
                if(selected.length > 0){
                    const objFound = _.find(selected, key);                 
                    if(!objFound && selected.length < 20){
                        selected.push(key);
                    }
                }else{
                    selected.push(key);
                }      
            });    
            _.forEach(selected , (upload) => { 
                const selectedItem = _.findIndex(listMedia, {'id' : upload.id});
                selectedItem > -1 ? this.state.listMedia[selectedItem].selectedData = true : '';
            });                    
        }
        this.setState({selected, error});
      }
      selectAll = () => {
        const checkbox = this.refs.selectAll;
        let { selected, listMedia } = this.state;
        _.forEach(selected , (upload) => { 
            const selectedItem = _.findIndex(listMedia, {'id' : upload.id});
            selectedItem > -1 ? this.state.listMedia[selectedItem].selectedData = false : '';
        });    
        if (checkbox.checked) {
            selected = this.state.listMedia.slice(0,20);
            selected.map(data => {data.selectedData = true});
        } else {
            selected = [];
            for(let i = 0; i< 20; i++){
                this.state.listMedia[i].selectedData = false;
            }
        }
        this.setState({ selected, tagAdded: false, error: '' });
    }
    changeSocialSource = (source) => {        
        this.setState({socialSource: source, listMedia: [], selected: [], isCallAPI: false, pageIndex: 0, hashtagsArray: [], setFields: false, valueHashtag: '', error: '', errorTag: '', errorTags: '', hashTagSelect: [], tagAdded: false}, this.callAPI(0, source));
    }
    render() {
        !this.state.inputSearch && this.refs.tagSearch ? this.refs.tagSearch.value ='' : '';
        let importBtnStyle = {}, saveBtnStyle ={};
        this.state.hashtagsArray.length == 0 ? saveBtnStyle = {display: 'none'}:'';
        this.state.selected.length == 0 ? importBtnStyle = { opacity: '0.5', pointerEvents: 'none' } : '';
        this.state.clickImport ? importBtnStyle = { opacity: '0.5', pointerEvents: 'none' } : '';
        const hashtags = _.uniq(this.state.hashtags);
        return (
            <div>
            <Modal
                isOpen={this.props.isOpen}
                shouldCloseOnOverlayClick={true}
                onAfterOpen={this.afterOpenModal}
                onRequestClose={this.closeModal}
                className={{
                    base: 'custom_Modal',
                    afterOpen: 'custom_after-open-instagram-media',
                    beforeClose: 'custom_before-close'
                }}
                overlayClassName={{
                    base: 'custom_Overlay',
                    afterOpen: 'customOverlay_after-open',
                    beforeClose: 'customOverlay_before-close'
                }}
                contentLabel="Example Modal"
            >
                {this.state.loadingUpload &&
                    <ReactLoading type={'spinningBubbles'} color={'#d25408'} delay={0} height={64} width={64} className="spinner-loading" />
                }
                 <SelectableGroup
                    className="main" 
                    ref="selectable"
                    preventDefault={true}
                    onSelection={this.handleSelection}                   
				>                    
                <div className="container-fluid instagram-fluid">
                <div className="bortlet-head">
                  <div className="bortlet-title" >
                    <ul className="nav nav-pills">
                      <li className={this.state.socialSource === 'instagram' ? 'active' : ''} onClick={() => this.changeSocialSource('instagram')}>
                        <a href="#">Instagram</a>
                      </li>
                      <li className={this.state.socialSource === 'twitter' ? 'active' : ''} onClick={() => this.changeSocialSource('twitter')}>
                        <a href="#">Twitter</a>
                      </li>                    
                    </ul>
                  </div>                
                </div>
                        <div className="instagram-media">
                            <div className="row">
                                <div className="col-md-12 title">
                                    Import from {this.state.socialSource}
                                </div>                                
                            </div>
                            {/* 
                            <div className="row">
                                <div className="hashtags col-lg-4 col-md-4">
                                    <input type="text" maxLength="25" value={this.state.valueHashtag} onChange={this.updateInputValue} onKeyPress={(e) => this._handleKeyPress(e)} placeholder="Enter hashtag here" />
                                    <div className="save-btn"  style={saveBtnStyle} onClick={this.handleSave}>Save</div>
                                    <div className="error">{this.state.errorTag}</div>
                                </div>
                                <div className="date-search col-lg-4 col-md-4">
                                    <form style={{display: 'none'}}>
                                        <div className="header row">
                                            <div className="col-lg-6 col-md-6">
                                                <label>From</label>
                                                <Field
                                                    name="fromDate"
                                                    label='From'
                                                    component={DatePickerCustomImport}
                                                    onChange={this.handleDate} />
                                                <div className="error">{this.state.fromError}</div>
                                            </div>
                                            <div className="col-lg-6 col-md-6">
                                                <label>To</label>
                                                <Field
                                                    name="toDate"
                                                    label='To'
                                                    component={DatePickerCustomImport}
                                                    onChange={this.handleDate} />
                                                <div className="error">{this.state.toError}</div>
                                            </div>

                                        </div>
                                    </form>
                                </div>
                                <div className="import-select col-lg-4 col-md-4">
                                    <div className="row">
                                        <div className="checkbox-all col-lg-6 col-md-6">
                                            <input type="checkbox" ref="selectAll" onChange={this.selectAll} /> <span>Select All</span>
                                        </div>
                                        <div className="col-lg-6 col-md-6" style={{ paddingRight: '0px' }}>
                                            <button className="btn-import pull-right" onClick={this.handleSearch}>Search</button>
                                        </div>
                                    </div>
                                </div>
                            </div> */
                            }
                            <div className="row">
                                <div id="hashtags" className="col-lg-6 col-md-6 col-sm-6 col-xs-12 hashtags-list">
                                    <span className="hashtag-title">Hashtag:</span>
                                    <div className={classNames('react-tagsinput-tag selected')}>                                    
                                        <span>
                                            #teampixel
                                        </span>                
                                    </div>
                                {/* { this.state.hashtagsArray.map(this.renderHashtagItem, this, '' ) }

                                {hashtags && hashtags.length > 0 ? hashtags.map(this.renderHashtagItem2, this, '' ) : <div className="not-found">No hashtags found</div>} */}
                                </div>
                                <div className="col-lg-6 col-md-6 col-sm-6 col-xs-12 import-select">
                                    <div className="checkbox-all"><input type="checkbox" ref="selectAll" onChange={this.selectAll} /> <span>Select Most Recent 20</span></div>
                                </div>                                
                            </div>                          
                            <div className="media-body">
                                <Scrollbars 
                                ref="scrollbars" 
                                // onScroll={this.handleScroll}
                                onUpdate={this.handleUpdate}
                                style={{ height: window.innerWidth >= 991 ? window.innerHeight * 0.8 - 130 : window.innerHeight * 0.8 - 90 }} 
                                renderThumbVertical={({ style, ...props }) =>
                                    <div {...props} style={{ ...style, backgroundColor: '#E15B28', overflowX: 'hidden', marginLeft: '3px' }}
                                                                />
                                }>                                
                                        <div className="media-list">
                                        <div className="list-img">
                                            {this.state.listMedia.length > 0 ?                                            
                                                this.state.listMedia.map((data, i) => {
                                                return (
                                                    <SelectedUploadItem
                                                    selectableKey={data}
                                                    key={data.id} 
                                                    data={data}                                                   
                                                    selectCheckbox={this.selectCheckbox}
                                                    />
                                                );
                                                })
                                             : 'No Media found' }                            
                                            </div>
                                        </div>    
                                       
                                </Scrollbars>
                                {/* <div className="row">
                            {this.state.listMedia.length > 0 ? <CheckboxGroup
                                    name="media"
                                    onChange={this.handleSelect}
                                    value={this.state.selected}>
                                    {this.state.listMedia.map(this.renderUploadItem, this, [])}
                                </CheckboxGroup> : <span className="no-media">No Media found</span>}
                        </div> */}
                            </div>
                            
                            <div className="media-footer">                              
                                <div className="col-lg-6 col-md-6 col-sm-6 pull-left">
                                    {this.state.error ? 
                                    <div className="error-left">
                                        {this.state.error}
                                    </div> : 
                                    <div className="success">
                                        {this.state.tagAdded ? 'Hashtags saved' : ''}
                                    </div>}
                                </div>   
                                <div className="col-lg-6 col-md-6 col-sm-6 pull-right">                                    
                                    <button className="btn-import " style={importBtnStyle} onClick={this.handleImport}>Import</button>
                                </div>
                            </div>
                        </div>
                </div>         
                </SelectableGroup>      
            </Modal >
             <Modal
             isOpen={this.state.openModal}       
             shouldCloseOnOverlayClick={false}                    
             className={{
                 base: 'custom_Modal',
                 afterOpen: 'modal_export_username',
                 beforeClose: 'custom_before-close'
             }}
             overlayClassName={{
                 base: 'custom_Overlay',
                 afterOpen: 'customOverlay_after-open',
                 beforeClose: 'customOverlay_before-close'
             }}
             contentLabel="Example Modal"
             >          
             <div className="container-fluid">
                 <form className='form-confirm'>
                    <div className="row">
                         <div className="col-md-12 col-lg-12 col-sm-12">
                             <span className='title-confirm-popup'>{this.state.msg}</span>
                         </div>
                     </div>                   
                     <div className="row">
                         <div className="col-md-6 col-lg-6 col-sm-6" >
                             <button className="btn btn-success btn-ok" onClick={(e) => this.handleOK(e)}>OK</button>
                         </div>
                         <div className="col-md-6 col-lg-6 col-sm-6">
                             <button className="btn btn-danger btn-cancel" onClick={(e) => this.closeModal2(e)}>Cancel</button>
                         </div>
                     </div>                   
                 </form>        
             </div>                    
         </Modal>
         </div>
        );
    }
}
MediaPopup = reduxForm({
    form: 'searchMedia'
})(MediaPopup);
