import 'bootstrap/dist/css/bootstrap.min.css';
import './App.css';

import { useState, useEffect } from 'react';

import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';

import Table from 'react-bootstrap/Table';

const baseURL = 'https://jsonplaceholder.typicode.com/posts?userId=';
const numericRegex = new RegExp(/[0-9]/g);

function RenderLoadedTasks(taskData) {
  // Debug
  //console.log("[Render] Movie Data.", movieData);

  return (
    <Table striped bordered hover>
      <thead>
        <tr>
          <th className="col-1 text-center">User #</th>
          <th className="col-1 text-center">Task #</th>
          <th className="col-5 text-center">Title</th>
          <th className="col-5 text-center">Body</th>
        </tr>
      </thead>
      <tbody>
        {
          taskData.map((task, index) => (
            <tr key={`task-data-row-${index}`}>
              <td className="col-1 text-center fw-bold">{task.userId}</td>
              <td className="col-1 text-center fw-bold">{task.id}</td>
              <td className="col-5 fw-normal">{task.title}</td>
              <td className="col-5 fw-normal">{task.body}</td>
            </tr>
          ))
        }
      </tbody>
    </Table>
  );
}

function RenderNoUserFilter() {
  return (
    <Row>
      <Col className="col-12 d-flex flex-column align-items-center mt-3">
        <h4>Begin the API call process by entering a user ID.</h4>
      </Col>
    </Row>
  );
}

function RenderEmptyResults(userId) {
  return (
    <Row>
      <Col className="col-12 d-flex flex-column align-items-center mt-3">
        <h4>The API was unable to yield any results with the following ID [{userId}].</h4>
      </Col>
    </Row>
  );
}

function App() {
  const [todoTaskUserId, setTODOTaskUserId] = useState("");
  const [todoList, setTODOList] = useState([]);
  const [loading, setLoading] = useState(false);

  const onInputTaskIdHandler = (event) => {
    const filterDigits = event.target.value.match(numericRegex);
    setTODOTaskUserId(filterDigits && filterDigits.length > 0 ? filterDigits.join('') : "");
  };

  useEffect(() => {
    const fullURL = baseURL + todoTaskUserId;
    setTODOList([]);

    if (todoTaskUserId) {
      setLoading(true);

      // Debug
      console.log("[Fetch] URL: " + fullURL);

      fetch(fullURL)
        .then((response) => response.json())
        .then((data) => {
          // Debug
          console.log("[Fetch] Data.", data);

          // Debug
          //console.log("Response.", data.Response);

          //if (!data.Response !== undefined && data.Response === "False")
          //throw new Error(`Failed to retrieve movie title [${movieName}].`);

          setTODOList(data);
        })
        .catch((error) => console.log(error))
        .finally(() => setLoading(false));
    }
  }, [todoTaskUserId]);

  return (
    <>
      <Container fluid className="page-layout pb-4">
        <Row>
          <Col className="col-12 d-flex justify-content-center mt-3">
            <h1 style={{ width: "fit-content" }}>JSONPlaceholder TODO Task List</h1>
          </Col>
        </Row>
        <Row>
          <Col className="col-12 d-flex flex-column align-items-center my-3">
            <input type="text" value={todoTaskUserId} onChange={onInputTaskIdHandler} />
            {loading && <p className="mt-2">Loading...</p>}
          </Col>
        </Row>
        {loading === false ?
          (todoTaskUserId ? (todoList.length > 0 ? RenderLoadedTasks(todoList) : RenderEmptyResults(todoTaskUserId)) : RenderNoUserFilter()) :
          null}
      </Container>
    </>
  )
}

export default App
