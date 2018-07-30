import React, {Component, PropTypes} from 'react';
import InstagramLogin from 'react-instagram-login';

export default class TestInstagram extends Component {
  constructor(props) {
    super(props);
  }   
  callAPI = () => {   
    let url = `https://www.socialmediawall.io/api/v1.1/25481/posts/?app_id=1d361c0a101c4361be0fa82e1bdf9480&app_secret=1d6dec425f8844b4bea6907748a4ed82&limit=30&include_hidden=true&offset=0&include_only_video_posts=true`;
    new Promise((resolve, reject) => {
        const xhr = new XMLHttpRequest();      
        xhr.open("GET", url, true);
        xhr.onload = () => {
            let result = JSON.parse(xhr.response);    
            console.log(result);                                                    
            resolve(xhr.responseText);
        }
        xhr.onerror = () => {          
            reject(xhr.statusText);
        } 
        xhr.send();
    }); 
  }
  callAPI2 = () => {   
    let url = `https://www.socialmediawall.io/api/v1.1/25481/posts/?app_id=1d361c0a101c4361be0fa82e1bdf9480&app_secret=1d6dec425f8844b4bea6907748a4ed82&limit=30&include_hidden=true&offset=0&include_only_image_posts=true`;
    new Promise((resolve, reject) => {
        const xhr = new XMLHttpRequest();      
        xhr.open("GET", url, true);
        xhr.onload = () => {
            let result = JSON.parse(xhr.response);    
            console.log('api 2 ',result);                                                    
            resolve(xhr.responseText);
        }
        xhr.onerror = () => {          
            reject(xhr.statusText);
        } 
        xhr.send();
    }); 
  }
  callAPI3 = () => {   
    let url = `https://www.socialmediawall.io/api/v1.1/25481/posts/?app_id=1d361c0a101c4361be0fa82e1bdf9480&app_secret=1d6dec425f8844b4bea6907748a4ed82&limit=30&include_hidden=true&offset=0&include_only_video_posts=true&include_only_image_posts=true`;
    new Promise((resolve, reject) => {
        const xhr = new XMLHttpRequest();      
        xhr.open("GET", url, true);
        xhr.onload = () => {
            let result = JSON.parse(xhr.response);    
            console.log('api 3 ',result);                                                    
            resolve(xhr.responseText);
        }
        xhr.onerror = () => {          
            reject(xhr.statusText);
        } 
        xhr.send();
    }); 
  }
  componentDidMount(){
    this.callAPI();
    this.callAPI2();
    this.callAPI3();
   
  }
  
  render() {
    return (
        <div className="container-fluid">        
        </div>
    );
  }
}
