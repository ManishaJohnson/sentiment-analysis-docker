# Sentiment Analysis Docker Setup

This project contains a dockerized sentiment analysis application with a Flask API backend, a React frontend, and sentiment analysis hosted on Google Colab.

## Prerequisites

- Docker
- Docker Compose
- Free ngrok account
- Access to the provided Google Colab worksheet: [Sentiment Analysis Colab](https://colab.research.google.com/drive/1Mw94LlDDHlBJlecOunbtcpgOTQC2nhL0?usp=sharing)
- Git installed on your local machine

## Getting Started

1. Clone the repository to your local machine:
   ```
   git clone https://github.com/ManishaJohnson/sentiment-analysis-docker.git
   ```

2. Navigate to the project directory:
   ```
   cd sentiment-analysis-docker
   ```

## Setting up ngrok

1. Sign up for a free ngrok account at [https://ngrok.com/](https://ngrok.com/).
2. After signing up, go to the [ngrok dashboard](https://dashboard.ngrok.com/get-started/your-authtoken).
3. Copy your authtoken. You'll need this for the Google Colab setup.

## Setting up Google Colab

1. Open the [Sentiment Analysis Colab worksheet](https://colab.research.google.com/drive/1Mw94LlDDHlBJlecOunbtcpgOTQC2nhL0?usp=sharing).
2. In the notebook, find the cell that contains the ngrok authtoken command. It should look like this:
   ```
   !ngrok authtoken YOUR_TOKEN_HERE
   ```
3. Replace `YOUR_TOKEN_HERE` with your ngrok authtoken that you copied earlier.
4. Run all the cells in the worksheet. This will set up the sentiment analysis model and create an ngrok tunnel.
5. After running all cells, you will see an ngrok URL displayed. Copy this URL.

## Updating the API with ngrok URL

1. Open the `senti_ui_api.py` file in your local project directory.
2. Locate the line that defines the `COLAB_URL` variable.
3. Replace the existing URL with the ngrok URL you copied from Google Colab.
4. Save the file.

## Running the Application

1. Ensure your Google Colab worksheet is still running.
2. Navigate to the project root directory in your terminal.
3. Build and start the Docker containers:

   ```
   docker-compose -f dockerfile/docker-compose.yml up --build
   ```

4. Wait for the build process to complete. You should see output indicating that both the API and UI services have started.

## Testing the System

Once the containers are up and running, you can test the system as follows:

1. Testing the API:
   - Open a new terminal window.
   - Use curl to send a POST request to the API:

     ```
     curl -X POST -H "Content-Type: application/json" -d '{"text":"I love this product!"}' http://localhost:5001/analyze
     ```

   - You should receive a JSON response with sentiment analysis results.

2. Testing the UI:
   - Open a web browser and navigate to `http://localhost:3000`.
   - You should see the React frontend for the sentiment analysis application.
   - Enter some text in the input field and submit it.
   - The results should be displayed on the page.

3. Checking the database:
   - The SQLite database file is mounted as a volume in the API container.
   - To inspect it, you can exec into the API container:

     ```
     docker exec -it $(docker ps -qf "name=api") /bin/bash
     ```

   - Once inside the container, you can use the SQLite command-line tool:

     ```
     sqlite3 sentiment_analysis.db
     ```

   - In the SQLite prompt, you can run queries like:

     ```sql
     SELECT * FROM analysis_history;
     ```

## Troubleshooting

- If you encounter any issues, check the Docker logs:

  ```
  docker-compose -f dockerfile/docker-compose.yml logs
  ```

- Ensure all required ports (5001 for API, 3000 for UI) are available on your machine.
- If you're not getting sentiment analysis results, make sure your Google Colab worksheet is still running and the ngrok URL is correctly updated in `senti_ui_api.py`.

## Stopping the Application

To stop the running containers:

```
docker-compose -f dockerfile/docker-compose.yml down
```

This will stop and remove the containers, but preserve the database volume.

## Notes

- The API is accessible at `http://localhost:5001`.
- The UI is accessible at `http://localhost:3000`.
- Any changes to the code will require rebuilding the Docker images.
- Remember to update the ngrok URL in `senti_ui_api.py` if you restart your Google Colab session, as the URL will change.
- The free ngrok plan has usage limits. If you encounter issues related to ngrok, you may need to wait or consider upgrading your plan.