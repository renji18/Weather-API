const express = require('express')
const app = express()
const requests = require('requests')
const path = require('path')
const hbs = require('hbs')

app.use(express.json())

app.set('view engine', 'hbs')
hbs.registerPartials(path.join(__dirname, '/Partials'))

app.get('/', (req, res) => {
  res.render('index')
})

app.get('/weather', async(req, res) => {
  const location = req.query.city
  if(!location){
    res.render('weather', {
      MESSAGE: 'Please provide a location',
    })
    return
  }
  requests(`https://weather.visualcrossing.com/VisualCrossingWebServices/rest/services/timeline/${location}?unitGroup=metric&key=6PGDMU6LY3ZBGHBBL44SSBZMG&contentType=json`)
    .on('data', (chunk) => {
      if(chunk === `Invalid location found. Please check your location parameter:${location}`){
        res.render('weather', {
          MESSAGE: 'Opps! Looks like we have no info for the provided location, please try another location'
        })
        return
      }
      const objData = JSON.parse(chunk)
      const address = objData.address
      const temp = objData.currentConditions.temp
      const condition = objData.currentConditions.conditions
      res.render('weather', {
        CITY: `City: ${address}`,
        TEMP: `Temperature: ${temp} in Celcius`,
        COND: `Condition: ${condition}`,
      })
    })
    .on('end', (err) => {
      if (err)
        res.render('404', {
          ERROR: 'Opps! Looks like we have no info for the provided location, please try another location'
        })
    })
})

app.get('/about', (req, res) => {
  res.render('about')
})

app.get('*', (req, res) => {
  res.render('404', {
    ERROR: 'Opps! You came to a wrong page, please try going back.'
  })
})

const port = 5000
app.listen(port, () => {
  console.log(`Server is listening on port ${port}`);
})