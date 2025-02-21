import { Router } from 'express';
const router = Router();

import HistoryService from '../../service/historyService.js';
import WeatherService from '../../service/weatherService.js';

// TODO: POST Request with city name to retrieve weather data
router.post('/', async (req, res) => {
  // TODO: GET weather data from city name
  console.log(req.body.cityName);
const city = req.body.cityName;
const weatherData = await WeatherService.getWeatherForCity(city);
res.json(weatherData);
  // TODO: save city to search history
HistoryService.addCity(city);
});

// GET search history
router.get('/history', async (_req, res) => {
  res.json(await HistoryService.getCities());
});

// * BONUS: DELETE city from search history
router.delete('/history/:id', async (req, res) => {
  const requestedId = Number.parseInt(req.params.id);
  if (requestedId !== -1) {
    HistoryService.removeCity(requestedId);
    return res.json('Term deleted');
  }
  return res.json('No match found');
});

export default router;
