import waxlogo from './wax-logo.png';
import GoldmandGame from '../GoldmandGame.jsx'
import * as waxjs from "@waxio/waxjs/dist";
import React from 'react';
import LoginButton from '../LoginButton.jsx'
import {execute_mine} from "../WaxWrapper.js";
import DatabaseTable from "../DatabaseTable.jsx";
import ConfigurationTable from "../UIElements/ConfigurationTable.jsx";
import Button from 'react-bootstrap/Button';
import {get_total_amount, mark_execution, get_all_rows, get_configuration} from "../DatabaseConnection.js";
import { Logger } from 'aws-amplify';

const logger = new Logger('foo');

const wax = new waxjs.WaxJS({
  rpcEndpoint: 'https://wax.greymass.com',
  tryAutoLogin: true
});

class MinerButton extends React.Component {

  constructor(props) {
    super(props);
    this.state = {
      refresh: false
    };
  }

  handleButtonClick = () => {
    const fetchUserEmail = async () => {
      execute_mine(wax).then(res => 
        {
          if(res) {
            setTimeout(() => {  this.props.callBack() }, 5000);
          }
        })
    };
    fetchUserEmail();
  };

  render() {
    return (
      <div>
        <Button onClick={this.handleButtonClick}>
          Click to mine now just once
        </Button>
      </div>
    );
  }
}

class BaseApp extends React.Component {
    state = {
    total_amount: 0,
    refresh: false,
    rows: [],
    configuration: undefined,
    is_loading: true,
  };

  do_refresh = () => {
    this.setState({
      refresh: true
    })
  }

  componentDidMount() {
    setTimeout(() => {  this.handleGettingAllNumbers() }, 5000);
    logger.info('info bar');
    logger.debug('debug bar');
    logger.warn('warn bar');
    logger.error('some error');

    wax.login()
  }


  handleGettingAllNumbers = () => {
    if (wax.userAccount != undefined) {
      const total_amount = get_total_amount(wax.userAccount, 'goldman').then(res =>
        this.setState({
          total_amount: res
        })
      )

      const all_rows = get_all_rows(wax.userAccount, 'goldman').then(res =>
        this.setState({
          rows: res
        })
      )

      const configuration = get_configuration(wax.userAccount, 'goldman').then(res =>
        this.setState({
          configuration: res,
          is_loading: false
        })
      )
    }
  }

  post_process_callback = () => {
      this.setState({
        is_loading: true
      })
      setTimeout(() => {  this.handleGettingAllNumbers() }, 5000);
  }

  format_meta_data_for_reward = (row) => {
    return Number(row['meta_data']['reward'].replace('GME', '').trim())
  }


  render() {
    return (
      <div className="App">
        <header className="App-header">
          <img src={waxlogo} className="App-logo" alt="logo" />
            <h1>Miner</h1>
            <LoginButton wax={wax} callBack={() => this.do_refresh()} counter={this.state.rows.length}/>
            <MinerButton callBack={() => this.handleGettingAllNumbers()} />
            <GoldmandGame wax={wax} callBack={() => this.post_process_callback()} configuration={this.state.configuration} is_loading={this.state.is_loading} />
            <ConfigurationTable data={this.state.configuration} />
            <DatabaseTable 
              rows={this.state.rows} 
              reward_currency={'Reward GME'} 
              format_meta_data={(row) => this.format_meta_data_for_reward(row)} 
            />
        </header>
      </div>
    );
  }
}

const GoldmandGamePage = () => {
  return (
      <BaseApp />
    )
};

export default GoldmandGamePage;