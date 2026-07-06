import { LocationResponse } from './location.response';

export type StationResponse = {
  id: string;
  name: string;
  location: LocationResponse;
  sensor_model: string;
  state: 'active' | 'inactive';
  provider: 'OpenWeatherMap' | null;
  owner_id: string | null;
};
