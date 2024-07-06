from flask import Flask, request, jsonify
from flask_cors import CORS
import requests
import sqlite3
from datetime import datetime

app = Flask(__name__)
CORS(app)

# Replace this with the ngrok URL from your Colab notebook
COLAB_URL = " https://7b00-34-139-155-182.ngrok-free.app"

# Initialize database
def init_db():
    conn = sqlite3.connect('sentiment_analysis.db')
    c = conn.cursor()
    c.execute('''CREATE TABLE IF NOT EXISTS analysis_history
                 (id INTEGER PRIMARY KEY AUTOINCREMENT,
                  input_text TEXT,
                  education_score REAL,
                  emotion TEXT,
                  timestamp DATETIME)''')
    conn.commit()
    conn.close()

init_db()

def send_text_to_colab(text):
    try:
        response = requests.post(COLAB_URL + "/process", json={"text": text})
        if response.status_code == 200:
            return response.json()
        else:
            return f"Error: Received status code {response.status_code}"
    except requests.RequestException as e:
        return f"Error: {str(e)}"

@app.route('/analyze', methods=['POST'])
def analyze():
    data = request.json
    if 'text' not in data:
        return jsonify({"error": "Missing 'text' in request body"}), 400
    
    input_text = data['text']
    result = send_text_to_colab(input_text)
    
    # Log to database
    conn = sqlite3.connect('sentiment_analysis.db')
    c = conn.cursor()
    c.execute("INSERT INTO analysis_history (input_text, education_score, emotion, timestamp) VALUES (?, ?, ?, ?)",
              (input_text, result['analysis']['Education'], result['analysis']['Emotion'], datetime.now()))
    conn.commit()
    conn.close()
    
    return jsonify({
        "input": input_text,
        "analysis": result['analysis']
    })

@app.route('/history', methods=['GET'])
def get_history():
    conn = sqlite3.connect('sentiment_analysis.db')
    c = conn.cursor()
    c.execute("SELECT * FROM analysis_history ORDER BY timestamp DESC LIMIT 10")
    rows = c.fetchall()
    conn.close()
    
    history = []
    for row in rows:
        history.append({
            "input": row[1],
            "analysis": {
                "Education": row[2],
                "Emotion": row[3]
            },
            "timestamp": row[4]
        })
    
    return jsonify(history)

if __name__ == "__main__":
    app.run(host='0.0.0.0', port=5001)
