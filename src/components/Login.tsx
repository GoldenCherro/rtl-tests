import axios from 'axios';
import React, { ChangeEvent, useState } from 'react';

interface UserInfo {
  username: string;
  password: string;
}

function Login() {
  const [userInfo, setUserInfo] = useState<UserInfo>({
    username: '',
    password: '',
  });
  const [login, setLogin] = useState<boolean>(true);
  const [pokemon, setPokemon] = useState<any>([]);

  const handleInputChange = (e: ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setUserInfo((prevState: UserInfo) => ({
      ...prevState,
      [name]: value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLogin(false);
    const result: Array<any> = [];
    for (let index = 1; index < 4; index++) {
      const poke = await axios.get(
        `https://pokeapi.co/api/v2/pokemon/${Math.floor(Math.random() * 500)}/`
      );
      result.push(poke.data.sprites.front_default);
    }
    setPokemon(result);
  };

  const handleVolver = () => {
    setLogin(true);
    setUserInfo({
      username: '',
      password: '',
    });
  };

  return (
    <>
      {login ? (
        <div className="loginContainer">
          <form className="loginForm" onSubmit={handleSubmit}>
            <div className="usernameContainer">
              <input
                type="text"
                name="username"
                placeholder="Username"
                value={userInfo.username}
                onChange={handleInputChange}
              />
            </div>
            <div className="passwordContainer">
              <input
                type="password"
                name="password"
                placeholder="Password"
                value={userInfo.password}
                onChange={handleInputChange}
              />
            </div>
            <div className="buttonContainer">
              <button
                className="button"
                type="submit"
                disabled={!userInfo.username || userInfo.password.length < 8}
              >
                Login
              </button>
            </div>
          </form>
        </div>
      ) : (
        <>
          <div>
            {pokemon.map((poke: any, index: number) => (
              <img src={poke} alt="pokemon" key={index} />
            ))}
          </div>
          <div className="buttonContainer">
            <button className="button" onClick={handleVolver}>
              Volver
            </button>
          </div>
        </>
      )}
    </>
  );
}

export { Login };
