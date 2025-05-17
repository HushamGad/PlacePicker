import { useEffect, useState } from 'react'

// This code defines a custom React hook named useFetch that handles fetching data asynchronously
// fetchFn: A function that performs the data fetching.
//initialValue: The initial value for the fetched data.
const useFetch = (fetchFn, initialValue) => {
    // Tracks whether data is being fetched.
    const [isFetching, setIsFetching] = useState() 
    // Stores any error that occurs during fetching.
    const [error, setError] = useState()
    // Holds the actual data returned from the fetch function.
    const [fetchedData, setFetchedData] = useState(initialValue)


    useEffect(() => {
        async function fetchData() {
            setIsFetching(true) // Start fetching, show loading spinner.
            try {
                const data = await fetchFn() // Fetch data using the provided function.
                setFetchedData(data) // Store fetched data in state.
            } catch (error) {
                setError({ message: error.message }) // Store error if fetching fails.
            }
            setIsFetching(false) // Stop fetching, hide loading spinner.
        }
        fetchData() // Call the async function when the component mounts.
    }, [fetchFn])
    return {
        isFetching, // Tells whether data is being loaded.
        error, // Holds the error message, if any.
        fetchedData, //  Contains the fetched data.
        setFetchedData, // Allows updating the fetched data manually.
    }

}

export default useFetch
