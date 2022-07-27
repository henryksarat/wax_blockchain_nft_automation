import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import LoginButton from './LoginButton.jsx'
import * as waxjs from "@waxio/waxjs/dist";
import { unmountComponentAtNode } from "react-dom";
import { act } from "react-dom/test-utils";

const USER_ACCOUNT = 'somename'

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

jest.mock('@waxio/waxjs/dist');

test('if not signed in the login button displays', async () => {
  render(<LoginButton />)
  expect(screen.getByRole('button')).toHaveTextContent('Click to login')
}) 

test('if wax not completely defined then have to login', async () => {
  var mocked_wax = new waxjs.WaxJS({});

  render(<LoginButton wax={mocked_wax} />)
  expect(screen.getByRole('button')).toHaveTextContent('Click to login')
}) 

test('wax userAccount is undefined so still need to login', async () => {
  var mocked_wax = new waxjs.WaxJS({});
  mocked_wax.userAccount = undefined
  
  render(<LoginButton wax={mocked_wax} />)
  expect(screen.getByRole('button')).toHaveTextContent('Click to login')
})

test('on login show name and executions', async () => {
  var wax = {userAccount: USER_ACCOUNT}
  render(<LoginButton wax={wax} counter={2} />)

  expect(screen.getByRole('button')).toHaveTextContent(USER_ACCOUNT)
  expect(screen.getByRole('button')).toHaveTextContent('total executions')
  expect(screen.getByRole('button')).toHaveTextContent('2')
})

test('on button click do callback', async () => {
  const user_name = USER_ACCOUNT
  const call_back = jest.fn();

  var mocked_wax = new waxjs.WaxJS({});
  mocked_wax.login.mockReturnValueOnce(user_name)

  render(<LoginButton wax={mocked_wax} callBack={call_back} />)

  fireEvent.click(screen.getByRole('button'));

  await waitFor(() => screen.getByRole('button'))
  
  screen.getByRole('button')

  expect(call_back).toHaveBeenCalledTimes(1);
  expect(call_back).toHaveBeenCalledWith(USER_ACCOUNT);
}) 