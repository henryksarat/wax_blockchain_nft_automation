import React from 'react';
import Table from 'react-bootstrap/Table';

class DatabaseTable extends React.Component {
  render() {
  	if(this.props.rows.length == 0) {
  		return (
  			<div>No executions saved</div>
  		)
  	}

    var items = []
    var rows = []

    var total_amount = 0
    for(let i = this.props.rows.length-1; i >= 0 ; i--) {
      var d = new Date(this.props.rows[i].date);
      var options = { year: 'numeric', month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' };
      var current_reward = this.props.format_meta_data(this.props.rows[i])
      total_amount = total_amount + current_reward
      rows.push(
		    <tr key={this.props.rows[i].date}>
		      <td>{d.toLocaleDateString("en-US", options)}</td>
		      <td>{current_reward}</td>
		      <td>{this.props.rows[i]['current_state']}</td>
		    </tr>
      	)


    }

    var  display_text = "Total executions: " + total_amount
    
    return(
      <div>
	      <p>{display_text}</p>
	      <Table striped bordered hover size="sm" variant="dark">
			<thead>
			    <tr>
			      <th>Date</th>
			      <th>{this.props.reward_currency}</th>
			      <th>State</th>
			    </tr>
			  </thead>
			  <tbody>
			  	{rows}
			  </tbody>
	      </Table>
      </div>
    )
  }
}

export default DatabaseTable;