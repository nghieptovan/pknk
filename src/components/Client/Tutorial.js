import React, { Component, PropTypes } from 'react';
import _ from 'lodash';
import Modal from 'react-modal';
import { Scrollbars } from 'react-custom-scrollbars';
import ReactLoading from 'react-loading';
import logoImg from '../../assets/logologin.png';
import './Tutorial.scss';
import phoneImage from '../../assets/phone-tutorial.png';
import widgetImage from '../../assets/widget-tutorial.png';
export default class Tutorial extends Component {
    constructor(props) {
        super(props);
        this.state = {
            expandHow: false,
            expandGetting: false,
            expandDirect: false,
            expandInstagram: false,
            expandEmail: false,
            expandReview: false,
            expandActivate: false
        };
    }
    closeModal = () => {
        this.props.closeModal();
    }
    handleExpand = (id) => {
        switch (id) {
            case 'how': this.setState({ expandHow: !this.state.expandHow }); break;
            case 'direct': this.setState({ expandDirect: !this.state.expandDirect }); break;
            case 'instagram': this.setState({ expandInstagram: !this.state.expandInstagram }); break;
            case 'getting': this.setState({ expandGetting: !this.state.expandGetting }); break;
            case 'email': this.setState({ expandEmail: !this.state.expandEmail }); break;
            case 'review': this.setState({ expandReview: !this.state.expandReview }); break;
            case 'activate': this.setState({ expandActivate: !this.state.expandActivate }); break;
        }
    }
    render() {
        let cssHow = { height: 0, overflow: 'hidden' };
        this.state.expandHow ? cssHow.height = 'auto' : '';
        return (
            <Modal
                isOpen={this.props.isOpen}
                shouldCloseOnOverlayClick={true}
                onRequestClose={this.closeModal}
                className={{
                    base: 'custom_Modal',
                    afterOpen: 'custom_after-open-tutorial',
                    beforeClose: 'custom_before-close'
                }}
                overlayClassName={{
                    base: 'custom_Overlay',
                    afterOpen: 'customOverlay_after-open',
                    beforeClose: 'customOverlay_before-close'
                }}
                contentLabel="Example Modal"
            >
                <div className="container-fluid tutorial-fluid">
                    <div className="header">
                        <div className="logo"><img src={logoImg} /></div>
                        <span>Tutorials</span>
                    </div>
                    <div className="body">
                        <div className="row section">
                            <div className="title col-lg-12 col-md-12 col-sm-12 col-xs-12">
                                <span className="dot"></span>
                                <span className="text">How does EnTribe work?</span>
                                {this.state.expandHow ?
                                    <span className="arrow up-arrow" onClick={() => this.handleExpand('how')}></span> :
                                    <span className="arrow down-arrow" onClick={() => this.handleExpand('how')}></span>
                                }
                            </div>
                            <div className='content col-lg-12 col-md-12 col-sm-12 col-xs-12'>
                                <div className={`content-body ${this.state.expandHow ? 'expanded' : ''}`}>
                                    <div className="row info">
                                        <div className="text col-lg-7 col-md-7">
                                            You can choose to have your community upload their content directly to EnTribe OR post on Instagram and EnTribe will pull content for those creators that have already registered. (Instagram is limited to photos only) Option A allows for more control of your brand message because you can curate and reward
                                            the content before it gets published. Option B increases the speed of engagement but limits your control.
                                        </div>
                                        <div className="video col-lg-5 col-md-5">
                                            Video holder
                                        </div>
                                    </div>
                                    <div className="sub-item-list">
                                        <div className="row sub-item">
                                            <span className="col-lg-1 col-md-1 col-sm-1 col-xs-1 box">A</span>
                                            <span className="col-lg-11 col-md-11 col-sm-11 col-xs-11 text">
                                            <div className='row'>
                                                <div className="col-lg-9 col-md-9">
                                                    <b>Option A - Direct Upload (photo & video)</b><br/>
                                                    Setup a photo/video challenge for your community in the EnTribe Platform to match one of your existing marketing programs.<br/>                                                    
                                                    <i>Examples:  Share A Coke, Ice Bucket Challenge, My Calvins, Pets At Work</i><br/>
                                                    <br/>
                                                    Activate your community through your existing marketing channels and drive them to a landing page to upload their content.<br/>                                                    
                                                    <i>Example:  This is my Pet At Work, show us yours and get rewarded @ www.purina.com/upload.</i>
                                                </div>
                                                <div className="col-lg-3 col-md-3">
                                                    <img src={phoneImage}/>
                                                </div>
                                            </div>   
                                                OR
                                                <br/>
                                            <div className="row">
                                                <div className="col-lg-9 col-md-9">
                                                    <b>Option B - Instagram Upload (photos only)</b><br/>
                                                    Have your community register with their Instagram credentials on your website and then ask them to post photos to Instagram with specific hashtags.  EnTribe provides an embeddable registration widget.  EnTribe then pulls that content into the platform.<br/>
                                                    <i>Examples:  #ShareACoke, #IceBucketChallenge, #MyCalvins, #PetsAtWork.</i>
                                                </div>
                                                <div className="col-lg-3 col-md-3">
                                                    <img src={widgetImage}/>
                                                </div>
                                            </div>                                           
                                        </span>
                                        </div>
                                        <div className="row sub-item">
                                            <span className="col-lg-1 col-md-1 col-sm-1 col-xs-1 box">B</span>
                                            <span className="col-lg-11 col-md-11 col-sm-11 col-xs-11 text">Curate and reward your community uploads in the EnTribe
                                                platform.
                                        </span>
                                        </div>
                                        <div className="row sub-item">
                                            <span className="col-lg-1 col-md-1 col-sm-1 col-xs-1 box">C</span>
                                            <span className="col-lg-11 col-md-11 col-sm-11 col-xs-11 text">Share the content through social media and other platforms calling out the challenge
                                                and ask your creators to do the same, thus driving their network back to participate in
                                                the challenge creating a network effect.
                                        </span>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div className="row section">
                            <div className="title col-lg-12 col-md-12 col-sm-12 col-xs-12">
                                <span className="dot"></span>
                                <span className="text">Setup a photo/video challenge (Direct Upload)</span>
                                {this.state.expandDirect ?
                                    <span className="arrow up-arrow" onClick={() => this.handleExpand('direct')}></span> :
                                    <span className="arrow down-arrow" onClick={() => this.handleExpand('direct')}></span>
                                }
                            </div>
                            <div className='content col-lg-12 col-md-12 col-sm-12 col-xs-12'>
                                <div className={`content-body ${this.state.expandDirect ? 'expanded' : ''}`}>
                                    <div className="sub-item-list">
                                        <div className="row sub-item">
                                            <span className="col-lg-1 col-md-1 col-sm-1 col-xs-1 box">A</span>
                                            <span className="col-lg-11 col-md-11 col-sm-11 col-xs-11 text">Click on “Create Challenge” at the top of your Dashboard.
                                        </span>
                                        </div>
                                        <div className="row sub-item">
                                            <span className="col-lg-1 col-md-1 col-sm-1 col-xs-1 box">B</span>
                                            <span className="col-lg-11 col-md-11 col-sm-11 col-xs-11 text">Enter the challenge name, a description, start and end dates and upload an image example,
                                                showing what you are looking for and click “Next”.
                                        </span>
                                        </div>
                                        <div className="row sub-item">
                                            <span className="col-lg-1 col-md-1 col-sm-1 col-xs-1 box">C</span>
                                            <span className="col-lg-11 col-md-11 col-sm-11 col-xs-11 text">Here you can set your standard rewards for this challenge and add recommended tags for
                                                your creators, these will show up in the upload widget. If you are using cash make sure you
                                                have enough in your EnTribe account or contact your EnTribe representative for more
                                                information.
                                                You can either make the challenge Go Live right now or save your work for later.<br/>
                                                <i>Note: If your auto-emails are turned on, when you do Go Live, an email will be sent to your
                                                community notifying them of the challenge. We recommend checking this email message
                                                content before creating your first challenge to make sure it fits your brand.</i>
                                        </span>
                                        </div>
                                        <div className="row sub-item">
                                            <span className="col-lg-1 col-md-1 col-sm-1 col-xs-1 box">D</span>
                                            <span className="col-lg-11 col-md-11 col-sm-11 col-xs-11 text">Then go to the Challenges tab and click on the challenge you just created. At the bottom of
                                                the page you will find the mobile optimized entribe.com webpage and embeddable upload
                                                widget for this challenge. You can either direct your community to upload on the EnTribe
                                                website or embed the widget on any website you choose.
                                        </span>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div className="row section">
                            <div className="title col-lg-12 col-md-12 col-sm-12 col-xs-12">
                                <span className="dot"></span>
                                <span className="text">Setup an Instagram photo challenge (Instagram Upload)</span>
                                {this.state.expandInstagram ?
                                    <span className="arrow up-arrow" onClick={() => this.handleExpand('instagram')}></span> :
                                    <span className="arrow down-arrow" onClick={() => this.handleExpand('instagram')}></span>
                                }
                            </div>
                            <div className='content col-lg-12 col-md-12 col-sm-12 col-xs-12'>
                                <div className={`content-body ${this.state.expandInstagram ? 'expanded' : ''}`}>
                                    <div className="sub-item-list">
                                        {/* <div className="row sub-item">
                                            <span className="col-lg-1 col-md-1 col-sm-1 col-xs-1 box">A</span>
                                            <span className="col-lg-11 col-md-11 col-sm-11 col-xs-11 text">Click on “Create Challenge” at the top of your Dashboard.
                                        </span>
                                        </div>
                                        <div className="row sub-item">
                                            <span className="col-lg-1 col-md-1 col-sm-1 col-xs-1 box">B</span>
                                            <span className="col-lg-11 col-md-11 col-sm-11 col-xs-11 text">Enter the challenge name, a description, start and end dates and upload an image example,
                                                showing what you are looking for and click “Next”.
                                        </span>
                                        </div>
                                        <div className="row sub-item">
                                            <span className="col-lg-1 col-md-1 col-sm-1 col-xs-1 box">C</span>
                                            <span className="col-lg-11 col-md-11 col-sm-11 col-xs-11 text">Here you can set your standard rewards for this challenge and add recommended tags for
                                                your creators, these will show up in the upload widget. If you are using cash make sure you
                                                have enough in your EnTribe account or contact your EnTribe representative for more
                                                information.
                                                You can either make the challenge Go Live right now or save your work for later.
                                                <p>Note: If your auto-emails are turned on, when you do Go Live, an email will be sent to your
                                                community notifying them of the challenge. We recommend checking this email message
                                                content before creating your first challenge to make sure it fits your brand.</p>
                                        </span>
                                        </div>
                                        <div className="row sub-item">
                                            <span className="col-lg-1 col-md-1 col-sm-1 col-xs-1 box">D</span>
                                            <span className="col-lg-11 col-md-11 col-sm-11 col-xs-11 text">Then go to the Challenges tab and click on the challenge you just created. At the bottom of
                                                the page you will find the mobile optimized entribe.com webpage and embeddable upload
                                                widget for this challenge. You can either direct your community to upload on the EnTribe
                                                website or embed the widget on any website you choose.
                                        </span>
                                        </div> */}
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div className="row section">
                            <div className="title col-lg-12 col-md-12 col-sm-12 col-xs-12">
                                <span className="dot"></span>
                                <span className="text">Getting started on EnTribe</span>
                                {this.state.expandGetting ?
                                    <span className="arrow up-arrow" onClick={() => this.handleExpand('getting')}></span> :
                                    <span className="arrow down-arrow" onClick={() => this.handleExpand('getting')}></span>
                                }
                            </div>
                            <div className='content col-lg-12 col-md-12 col-sm-12 col-xs-12'>
                                <div className={`content-body ${this.state.expandGetting ? 'expanded' : ''}`}>
                                    <div className="sub-item-list">
                                        {/* <div className="row sub-item">
                                            <span className="col-lg-1 col-md-1 col-sm-1 col-xs-1 box">A</span>
                                            <span className="col-lg-11 col-md-11 col-sm-11 col-xs-11 text">Click on “Create Challenge” at the top of your Dashboard.
                                        </span>
                                        </div>
                                        <div className="row sub-item">
                                            <span className="col-lg-1 col-md-1 col-sm-1 col-xs-1 box">B</span>
                                            <span className="col-lg-11 col-md-11 col-sm-11 col-xs-11 text">Enter the challenge name, a description, start and end dates and upload an image example,
                                                showing what you are looking for and click “Next”.
                                        </span>
                                        </div>
                                        <div className="row sub-item">
                                            <span className="col-lg-1 col-md-1 col-sm-1 col-xs-1 box">C</span>
                                            <span className="col-lg-11 col-md-11 col-sm-11 col-xs-11 text">Here you can set your standard rewards for this challenge and add recommended tags for
                                                your creators, these will show up in the upload widget. If you are using cash make sure you
                                                have enough in your EnTribe account or contact your EnTribe representative for more
                                                information.
                                                You can either make the challenge Go Live right now or save your work for later.
                                                <p>Note: If your auto-emails are turned on, when you do Go Live, an email will be sent to your
                                                community notifying them of the challenge. We recommend checking this email message
                                                content before creating your first challenge to make sure it fits your brand.</p>
                                        </span>
                                        </div>
                                        <div className="row sub-item">
                                            <span className="col-lg-1 col-md-1 col-sm-1 col-xs-1 box">D</span>
                                            <span className="col-lg-11 col-md-11 col-sm-11 col-xs-11 text">Then go to the Challenges tab and click on the challenge you just created. At the bottom of
                                                the page you will find the mobile optimized entribe.com webpage and embeddable upload
                                                widget for this challenge. You can either direct your community to upload on the EnTribe
                                                website or embed the widget on any website you choose.
                                        </span>
                                        </div> */}
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div className="row section">
                            <div className="title col-lg-12 col-md-12 col-sm-12 col-xs-12">
                                <span className="dot"></span>
                                <span className="text">Email & communications with creators</span>
                                {this.state.expandEmail ?
                                    <span className="arrow up-arrow" onClick={() => this.handleExpand('email')}></span> :
                                    <span className="arrow down-arrow" onClick={() => this.handleExpand('email')}></span>
                                }
                            </div>
                            <div className='content col-lg-12 col-md-12 col-sm-12 col-xs-12'>
                                <div className={`content-body ${this.state.expandEmail ? 'expanded' : ''}`}>
                                    <div className="sub-item-list">
                                        {/* <div className="row sub-item">
                                            <span className="col-lg-1 col-md-1 col-sm-1 col-xs-1 box">A</span>
                                            <span className="col-lg-11 col-md-11 col-sm-11 col-xs-11 text">Click on “Create Challenge” at the top of your Dashboard.
                                        </span>
                                        </div>
                                        <div className="row sub-item">
                                            <span className="col-lg-1 col-md-1 col-sm-1 col-xs-1 box">B</span>
                                            <span className="col-lg-11 col-md-11 col-sm-11 col-xs-11 text">Enter the challenge name, a description, start and end dates and upload an image example,
                                                showing what you are looking for and click “Next”.
                                        </span>
                                        </div>
                                        <div className="row sub-item">
                                            <span className="col-lg-1 col-md-1 col-sm-1 col-xs-1 box">C</span>
                                            <span className="col-lg-11 col-md-11 col-sm-11 col-xs-11 text">Here you can set your standard rewards for this challenge and add recommended tags for
                                                your creators, these will show up in the upload widget. If you are using cash make sure you
                                                have enough in your EnTribe account or contact your EnTribe representative for more
                                                information.
                                                You can either make the challenge Go Live right now or save your work for later.
                                                <p>Note: If your auto-emails are turned on, when you do Go Live, an email will be sent to your
                                                community notifying them of the challenge. We recommend checking this email message
                                                content before creating your first challenge to make sure it fits your brand.</p>
                                        </span>
                                        </div>
                                        <div className="row sub-item">
                                            <span className="col-lg-1 col-md-1 col-sm-1 col-xs-1 box">D</span>
                                            <span className="col-lg-11 col-md-11 col-sm-11 col-xs-11 text">Then go to the Challenges tab and click on the challenge you just created. At the bottom of
                                                the page you will find the mobile optimized entribe.com webpage and embeddable upload
                                                widget for this challenge. You can either direct your community to upload on the EnTribe
                                                website or embed the widget on any website you choose.
                                        </span>
                                        </div> */}
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div className="row section">
                            <div className="title col-lg-12 col-md-12 col-sm-12 col-xs-12">
                                <span className="dot"></span>
                                <span className="text">Review & reward uploads</span>
                                {this.state.expandReview ?
                                    <span className="arrow up-arrow" onClick={() => this.handleExpand('review')}></span> :
                                    <span className="arrow down-arrow" onClick={() => this.handleExpand('review')}></span>
                                }
                            </div>
                            <div className='content col-lg-12 col-md-12 col-sm-12 col-xs-12'>
                                <div className={`content-body ${this.state.expandReview ? 'expanded' : ''}`}>
                                    <div className="sub-item-list">
                                        {/* <div className="row sub-item">
                                            <span className="col-lg-1 col-md-1 col-sm-1 col-xs-1 box">A</span>
                                            <span className="col-lg-11 col-md-11 col-sm-11 col-xs-11 text">Click on “Create Challenge” at the top of your Dashboard.
                                        </span>
                                        </div>
                                        <div className="row sub-item">
                                            <span className="col-lg-1 col-md-1 col-sm-1 col-xs-1 box">B</span>
                                            <span className="col-lg-11 col-md-11 col-sm-11 col-xs-11 text">Enter the challenge name, a description, start and end dates and upload an image example,
                                                showing what you are looking for and click “Next”.
                                        </span>
                                        </div>
                                        <div className="row sub-item">
                                            <span className="col-lg-1 col-md-1 col-sm-1 col-xs-1 box">C</span>
                                            <span className="col-lg-11 col-md-11 col-sm-11 col-xs-11 text">Here you can set your standard rewards for this challenge and add recommended tags for
                                                your creators, these will show up in the upload widget. If you are using cash make sure you
                                                have enough in your EnTribe account or contact your EnTribe representative for more
                                                information.
                                                You can either make the challenge Go Live right now or save your work for later.
                                                <p>Note: If your auto-emails are turned on, when you do Go Live, an email will be sent to your
                                                community notifying them of the challenge. We recommend checking this email message
                                                content before creating your first challenge to make sure it fits your brand.</p>
                                        </span>
                                        </div>
                                        <div className="row sub-item">
                                            <span className="col-lg-1 col-md-1 col-sm-1 col-xs-1 box">D</span>
                                            <span className="col-lg-11 col-md-11 col-sm-11 col-xs-11 text">Then go to the Challenges tab and click on the challenge you just created. At the bottom of
                                                the page you will find the mobile optimized entribe.com webpage and embeddable upload
                                                widget for this challenge. You can either direct your community to upload on the EnTribe
                                                website or embed the widget on any website you choose.
                                        </span>
                                        </div> */}
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div className="row section">
                            <div className="title last col-lg-12 col-md-12 col-sm-12 col-xs-12">
                                <span className="dot"></span>
                                <span className="text">Activate: get more content from your community</span>
                                {this.state.expandActivate ?
                                    <span className="arrow up-arrow" onClick={() => this.handleExpand('activate')}></span> :
                                    <span className="arrow down-arrow" onClick={() => this.handleExpand('activate')}></span>
                                }
                            </div>
                            <div className='content col-lg-12 col-md-12 col-sm-12 col-xs-12'>
                                <div className={`content-body ${this.state.expandActivate ? 'expanded' : ''}`}>
                                    <div className="sub-item-list">
                                        {/* <div className="row sub-item">
                                            <span className="col-lg-1 col-md-1 col-sm-1 col-xs-1 box">A</span>
                                            <span className="col-lg-11 col-md-11 col-sm-11 col-xs-11 text">Click on “Create Challenge” at the top of your Dashboard.
                                        </span>
                                        </div>
                                        <div className="row sub-item">
                                            <span className="col-lg-1 col-md-1 col-sm-1 col-xs-1 box">B</span>
                                            <span className="col-lg-11 col-md-11 col-sm-11 col-xs-11 text">Enter the challenge name, a description, start and end dates and upload an image example,
                                                showing what you are looking for and click “Next”.
                                        </span>
                                        </div>
                                        <div className="row sub-item">
                                            <span className="col-lg-1 col-md-1 col-sm-1 col-xs-1 box">C</span>
                                            <span className="col-lg-11 col-md-11 col-sm-11 col-xs-11 text">Here you can set your standard rewards for this challenge and add recommended tags for
                                                your creators, these will show up in the upload widget. If you are using cash make sure you
                                                have enough in your EnTribe account or contact your EnTribe representative for more
                                                information.
                                                You can either make the challenge Go Live right now or save your work for later.
                                                <p>Note: If your auto-emails are turned on, when you do Go Live, an email will be sent to your
                                                community notifying them of the challenge. We recommend checking this email message
                                                content before creating your first challenge to make sure it fits your brand.</p>
                                        </span>
                                        </div>
                                        <div className="row sub-item">
                                            <span className="col-lg-1 col-md-1 col-sm-1 col-xs-1 box">D</span>
                                            <span className="col-lg-11 col-md-11 col-sm-11 col-xs-11 text">Then go to the Challenges tab and click on the challenge you just created. At the bottom of
                                                the page you will find the mobile optimized entribe.com webpage and embeddable upload
                                                widget for this challenge. You can either direct your community to upload on the EnTribe
                                                website or embed the widget on any website you choose.
                                        </span>
                                        </div> */}
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </Modal >
        );
    }
}

