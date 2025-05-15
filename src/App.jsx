import { useRef, useState, useCallback, useEffect } from 'react';

import Places from './components/Places.jsx';
import Modal from './components/Modal.jsx';
import DeleteConfirmation from './components/DeleteConfirmation.jsx';
import logoImg from './assets/logo.png';
import AvailablePlaces from './components/AvailablePlaces.jsx';
import { fetchUserPlaces, updateUserPlaces } from './http.js';
import ErrorPage from './components/ErrorPage';

function App() {
  const selectedPlace = useRef(); // Holds a reference to the place the user wants to remove.

  const [userPlaces, setUserPlaces] = useState([]); // Stores an array of places the user has selected.

  const [isFetching, setIsFetching] = useState(false) // Shows a loading spinner or message while waiting for data.

  const [error, setError] = useState() // Displays an error message to the user if data fetching or any operation fails.

  const [modalIsOpen, setModalIsOpen] = useState(false); // Keeps track of whether the modal is visible or not.

  const [errorUpdatingPlaces, setErrorUpdatingPlaces] = useState() // Displays a separate error message for update operations, as opposed to general fetching errors.

  // fetch user places from a server as soon as the component mounts
  useEffect(() => {
    async function fetchPlaces() {
      setIsFetching(true) //  show a loading spinner or some other indication that the app is busy.
      try {
        const places = await fetchUserPlaces() // Calls an API function that fetches user places from the server.
        setUserPlaces(places) // Updates the state with the fetched places data.
      } catch (error) {
        setError({ message: error.message }) // Catches any error that occurs during the data fetching process.
      }
      setIsFetching(false) // Ensures that the loading spinner or indicator disappears even if an error occurred.
    }
    fetchPlaces()
  }, []) // The empty dependency array ([]) means this effect will run only once when the component mounts.

  function handleStartRemovePlace(place) {
    setModalIsOpen(true); // Sets the modal to open.
    selectedPlace.current = place; // Stores the selected place in selectedPlace using the useRef hook.
  }

  function handleStopRemovePlace() {
    setModalIsOpen(false); // Closes the modal without performing any action.
  }

  // Uses the async keyword because it performs asynchronous operations (updating the server).
  //The function takes a selectedPlace object as an argument, representing the place the user has just picked.
  async function handleSelectPlace(selectedPlace) {
    setUserPlaces((prevPickedPlaces) => {
      if (!prevPickedPlaces) {
        prevPickedPlaces = []; // This check ensures that prevPickedPlaces is always an array.
      }
      // Uses some() to check for duplicates by comparing place.id.
      if (prevPickedPlaces.some((place) => place.id === selectedPlace.id)) {
        // Returns true if at least one element in the array satisfies the condition.
        // If a match is found, it returns the existing array unchanged, thus preventing duplicates.
        return prevPickedPlaces;
      }
      // If the selected place is not a duplicate, it adds the new place at the beginning of the array.
      // Uses the spread operator (...) to include all previous places after the newly added one.
      return [selectedPlace, ...prevPickedPlaces];
    });
    // The function tries to update the server with the new list of places.
    try {
      await updateUserPlaces([selectedPlace, ...userPlaces]) // Uses await to ensure the update is completed before moving on.

    } catch (error) {
      setUserPlaces(userPlaces) // Resets the state to the previous list of places, effectively undoing the change.
      setErrorUpdatingPlaces({ // Uses setErrorUpdatingPlaces to store the error message, which can be shown to the user.
        message: error.message
      })
    }
  }

  // useCallback: A React hook that memoizes the function, ensuring it doesn’t get recreated on every render.
  const handleRemovePlace = useCallback(async function handleRemovePlace() {
    setUserPlaces((prevPickedPlaces) => // Uses setUserPlaces to update the list of places.
      // Uses the .filter() method to remove the place with the matching ID
      // Keeps only the places whose ID does not match the currently selected place ID
      prevPickedPlaces.filter((place) => place.id !== selectedPlace.current.id)
    );
    // The function then tries to update the server with the new list of places.
    try {
      // Calls the updateUserPlaces() function, passing the updated list (without the removed place).
      await updateUserPlaces(
        userPlaces.filter((place) => place.id !== selectedPlace.current.id)
      )
    } catch (error) {
      setUserPlaces(userPlaces) // Revert the local state to the original list (userPlaces).
      setErrorUpdatingPlaces({ // Set an error message to notify the user.
        message: error.message
      })
    }
    // Sets the modal state to closed after the deletion process is completed.
    setModalIsOpen(false);
    // The function is recreated only when userPlaces changes, which is a logical dependency since the function works with the list of places.
  }, [userPlaces]);
  function handleError() {
    setErrorUpdatingPlaces(null) //  reset the error state when the user has acknowledged the error.
  }
  return (
    <>
      <Modal open={errorUpdatingPlaces} onClose={handleError}>
        {errorUpdatingPlaces && (<ErrorPage
          title="An error occurred!"
          message={errorUpdatingPlaces.message}
          onConfirm={handleError} />
        )}
      </Modal>

      <Modal open={modalIsOpen} onClose={handleStopRemovePlace}>
        <DeleteConfirmation
          onCancel={handleStopRemovePlace}
          onConfirm={handleRemovePlace}
        />
      </Modal>

      <header>
        <img src={logoImg} alt="Stylized globe" />
        <h1>PlacePicker</h1>
        <p>
          Create your personal collection of places you would like to visit or
          you have visited.
        </p>
      </header>
      <main>
        {error && <ErrorPage title="An error occurred" message={error.message} />}
        {!error && <Places
          title="I'd like to visit ..."
          fallbackText="Select the places you would like to visit below."
          isLoading={isFetching}
          loadingText='Fetching your places...'
          places={userPlaces}
          onSelectPlace={handleStartRemovePlace}
        />}

        <AvailablePlaces onSelectPlace={handleSelectPlace} />
      </main>
    </>
  );
}

export default App;
