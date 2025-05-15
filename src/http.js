export async function fetchAvailablePlaces() {
    // Sends an HTTP GET request to the specified URL
    const response = await fetch('http://localhost:3000/places')
    if (!response.ok) { // Checks whether the response was successful.
        // If the response is not OK, it throws an error with the message
        throw new Error('Failed to fetch places')
    }
    // Converts the response body from JSON format to a JavaScript object.
    const resData = await response.json()
    // Returns the places array from the parsed data.
    return resData.places
}

export async function fetchUserPlaces() {
    const response = await fetch('http://localhost:3000/user-places')
    if (!response.ok) {
        throw new Error('Failed to fetch user places')
    }
    const resData = await response.json()

    return resData.places
}

export async function updateUserPlaces(places) {
    // Uses fetch to make an HTTP request to the server 
    const response = await fetch('http://localhost:3000/user-places', {
        method: 'PUT', // Uses the PUT method to update data.
        body: JSON.stringify({ places }), // Sends the places data in the request body after converting it to a JSON string
        headers: { //  tells the server that the body contains JSON data.
            'Content-Type': 'application/json'
        }
    })
    //Converts the response stream from the server to a JavaScript object
    const resData = await response.json()

    if (!response.ok) {
        throw new Error('Failed to update user data')
    }

    return resData.message
}