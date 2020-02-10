import PouchDB from 'pouchdb';
import PouchDBFind from 'pouchdb-find';
import Fuse from 'fuse.js';
import Promise from 'bluebird';
import request from 'request-promise';
PouchDB.plugin(PouchDBFind);

class firstdb {
  constructor(config) {
    if (!config) config = {};
    this.db = new PouchDB(config.db_name || 'localdb');
    this.api = {};
    this.sync = {
      available: false,
      updating: {
        label: '',
        percentage: 0
      }
    };
    if (!config.api) config.api = {};
    this.api.base_url = config.api.base_url || 'https://frc-api.firstinspires.org/v2.0';
    this.api.username = config.api.username || '';
    this.api.auth_key = config.api.auth_key || '';
    this.season = "2020";
    this.startup();
  }

  get authorization_token() {
    return Buffer.from(this.api.username+':'+this.api.auth_key).toString('base64');
  }

  //Fetch data from the database
  getConfig() {
    return this.db.get('config/api');
  }
  getScouts() {
    return new Promise((resolve, reject) => {
      this.db.allDocs({
        include_docs: true,
        startkey: 'scout/',
        endkey: 'scout/\ufff0'
      }).then(resp => {
        resolve(resp.rows.map(row => row.doc));
      }).catch((err) => {
        reject(err);
      });
    });
  };
  getDistricts() {
    return new Promise((resolve, reject) => {
      this.db.allDocs({
        include_docs: true,
        startkey: 'district/',
        endkey: 'district/\ufff0'
      }).then(resp => {
        resolve(resp.rows.map(row => row.doc));
      }).catch((err) => {
        reject(err);
      });
    });
  };
  getEvents() {
    return new Promise((resolve, reject) => {
      this.db.allDocs({
        include_docs: true,
        startkey: 'event/',
        endkey: 'event/\ufff0'
      }).then(resp => {
        resolve(resp.rows.map(row => row.doc));
      }).catch((err) => {
        reject(err);
      });
    });
  };
  getTeams() {
    return new Promise((resolve, reject) => {
      this.db.allDocs({
        include_docs: true,
        startkey: 'team/',
        endkey: 'team/\ufff0'
      }).then(resp => {
        resolve(resp.rows.map(row => row.doc));
      }).catch((err) => {
        reject(err);
      });
    });
  };

  //Search data from the database
  findScout(params) {};
  findDistrict(params) {};
  findEvent(params) {};
  findTeam(params) {};

  //Manually add data
  addScout(scout) {
    return this.updateScout(`${scout.last}_${scout.first}`, scout);
  };
  removeScout(scout) {

  };

  //Database update functions
  updateScout(id, data) {
    return this.updateDocument(`scout/${id}`, data);
  };
  updateDistrict(code, data) {
    return this.updateDocument(`district/${code}`, data);
  };
  updateEvent(code, data) {
    return this.updateDocument(`event/${code}`, data);
  };
  updateTeam(number, data) {
    return this.updateDocument(`team/${number}`, data);
  };

  fetchDistricts() {
    return this.fetchResource('districts').then((resp) => {
      return Promise.each(resp.districts, (district, i, l) => {
        return this.updateDistrict(district.code, district);
      });
    }).catch(console.error);
  };
  fetchEvents() {
    return this.fetchResource('events').then((resp) => {
      return Promise.each(resp.Events, (event, i, l) => {
        return this.updateEvent(event.code, event);
      });
    }).catch(console.error);
  };


  //Utility Functions
  updateDocument(id, data) {
    return new Promise((resolve, reject) => {
      this.db.get(id).then(doc => {
        //Document already exists
        this.db.put({
          ...doc,
          _id: id,
          ...data
        }).then((resp) => {
          //Successfully updated!
          return this.db.get(id).then(resolve);
        }).catch(reject);
      }).catch((err) => {
        //Document doesnt exist!
        this.db.put({
          _id: id,
          ...data
        }).then((resp) => {
          return this.db.get(id).then(resolve);
        }).catch(reject);
      });
    });
  }

  fetchResource(endpoint, qs) {
    return request({
      uri: `${this.api.base_url}/${this.season}/${endpoint}`,
      headers: {
        'Authorization': `Basic ${this.authorization_token}`,
        'Accept': 'application/json'
      },
      qs: qs,
      json: true
    });
  };
  configAPI(config) {
    return new Promise((resolve, reject) => {
      return this.updateDocument('config/api', config).then((ret) => {
        //Config has been updates, test it
        this.testAPI().then(() => {
          resolve(ret);
        }).catch(reject)
      });
    });
  };

  testAPI() {
    return new Promise((resolve, reject) => {
      this.fetchResource('').then((resp) => {
        this.sync.available = true;
        resolve();
      }).catch(err => {
        this.sync.available = false;
        reject();
      })
    });
  };
  startup() {
    //First, check if api config exists
    if (this.api.username || this.api.auth_key) {
      //Override config with given configuration;
      this.configAPI(this.api);
    } else {
      this.getConfig().then(config => {
        this.api = config;
      }).catch(console.error);
    }
  };
}

export default firstdb;