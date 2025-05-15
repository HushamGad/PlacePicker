import fs from 'node:fs/promises'; // allows file operations using promises.
import bodyParser from 'body-parser'; //  enables JSON body parsing in requests.
import express from 'express'; // helps create a robust web server.

const app = express();

app.use(express.static('images')); // serves all files in the images folder via the root URL.
app.use(bodyParser.json()); // allows parsing of incoming JSON request bodies.

// CORS

app.use((req, res, next) => {
  res.setHeader('Access-Control-Allow-Origin', '*'); // Allows your API to be accessed from any domain 
  res.setHeader('Access-Control-Allow-Methods', 'GET, PUT'); // It allows only GET and PUT requests.
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type'); // This allows the Content-Type header, which is essential for sending JSON data.

  next(); // Tells Express to move on to the next middleware or route handler.
});
// Sets up a route that listens for GET requests on the /places path.
app.get('/places', async (req, res) => {
  // Uses the fs.readFile method from the fs/promises module to read the contents of places.json.
  const fileContent = await fs.readFile('./data/places.json');
  // Uses JSON.parse() to convert the Buffer (or string) data into a JavaScript object.
  const placesData = JSON.parse(fileContent);
  // Uses res.status(200) to indicate that the request was successful.
  // Uses res.json() to send a JSON response back to the client.
  res.status(200).json({ places: placesData });
});

app.get('/user-places', async (req, res) => {
  const fileContent = await fs.readFile('./data/user-places.json');

  const places = JSON.parse(fileContent);

  res.status(200).json({ places });
});
// The HTTP PUT method is typically used to update existing data.
app.put('/user-places', async (req, res) => {
  // Uses req.body to access the incoming data from the client.
  const places = req.body.places;
  // Writes the updated places data to the file user-places.json located in the ./data/ directory.
  // Uses JSON.stringify() to convert the JavaScript object into a JSON-formatted string.
  await fs.writeFile('./data/user-places.json', JSON.stringify(places));
  //  Sends a JSON response with a confirmation message.
  res.status(200).json({ message: 'User places updated!' });
});

//  Uses the app.use() method to set up a catch-all middleware.
app.use((req, res, next) => {
  // Browsers send an OPTIONS request automatically before making PUT, POST, or DELETE requests to ensure the server allows the action.
  if (req.method === 'OPTIONS') {
    return next(); // If the method is OPTIONS, it calls next() to pass the request to the next middleware, rather than returning a 404.
  }
  // This line sets the HTTP status code to 404, indicating the resource was not found.
  res.status(404).json({ message: '404 - Not Found' });
});
//  Start the Express server and make it listen for incoming requests on port 3000.
app.listen(3000);
