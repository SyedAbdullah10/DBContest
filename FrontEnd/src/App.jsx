import { useState } from "react";

function App() {
    const [userQuery, setUserQuery] = useState("");
    const [result, setResult] = useState("");

    const handleSubmit = async (e) => {
        e.preventDefault();
        const response = await fetch("http://localhost:5000/evaluate", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
                userQuery,
                expectedQuery: "SELECT name FROM employees WHERE salary > 50000 ORDER BY name",
            }),
        });

        const data = await response.json();
        setResult(data.message);
    };

    return (
        <div>
            <h1>SQL Query Contest</h1>
            <form onSubmit={handleSubmit}>
                <textarea
                    rows="5"
                    cols="50"
                    placeholder="Write your SQL query here..."
                    value={userQuery}
                    onChange={(e) => setUserQuery(e.target.value)}
                />
                <br />
                <button type="submit">Submit</button>
            </form>
            <h3>Result: {result}</h3>
        </div>
    );
}

export default App;
