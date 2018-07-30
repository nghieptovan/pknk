import React, { Component, PropTypes } from 'react';
import { getCurrentUser } from './../../utils/common';
import { connect } from 'react-redux';
import * as WidgetActions from '../../redux/actions/widget';
import history from '../../index';
import ReactLoading from 'react-loading';
import './index.scss'
@connect(
  state => ({
    widget: state.widget,    
  }),
  ({
    changeLink: (link) => WidgetActions.changeLink(link)    
  }
  )
)
export default class ChangeLink extends Component {
  constructor(props) {
    super(props);    
  }
  componentWillReceiveProps(nextProps) {
   const { widget } = this.props;
   const { widget: nextWidget } = nextProps;
   nextWidget.replace != widget.replace && nextWidget.replacedLink ? history.push(nextWidget.replacedLink) : '';
  }

  componentWillMount(){    
    const link = this.props.params.link;   
    this.props.changeLink(link);   
  }
 
  render() {  
    return (      
        <ReactLoading type={'spinningBubbles'} color={'#d25408'} delay={0} height={64} width={64} className="spinner-loading" />
    )
  }
}
