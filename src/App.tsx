import React, { useState, useEffect } from 'react';
import momentTime from 'moment-timezone'


export default function App() {
  const [location, setLocation] = useState('' as string)
  const [locationData, setLocationData] = useState(null as any)
  const [time, setTime] = useState('' as string)
  const [error, setError] = useState(false as boolean)

  const weatherFetch = newLocation => {

    const weatherKey = `https://api.openweathermap.org/data/2.5/weather?${newLocation}&units=imperial&appid=e18fd02e1ddd96c31b615bbec62ad779` as string
      fetch(weatherKey).then((res) => {
        if (res.ok) return res.json()
      }).then((response) => {
        if (response.cod !== 200) {
          setError(true)
          setLocationData(null)
        } else {
          console.log(response)
          setLocationData(response)
          setError(false)
        }
      }).catch(() => {
        setError(true)
        setLocationData(null)
      })
  }

  const getCurrentLocation = (e) => {
    e.preventDefault();
    navigator.geolocation.getCurrentPosition((position) => {
      if (position) {
        const lat = position.coords.latitude as number
        const long = position.coords.longitude as number
        const newString = `lat=${lat}&lon=${long}` as string
        weatherFetch(newString)
      }
    });
  }

  useEffect(() => {
    if (locationData) {
      const timezoneKey = `http://api.geonames.org/timezoneJSON?lat=${locationData.coord.lat}&lng=${locationData.coord.lon}&username=pepper`
      fetch(timezoneKey)
        .then((res) => {
          return res.json()
        }).then((response) => {
          const currenttime = momentTime.tz(response.timezoneId).format('dddd, MMMM Do, YYYY h:mm:ss A') as string
          setTime(currenttime)
        }).catch(error => console.log(error))
    }
  }, [locationData])

  const handleLocationLookup = e => {
    e.preventDefault()
    const isItZipCode = /^\d+$/.test(location) as Boolean
    const revisedLocation = (isItZipCode) ? `zip=${location},us` as string : `q=${location}` as string
    weatherFetch(revisedLocation)
  }

  return (
    <div className="main-container">
      <form onSubmit={(e) => handleLocationLookup(e)}>

        <label htmlFor="location-input">
          <h1 className="real-label">Location Info</h1>
          <input
            id="location-input"
            name="location"
            pattern=".{3,}"
            onChange={e => setLocation(e.target.value)}
            required title="3 characters minimum"
            placeholder="Enter a Location" />
        </label>
        <span className="button-group">
          <button className="location-lookup" type='submit'>Weather Lookup</button>
          <button className="location-lookup" onClick={getCurrentLocation}>Get Current Location</button>
        </span>
        
      </form>
    
      {(locationData) && (!error) && <div className="weather-info-container">
        <h2>{locationData.name}</h2>
        <span className="weather-icon-image"><img src={`http://openweathermap.org/img/wn/${locationData.weather[0].icon}@2x.png`} alt="Weather Icon" /></span>
        <p><b>Weather:</b> {locationData.main.temp}°  {locationData.weather[0].description} </p>
        <p><b>Date & Time:</b> {time}</p>
      </div>}
      {error && <div className="error-message">
      <h2>No result was found</h2>
      <p>These are the formats allowed:</p> 
      <ul>
        <li>Groton, MA, US</li>
        <li>San Francisco</li>
        <li>90210</li></ul>
        </div>}
    </div>
  )
}
