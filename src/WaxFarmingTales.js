 import {calculate_time_left} from "./TimeUtil.js";

const fetch_asset_information =  (wax, user_account, asset_id, template_id, last_harvest, table_name, harvest_table_name) => {
    const fetchUserEmail = async () => {
      if(user_account == undefined) {
        return
      }

      const res2 = await wax.rpc.get_table_rows({
        json: true,
        code: 'farminggames',
        scope: 'farminggames',
        table: table_name,
        limit: "1000"
      });

      let cooldown = ''
      let label = ''
      for (let i = 0; i < res2.rows.length; i++) {
        if(res2.rows[i].template_id == template_id) {
          cooldown = res2.rows[i].cooldown
          label = res2.rows[i].label
        }
      }

      var d = new Date(0)
      d.setUTCSeconds(last_harvest)

      let new_harvest_time = last_harvest+cooldown


      var current_asset = {}

      var time_left = calculate_time_left(new_harvest_time)

      current_asset = {
        'asset_id': asset_id,
        'harvest_time': new_harvest_time,
        'time_difference': time_left,
        'label': label,
        'type': harvest_table_name
      }

      return current_asset

    }

    return fetchUserEmail().then(function(asset_dict) {
      return asset_dict
    });
  }

  const fetch_farming_tales_assets =  (wax, user_account, table_name) => {
    const perform_fetch = async () => {
      if(user_account == undefined) {
        return
      }

      var res = await wax.rpc.get_table_rows({
        json: true,
        limit: "1000",
        code: 'farminggames',
        scope: 'farminggames',
        table: table_name,
        lower_bound: user_account,
        upper_bound: user_account,
        key_type: "i64",
        index_position: 2
      });

      var asset_list = []

      var rows = res.rows

      for(let i=0; i < rows.length; i++) {
        asset_list.push({
          'asset_id': rows[i].asset_id,
          'template_id': rows[i].template_id,
          'last_harvest': rows[i].last_harvest
        })
      }
      return asset_list

    }

    return perform_fetch().then(function(assets) {
      return assets
    });
  }

  export { fetch_asset_information, fetch_farming_tales_assets }

