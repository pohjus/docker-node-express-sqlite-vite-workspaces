import { useState, useEffect } from "react";
import axios from "axios";
import "./App.css";

function App() {
  const [items, setItems] = useState([]);

  useEffect(() => {
    const fetchItems = async () => {
      // Replace '/api/items' with your actual API endpoint
      const apiUrl = `/api/people`;

      try {
        const response = await axios.get(apiUrl);
        console.info(response.data);
        setItems(response.data);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    fetchItems();
  }, []);

  return (
    <div className="App">
      <h1>Backend Data</h1>
      <ul>
        {items.map((item) => (
          <li key={item.id}>{item.name}</li>
        ))}
      </ul>
    </div>
  );
}

export default App;
