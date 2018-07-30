import React from 'react';
import {IndexRoute, Route, Switch} from 'react-router';
import { getMeFromToken } from './redux/actions/auth';
import {
    App,
    Login,
    Admin,
    Clients,
    Client,
    ClientDashboard,
    CreatorDashboard,
    Admins,
    Report,
    TermsAndConditions,
    Reviewers,
    SocialMedia,
    Challenges,
    Rewards,
    ChallengesDetail,
    Uploads,
    SignUp,
    Brand,
    MyUploads,
    Creators,
    Widget,
    BrandAdmin,
    Accounts,
    ChangePwd,
    Configure,
    RewardAdmin,
    ChallengeDetailCreator,
    ChangePwdAdmin,
    ChallengePage,
    ChangeLink,
    Policy,
    TestInstagram,
    RegisterWidget,
    Support,
    Dashboard
 } from './components';

export default (store) => {
  return (
      <Route path="/" component={Dashboard}>
       
        <Route path="/challenge">
          <IndexRoute component={ChallengePage}/>
        </Route>
        
        { /* Creator area*/ }
        <Route path="/creator">
          <IndexRoute component={Brand}/>
          <Route path="dashboard" component={CreatorDashboard}/>
          <Route path="brand" component={Brand}/>
          <Route path="signup" component={SignUp}/>
          <Route path="myuploads" component={MyUploads}/>
          <Route path=":clientName/:challengeName/detail" component={ChallengeDetailCreator}/>
        </Route>

      
     
      </Route>
        
  );
};
