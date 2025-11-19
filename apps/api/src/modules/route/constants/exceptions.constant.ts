/**
 * Mensagens de erro para a funcionalidade de rotas.
 */
export const ROUTE_EXCEPTIONS = {
  SERVICE_UNAVAILABLE: 'Route service is currently unavailable.',
  INVALID_COORDINATES_FORMAT:
    'Invalid coordinate format. Expected: lat,lon/lat,lon',
  ORIGIN_OUT_OF_SERVICE_AREA:
    'Origin coordinates are outside the service area.',
  DESTINATION_OUT_OF_SERVICE_AREA:
    'Destination coordinates are outside the service area.',
  LATITUDE_OUT_OF_RANGE: 'Latitude must be between -90 and 90.',
  LONGITUDE_OUT_OF_RANGE: 'Longitude must be between -180 and 180.',
  ROUTE_CALCULATION_FAILED: 'Failed to calculate route.',
  REQUEST_TIMEOUT: 'Route calculation request timed out.',
};
