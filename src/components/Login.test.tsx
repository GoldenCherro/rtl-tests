import { fireEvent, render, act } from '@testing-library/react';
import { Login } from './Login';
import axios from 'axios';

jest.mock('axios');

const setMockedValue = () =>
  // @ts-ignore
  axios.get.mockResolvedValue({
    data: {
      sprites: {
        front_default:
          'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/1.png',
      },
    },
  });

const setupTest = () => {
  const utils = render(<Login />);
  const username = utils.getByPlaceholderText('Username');
  const password = utils.getByPlaceholderText('Password');
  const loginButton = utils.getByText('Login');
  return {
    username,
    password,
    loginButton,
    ...utils,
  };
};

describe('Login', () => {
  it('should render correctly', () => {
    expect(() => render(<Login />)).not.toThrow();
  });

  it('should let you write username and password', () => {
    const { username, password } = setupTest();

    expect(username).toBeInTheDocument();
    expect(password).toBeInTheDocument();
  });

  it('should have the login button disable if no username or password have been entered', () => {
    const { loginButton } = setupTest();

    expect(loginButton).toBeDisabled();
  });

  it('should enable the login button after writing 8 char length password', () => {
    const { username, password, loginButton } = setupTest();

    fireEvent.change(username, { target: { value: 'test' } });
    fireEvent.change(password, { target: { value: '12345678' } });

    expect(loginButton).toBeEnabled();
  });

  it('should disable the login button after writing 8 char length password and then erased a char', () => {
    const { username, password, loginButton } = setupTest();

    fireEvent.change(username, { target: { value: 'test' } });
    fireEvent.change(password, { target: { value: '12345678' } });

    expect(loginButton).toBeEnabled();

    fireEvent.change(password, { target: { value: '1234567' } });

    expect(loginButton).toBeDisabled();
  });

  it('should display Volver Button once submitted', async () => {
    const { username, password, loginButton, findByText } = setupTest();

    fireEvent.change(username, { target: { value: 'test' } });
    fireEvent.change(password, { target: { value: '12345678' } });

    setMockedValue();

    await act(async () => {
      await fireEvent.click(loginButton);
    });

    const volverButton = await findByText(/Volver/);

    expect(volverButton).toBeInTheDocument();
  });

  it('should display 3 Pokemon', async () => {
    const { username, password, loginButton, findAllByAltText } = setupTest();

    fireEvent.change(username, { target: { value: 'test' } });
    fireEvent.change(password, { target: { value: '12345678' } });

    setMockedValue();

    await act(async () => {
      await fireEvent.click(loginButton);
    });

    const pokemon = await findAllByAltText(/pokemon/);

    expect(pokemon.length).toBe(3);
  });
});
