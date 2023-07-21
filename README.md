# url-shortner
Usage

Once the application is up and running, you can use the following API endpoints to interact with the URL Shortener:
1. Shorten a URL

    Endpoint: POST /shortenUrl
    Description: Shortens a long URL and generates a unique short code.
    Request Body:

    json

{
  "destinationUrl": "https://www.example.com/very/long/url/to/be/shortened"
}

Response:

json

    {
      "shortUrl": "shortCode"
    }

2. Update Destination URL

    Endpoint: PUT /updateUrl
    Description: Updates the destination URL associated with a given short code.
    Request Body:

    json

{
  "shortUrl": "shortCode",
  "destinationUrl": "https://www.new-destination-url.com"
}

Response:

json

    {
      "success": true
    }

3. Redirect to Original URL

    Endpoint: GET /:shortCode
    Description: Redirects to the original URL associated with the provided short code.
    Response: Redirects to the original URL.

4. Update Expiry Date

    Endpoint: PUT /updateExpiry
    Description: Updates the expiry date of a short URL.
    Request Body:

    json

{
  "shortUrl": "shortCode",
  "daysToAdd": 7
}

Response:

json

    {
      "success": true
    }

Configuration

The application uses MongoDB as the database. You can configure the database connection by modifying the following line in app.js:

javascript

mongoose.connect('mongodb://0.0.0.0:27017/url_shortener', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
