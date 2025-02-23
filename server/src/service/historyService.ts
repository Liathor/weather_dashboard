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
  cities: City[] = [];
  filePath: string = 'searchHistory.json';

  constructor() {
    this.read();
  }

  // Define a read method that reads from the searchHistory.json file
  private async read() {
  console.log('read city triggered');
    try {
      const data = await fs.readFile(this.filePath, 'utf8');
      this.cities = JSON.parse(data);
    } catch (error) {
      console.error('Error reading file:', error);
    }
    return this.cities;
  }

  // Define a write method that writes the updated cities array to the searchHistory.json file
  private async write(cities: City[]) {
    console.log('write city triggered');
    try {
      await fs.writeFile(this.filePath, JSON.stringify(cities, null, 2));
    }
    catch (error) {
      console.error('Error writing file:', error);
    }
    return this.cities;
  }

  // Define a getCities method that reads the cities from the searchHistory.json file and returns them as an array of City objects
  async getCities() {
    return this.cities;
  }

  // Define an addCity method that adds a city to the searchHistory.json file
  async addCity(city: string) {
    console.log('add city triggered');
    
    // Check if the city already exists by its name
    const cityExists: boolean = this.cities.some(existingCity => existingCity.name.toLowerCase() === city.toLowerCase());

    if (cityExists) {
      console.log('City already exists in history');
      return this.cities; // Return current list if city is already in history
    }
    
    // If city is not a duplicate, add it
    const newCity = new City(city, this.cities.length + 1);
    this.cities.push(newCity);
    await this.write(this.cities);

    return this.cities;
  }

  // * BONUS: Define a removeCity method that removes a city from the searchHistory.json file
  async removeCity(id: number) {
    console.log('remove city triggered');
    this.cities = this.cities.filter(city => city.id !== id);
    await this.write(this.cities);
    return this.cities;
  }
}

export default new HistoryService();
