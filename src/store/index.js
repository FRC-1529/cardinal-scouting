import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex)

import Database from '../modules/firstdb.js'
import { ToastProgrammatic as Toast } from 'buefy'

let localdb = new Database();

export default new Vuex.Store({
  state: {
    api: {
      base_url: "https://frc-api.firstinspires.org/v2.0",
      username: "",
      auth_key: ""
    },
    sync: false,
    scouts: [],
    districts: [],
    events: [],
    teams: [],
    season: "2020",
    record: {
      scout: "",
      district: "",
      event: "",
      team: "",
      robot: {
        autonomous: {
          starting_cells: 0,
          crosses_line: false,
          scoring: {
            low: {
              failure: 0,
              success: 0
            },
            two_pointer: {
              failure: 0,
              success: 0
            },
            three_pointer: {
              failure: 0,
              success: 0
            },
          }
        },
        teleop: {
          max_cells: 0,
          control_panel: {
            spin: false,
            color: false
          },
          mobility: {
            under_control_panel: false,
            over_rendezvous: false
          }
        },
        end_game: {
          climbing: {
            climb: false,
            park: false,
            fell: false,
            fall_location: ""
          },
          generator_switch: false
        },
        other: {
          alliance_score: 0,
          game_outcome: null,
          fouls: 0,
          tech_fouls: 0,
          yellow_card: false,
          red_card: false,
          alliance_ability: 0,
          defence: {
            possible: false,
            score: 0
          },
          bad_outcomes: {
            no_show: false,
            broken: false,
            died: false,
            fell_over: false
          }
        }
      }
    }
  },
  getters: {
  },
  mutations: {
    UPDATE_API_CONFIG(state, config) {
      state.api = config;
    },
    ENABLE_SYNC(state) {
      state.sync = true;
    },
    DISABLE_SYNC(state) {
      state.sync = false;
    },
    SET_SYNC(state, b) {
      state.sync = b;
    },
    UPDATE_SCOUTS(state, scouts) {
      state.scouts = scouts;
    },
    SET_SCOUT(state, scout) {
      state.record.scout = scout;
    },
    SET_DISTRICT(state, district) {
      state.record.district = district;
    },
    SET_EVENT(state, event) {
      state.record.event = event;
    },
    UPDATE_DISTRICTS(state, districts) {
      state.districts = districts;
    },
    UPDATE_EVENTS(state, events) {
      state.events = events;
    }
  },
  actions: {
    ADD_SCOUT(context, scout) {
      localdb.addScout(scout).then(() => {
        return localdb.getScouts().then((scouts) => {
          context.commit('UPDATE_SCOUTS', scouts);
        });
      }).catch(err => {
        console.error(err);
        Toast.open({
          duration: 3000,
          message: err,
          type: 'is-danger'
        });
      })
    },
    SET_SCOUT(context, scout) {
      context.commit('SET_SCOUT', scout);
    },
    SET_DISTRICT(context, district) {
      
      context.commit('SET_DISTRICT', district);
    },
    SET_EVENT(context, event) {
      context.commit('SET_EVENT', event);
    },
    SET_API_CONFIG(context, config) {
      localdb.configAPI(config).then(r_config => {
        context.commit('ENABLE_SYNC')
        context.commit('UPDATE_API_CONFIG', r_config);
      }).catch(() => {
        context.commit('DISABLE_SYNC');
      });
    },
    SYNC_DISTRICTS(context) {
      localdb.fetchDistricts().then((resp) => {
        return localdb.getDistricts().then(districts => {
          context.commit('UPDATE_DISTRICTS', districts);
        });
      }).catch(err => {
        console.error(err);
      })
    },
    SYNC_EVENTS(context) {
      localdb.fetchEvents().then(() => {
        return localdb.getEvents().then(events => {
          context.commit('UPDATE_EVENTS', events);
        });
      }).catch(err => console.error(err));
    },
    SYNC_ALL(context) {
      context.dispatch('SYNC_DISTRICTS');
      context.dispatch('SYNC_EVENTS');
    },
    STARTUP(context) {
      localdb.getConfig().then(config => {
        context.commit('UPDATE_API_CONFIG', config);
        localdb.testAPI().then(() => {
          context.commit('ENABLE_SYNC');
        }).catch((err) => {
          context.commit('DISABLE_SYNC');
        })
      })
      localdb.getScouts().then(scouts => {
        context.commit('UPDATE_SCOUTS', scouts);
      });
      localdb.getDistricts().then(districts => {
        context.commit('UPDATE_DISTRICTS', districts);
      });
    }
  },
  modules: {}
})
