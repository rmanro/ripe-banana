const { assert } = require('chai');
const request = require('./request');
const { dropCollection } = require('./db');

describe('actors API', () => {

    const saveActor = (actorName) => {
        it('saves an actor', () => {
            return request.post('/actors')
                .send(actorName)
                .then(checkOk)
                .then(({ body }) => {
                    const { _id, __v } = body;
                    assert.ok(_id);
                    assert.equal(__v, 0);
                    assert.deepEqual(body, { _id, __v, ...actorName });
                    bradPitt = body;
                });
        });
    };

    before(() => dropCollection('actors'));

    let bradPitt = {
        name: 'Brad Pitt',
        dob: '1963-12-18',
        pob: 'Shawnee, OK, USA'
    };
    
    let milaKunis = {
        name: 'Mila Kunis',
        dob: '1983-8-14',
        pob: 'Chernivtsi, Ukraine'
    };

    let gaelGarciaBernal = {
        name: 'Gael Garcia Bernal',
        dob: '1978-11-30',
        pob: 'Guadalajara, Jalisco, Mexico'
    };

    let danRadcliffe = {
        name: 'Danial Radcliffe',
        dob: '1989-7-23',
        pob: 'Fulham, London, England, UK'
    };

    let domGleeson = {
        name: 'Domhnall Gleeson',
        dob: '1983-5-12',
        pob: 'Dublin, Ireland'
    };

    let emmaWatson = {
        name: 'Emma Watson',
        dob: '1990-4-15',
        pob: 'Paris, France'
    };

    let willHarper = {
        name: 'William Jackson Harper',
        dob: '1980-2-8',
        pob: 'Dallas, TX, USA'
    };

    let nikWaldau = {
        name: 'Nikolaj Coster-Waldau',
        dob: '1970-7-27',
        pob: 'Rudkøbing, Denmark'
    };

    let kitHarington = {
        name: 'Kit Harington',
        dob: '1986-12-26',
        pob: 'London, England, UK'
    };

    let pedroPascal = {
        name: 'Pedro Pascal',
        dob: '1975-4-2',
        pob: 'Santiago, Chile'
    };

    const checkOk = res => {
        if(!res.ok) throw res.error;
        return res;
    };

    saveActor(bradPitt);
    saveActor(milaKunis);
    saveActor(gaelGarciaBernal);
    saveActor(danRadcliffe);
    saveActor(domGleeson);
    saveActor(emmaWatson);
    saveActor(willHarper);
    saveActor(nikWaldau);
    saveActor(kitHarington);
    saveActor(pedroPascal);

    it('updates an actor', () => {
        bradPitt.pob = 'Shawnee, OK';

        return request.put(`/actors/${bradPitt._id}`)
            .send(bradPitt)
            .then(checkOk)
            .then(({ body }) => {
                assert.deepEqual(body, bradPitt);
            });
    });
});