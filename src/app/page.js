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

  const handleClick = async (item) => {
    const prevActiveId = data.locations.find((l) => l.active === true)._id;

    const updatedLocations = data.locations.map((loc) =>
      loc.location === item.location
        ? { ...loc, active: true }
        : { ...loc, active: false }
    );
    setData({ locations: updatedLocations });

    await fetch(`/api/locations/${item._id}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ newLocation: item.location, newActive: true }),
    });

    await fetch(`/api/locations/${prevActiveId}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ newLocation: item.location, newActive: false }),
    });
  };

  if (isLoading)
    return (
      <div className={style.container}>
        <p>בטעינה....</p>
      </div>
    );
  if (!data) return <p>No profile data</p>;

  return (
    <div className={style.container}>
      <h1>איפה האוטו שלי?!</h1>
      {data.locations.map((item) => (
        <Button key={item._id} item={item} handleClick={handleClick} />
      ))}
    </div>
  );
};

export default Home;
