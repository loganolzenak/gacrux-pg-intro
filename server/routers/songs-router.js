const express = require('express');
const router = express.Router();

const pool = require('../modules/pool');
const bodyParser = require('body-parser');

router.get('/', function(request, response){
  const sqlText = 'SELECT * FROM songs';
  pool.query(sqlText)
    // query was successful
    .then(function(result) {
      console.log('Get result:', result);
      response.send(result.rows);
    })
    // bad things could happen...
    .catch(function(error){
      console.log('Error on Get:', error);
      response.sendStatus(500);
    })
})
//get a single song from /songs/5
router.get('/:id', (request, response)=>{
  const id = request.params.id;
  const sqlText = 'select * from songs where id=$1';
  pool.query(sqlText, [id])
    .then((result)=>{
      console.log(`getting song ${id}`);
      response.send(result.rows);
    })
    .catch(function(error) {
      response.sendStatus(500);
    })
})

router.delete('/:id', (request, response)=>{
  const id = request.params.id;
  const newRating = request.body.rating;
  const sqlText = `DELETE FROM songs WHERE id=$1`;
  pool.query(sqlText, [id])
    .then((result)=>{
      response.sendStatus(200);
    .catch((error)=> {
      response.sendStatus(500);
    })





//update the rating of a specific song
router.put('/:id', (request, response)=>{
  const id = request.params.id;
  const newRating = request.body.rating;
  const sqlText = `UPDATE songs SET rating=$1 WHERE id=$2`;
  pool.query(sqlText, [newRating, id])
    .then((result)=>{
      response.sendStatus(200);
    .catch((error)=> {
      response.sendStatus(500);
    })
  )})
}



router.post('/add', (request, response) => {
  const song = request.body;
  console.log('Add song:', song);

  const sqlText = `INSERT INTO songs 
      (artist, track, published, rank)
      VALUES ($1, $2, $3, $4)`;
  pool.query(sqlText, 
      [song.artist, song.track, song.published, song.rank])
    .then( (result) => {
      console.log('Added song:', result);
      response.sendStatus(201);
    })
    .catch( (error) => {
      console.log('Error adding song:', error);
      response.sendStatus(500);
    })
})

module.exports = router;