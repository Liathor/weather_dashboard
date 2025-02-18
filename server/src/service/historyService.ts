import { promises as fs } from 'fs'; 

// Define a City class with name and id properties
class City {
  name: string;
  id: number;

  constructor (
    name:string,
    id:number
  ) {
    this.name = name;
    this.id = id;
  }
}

// TODO: Complete the HistoryService class
class HistoryService {
  // Define a read method that reads from the searchHistory.json file
  private async read(): Promise<string> {
    try {
      return await fs.readFile('searchHistory.json', 'utf8');
    } catch (error) {
      console.error('Error reading file:', error);
      return '[]'; // Return an empty JSON array as a fallback
    }
  }

  // Define a write method that writes the updated cities array to the searchHistory.json file
  private async write(cities: City[]) {
    try {
    fs.writeFile('searchHistory.json', JSON.stringify(cities))}
    catch (error) {
      console.error('Error writing file:', error);
    }
  }

  // Define a getCities method that reads the cities from the searchHistory.json file and returns them as an array of City objects
  async getCities() {
    const cities: City[] = JSON.parse(await this.read());
    return cities;
  }

  // TODO Define an addCity method that adds a city to the searchHistory.json file
  async addCity(city: string) {
    const cities: City[] = JSON.parse(await this.read());
    const cityId = cities.length + 1;
    cities.push(new City(city, cityId));
    await this.write(cities);
  }
  // * BONUS TODO: Define a removeCity method that removes a city from the searchHistory.json file
  async removeCity(id: string) {
    const cities: City[] = JSON.parse(await this.read());
    const cityId = parseInt(id);
    const updatedCities = cities.filter(city => city.id !== cityId);
    await this.write(updatedCities);
  }
}

export default new HistoryService();
