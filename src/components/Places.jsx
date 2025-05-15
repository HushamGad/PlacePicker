// title: The title for the list of places.
// places: An array of place objects to be displayed.
// fallbackText: Text to display if there are no places.
// onSelectPlace: A callback function triggered when a place is selected.
export default function Places({ title, places, fallbackText, onSelectPlace,isLoading,loadingText }) {
  console.log(places);
  return (
    <section className="places-category">
      <h2>{title}</h2>
      {isLoading && <p className="fallback-text">{loadingText}</p>}
      {/* This uses a conditional rendering technique to show a message if the places array is empty. */}
      {!isLoading && places.length === 0 && <p className="fallback-text">{fallbackText}</p>}
      {!isLoading && places.length > 0 && ( // If places is not empty, it displays a list of places.
        <ul className="places">
          {places.map((place) => (
            <li key={place.id} className="place-item">
              <button onClick={() => onSelectPlace(place)}>
                <img src={`http://localhost:3000/${place.image.src}`} alt={place.image.alt} />
                <h3>{place.title}</h3>
              </button>
            </li>
          ))}
        </ul>
      )}
    </section>
  );
}
