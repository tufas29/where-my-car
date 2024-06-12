"use client";
import { useState, useEffect } from "react";
import Button from "../../components/button/Button";
import style from "./page.module.css";
const Home = () => {
  const [data, setData] = useState(null);
  const [isLoading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/locations")
      .then((res) => res.json())
      .then((data) => {
        setData(data);
        setLoading(false);
      });
  }, []);

  if (isLoading)
    return (
      <div className={style.container}>
        <p>בטעינה....</p>
      </div>
    );
  if (!data) return <p>No profile data</p>;

  return (
    <div className={style.container}>
      {data.locations.map((item) => (
        <Button
          key={item.location}
          location={item.location}
          active={item.active}
        />
      ))}
    </div>
  );
};

export default Home;
