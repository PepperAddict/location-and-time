import React, { useState, useEffect } from 'react';
import momentTime from 'moment-timezone'


export default function App() {
  const [location, setLocation] = useState('' as string)
  const [locationData, setLocationData] = useState(null as any)
  const [time, setTime] = useState('' as string)
  const [error, setError] = useState({
    set: false as boolean,
    message: '' as string
  } as any)

  const weatherFetch = newLocation => {
    const errorMessage = { set: true, message: 'No result was found. These are the formats allowed: "Groton, MA, US", "San Francisco" or Zipcode: 90210' } as object
    const weatherKey = `https://api.openweathermap.org/data/2.5/weather?${newLocation}&units=imperial&appid=e18fd02e1ddd96c31b615bbec62ad779` as string

      fetch(weatherKey).then((res) => {
        if (res.ok) return res.json()
      }).then((response) => {
        if (response.cod !== 200) {
          setError(errorMessage)
          setLocationData(null)
        } else {
          console.log(response)
          setLocationData(response)
          setError({set: false})
        }

      }).catch(() => {
        setError(errorMessage)
        setLocationData(null)
      })
    
  }

  useEffect(() => {

    navigator.geolocation.getCurrentPosition((position) => {
      if (position) {
        const lat = position.coords.latitude as number
        const long = position.coords.longitude as number
        const newString = `lat=${lat}&lon=${long}` as string
        weatherFetch(newString)

      }
    });
  }, [])

  useEffect(() => {
    if (locationData) {
      fetch(`http://api.geonames.org/timezoneJSON?lat=${locationData.coord.lat}&lng=${locationData.coord.lon}&username=pepper`)
        .then((res) => {
          return res.json()
        }).then((response) => {
          console.log(response)
          const currenttime = momentTime.tz(response.timezoneId).format('dddd, MMMM Do, YYYY h:mm:ss A') as string
          setTime(currenttime)
        }).catch(error => console.log(error))
    }
  }, [locationData])

  const handleLocationLookup = e => {
    e.preventDefault()

    const isItZipCode = /^\d+$/.test(location) as Boolean
    const revisedLocation = (isItZipCode) ? `zip=${location},us` : `q=${location}`
    weatherFetch(revisedLocation)
  }

  return (
    <div className="main-container">
      <form onSubmit={(e) => handleLocationLookup(e)}>

        <label htmlFor="locationInput">
          <p className="real-label">Location</p>
          <input
            id="location"
            name="location"
            onChange={e => setLocation(e.target.value)}
            placeholder="enter a Location" />
        </label>
        <button className="locationLookup" type='submit'>Weather Lookup</button>
      </form>

      {(locationData) && <div className="weatherInfoContainer">
        <h1>{locationData.name}</h1>
        <p><b>Weather:</b> {locationData.main.temp}°  {locationData.weather[0].description}</p>
        <p><b>Time: {time}</b></p>
      </div>}
      {error.set && <p className="errorMessage">{error.message}</p>}
    </div>
  )
}
