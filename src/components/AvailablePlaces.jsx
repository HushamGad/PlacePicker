import Places from './Places.jsx';
import ErrorPage from './ErrorPage.jsx';
import { sortPlacesByDistance } from './../loc';
import { fetchAvailablePlaces } from '../http.js';
import useFetch from '../hooks/useFetch.js';

async function fetchSortedPlaces() {
  const places = await fetchAvailablePlaces()
  // The function returns a new Promise. This is necessary because the Geolocation API works asynchronously.
  return new Promise((resolve) => {
    navigator.geolocation.getCurrentPosition((position) => {
      const sorttedPlaces = sortPlacesByDistance(
        places, // The list fetched from the server
        position.coords.latitude, // User's latitude.
        position.coords.longitude // User's longitude.
      )
      resolve(sorttedPlaces)
    })
  })
}

export default function AvailablePlaces({ onSelectPlace }) {
  const {
    isFetching,
    error,
    fetchedData: availablePlaces,
  } = useFetch(fetchSortedPlaces, [])

  if (error) {
    return <ErrorPage title="An error occurred!" message={error.message} />
  }
  return (
    <Places
      title="Available Places"
      places={availablePlaces}
      isLoading={isFetching}
      loadingText='Fetching place data...'
      fallbackText="No places available."
      onSelectPlace={onSelectPlace}
    />
  );
}
