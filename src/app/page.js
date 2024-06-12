"use client";
import { useState, useEffect } from "react";
import Button from "../../components/button/Button";
import style from "./page.module.css";
import Spinner from "../../components/spinner/Spinner";
import converTime from "../../utils/convertTime";

const Home = () => {
  const [data, setData] = useState(null);
  const [isLoading, setLoading] = useState(true);
  const [lastUpdate, setLastUpdate] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      await fetch("/api/locations")
        .then((res) => res.json())
        .then((data) => {
          setData(data);
          setLoading(false);
          const activeLocation = data.locations.find(
            (loc) => loc.active === true
          );
          if (activeLocation) {
            setLastUpdate(converTime(activeLocation.updatedAt));
          }
        });
    };
    fetchData();
  }, []);

  const handleClick = async (item) => {
    const prevActiveId = data.locations.find((l) => l.active === true)._id;

    const updatedLocations = data.locations.map((loc) =>
      loc.location === item.location
        ? { ...loc, active: true }
        : { ...loc, active: false }
    );
    setData({ locations: updatedLocations });
    setLastUpdate(converTime(new Date().toISOString()));
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
        <Spinner />
      </div>
    );
  if (!data) return <p>No data</p>;

  return (
    <div className={style.container}>
      {data.locations.map((item) => (
        <Button key={item._id} item={item} handleClick={handleClick} />
      ))}
      <p className={style.lastUpdate}>{`עדכון אחרון: ${lastUpdate}`}</p>
    </div>
  );
};

export default Home;
