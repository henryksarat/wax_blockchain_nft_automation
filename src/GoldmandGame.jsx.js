import React, { useEffect, useState } from 'react';
import * as waxjs from "@waxio/waxjs/dist";
import {calculate_time_left, random_int_from_interval, timer_components} from "./TimeUtil.js";
import {execute_mine} from "./WaxWrapper.js";
import Button from 'react-bootstrap/Button';
import Spinner from 'react-bootstrap/Spinner';
import {get_total_amount, mark_execution, add_configuration, delete_configuration} from "./DatabaseConnection.js";


class GoldmandGame extends React.Component {
  constructor(props) {
    super(props);
    
    this.state = {
      refresh: false,
      range_min_start: '',
      range_min_end: '',
      next_refresh: undefined,
      failed_attempts: 0,
      timer_id: 0
    };
  }

  componentDidMount() {
    var timer_id = setInterval(this.refresh_on_cadence, 5000);
    this.setState({timer_id: timer_id});
  }

  componentWillUnmount() {
    clearInterval(this.state.timer_id)

    this.setState({
      refresh: false,
      range_min_start: '',
      range_min_end: '',
      next_refresh: undefined,
      failed_attempts: 0
    });
  }

  refresh_on_cadence = () => {
    var next_execution = this.get_next_execution_time()

    if(next_execution != undefined) {
    	var start = new Date(Date.now())
    	var end = new Date(next_execution)
  	  var difference = end-start
    	if(difference<0) {
    		console.log('attempting to execute now')
        execute_mine(this.props.wax).then( res => {
        		if(res) {
          			// mark_execution(this.props.wax.userAccount, 'goldman', 1)
          			this.props.callBack();
                this.prepare_for_reset_of_time()
              } else {
                var failed_attempts = this.state.failed_attempts
                failed_attempts = failed_attempts + 1

                console.log('failed attempts =' + failed_attempts)
                if(failed_attempts >= 3) {
                  console.log('WARNING: Failed 3 or more times. Resetting counter based on jitter.')
                  this.prepare_for_reset_of_time()
                } else {
                  console.log('Failed so will try again. On attempt #' + failed_attempts)
                }

                this.setState({failed_attempts: failed_attempts});
              }
            }
          )
    		}
    	}
      this.setState({refresh: true});
    }

  prepare_for_reset_of_time = () => {
    var range_min_start = this.get_range_min_start()
    var range_min_end = this.get_range_min_end()
    this.setState({
      next_refresh: undefined,
      failed_attempts: 0,
      range_min_start: range_min_start,
      range_min_end: range_min_end
    });
    this.set_execution_time()
  }

  set_execution_time = () => {
    if(this.state.range_min_start == '' || this.state.range_min_end == '' || Number.isInteger(this.state.range_min_start) == false || Number.isInteger(this.state.range_min_end) == false) {
      console.log('invalid jitter')
      return
    }

  	console.log('will set time between ' + this.state.range_min_start + ' and ' + this.state.range_min_end)

  	var min = this.state.range_min_start * 60
  	var max = this.state.range_min_end * 60

  	var seconds = random_int_from_interval(min, max)

  	var start = new Date(Date.now())
  	start.setSeconds(start.getSeconds() + seconds);
  	
  	console.log('next execution is in %s seconds, which is %s minutes. This is %s', seconds, seconds/60, start)
  	add_configuration(
      this.props.wax.userAccount, 
      'goldman', 
      'jitter', 
      this.state.range_min_start, 
      this.state.range_min_end, 
      start.getTime()
    )
  	this.setState({next_refresh: start.getTime()});
    this.props.callBack();
  }

  delete_configuration = () => {
    delete_configuration(this.props.wax.userAccount, 'goldman')

    this.props.callBack()
    this.setState({
      next_refresh: undefined,
      failed_attempts: 0,
      range_min_start: '',
      range_min_end: ''
    });
  }

  set_start_time = (event) => {
	   this.setState({range_min_start: Number(event.target.value)});
  }

  set_end_time = (event) => {
	   this.setState({range_min_end: Number(event.target.value)});
  }

  get_next_execution_time = () => {
    var time_to_render = this.state.next_refresh

    if(time_to_render == undefined) {
      if(this.props.configuration != undefined) {
        time_to_render = this.props.configuration.next_execution
      }
    }

    return time_to_render
  }

  get_range_min_start= () => {
    var range_min_start = this.state.range_min_start

    if(range_min_start == '') {
      if(this.props.configuration != undefined) {
        range_min_start = this.props.configuration.start_min
      }
    }

    return range_min_start
  }

  get_range_min_end = () => {
    var range_min_end = this.state.range_min_end

    if(range_min_end == '') {
      if(this.props.configuration != undefined) {
        range_min_end = this.props.configuration.end_min
      }
    }

    return range_min_end
  }

  render() {


	var time_to_render = this.get_next_execution_time()
  var range_min_start = this.get_range_min_start()
  var range_min_end = this.get_range_min_end()

	const timerComponents = timer_components(time_to_render/1000, 'Until Next Mine')

    const is_loading = () => {
      if (this.props.is_loading) {
        return <Spinner animation="border" />
      }
    }

  	return (
  		<div>
        {is_loading()}
  			<p>Set the jitter time in minutes</p>
	        <input
	            type="text"
	            value={range_min_start}
	            onChange={this.set_start_time}
	         />
	          to 
	        <input
	            type="text"
	            value={range_min_end}
	            onChange={this.set_end_time}
	         />

	       <Button onClick={this.set_execution_time}>
	          Update Configuration 
	        </Button>

         <Button onClick={this.delete_configuration}>
            Delete config
          </Button>

	        <p>{timerComponents.length ? timerComponents : <span>No Countdown</span>}</p>
        </div>
	);
  }
}

export default GoldmandGame;