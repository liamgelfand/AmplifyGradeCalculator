const express = require('express')
const bodyParser = require('body-parser')
const awsServerlessExpressMiddleware = require('aws-serverless-express/middleware')

// declare a new express app
const app = express()
app.use(bodyParser.json())
app.use(awsServerlessExpressMiddleware.eventContext())

// Enable CORS for all methods
app.use(function(req, res, next) {
  res.header("Access-Control-Allow-Origin", "*")
  res.header("Access-Control-Allow-Headers", "*")
  next()
});

function calculate(weight, grades) {
  // Calculate the weighted average
  const weightedSum = grades.reduce((sum, grade) => sum + grade, 0);
  const weightedAverage = (weightedSum / grades.length) * (weight / 100);

  return weightedAverage;
}

app.post('/calculate/*', function(req, res) {
  // Add your code here
  res.json({success: 'post call succeed!', url: req.url, body: req.body})
});



app.post('/calculate', function(req, res) {
  const requestData = req.body.body; // Extract the "body" field from the request

  // Initialize an array to store calculated grades for each section
  const calculatedGrades = [];

  // Loop through each course in the requestData
  requestData.courses.forEach(course => {
    // Loop through each section in the current course
    course.sections.forEach(section => {
      // Extract the weight and grades for the current section
      const weight = section.weight;
      const grades = section.grades;

      // Perform your calculation based on weight and grades
      const calculatedGrade = calculate(weight, grades);

      // Add calculated grade to list
      calculatedGrades.push(calculatedGrade);
    });
  });

  // Respond with the calculated grades
  res.json({ success: true, calculatedGrades });
});




/**********************
 * Example get method *
 **********************/

app.get('/calculate', function(req, res) {
  // Add your code here
  res.json({success: 'get call succeed!', url: req.url});
});

app.get('/calculate/*', function(req, res) {
  // Add your code here
  res.json({success: 'get call succeed!', url: req.url});
});

/****************************
* Example post method *
****************************/

/****************************
* Example put method *
****************************/

app.put('/calculate', function(req, res) {
  // Add your code here
  res.json({success: 'put call succeed!', url: req.url, body: req.body})
});

app.put('/calculate/*', function(req, res) {
  // Add your code here
  res.json({success: 'put call succeed!', url: req.url, body: req.body})
});

/****************************
* Example delete method *
****************************/

app.delete('/calculate', function(req, res) {
  // Add your code here
  res.json({success: 'delete call succeed!', url: req.url});
});

app.delete('/calculate/*', function(req, res) {
  // Add your code here
  res.json({success: 'delete call succeed!', url: req.url});
});

app.listen(3000, function() {
    console.log("App started")
});

// Export the app object. When executing the application local this does nothing. However,
// to port it to AWS Lambda we will create a wrapper around that will load the app from
// this file
module.exports = app
