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
  temp: number;

  constructor(temp: number) {
    this.temp = temp;
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

  //  Create fetchLocationData method
  // Fetch weather forecast data for city using latitude and longitude
   private async fetchLocationData(lat: number, lon: number) {
      this.baseURL = `https://api.openweathermap.org/data/2.5/forecast/daily?lat=${lat}&lon=${lon}&cnt=5&appid=${this.APIKey}`;
      const response = await fetch(this.baseURL);
      if (!response.ok) {
        console.log('API fetchWeatherData not working');
      }
      const data: any = await response.json();
      //console.log('got results from fetch: ', data);
      return data;
  }

  // Create destructureLocationData method
  private destructureLocationData(locationData: Coordinates): Coordinates {
    return {
      latitude: locationData.latitude,
      longitude: locationData.longitude,
      appID: locationData.appID
    }
  }

  // Create buildGeocodeQuery method
  private buildGeocodeQuery(): string {  
    return `http://api.openweathermap.org/geo/1.0/direct?q=${this.cityName}&limit=1&appid=${this.APIKey}`;
  }

  // TODO: Create buildWeatherQuery method
  private buildWeatherQuery(coordinates: Coordinates): string { 
    return `https://api.openweathermap.org/data/2.5/weather?lat=${coordinates.latitude}&lon=${coordinates.longitude}&appid=${this.APIKey}`;
  }

  // Create fetchAndDestructureLocationData method
  // Fetch location data for city and destructure it
  private async fetchAndDestructureLocationData() {
    try {
      const response = await fetch(this.buildGeocodeQuery());

      if (!response.ok) {
        console.log('API fetchAndDestructureLocationData not working');
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
      return this.destructureLocationData(cityCoordinates);
    } catch (error) {
      console.error('Error getting location data:', error);
      return null;
    }
  }

  // Create fetchWeatherData method
  // Grab current weather data for city using coordinates
  private async fetchWeatherData(coordinates: Coordinates) {
    const response = await fetch(this.buildWeatherQuery(coordinates));
    if (!response.ok) {
      console.log('API fetchWeatherData not working');
    }
    const data: any = await response.json();
    //console.log('got results from fetch: ', data);
    return data;
  }

  // TODO: Build parseCurrentWeather method
  private parseCurrentWeather(response: any) {
    let currentWeather: Weather = {
      temp: response.main.temp,
    }
    //console.log('current weather: ', currentWeather);
    return currentWeather;
  }

  // TODO: Complete buildForecastArray method
  private buildForecastArray(currentWeather: Weather, weatherData: any[]) {
    let forecastArray: Weather[] = [];
    forecastArray.push(currentWeather);
    for (let i = 0; i < weatherData.length; i++) {
      let forecastWeather: Weather = {
        temp: weatherData[i].temp.day,
      }
      forecastArray.push(forecastWeather);
    }
    console.log('forecast array: ', forecastArray);
    return forecastArray;
  }

  // Complete getWeatherForCity method
  async getWeatherForCity(city: string) {
    console.log(`searching for ${city}`);
    this.cityName = city;
    const cityCoordinates = await this.fetchAndDestructureLocationData();
    if (!cityCoordinates) {
      return null;
    }
    const weatherData: any = await this.fetchWeatherData(cityCoordinates);
    const currentWeather = this.parseCurrentWeather(weatherData);
    const forecastData = await this.fetchLocationData(cityCoordinates.latitude, cityCoordinates.longitude);
    console.log('got current weather data: ', currentWeather);
    return this.buildForecastArray(currentWeather, forecastData);
  }
}

export default new WeatherService("New York");
