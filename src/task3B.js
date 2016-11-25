
import express from 'express';
import fetch from  'isomorphic-fetch';
import _ from 'lodash';
const router = express.Router();

const petsUrl = 'https://gist.githubusercontent.com/isuvorov/55f38b82ce263836dadc0503845db4da/raw/pets.json';
let pets = {};
fetch(petsUrl)
    .then(async (res) => {
        pets = await res.json();
    })
    .catch(err => {
        console.log('Что-то пошло не так:', err);
    });

function isNumeric(n) {
   return !isNaN(parseFloat(n)) && isFinite(n);
}

router.get('/pets/populate', (req, res) => {
    const type = req.query.type ? req.query.type : false;
    const age_gt = req.query.age_gt ? req.query.age_gt : -1;
    const age_lt = req.query.age_lt ? req.query.age_lt : 9999;
    let petsArr = [];
    if (type) {
        petsArr = _.cloneDeep(_.filter(pets.pets, function(o) { return o.type == type && o.age > age_gt && o.age < age_lt}));
    }else{
        petsArr = _.cloneDeep(_.filter(pets.pets, function(o) { return o.age > age_gt && o.age < age_lt}));
    }
    _.forEach(petsArr, function(value, key) {
        petsArr[key]['user'] = _.find(pets.users, function(o){ return o.id == value.userId});
    });
    res.json(petsArr);
});


router.get('/pets/:id/populate', (req, res) => {
    const id = req.params.id;
    const user = _.cloneDeep(_.find(pets.pets, function(o) { return o.id == id;
    }));

    user['user'] = _.find(pets.users, function(o) { return o.id == user.userId});
    if (user === undefined) {
        res.status(404).send("Not Found");
    } else {
        res.send(user);
    }
});


router.get('/users/populate', (req, res) => {
    const havePet = req.query.havePet ? req.query.havePet : false;
    const userPetArr = [];
    const userArr = _.cloneDeep(pets.users);
    const userIdArr = [];
    _.forEach(userArr, function(value, key) {
        userArr[key]['pets'] = _.filter(pets.pets, function(o){ return o.userId == value.id});
    });
    _.filter(pets.pets, function(o) {
        if (o.type == havePet) {
            userIdArr.push(o.userId);
        }
    });
    _.forEach(_.uniq(userIdArr.sort()), function(value, key) {
        userPetArr.push(_.find(userArr, function(o){ return o.id == value}));
    });
    res.json(havePet ? userPetArr : userArr);
});


router.get('/users/:id/populate', (req, res, next) => {
    const id = isNumeric(req.params.id) ? req.params.id : next();
    const user =_.cloneDeep(_.find(pets.users, function(o){console.log("O равно   ",o.id); return o.id == id}));
    if (user === undefined){
        res.status(404).send("Not Found");
    }else{
        user['pets'] = _.filter(pets.pets, function(o){ return o.userId == user.id});
        res.send(user);
    }
});


router.get('/users/:username/populate', (req, res) => {
    const username = req.params.username;
    const user =_.cloneDeep(_.find(pets.users, function(o){console.log(o); return o.username == username}));
    if (user === undefined){
        res.status(404).send("Not Found");
    }else{
        user['pets'] = _.filter(pets.pets, function(o){ return o.userId == user.id});
        res.send(user);
    }
});


router.get("/", (req, res) => {
    res.json(pets);
});


router.get('/users', (req, res) => {
    const havePet = req.query.havePet ? req.query.havePet : false;
    const petsArr = [];
    const userArr = [];
    _.filter(pets.pets, function(o){
        if (o.type == havePet) {
            petsArr.push(o.userId);
        }
    });
    console.log(petsArr);
    _.forEach(_.uniq(petsArr.sort()), function(value, key) {
        userArr.push(_.find(pets.users, function(o){ return o.id == value}));
    });
    res.json(havePet ? userArr : pets.users);
});


router.get('/users/:id', (req, res, next) => {
    const id = isNumeric(req.params.id) ? req.params.id : next();
    const user =_.find(pets.users, function(o){ return o.id == id});
    if (user === undefined){
        res.status(404).send("Not Found");
    }else{
        res.send(user);
    }
});


router.get("/users/:username", (req, res, next) => {
    const username = req.params.username;
    const user =_.find(pets.users, function(o){ return o.username == username});
    if (user === undefined){
        res.status(404).send("Not Found");
    }else{
        res.send(user);
    }
});


router.get('/users/:id/pets', (req, res, next) => {
    const id = isNumeric(req.params.id) ? req.params.id : next();
    const petsArr = _.filter(pets.pets, function(o){ return o.userId == id});
    res.json(petsArr);
});


router.get('/users/:username/pets', (req, res) => {
    const username = req.params.username;
    const id = _.find(pets.users, function(o){ return o.username == username});
    const petsArr = _.filter(pets.pets, function(o){ return o.userId == id.id});
    res.json(petsArr);
});


router.get('/pets', (req, res) => {
    const type = req.query.type ? req.query.type : false;
    const age_gt = req.query.age_gt ? req.query.age_gt : -1;
    const age_lt = req.query.age_lt ? req.query.age_lt : 9999;
    let petsArr = [];
    if (type){
        petsArr = _.filter(pets.pets, function(o){ return o.type == type && o.age > age_gt && o.age < age_lt});
    }else{
        petsArr = _.filter(pets.pets, function(o){ return o.age > age_gt && o.age < age_lt});
    }
    res.json(req.query.type || req.query.age_gt || req.query.age_lt ? petsArr : pets.pets);
});


router.get('/pets/:id', (req, res) => {
    const id = req.params.id;
    const user =_.find(pets.pets, function(o){ return o.id == id});
    if (user === undefined){
        res.status(404).send("Not Found");
    }else{
        res.send(user);
    }
});


module.exports = router
