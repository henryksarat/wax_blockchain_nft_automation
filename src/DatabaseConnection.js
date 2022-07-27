import axios from 'axios';

const extra_logging = false

const BASE_URL = 'ADD URL HERE FOR AWS'

const get_total_amount = async (account_name, game_name) => {
    const {data} = await axios.get(
        `${BASE_URL}`,
        {params: {account_name: account_name, game_name: game_name, start_date: 1644785124950, end_date: 1676323171000}}
      )
	var obj = JSON.parse(data.body)
    return obj.total_amount
}

const mark_execution = async (account_name, game_name, amount) => {
    await axios.post(
      `${BASE_URL}`,
      {account_name: account_name, game_name: game_name, amount: amount}
    ).then(res => {
        console.log('saved to database for ' + account_name + ' for game ' + game_name);
    })
}

const mark_execution_goldman = async (account_name, game_name, amount, metadata) => {
    await axios.post(
      `${BASE_URL}`,
      {account_name: account_name, game_name: game_name, amount: amount, metadata: metadata}
    ).then(res => {
        console.log('saved to database for ' + account_name + ' for game ' + metadata);
    })
}

const get_all_rows= async (account_name, game_name) => {
    const {data} = await axios.get(
        `${BASE_URL}`,
        {params: {account_name: account_name, game_name: game_name, start_date: 1644785124950, end_date: 1676323171000}}
      )
	var obj = JSON.parse(data.body)
    return obj.rows
}

const add_configuration = async(account_name, game_name, config_type, start_min, end_min, next_execution) => {
    await axios.post(
      `${BASE_URL}/configuration`,
      {account_name: account_name, game_name: game_name, config_type: config_type,
        start_min: start_min, end_min: end_min, next_execution: next_execution}
    ).then(res => {
        console.log('saved config to database for ' + account_name + ' for game ' + game_name);
    })
}

const get_configuration = async (account_name, game_name) => {
    const {data} = await axios.get(
        `${BASE_URL}/configuration`,
        {params: {account_name: account_name, game_name: game_name}}
      )
    
    if(data.statusCode == 200) {
        if(extra_logging) {
            console.log('found config')
        }
        return JSON.parse(data.body)
    } 

    if(extra_logging) {
        console.log('did not find config')
    }
    
    return undefined
}

const delete_configuration = async(account_name, game_name) => {
    await axios.delete(
        `${BASE_URL}/configuration`,
      { data: {account_name: account_name, game_name: game_name}}
    ).then(res => {
          // for (var key in res) { 
          //   console.log(key, res[key])
          // }
    })
}

const add_log = async(account_name, game_name, type, text) => {
    // await axios.post(
    //   `${BASE_URL}/log`,
    //   {account_name: account_name, game_name: game_name, type: type, text: text}
    // ).then(res => {
    //     console.log('saved log to database for ' + account_name + ' for game ' + game_name);
    // })
}

export { BASE_URL, get_total_amount, mark_execution, get_all_rows, add_configuration, get_configuration, delete_configuration, add_log, mark_execution_goldman }