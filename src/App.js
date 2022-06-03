
import './App.css';
import React, {Component} from 'react';


class App extends Component{
  state ={
    lat: undefined,
    lon: undefined,
    city: undefined,
    tempC: undefined,
    tempF: undefined,
    errorMsg: undefined,
    season:undefined,

  }

  getPosition = () => {
      return new Promise(function (resolve, reject) {
        navigator.geolocation.getCurrentPosition(resolve, reject);
      });
}

getWeather = async(latitide, longitude) => {
const api_call = await fetch(`//api.openweathermap.org/data/2.5/weather?lat=${latitide}&lon=${longitude}&appid=e7985e50d5362951e5763965d4e9c373
&units=metric`);
const data = await api_call.json();
this.setState({
lat:latitide,
lon:longitude,
city:data.name,
tempC:Math.round(data.main.temp),
tempF:Math.round(data.main.temp * 9/5 + 32),
humidity:data.main.humidity,
main:data.weather[0].main,
})
}

componentDidMount() {
  this.getPosition()
  .then((position) => {
    this.getWeather(position.coords.latitude, position.coords.longitude);
  })
  .catch((err) => {
      this.setState({errorMsg: err.message});
    });

    this.timerID = setInterval(
      () => this.getWeather(this.state.lat, this.state.lon),
      60000
    );
}

componentWillUnmount() {
  clearInterval(this.timerID);
}

getSeason = (season) => {
  const {tempC} = this.state;
  if(tempC > 25) {
    return "Summer";
  }
  else if(tempC < 25 && tempC > 10) { return "Monsoon"; }
  else if(tempC < 10 && tempC > 0) { return "Spring"; }
  else if(tempC < -10 && tempC > -25) { return "Autumn"; }
  else { return "Winter"; }
}

render() {
  const {city, tempC, tempF,  humidity, main, season, errorMsg} = this.state;
  if(city) {
    return (
      <div className="App">
        <div className="weather-box">
          <div className="weather-item">{city}</div>
          <div className="weather-item">{tempC} &deg;C </div>
          <div className="weather-item">{this.state.humidity}% Humidity</div>
          <div className="weather-item">{this.state.main}</div>
          <div className="weather-item">{this.getSeason(this.state.season)}</div>
        </div>
      </div>
    );
  }
  else {
    return(
      <div>Loading.....</div>
    )
  }
}
}


export default App;
