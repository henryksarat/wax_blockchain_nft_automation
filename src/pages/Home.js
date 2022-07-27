import waxlogo from './wax-logo.png';
import axios from 'axios';
import {get_total_amount, mark_execution} from "../DatabaseConnection.js";

import React, { Component } from 'react';


export default class Home extends Component {
  constructor(props) {
    super(props);
    this.state = {
      name: '',
      message: '',
    };
    this.handleSubmit = this.handleSubmit.bind(this);
    this.handleChange = this.handleChange.bind(this);
  }

  handleChange(event) {
    const inputValue = event.target.value;
    const stateField = event.target.name;
    this.setState({
      [stateField]: inputValue,
    });
    console.log(this.state);
  }
  async handleSubmit(event) {
    event.preventDefault();
    console.log('try to clal lambda')
    const { name, message } = this.state;
//     await axios.post(
//       'https://1ojzjgvjob.execute-api.us-east-1.amazonaws.com/prod',
//       {account_name: `${name}`, game_name: 'farmingtales', amount: `${message}`}
//     ).then(res => {
//         console.log(res);
//     })
// 
//     console.log('its ' + `${name}`)
//     await axios.get(
//         'https://1ojzjgvjob.execute-api.us-east-1.amazonaws.com/prod',
//         {params: {account_name: 'ggg1', game_name: 'farmingtales'}}
//       ).then(res => {
//           console.log(res);
//       })
      mark_execution(`${name}`, 'goldmand', 1)

      get_total_amount(`${name}`, 'goldmand')

  }

  // async handleSubmit(event) {
  //   event.preventDefault();
  //   console.log('try to clal lambda')
  //   const { name, message } = this.state;
  //   await axios.post(
  //     'https://cuos3yxbmi.execute-api.us-east-1.amazonaws.com/default/my-function',
  //     { key1: `${name}, ${message}` }
  //   ).then(res => {
  //       console.log(res);
  //   })
  // }

  render() {
    return (
      <div>
{/*         <form onSubmit={this.handleSubmit}> */}
{/*           <label>Name:</label> */}
{/*           <input */}
{/*             type="text" */}
{/*             name="name" */}
{/*             onChange={this.handleChange} */}
{/*             value={this.state.name} */}
{/*           /> */}
{/*  */}
{/*           <label>Message:</label> */}
{/*           <input */}
{/*             type="text" */}
{/*             name="message" */}
{/*             onChange={this.handleChange} */}
{/*             value={this.state.message} */}
{/*           /> */}
{/*  */}
{/*           <button type="submit">Send</button> */}
{/*         </form> */}
      </div>
    );
  }
}