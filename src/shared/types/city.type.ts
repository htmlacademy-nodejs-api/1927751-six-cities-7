import { CityName } from './city-name.enum.js';
import { Location } from './location.type.js';

export type City = Record<CityName, Location>;
