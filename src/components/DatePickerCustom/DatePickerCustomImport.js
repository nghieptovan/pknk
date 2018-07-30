import React, {Component} from 'react';
import './DatePickerCustom.scss';
import moment from 'moment';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';

export default class DatePickerCustom extends Component {
  constructor () {
    super ();
    this.state = ({
      today: null
    })   
  }
  clickCalendar = ref => {
    ref === 'startDate' ? this.refs.startDate.onInputClick() : this.refs.endDate.onInputClick();
  }

  handleChange = date => {
    this.setState({today: date <  moment() ? true : false });
    moment.locale('en-gb');
    date && this.props.input.onChange(moment(date).format('ll'));
  }

  render() {
    let {input, label, meta: {touched, error, visited} } = this.props;
    let ref = input.name;
    return (
      <div>
        <DatePicker
          {...input}
          locale ='en-gb'
          todayButton={"Today"}
          scrollableMonthDropdown
          scrollableYearDropdown
          showMonthDropdown
          showYearDropdown
          popperPlacement="top-end"
          popperModifiers={{
            preventOverflow: {
              enabled: true,
              escapeWithReference: false, // force popper to stay in viewport (even when input is scrolled out of view)
              boundariesElement: 'viewport'
            }
          }}
          yearDropdownItemNumber={15}
          placeholderText={label}
          dateFormat="ll"
          selected={input.value ? moment(input.value, "ll") : null}
          ref={ref}
          onChange={this.handleChange}
        />
        <i className="icon-calendar iconDate" onClick={() => this.clickCalendar(ref)}/>
        {(touched || this.state.today) && (error && <span className='redux-form-error-message'>{error}</span>)}
      </div>
    );
  }
}

