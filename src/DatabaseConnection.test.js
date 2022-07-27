import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { unmountComponentAtNode } from "react-dom";
import {get_total_amount, mark_execution, BASE_URL} from './DatabaseConnection.js'
import axios from 'axios';

jest.mock('axios');

let container = null;
beforeEach(() => {
  // setup a DOM element as a render target
  container = document.createElement("div");
  document.body.appendChild(container);
});

afterEach(() => {
  // cleanup on exiting
  unmountComponentAtNode(container);
  container.remove();
  container = null;
});

test('GET total amount', async () => {
  const resp = {data: {'body': JSON.stringify({'total_amount': 100})}};
  axios.get.mockResolvedValue(resp);

  const result = await get_total_amount('some_account_name', 'farmingtales')

  expect(axios.get).toHaveBeenCalledWith(BASE_URL, {"params": {"account_name": "some_account_name", "end_date": 1676323171000, "game_name": "farmingtales", "start_date": 1644785124950}});
  expect(result).toEqual(100);
})

test('POST mark execution', async () => {
  const resp = {};
  axios.post.mockResolvedValue(resp);

  const result = await mark_execution('some_account_name', 'farmingtales', 100)

  expect(axios.post).toHaveBeenCalledWith(BASE_URL, {"account_name": "some_account_name", "game_name": "farmingtales", "amount": 100});
})