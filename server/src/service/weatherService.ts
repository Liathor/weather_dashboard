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
      return data;
    }
    else {
      console.log('API location data fetch not working');
    }
  }

  // Create destructureLocationData method
  private destructureLocationData(locationData: Coordinates): Coordinates {
    const latitude = locationData.lat;
    const longitude = locationData.lon;
    this.fetchLocationData(latitude,longitude);
  }

  // Create buildGeocodeQuery method
  private buildGeocodeQuery(): string {

  

  }

  // TODO: Create buildWeatherQuery method
  // private buildWeatherQuery(coordinates: Coordinates): string {}

  // TODO: Create fetchAndDestructureLocationData method
  // private async fetchAndDestructureLocationData() {}

  // TODO: Create fetchWeatherData method
  // private async fetchWeatherData(coordinates: Coordinates) {}

  // TODO: Build parseCurrentWeather method
  // private parseCurrentWeather(response: any) {}

  // TODO: Complete buildForecastArray method
  // private buildForecastArray(currentWeather: Weather, weatherData: any[]) {}

  // Complete getWeatherForCity method
  async getWeatherForCity(city: string) {
    this.cityName = city;
    this.APIKey = '3211945170c968d866a95cf081211299';
    this.baseURL = `http://api.openweathermap.org/geo/1.0/direct?q=${this.cityName}&limit=1&appid=${this.APIKey}`;
    const response = await fetch(this.baseURL);
    if (response.ok) {
      const data = await response.json();
      let cityCoordinates: Coordinates = {
        latitude: data.lat,
        longitude: data.lon,
        appID:  data.name
      }
      return this.fetchLocationData(cityCoordinates.latitude, cityCoordinates.longitude);
    }
    else {
      console.log('API getWeatherForCity not working');
    }
  }
}

export default new WeatherService();
