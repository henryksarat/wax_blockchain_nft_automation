import {add_log, mark_execution_goldman, mark_execution} from "./DatabaseConnection.js";
import {farmingtales_reward_metadata} from "./JsonHelper.js";

const fetch_staked = (wax) => {
	if(wax == undefined) {
		return -1
	}
	var user_account = wax.userAccount

	const fetchAllNumbers = async () => {
			if(user_account == undefined) {
				return -1
			}

      const res = await basic_get_table(wax, 'farmingstake', 'staked', user_account)

      const staked = res.rows[0].amount

      return staked
  	 }
     return fetchAllNumbers()
 }

 const fetch_unstaked_sest_and_cbit = (wax) => {
	if(wax == undefined) {
		return -1
	}
	var user_account = wax.userAccount

 	const fetchAllNumbers = async () => {
		if(user_account == undefined) {
			return [-1, -1]
		}
		
		const res_wallet = await basic_get_table(wax, 'farminggames', 'wallet', user_account)
      
      var sest = 0;
      var cbit = 0;

      for(let i=0;i<res_wallet.rows[0].balances.length;i++) {
        var the_row = res_wallet.rows[0].balances[i]

        if(the_row.key == 'SEST') {
          sest = the_row.value
        } else if(the_row.key == 'CBIT') {
          cbit = the_row.value
        }
      }
      
      return [sest, cbit]
	}
     return fetchAllNumbers()
 }

  const fetch_food_count = (wax) => {
	if(wax == undefined) {
		return -1
	}
	var user_account = wax.userAccount

	// max sure to do wax per instance and return correctly from the methods

 	const fetchAllNumbers = async () => {
		if(user_account == undefined) {
			return -1
		}

		const res_resources = await basic_get_table(wax, 'farminggames', 'resources', user_account)

    
      var food = res_resources.rows[0].food
      return food
	}
     return fetchAllNumbers()
 }

 const execute_staking = (wax, sest) => {
	if(wax == undefined) {
		return
	}
	var user_account = wax.userAccount

	const execute = async () => {
		if(user_account == undefined) {
			return
		}
		var normalized_value = Math.trunc(sest/10000)
	    const value = normalized_value + ".0000 SEST"

	    console.log('going to auto stake ' + value)

	    if(normalized_value < 5) {
	      console.log('not enough value to auto stake. current value=' + value)
	      return
	    }

	     try {
	        const account = user_account
					var settings = basic_block_chain_settings()
	        var structure = create_structure_transaction(
      			'farminggames', 
      			'stakesest', 
      			user_account, {
              account,
              value,
            }
					)
					const result = await wax.api.transact(structure, settings);
	        console.log('success staking');
	      } catch(e) {
	        console.log('error staking = ' + e.message);
	      }
	  }

	  return execute()
 }


 const execute_harvest = (wax, asset_id, table_name, first_try) => {
	if(wax == undefined) {
		return -1
	}
	var user_account = wax.userAccount

	const execute = async () => {
		if(user_account == undefined) {
			return
		}
	 	try{
	        const account = user_account
	        var structure = create_structure_transaction(
      			'farminggames', 
      			table_name, 
      			user_account, {
							account,
							asset_id,
						}
					)
					var settings = basic_block_chain_settings()
	  
	        const result = await wax.api.transact(structure, settings);

	        console.log('Harvested for id ' + asset_id)
	        
	        await sleep(10000);
	        return true
	      } catch(e) {
	        if(e.message.includes('Not enough food to harvest')) {
	          	execute_refill_food(wax)
	        } else {
	          console.log('something went wrong harvesting ' + e.message)
	        }

	        return false
	      }
	  }
	  return fetch_unstaked_sest_and_cbit(wax).then(function(sest_pre) {
	  	console.log('got result=' + sest_pre[0])
	  	return execute().then(function(harvest_result) {
	  			console.log('got next result=' + harvest_result)
	  			if(harvest_result) {
	  				console.log('before')
	  				console.log('after')
		  			return fetch_unstaked_sest_and_cbit(wax).then(function(sest_post) {
		  				console.log(harvest_result)
		  				console.log(sest_post[0])
		  				console.log(sest_pre[0])

		  				var new_amount = sest_post[0] - sest_pre[0]

		  				mark_execution(wax.userAccount, 'farmingtales', new_amount)
		  				console.log('success so saved to database')
		  				return harvest_result
		  			})
	  			} else {
	  				console.log('failed harvesting')
	  				return harvest_result
	  			}
	  			
	  		})
	  })
 }

function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

 const execute_refill_food = (wax) => {
	if(wax == undefined) {
		return false
	}
	var user_account = wax.userAccount

 	const execute = async () => {
		if(user_account == undefined) {
			return false
		}
 		console.log('refilled more food')
      const account = user_account
      try {
      	var settings = basic_block_chain_settings()

	        var structure = create_structure_transaction(
      			'farminggames', 
      			'refillfood', 
      			user_account, {
							account
						}
					)
        const result = await wax.api.transact(structure, settings);
        return true
      } catch(e) {
        console.log('no able to refill food=' + e.message)
        return false
      }
 	}

 	return execute()
 }

 const execute_mine = (wax) => {
	if(wax == undefined) {
		return false
	}
	var user_account = wax.userAccount

 	const execute = async () => {
		if(user_account == undefined) {
			console.log('not logged in cant mine')
			return
		}
      const miner = user_account
      try {
      	var settings = basic_block_chain_settings()
        var structure = create_structure_transaction(
    			'goldmandgame', 
    			'mine', 
    			user_account, {
						miner
					}
				)
				const result = await wax.api.transact(structure, settings);
				
        console.log('mine complete = ' + result)
        try {
        	var metadata = result.processed.action_traces[0].inline_traces[0].act.data
					add_log(user_account, 'goldman', 'SUCCESS', metadata)
					mark_execution_goldman(wax.userAccount, 'goldman', 1, metadata)
				} catch(e) {
						console.log('error reporting meta data')
						add_log(user_account, 'goldman', 'ERROR', 'error logging or reporting execution')
				}

        return true
      } catch(e) {
        console.log('cant mine because of error=' + e.message)
        add_log(user_account, 'goldman', 'ERROR', e.message)
        return false
      }
 	}

 	return execute()
 }

 const basic_get_table = (wax, code, table, user_account) => {
 	return wax.rpc.get_table_rows({
        json: true,
        code: code,
        scope: code,
        table: table,
        lower_bound: user_account,
        upper_bound: user_account
      });
 }

 const create_structure_transaction = (account, name, actor, data) => {
 		
 		return {
	      actions: [{
	        account: account,
	        name: name,
	        authorization: [{
	          actor: actor,
	          permission: 'active',
	        }],
	        data: data,
	      }]
	    }
	  }
 

 const basic_block_chain_settings = () => {
		return {
	      blocksBehind: 3,
	      expireSeconds: 30
	   }
 }

  export { fetch_staked, fetch_unstaked_sest_and_cbit, fetch_food_count, execute_staking, execute_harvest, execute_mine };