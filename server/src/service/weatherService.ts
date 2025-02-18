import dotenv from 'dotenv';
dotenv.config();

// Define an interface for the Coordinates object
interface Coordinates {
  latitude: number;
  longitude: number;
  appID: string;
}

// TODO: Define a class for the Weather object
class Weather {
  date: string;
  emoji: string;
  temp: number;
  wind: number;
  humidity: number;

  constructor(date:string, emoji: string, temp: number, wind: number, humidity: number) {
    this.date = date;
    this.emoji = emoji;
    this.temp = temp;
    this.wind = wind;
    this.humidity = humidity;
  }
}

// TODO: Complete the WeatherService class
class WeatherService {
  // TODO: Define the baseURL, API key, and city name properties
  baseURL: string;
  APIKey: string;
  cityName: string;

  constructor(
    baseURL: string = "https://api.openweathermap.org/data/3.0", 
    APIKey: string = "3211945170c968d866a95cf081211299", 
    cityName: string
  ) {
    this.baseURL = baseURL;
    this.APIKey = APIKey;
    this.cityName = cityName;
  }

  // Create fetchLocationData method
  private async fetchLocationData(lat: number, lon: number) {
    this.baseURL = `https://api.openweathermap.org/data/3.0/onecall?lat=${lat}&lon=${lon}&appid=${this.APIKey}`;
    const response = await fetch(this.baseURL);
    if (response.ok) {
      const data = await response.json();
      return this.destructureLocationData(data);
    }
    else {
      console.log('API fetchLocationData not working');
    }
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
    return `https://api.openweathermap.org/data/3.0/onecall?lat=${coordinates.latitude}&lon=${coordinates.longitude}&appid=${this.APIKey}`;
  }

  // TODO: Create fetchAndDestructureLocationData method
  private async fetchAndDestructureLocationData() {
    const response = await fetch(this.buildGeocodeQuery());
    if (response.ok) {
      const data = await response.json();
      let cityCoordinates: Coordinates = {
        latitude: data.lat,
        longitude: data.lon,
        appID:  data.name
      }
      return this.destructureLocationData(cityCoordinates);
    }
    else {
      console.log('API fetchAndDestructureLocationData not working');
    }
  }

  // TODO: Create fetchWeatherData method
  private async fetchWeatherData(coordinates: Coordinates) {
    const response = await fetch(this.buildWeatherQuery(coordinates));
    if (response.ok) {
      const data = await response.json();
      return data;
    }
    else {
      console.log('API fetchWeatherData not working');
    }
  }

  // TODO: Build parseCurrentWeather method
  private parseCurrentWeather(response: any) {
    let currentWeather: Weather = {
      date: new Date().toLocaleDateString(),
      emoji: response.weather[0].icon,
      temp: response.temp,
      wind: response.wind_speed,
      humidity: response.humidity
    }
    return currentWeather;
  }

  // TODO: Complete buildForecastArray method
  private buildForecastArray(currentWeather: Weather, weatherData: any[]) {
    let forecastArray: Weather[] = [currentWeather];
    for (let i = 1; i < 6; i++) {
      let forecastWeather: Weather = {
        date: new Date().toLocaleDateString(),
        emoji: weatherData[i].weather[0].icon,
        temp: weatherData[i].temp,
        wind: weatherData[i].wind_speed,
        humidity: weatherData[i].humidity
      }
      forecastArray.push(forecastWeather);
    }
    return forecastArray;
  }

  // Complete getWeatherForCity method
  async getWeatherForCity(city: string) {
    this.cityName = city;
    const cityCoordinates = await this.fetchAndDestructureLocationData();
    const weatherData = await this.fetchWeatherData(cityCoordinates);
    const currentWeather = this.parseCurrentWeather(weatherData.current);
    const forecastArray = this.buildForecastArray(currentWeather, weatherData.daily);
    return forecastArray;
  }
}

export default new WeatherService();
