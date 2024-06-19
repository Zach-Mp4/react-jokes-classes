import React, { useState, useCallback, useEffect } from "react";
import axios from "axios";
import Joke from "./Joke";
import "./JokeList.css";

/** List of jokes. */

const JokeList = ({ numJokesToGet = 5 }) => {
  const [jokes, setJokes] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  const getJokes = useCallback(async () => {
    try {
      const newJokes = [];
      const seenJokes = new Set();

      while (newJokes.length < numJokesToGet) {
        const res = await axios.get('https://icanhazdadjoke.com', {
          headers: { Accept: 'application/json' },
        });
        const joke = res.data;

        if (!seenJokes.has(joke.id)) {
          seenJokes.add(joke.id);
          newJokes.push({ ...joke, votes: 0 });
        } else {
          console.log('duplicate found!');
        }
      }

      setJokes(newJokes);
      setIsLoading(false);
    } catch (err) {
      console.error(err);
    }
  }, [numJokesToGet]);

  useEffect(() => {
    getJokes();
  }, [getJokes]);

  const generateNewJokes = useCallback(() => {
    setIsLoading(true);
    getJokes();
  }, [getJokes]);

  const vote = useCallback((id, delta) => {
    setJokes((jokes) =>
      jokes.map((j) =>
        j.id === id ? { ...j, votes: j.votes + delta } : j
      )
    );
  }, []);

  const sortedJokes = [...jokes].sort((a, b) => b.votes - a.votes);

  if (isLoading) {
    return (
      <div className="loading">
        <i className="fas fa-4x fa-spinner fa-spin" />
      </div>
    );
  }

  return (
    <div className="JokeList">
      <button className="JokeList-getmore" onClick={generateNewJokes}>
        Get New Jokes
      </button>

      {sortedJokes.map((j) => (
        <Joke
          text={j.joke}
          key={j.id}
          id={j.id}
          votes={j.votes}
          vote={vote}
        />
      ))}
    </div>
  );
};

export default JokeList;