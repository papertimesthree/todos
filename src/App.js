import React, { useEffect, useState } from "react";
import {
  Alert,
  Badge,
  Button,
  ToggleButton,
  ToggleButtonGroup
} from "react-bootstrap";
import { fstore, increment } from "./fb";
import "./styles.css";

export default function App() {
  let [ar, setAr] = useState([]);
  let [reachedEnd, setReachedEnd] = useState(false);
  let [categoryFilter, setCategoryFilter] = useState(undefined);

  useEffect(() => {
    loadData();
  }, []);

  async function loadData() {
    // async
    let snapshot = await fstore
      .collection("todos")
      .orderBy("created_at", "desc")
      .limit(3)
      .get();
    setAr(snapshot.docs);
  }

  async function loadMoreData() {
    // async
    let snapshot = await fstore
      .collection("todos")
      .orderBy("created_at", "desc")
      .limit(3)
      .startAfter(ar[ar.length - 1])
      .get();

    if (snapshot.docs.length < 3) setReachedEnd(true);
    setAr([...ar, ...snapshot.docs]);
  }

  async function create(e) {
    e.preventDefault();
    // let data = {
    //   content: e.target.content.value,
    //   likes: parseInt(e.target.likes.value, 10) || 0,
    //   created_at: new Date(),
    //   category: e.target.category.value
    // };
    let data = Object.fromEntries(new FormData(e.target));
    data.created_at = new Date();
    data.likes = parseInt(data.likes, 10) || 0;

    e.target.reset();

    let result = await fstore.collection("todos").add(data);
    let doc = await fstore.collection("todos").doc(result.id).get();
    let copy = [doc, ...ar];
    setAr(copy);
  }

  async function remove(id) {
    await fstore.collection("todos").doc(id).delete();
    let copy = [...ar];
    for (let i = 0; i < copy.length; i++) {
      if (copy[i].id === id) {
        copy.splice(i, 1);
        break;
      }
    }
    setAr(copy);
  }

  async function addLike(id) {
    await fstore
      .collection("todos")
      .doc(id)
      .update({ likes: increment(1) });

    let updatedDoc = await fstore.collection("todos").doc(id).get();

    let copy = [...ar];
    for (let i = 0; i < copy.length; i++) {
      if (copy[i].id === id) {
        copy[i] = updatedDoc;
        break;
      }
    }
    setAr(copy);
  }

  function setFilter(filter) {
    setCategoryFilter(filter);
  }

  return (
    <div className="App container">
      <h1 className="mt-5 mb-3 text-center">To-Do List {categoryFilter}</h1>

      <ToggleButtonGroup name="category" type="radio">
        <ToggleButton
          variant="outline-secondary"
          value="all"
          onClick={() => setFilter(undefined)}
        >
          All
        </ToggleButton>
        <ToggleButton
          variant="outline-secondary"
          value="study"
          onClick={() => setFilter("study")}
        >
          {"🏫"} study
        </ToggleButton>
        <ToggleButton
          variant="outline-secondary"
          value="work"
          onClick={() => setFilter("work")}
        >
          {"🏢"} work
        </ToggleButton>
        <ToggleButton
          variant="outline-secondary"
          value="home"
          onClick={() => setFilter("home")}
        >
          {"🏠"} home
        </ToggleButton>
      </ToggleButtonGroup>

      {ar
        .filter(
          (v) =>
            categoryFilter === undefined || v.data().category === categoryFilter
        )
        .map((v) => (
          <div className="card my-4">
            <div className="card-header">
              <div className="badge badge-danger mr-3">{v.data().category}</div>
              {v.data().content}
            </div>
            <div className="d-flex justify-content-end">
              <button
                className="btn btn-primary"
                onClick={() => addLike(v.id, v.data().likes)}
              >
                {"⭐"} {v.data().likes}
              </button>
              <button className="btn btn-danger" onClick={() => remove(v.id)}>
                x
              </button>
            </div>
            <div className="card-footer">
              {v.data().created_at.toDate().toLocaleString()}
            </div>
          </div>
        ))}
      <hr />
      <button
        className="btn btn-primary"
        onClick={loadMoreData}
        disabled={reachedEnd}
      >
        Load More
      </button>
      <hr />
      <form className="form bg-dark p-3 rounded" onSubmit={create}>
        <input
          className="form-control"
          type="text"
          name="content"
          placeholder="Name"
        />
        <input
          className="form-control"
          type="number"
          name="likes"
          placeholder="Ranking"
        />
        <div className="my-2">
          <label className="mr-3">category</label>
          <ToggleButtonGroup name="category" type="radio">
            <ToggleButton variant="outline-secondary" value="study">
              {"🏫"} Study
            </ToggleButton>
            <ToggleButton variant="outline-secondary" value="work">
              {"🏢"} Work
            </ToggleButton>
            <ToggleButton variant="outline-secondary" value="home">
              {"🏠"} Home
            </ToggleButton>
          </ToggleButtonGroup>
        </div>
        <button className="btn btn-primary">create</button>
      </form>
      <hr />
    </div>
  );
}
