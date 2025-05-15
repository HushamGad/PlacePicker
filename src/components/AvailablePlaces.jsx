import { useEffect, useState } from 'react';
import Places from './Places.jsx';
import ErrorPage from './ErrorPage.jsx';
import { sortPlacesByDistance } from './../loc';
import {fetchAvailablePlaces} from '../http.js';



export default function AvailablePlaces({ onSelectPlace }) {
  const [isFetching, setIsFetching] = useState(false)
  const [availablePlaces, setAvailablePlaces] = useState([])
  const [error, setError] = useState()

  useEffect(() => {
    // Fetch Places from the Server
    async function fetchPlaces() {
      setIsFetching(true)
      try {
        
        const places = await fetchAvailablePlaces()
        // Sort Places by User's Location
        navigator.geolocation.getCurrentPosition((position) => {
          const sorttedPlaces = sortPlacesByDistance(
            places, // The list fetched from the server
            position.coords.latitude, // User's latitude.
            position.coords.longitude // User's longitude.
          )
          // Updates the state variable availablePlaces with the sorted list.
          setAvailablePlaces(sorttedPlaces) 
          setIsFetching(false)
        })
      } catch (error) {
        setError(error)
        setIsFetching(false)
      }

    }
    fetchPlaces()
  }, [])

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
