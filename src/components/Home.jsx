import React, { Component } from 'react';
import Particles from 'react-particles-js';
import logo from './presentational/btcLogo.svg';

const ParticleBackground = () => (
  <Particles
    params={{
      particles: {
        color: {
          value: "#FF9900"
        },
        number: {
          value: 100
        },
        size: {
          random: true,
          value: 6
        },
        move: {
          speed: 5,
          random: true
        },
      }
    }}
    style={{
      width: '100%',
      position: 'absolute',
      zIndex: '0',
    }}
  />
);

class Home extends Component {
  constructor(props) {
    super(props);
    this.redirectToLogin = this.redirectToLogin.bind(this);
  }

  redirectToLogin() {
    this.props.history.push("/login");
  }

  render() {
    return (
      <div>
        <ParticleBackground />
        <header className="App-header">
          <img src={logo} className="App-logo" alt="logo" />
          <h1 className="App-title">Welcome to your Tower of Control</h1>
          <div className="form" style={{zIndex:'1'}}>
            <form className="" onSubmit={this.redirectToLogin}>
              <button type="submit">Login  <i className='icon ion-play'></i></button>
            </form>
          </div>
        </header>
      </div>
    );
  }
}

export default Home;
