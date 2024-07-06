import React, { useState, useEffect } from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import styled from '@emotion/styled';
import axios from 'axios';
import './App.css';

const API_URL = 'http://localhost:5001'; // Update this if your API is hosted elsewhere

const MeterContainer = styled.div`
  width: 100%;
  background-color: #e0e0e0;
  border-radius: 4px;
  overflow: hidden;
  height: 20px;
  margin: 10px 0;
`;

const MeterFill = styled.div`
  height: 100%;
  width: ${props => props.value * 100}%;
  background: linear-gradient(to right, #ff4d4d, #ffff4d, #4dff4d);
  transition: width 0.5s ease-out;
`;

const MeterLabel = styled.div`
  display: flex;
  justify-content: space-between;
  font-size: 14px;
  color: #333;
`;

const Table = styled.table`
  width: 100%;
  border-collapse: collapse;
  margin-top: 20px;
`;

const Th = styled.th`
  background-color: #0066cc;
  color: white;
  padding: 10px;
  text-align: left;
`;

const Td = styled.td`
  padding: 10px;
  border-bottom: 1px solid #ddd;
`;

function App() {
  const [input, setInput] = useState('');
  const [result, setResult] = useState(null);
  const [history, setHistory] = useState([]);
  const [chartData, setChartData] = useState([]);

  useEffect(() => {
    fetchHistory();
  }, []);

  useEffect(() => {
    const newChartData = history.map((item, index) => ({
      name: index + 1,
      education: parseFloat(item.analysis.Education),
      emotion: parseFloat(item.analysis.Emotion.split(': ')[1])
    }));
    setChartData(newChartData.reverse());
  }, [history]);

  const fetchHistory = async () => {
    try {
      const response = await axios.get(`${API_URL}/history`);
      setHistory(response.data);
    } catch (error) {
      console.error('Error fetching history:', error);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post(`${API_URL}/analyze`, { text: input });
      setResult(response.data);
      setHistory([response.data, ...history]);
      setInput('');
    } catch (error) {
      console.error('Error:', error);
    }
  };

  return (
    <div className="App">
      <h1>Sentiment Analysis Dashboard</h1>
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Enter text to analyze"
        />
        <button type="submit">Analyze</button>
      </form>
      {result && (
        <div className="result">
          <h2>Result:</h2>
          <p><strong>Input:</strong> {result.input}</p>
          <div>
            <h3>Education Score</h3>
            <MeterContainer>
              <MeterFill value={parseFloat(result.analysis.Education)} />
            </MeterContainer>
            <MeterLabel>
              <span>0</span>
              <span>{result.analysis.Education}</span>
              <span>1</span>
            </MeterLabel>
          </div>
          <div>
            <h3>Emotion Score</h3>
            <MeterContainer>
              <MeterFill value={parseFloat(result.analysis.Emotion.split(': ')[1])} />
            </MeterContainer>
            <MeterLabel>
              <span>0</span>
              <span>{result.analysis.Emotion}</span>
              <span>1</span>
            </MeterLabel>
          </div>
        </div>
      )}
      <h2>Score History</h2>
      <ResponsiveContainer width="100%" height={300}>
        <LineChart data={chartData}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="name" />
          <YAxis />
          <Tooltip />
          <Legend />
          <Line type="monotone" dataKey="education" stroke="#8884d8" activeDot={{ r: 8 }} />
          <Line type="monotone" dataKey="emotion" stroke="#82ca9d" />
        </LineChart>
      </ResponsiveContainer>
      <h2>Analysis History</h2>
      <Table>
        <thead>
          <tr>
            <Th>Input</Th>
            <Th>Education Score</Th>
            <Th>Emotion</Th>
          </tr>
        </thead>
        <tbody>
          {history.map((item, index) => (
            <tr key={index}>
              <Td>{item.input}</Td>
              <Td>{item.analysis.Education}</Td>
              <Td>{item.analysis.Emotion}</Td>
            </tr>
          ))}
        </tbody>
      </Table>
    </div>
  );
}

export default App;