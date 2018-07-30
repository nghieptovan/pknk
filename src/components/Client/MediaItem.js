import React, { Component, PropTypes } from 'react';
import {s3URL} from '../../config';
import LazyLoad from 'react-lazy-load';
import { Checkbox, CheckboxGroup } from 'react-checkbox-group';
import ReactStars from 'react-stars';
import imgItem from '../../assets/img/no-img.png';
import instagramLogo from '../../assets/instagramlogo.png';

export default class MediaItem extends Component {
    constructor(props) {
        super(props);
        this.state = {
            hide: false
          };
      }
    static propTypes = {
        openModalPreview: PropTypes.func,
        selectCheckbox: PropTypes.func,
    };    
    selectCheckbox = () => {
        const { data } = this.props;
        this.props.selectCheckbox(data);
    }
    handleErrorImage = ()=>{
        this.setState({hide: true});
    }
    render() {
        const { data } = this.props;      
        const imageUri = data.type.includes('video') ? data.thumbnail : data.contentUri;       
        let imagePreview;
        imagePreview = imageUri ? s3URL+imageUri : imgItem; 
        if(this.state.hide){
             return null;
        }
        return (
            <div className="image_list col-md-3 col-sm-4 col-xs-6" key={data.id + data.mediaId}>
                <div className="image-thumb">
                    <header className="image-header hover-img">
                        {data.type && data.type.includes('video') && <div className="video-icon">
                            <i className="icon-play-icon"></i>
                        </div>}
                        {data.isRegistered && <div className="instagram-block"><img src={instagramLogo}/></div>}
                        <input type="checkbox" checked={data.selectedData ? data.selectedData : false} onChange={this.selectCheckbox} ref="checkbox" />
                        <LazyLoad height={150}>
                            <img className="lazy" src={data.type == 'video' ? data.thumbnail : data.imgUrl} onError={this.handleErrorImage} />
                        </LazyLoad>
                    </header>
                </div>
            </div>
        )
    }
    
};
