import React from 'react';
import Table from 'react-bootstrap/Table';

class ConfigurationTable extends React.Component {


  render() {
  	if(this.props.data == undefined) {
  		return (
  				<div>No config saved to database</div>
  			)
  	}

    var rows = []
		if (this.props.data != undefined) {
		  var next_execution = new Date(this.props.data.next_execution);
		  var options = { year: 'numeric', month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' };
		  
		  rows.push(
			    <tr key={this.props.data.next_execution}>
			      <td>{this.props.data.start_min}</td>
			      <td>{this.props.data.end_min}</td>
			      <td>{next_execution.toLocaleDateString("en-US", options)}</td>
			    </tr>
		  	)
		}
    
    return(
      <div>
      	<p>Configuration Set</p>
	      <Table striped bordered hover size="sm" variant="dark">
			<thead>
			    <tr>
			      <th>Start Minute</th>
			      <th>End Minute</th>
			      <th>Next Execution</th>
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

export default ConfigurationTable;