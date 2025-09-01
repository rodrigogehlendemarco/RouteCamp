# RouteCamp

RouteCamp is a web-based route optimization tool designed to help users find the most efficient route between multiple stops. It's ideal for delivery drivers, road trippers, and anyone needing to plan a multi-stop journey. The application is built with vanilla JavaScript, HTML, and CSS, and it leverages powerful APIs to provide accurate geocoding and route optimization.

This project was developed as a final project for the Joinville Dev Bootcamp.

## Live Demo

A live demo of the application is available here: [http://routecamp.s3-website-sa-east-1.amazonaws.com/](http://routecamp.s3-website-sa-east-1.amazonaws.com/)

## Features

*   **Multi-Stop Route Planning:** Add a starting point, a destination, and as many intermediate stops as you need.
*   **Optimal Route Calculation:** Uses the VROOM API to calculate the most efficient route, saving you time and fuel.
*   **Interactive Map:** Visualise the start, end, and intermediate points, along with the optimized route, on an interactive map powered by Leaflet and Mapbox.
*   **Step-by-Step Directions:** Get a clear, ordered list of the stops in your optimized route.
*   **Responsive Design:** Works on both desktop and mobile browsers.

## How to Use

1.  **Set Your Starting Point:** Enter the address for your point of departure.
2.  **Set Your Destination:** By default, the start and end points are the same. If you have a different destination, toggle the switch and fill in the destination address.
3.  **Add Stops:** Click the "Adicionar endereço" (Add address) button to add as many intermediate stops as you need.
4.  **Generate Route:** Once all your stops are entered, click the "Gerar rota!" (Generate route!) button.
5.  **View Your Route:** The application will display the optimized route on the map and provide a list of stops in the correct order.

## Getting Started (for Developers)

To run RouteCamp on your local machine, follow these steps:

### Prerequisites

You will need API keys from the following services:

*   **MapQuest:** Used for geocoding addresses into coordinates. You can get a free API key from the [MapQuest Developer Network](https://developer.mapquest.com/).
*   **Mapbox:** Used for the map tiles. You can get a free access token from [Mapbox](https://www.mapbox.com/).

### Installation

1.  **Clone the repository:**
    ```bash
    git clone https://github.com/rodrigodemarco/routecamp.git
    cd routecamp
    ```

2.  **Configure API Keys:**
    *   Create a file named `config.js` in the root directory of the project by copying the example file:
        ```bash
        cp config.example.js config.js
        ```
    *   Open `config.js` and add your MapQuest API key:
        ```javascript
        var chaveAPI = 'YOUR_MAPQUEST_API_KEY';
        ```
    *   **Note:** The Mapbox access token is currently hardcoded in `script.js`. For development, you can replace the existing token in that file with your own.

3.  **Run a local web server:**
    Since the application makes AJAX requests, you need to run it from a web server to avoid CORS issues. You can use any simple web server. If you have Python installed, you can run one easily:

    *For Python 3:*
    ```bash
    python -m http.server
    ```
    *For Python 2:*
    ```bash
    python -m SimpleHTTPServer
    ```
    Now, open your web browser and navigate to `http://localhost:8000` to use the application.

## Deployment

RouteCamp is a static web application, so it can be easily deployed to any static site hosting service. Here are a few options:

*   **AWS S3:** You can configure an S3 bucket for static website hosting.
*   **Netlify:** Simply drag and drop the project folder into the Netlify dashboard.
*   **Vercel:** Connect your Git repository for seamless deployments.
*   **GitHub Pages:** Configure your repository to serve the static files from the `main` branch.

Remember to have your `config.js` file with the correct API key in place before deploying.

## Contributing

Contributions are welcome! If you have ideas for new features, bug fixes, or improvements, feel free to open an issue or submit a pull request. As the project's UI is currently in Portuguese, a major contribution would be to internationalize the text to make it language-agnostic based on user location.

## Technology Stack

*   **Frontend:** HTML5, CSS3, JavaScript (with jQuery)
*   **Frameworks/Libraries:**
    *   Bootstrap
    *   Material Design
*   **APIs & Services:**
    *   **VROOM:** Open-source routing engine for route optimization.
    *   **MapQuest API:** For geocoding.
    *   **Leaflet.js:** For the interactive map.
    *   **Mapbox:** For map tiles.
