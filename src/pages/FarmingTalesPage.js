import waxlogo from './wax-logo.png';
import React from 'react';
import * as waxjs from "@waxio/waxjs/dist";
import ResourceStart from '../ResourceStart.jsx'
import {execute_mine, fetch_staked, fetch_unstaked_sest_and_cbit, fetch_food_count, execute_staking} from "../WaxWrapper.js";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import LoginButton from '../LoginButton.jsx'
import DatabaseTable from "../DatabaseTable.jsx";
import {get_total_amount, mark_execution, get_all_rows} from "../DatabaseConnection.js";
import Spinner from 'react-bootstrap/Spinner';


//11.89, 0 food. down to 6.8991
//23.6889, 0 food down to.... 18.6889 after 4 execute food so only 1 executed just fine
const wax = new waxjs.WaxJS({
  rpcEndpoint: 'https://wax.greymass.com'
});


class AutoSettings extends React.Component {
   render() {
    return (
      <form>
        <br />
        <label>
          Do Auto Click:
          <input
            name="doAutoClick"
            type="checkbox"
            checked={ this.props.checked}
            onChange={() => this.props.onAutoClick()} />
        </label>
      </form>
    );
  }
}

class DisplayStaked extends React.Component {
  render() {
    return (
      <div>
        <label>
          Do Auto Stake:
          <input
            name="doAutoStake"
            type="checkbox"
            checked={ this.props.doAutoStake}
            onChange={() => this.props.onAutoStakeClick() } />
        </label>

        <p>Staked: {this.props.staked}</p>
        <p>Sest unstaked: {this.props.sest}</p>
        <p>Cbit: {this.props.cbit}</p>
        <p>Food: {this.props.food}</p>
      </div>
    );
  }
}
class BuildingsToHarvest extends React.Component {
  componentDidMount() {
    alert(this.props.doAutoClick)
    alert(this.props.doAutoStake)
  }

  render() {
      return (
        <div>hi there = {this.props.value}</div>
    );
  }
}


class BaseApp extends React.Component {
  state = {
    doAutoStake: false,
    doAutoClick: false,
    staked: 0,
    sest: 0,
    cbit: 0,
    food: 0,
    refresh: false,
    rows: [],
    is_loading: false
  };

  componentDidMount() {
    this.handleGettingAllNumbers()
    this.setState({doAutoClick: true});
    this.setState({doAutoStake: true});
  }

  handleGettingAllNumbers = () => {
    fetch_staked(wax).then(res => 
      this.setState({
        staked: res
      })
    )


    fetch_unstaked_sest_and_cbit(wax).then(res => 
      this.setState({
        sest: res[0],
        cbit: res[1],
      })
    )

    fetch_food_count(wax).then(res => 
      this.setState({
        food: res
      })
    )

    get_all_rows(wax.userAccount, 'farmingtales').then(res =>
      this.setState({
        rows: res
      })
    )
  };


  handle_auto_click() {
    const doAutoClick = this.state.doAutoClick;
    this.setState({doAutoClick: !doAutoClick});
    console.log('changed auto click to=' + !doAutoClick)
  }

  handle_auto_stake_click() {
    const doAutoStake = this.state.doAutoStake;
    this.setState({doAutoStake: !doAutoStake});
    console.log('changed auto stake to=' + !doAutoStake)
  }


  execute_on_stake = () => {
    this.handleRefreshOfWallet(5000)
    if(this.state.doAutoStake) {
      setTimeout(() => {  execute_staking(wax, this.state.sest) }, 20000);
      this.handleRefreshOfWallet(30000)
    }
  }

  is_valid_to_continue = () => {
    var can_continue = wax != undefined && wax.userAccount != undefined
    console.log('can continue with execution=' + can_continue)
    return can_continue
  }

  handleRefreshOfWallet(delay_in_ms=5000) {
    console.log("Will refresh the wallet")
    setTimeout(() => {  this.handleGettingAllNumbers() }, delay_in_ms);
  }

  do_refresh = () => {
    this.setState({
      refresh: true
    })
    this.handleGettingAllNumbers()
  }

  get_user_account = () => {
    // return 'k4jd.wam'
    return wax.userAccount
  }

  format_meta_data_for_reward = (row) => {
    return row['amount']
  }

  render() {      
    const renderAuthButton = () => {
      if (wax.userAccount != undefined) {
        return <ResourceStart 
            wax={wax} 
            doAutoClick={this.state.doAutoClick} 
            doAutoStake={this.state.doAutoStake} 
            stakeCallback={() => this.execute_on_stake()}
            preStep={() => this.is_valid_to_continue()}
            userAccount={() => this.get_user_account()} />
      }
    }

      return (
      <div className="App">
        <header className="App-header">
          <img src={waxlogo} className="App-logo" alt="logo" />
          <p>
            Welcome to auto-harvest
          </p>
          <LoginButton wax={wax} callBack={() => this.do_refresh()}  counter={this.state.rows.length}/>
          <a
            className="App-link"
            href="https://reactjs.org"
            target="_blank"
            rel="noopener noreferrer"
          >
          </a>
            
            <AutoSettings 
              onAutoClick={() => this.handle_auto_click()}
              checked={this.state.doAutoClick}
              />
            <DisplayStaked 
            staked={this.state.staked}
            sest={this.state.sest}
            cbit={this.state.cbit}
            food={this.state.food}
            doAutoStake={this.state.doAutoStake} 
            refreshFunction={() => this.handleRefreshOfWallet()}
            onAutoStakeClick={() => this.handle_auto_stake_click()}
            />
            {renderAuthButton()}
            <DatabaseTable 
              rows={this.state.rows} 
              reward_currency={'Amount'} 
              format_meta_data={(row) => this.format_meta_data_for_reward(row)} 
            />
        </header>
      </div>
    );
  }
}


function FarmingTalesPage() {
  return (
    <BaseApp />
  );
}

export default FarmingTalesPage;