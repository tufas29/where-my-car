"use client";
import { useState, useEffect, useCallback } from "react";
import Button from "../../components/button/Button";
import style from "./page.module.css";
import Spinner from "../../components/spinner/Spinner";
import converTime from "../../utils/convertTime";

const Home = () => {
  const [data, setData] = useState(null);
  const [isLoading, setLoading] = useState(true);
  const [lastUpdate, setLastUpdate] = useState(null);

  const fetchData = useCallback(async () => {
    try {
      const response = await fetch("/api/locations");
      const data = await response.json();
      setData(data);
      const activeLocation = data.locations.find((loc) => loc.active === true);
      if (activeLocation) {
        setLastUpdate(converTime(activeLocation.updatedAt));
      }
    } catch (error) {
      console.error("Error fetching data:", error);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const handleClick = async (item) => {
    const prevActive = data.locations.find((loc) => loc.active === true);
    const prevActiveId = prevActive ? prevActive._id : null;

    const updatedLocations = data.locations.map((loc) =>
      loc._id === item._id
        ? { ...loc, active: true }
        : { ...loc, active: false }
    );
    setData((prevData) => ({ ...prevData, locations: updatedLocations }));
    setLastUpdate(converTime(new Date().toISOString()));

    try {
      await fetch(`/api/locations/${item._id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ newLocation: item.location, newActive: true }),
      });

      if (prevActiveId) {
        await fetch(`/api/locations/${prevActiveId}`, {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            newLocation: prevActive.location,
            newActive: false,
          }),
        });
      }
    } catch (error) {
      console.error("Error updating locations:", error);
    }
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
