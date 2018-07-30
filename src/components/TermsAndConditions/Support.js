import React, {Component} from 'react';
import './index.scss';
import logoImg from '../../assets/logologin.png';

export default class Support extends Component {  
  render() {
    
    return(
      <div className='terms-conditions-zone'>
        <div className="container content-wrapper">         
          <div className="content">
            <div className="text-center title-wrapper">
              <p className='title'>EnTribe Support and Availability Policy</p>
            </div>
            <div className="body-wrapper">
                  <div className='paragraph-wrapper'>                      
                      <p className='text'>This Support, Security and Availability Policy (the “Policy”) sets forth the policies and procedures with respect to services (the “Service”) provided by EnTribe to a customer (“Customer”) pursuant to a separate Service agreement between EnTribe and Customer (a “Customer Agreement”).</p>
                  </div>
                  <div className='paragraph-wrapper'>
                    <p className='header'>Summary:</p>
                    <p className='text'>As further described below, EnTribe will use commercially reasonable efforts to: (i) provide Customer with [99.9%] availability to the Service (the “Service Availability”); and (ii) provide standard support to Customer.</p>
                  </div>
                  <div className='paragraph-wrapper'>
                  <p className='header'>Availability:</p>          
                      <p className='text'>If the Service becomes substantially unavailable to Customer due to defects with the Service, EnTribe will respond to Customer (i) within eight (8) hours from Customer’s notification to EnTribe of such unavailability, if during normal business hours (Monday-Friday, 8:00am – 6:00pm Pacific), or (ii) within eight (8) hours of the start of the next business day, if outside of normal business hours.  The Service Availability will be measured on a monthly basis, with all hours weighted equally, but the Service Availability measurement will exclude reasonable scheduled downtime for system maintenance as well as any downtime or performance issues resulting from third party connections, services or utilities or other reason beyond EnTribe’s control (including without limitation, acts of God, acts of government, flood, fire, earthquakes, civil unrest, acts of terror, strikes or other labor problems (other than those involving EnTribe employees), computer, telecommunications, Internet service provider or hosting facility failures or delays involving hardware, software or power systems not within EnTribe’s possession or reasonable control, and denial of service attacks).  If the Service is unavailable to Customer due to defects with the Service beyond the Service Availability metric, then, as Customer’s sole and exclusive remedy (and EnTribe’s sole liability), EnTribe will provide Customer a credit for the subsequent Service billing cycle as follows:</p>
                      <table>
                          <tr>
                              <th>Availability</th>
                              <th>Credit</th>
                          </tr>
                          <tr>
                              <td>97.5% – 99.8%</td>
                              <td>5%</td>
                          </tr>
                          <tr>
                              <td>95% - 97.5%</td>
                              <td>10%</td>
                          </tr>
                          <tr>
                              <td>&lt; 95%</td>
                              <td>20%</td>
                          </tr> 
                      </table>
                      <p className='text'>In order to receive downtime credit, Customer must notify EnTribe support within seventy-two (72) hours from the time of downtime, and failure to provide such notice will forfeit the right to receive downtime credit.  All credits provided hereunder are nonrefundable.  If Customer elects not to renew the Agreement, such that the above credit cannot be applied, Customer will have the option to receive up to one free month of Service as its sole remedy in lieu of such credit.</p>
                  </div>
                  <div className='paragraph-wrapper'>
                  <p className='header'>Support:</p>
                  <p className='text'>EnTribe will provide support to customer for defects with the Service in accordance with the Service Plan selected by Customer.  Any other support services are outside of the scope of this policy and must be separately agreed in writing by Customer and EnTribe.  Customer may designate up to three (3) support contacts (“Designated Support Contacts”), and all support requests must come through the Designated Support Contacts.  Customer may update the Designated Support Contacts by providing notice to EnTribe.</p>
                  </div>            
            </div>                     
          </div>
        </div>
      </div>
    )
  }
}