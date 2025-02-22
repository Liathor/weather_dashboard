import { Router } from 'express';
const router = Router();

import HistoryService from '../../service/historyService.js';
import WeatherService from '../../service/weatherService.js';

// POST Request with city name to retrieve weather data
router.post('/', async (req, res) => {
  try {
  const city = req.body.cityName;

  const weatherData = await WeatherService.getWeatherForCity(city);

  // TODO: save city to search history
  await HistoryService.addCity(city);

  return res.json(weatherData);}
  catch {
    return res.json('Weather data retrieval failed');
  }
});

// GET search history
router.get('/history', async (_req, res) => {
  console.log('getting history');
  try {
    const history = await HistoryService.getCities();
    return res.json(history);}
  catch {
    return res.json('No history found');}
 });

// * BONUS: DELETE city from search history
// router.delete('/history/:id', async (req, res) => {
//   const requestedId = Number.parseInt(req.params.id);
//   if (requestedId !== -1) {
//     HistoryService.removeCity(requestedId);
//     return res.json('Term deleted');
//   }
//   return res.json('No match found');
// });

export default router;
