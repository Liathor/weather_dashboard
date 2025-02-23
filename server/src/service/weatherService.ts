import dotenv from 'dotenv';
dotenv.config();
import fetch from 'node-fetch';

// Define an interface for the Coordinates object
interface Coordinates {
  latitude: number;
  longitude: number;
  appID: string;
}

// TODO: Define a class for the Weather object
class Weather {
  tempF: number;
  humidity: number;
  windSpeed: number;
  icon: string;
  date?: string;
  city?: string;
  iconDescription?: string;

  constructor(tempF: number, humidity: number, windSpeed: number, icon: string) {
    this.tempF = tempF;
    this.humidity = humidity;
    this.windSpeed = windSpeed;
    this.icon = icon;
  }
}

// TODO: Complete the WeatherService class
class WeatherService {
  // TODO: Define the baseURL, API key, and city name properties
  baseURL: string = "https://api.openweathermap.org/data/2.5";
  APIKey: string = process.env.API_KEY || "";
  cityName: string;

  constructor (
    cityName: string
  ) {
    this.cityName = cityName;
  }

// Create fetchAndDestructureLocationData method
  // Fetch location data for city and destructure it
  private async fetchAndDestructureLocationData(): Promise<Coordinates | null> {
    try {
      const response = await fetch(`http://api.openweathermap.org/geo/1.0/direct?q=${this.cityName}&limit=1&appid=${this.APIKey}`);
      console.log(`fetching location data from http://api.openweathermap.org/geo/1.0/direct?q=${this.cityName}&limit=1&appid=${this.APIKey}`);

      if (!response.ok) {
        console.log('API for locationData not working');
        return null;
      }
      
      const data: any = await response.json();
      
      if (data.length === 0) {
        console.log('No data found');
        return null;
      }
      const firstResult = data[0];

      let cityCoordinates: Coordinates = {
        latitude: parseFloat(firstResult.lat.toFixed(2)),
        longitude: parseFloat(firstResult.lon.toFixed(2)),
        appID:  firstResult.name
      }
      return cityCoordinates;
    } catch (error) {
      console.error('Error getting location data:', error);
      return null;
    }
  }

  // Create fetchWeatherData method
  // Grab current weather data for city using coordinates
  private async fetchWeatherData(coordinates: Coordinates) {
    const response = await fetch(`https://api.openweathermap.org/data/2.5/forecast?lat=${coordinates.latitude}&lon=${coordinates.longitude}&appid=${this.APIKey}`);
    console.log (`fetching current weather data from https://api.openweathermap.org/data/2.5/forecast?lat=${coordinates.latitude}&lon=${coordinates.longitude}&appid=${this.APIKey}&cnt=8`);
    if (!response.ok) {
      console.log('API fetchWeatherData not working');
    }
    const data: any = await response.json();
    return data;
  }

  // TODO: Build parseCurrentWeather method
  private parseCurrentWeather(response: any): Weather {
    const responseList = response.list[0];
    let currentWeather: Weather = {
      tempF: parseInt(((responseList.main.temp- 273.15) * (9 / 5) + 32).toFixed(0)),
      humidity: responseList.main.humidity,
      windSpeed: responseList.wind.speed,
      icon: responseList.weather[0].icon,
      date: responseList.dt_txt.split(' ')[0],
      city: this.cityName,
      iconDescription: responseList.weather[0].description
    }
    return currentWeather;
  }

  // TODO: Complete buildForecastArray method
  private buildForecastArray(currentWeather: Weather, weatherData: any): Weather[] {
    let forecastArray: Weather[] = [currentWeather];
    //console.log('weatherData:', weatherData);
    const specificDates = weatherData.list.filter((data: any) => data.dt_txt.includes('12:00:00'));
    
    // console.log('SpecificDates:', specificDates);

    specificDates.slice(0, 5).forEach((forecast: any) => {
    //for (let i = 0; i < 6; i++) {
      //const forecast = specificDates[i];
      let forecastWeather: Weather = {
        tempF: parseInt(((forecast.main.temp- 273.15) * (9 / 5) + 32).toFixed(0)),
        humidity: forecast.main.humidity,
        windSpeed: forecast.wind.speed,
        icon: forecast.weather[0].icon,
        date: forecast.dt_txt.split(' ')[0],
        iconDescription: forecast.weather[0].description
      }
      forecastArray.push(forecastWeather);
      console.log('forecastArray:', forecastArray);
    });
    return forecastArray;
  }

  // Complete getWeatherForCity method
  async getWeatherForCity(city: string) {

    // Find Coordinates
    try {
      this.cityName = city;
      const cityCoordinates = await this.fetchAndDestructureLocationData();
    if (!cityCoordinates) {
      console.log('no city coordinates found');
      return null;
    }

    // Get weather data
    const currentWeather: any = await this.fetchWeatherData(cityCoordinates);

    // Parse current weather data
    const currentWeatherData = this.parseCurrentWeather(currentWeather);

    //Get forecasted weather data
    return this.buildForecastArray(currentWeatherData, currentWeather);}

    catch (error) {
      console.error('Error getting weather data:', error);
      return null;
    }
  }
}

export default new WeatherService("New York");
