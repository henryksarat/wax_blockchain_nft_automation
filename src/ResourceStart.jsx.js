import React, { useEffect, useState } from 'react';
import * as waxjs from "@waxio/waxjs/dist";
import {execute_harvest} from "./WaxWrapper.js";
import Button from 'react-bootstrap/Button';
import {get_total_amount, mark_execution} from "./DatabaseConnection.js";
import {timer_components, calculate_time_left, seconds_until, minutes_until} from "./TimeUtil.js";
import Spinner from 'react-bootstrap/Spinner';
import {fetch_asset_information, fetch_farming_tales_assets} from './WaxFarmingTales.js'

// timer tutorial: https://stackoverflow.com/questions/40885923/countdown-timer-in-react

const FT_TABLE_STAKED_ANIMAL = 'animal'
const FT_TABLE_ANIMAL_INFO = 'confanimal'

const FT_TABLE_STAKED_BUILDING = 'buildout'
const FT_TABLE_BUILDING_INFO = 'confbuilding'

const FT_ACTION_HARVEST_ANIMAL = 'harvestanim'
const FT_ACTION_HARVEST_BUILDING = 'harvestbuild'

class ResourceStart extends React.Component {
  constructor(props) {
    super(props);
    // this.timer = 0;
    this.executing_auto_harvest = false
    this.cadence = 1000*60*30 //30 minutes
    this.base_line_state()
  }

  componentDidMount() {
    this.start_fresh()
    var timer_id = setInterval(this.refresh_on_cadence, 10000);
    this.setState({timer_id: timer_id})
  }

  componentWillUnmount() {
    clearInterval(this.state.timer_id)
    this.base_line_state();
  }

  base_line_state = () => {
    this.state = {
      refresh: false,
      earliest: Number.MAX_SAFE_INTEGER,
      items: [],
      wax: this.props.wax,
      timer_id: 0,
      is_loading: false
    };
  }

  refresh_on_cadence = () => {
    const items_original = this.state.items.slice();

    const items = this.refresh_display_components(items_original)

    var timer_id = this.state.timer_id

    if(this.executing_auto_harvest) {
      this.executing_auto_harvest = false
      console.log('looking at this timer id on executing harvest true=' + timer_id)
      clearInterval(timer_id)
      timer_id = setInterval(this.refresh_on_cadence, 10000);
      console.log('resuming normal cadence')
    }

    var result = this.props.doAutoClick && this.has_item_ready_for_harvest()

    if (result) {
      clearInterval(timer_id)
      var total_delay = this.handleAllExecution()
      
      timer_id = setInterval(this.refresh_on_cadence, total_delay);
      this.executing_auto_harvest = true
      console.log('changing to cadence of ' + total_delay)
    } 

    this.setState({
      items,
      timer_id
    });
  }

  refresh_display_components = (items) => {
    for(let i=0; i < items.length; i++) {
      // console.log('harvest time i see=' + items[i].harvest_time)
      items[i].time_difference = calculate_time_left(items[i].harvest_time)
      items[i].display_component = this.display_component(
        items[i].harvest_time, 
        items[i].asset_id, 
        items[i].label,
        items[i].type,
      )
    }

    return items
  }

  start_fresh= () => {  
    this.setState({
      refresh: false,
      items: [],
      earliest: Number.MAX_SAFE_INTEGER,
      wax: this.state.wax
    }, () => { this.fetch_asset_ids() })
  }

 fetch_asset_ids = () => {
    const perform_fetch_and_store_to_state = async () => {
      if(this.props.userAccount() == undefined) {
        console.log('uneable to get asset_ids for the user without login')
        return
      }

      var items = this.state.items.slice();
      var res = await fetch_farming_tales_assets(
        this.state.wax, 
        this.props.userAccount(), 
        FT_TABLE_STAKED_ANIMAL
      )

      for(let i=0; i < res.length; i++) {
        var asset_info = await fetch_asset_information(
          this.state.wax, 
          this.props.userAccount(), 
          res[i].asset_id,
          res[i].template_id,
          res[i].last_harvest,
          FT_TABLE_ANIMAL_INFO,
          FT_ACTION_HARVEST_ANIMAL
        )
        items.push(asset_info)
      }

      var res = await fetch_farming_tales_assets(
        this.state.wax, 
        this.props.userAccount(), 
        FT_TABLE_STAKED_BUILDING
      )

      for(let i=0; i < res.length; i++) {
        var asset_info = await fetch_asset_information(
          this.state.wax, 
          this.props.userAccount(), 
          res[i].asset_id,
          res[i].template_id,
          res[i].last_harvest,
          FT_TABLE_BUILDING_INFO,
          FT_ACTION_HARVEST_BUILDING
        )

        items.push(asset_info)
      }

      var earliest = this.find_earliest(items, this.state.earliest)
      items = this.refresh_display_components(items)

      this.setState({
        items,
        earliest
      });
    }

    perform_fetch_and_store_to_state();
  }


  find_earliest = (items, earliest) => {
    for (let i = 0; i < items.length; i++) {
      var harvest_time = items[i].harvest_time

      if(earliest == undefined) {
        earliest = harvest_time
      }
      
      if (harvest_time < earliest) {
        earliest = harvest_time
      }
    }

    return earliest    
  }

  handleAllExecution = () => {
    this.loading_on()
    var wait_counter = 1;  
    var overall_buffer = 15000

    for (let i = 0; i < this.state.items.length; i++) {
      var increase = this.handleSingleExecution(
        this.state.items[i].asset_id, 
        this.state.items[i].type,
        this.state.items[i].harvest_time, 
        true, 
        overall_buffer*wait_counter)
      if(increase) {
        wait_counter++
      }
    }

    setTimeout(() => {  this.start_fresh(); }, overall_buffer*(wait_counter+1));

    setTimeout(() => {  this.props.stakeCallback(); }, overall_buffer*(wait_counter+2));
    setTimeout(() => {  this.loading_off() }, overall_buffer*(wait_counter+2));

    return overall_buffer*(wait_counter+4)
  }


  has_item_ready_for_harvest = () => {
    for (let i = 0; i < this.state.items.length; i++) {
      var seconds_until_var = seconds_until(this.state.items[i].harvest_time)
      if(seconds_until_var <= 0) {
        return true
      }
    }

    return false
  }

  handleSingleExecutionWithLoading = (asset_id, type, next_time, first_try, delay) => {
    this.loading_on()
    this.handleSingleExecution(asset_id, type, next_time, first_try, delay)
    setTimeout(() => {  this.start_fresh(); }, 20000);
    setTimeout(() => {  this.props.stakeCallback(); }, 25000);
    setTimeout(() => {  this.loading_off(); }, 30000);
  }

  handleSingleExecution = (asset_id, type, next_time, first_try, delay) => {
    var seconds_until_var = seconds_until(next_time)

    if (this.props.preStep() && seconds_until_var <= 0) {
      setTimeout(() => { 
        execute_harvest(this.state.wax, asset_id, type, true)
        .then(
          res=>{
            console.log(res)
            if(res) {
              console.log('success harvesting so saving')
              } else {
                console.log('failing harvesting so will retry')
              }
            }
          )
      } , delay)
      return true
    } else {
      return false
    }
  };

  loading_on = () => {
      this.setState({
        is_loading: true
      });
  }

  loading_off = () => {
      this.setState({
        is_loading: false
      });
  }

  display_component = (epoch_time, asset_id, label, type) => {
      var minutes_until_var = minutes_until(epoch_time)
      var seconds_until_var = seconds_until(epoch_time)
      var component = undefined
      if (seconds_until_var <= 0) {
        component = <Button key={asset_id} onClick={() => this.handleSingleExecutionWithLoading(asset_id, type, 0, true, 0)}>{'harvest ' + label} </Button>
      } else {
        component = <li key={asset_id}>{'wait ' + minutes_until_var + ' minutes for ' + label}</li>
      }

      return component
  }

  render() {
    const items = []
    for(let i = 0; i < this.state.items.length; i++) {
      items.push(this.state.items[i].display_component)
    }

    var time_to_render = this.state.earliest
    const timerComponents = timer_components(time_to_render, 'Until Next Harvest')
    const is_loading = () => {
      if (this.state.is_loading) {
        return <Spinner animation="border" />
      }
    }
    return (
      <div>
        <Button onClick={this.handleAllExecution}>
          Click to execute all right now
        </Button>
        <div>{is_loading()}</div>
        <p>{items}</p>
        <p>{timerComponents.length > 1 ? timerComponents : <span>Able to harvest</span>}</p>
      </div>

    );
  }
}

export default ResourceStart;
