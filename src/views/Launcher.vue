<template lang="pug">
#view
  b-navbar.is-dark(:mobile-burger="false" :is-active="true")
    template(slot="brand")
      b-navbar-item(tag="router-link" :to="{ path: '/report' }")
        b-icon(icon="close")
    template(slot="start")
    template(slot="end")
      b-navbar-item(tag="a" @click="showAPIModal()")
        b-icon(v-if="this.syncable" icon="sync")
        b-icon(v-else icon="sync-alert")
      b-navbar-item(tag="div")
        b-button(@click="" icon-left="view-dashboard" disabled="true") Explore Data
  .columns.form-height.is-vcentered
    .column
    .column.is-one-third
      .card
        header.card-header.has-background-dark
          p.card-header-title.has-text-light New Report
        .card-content
          b-field(label="Scout")
            .control
              b-dropdown(aria-role="scout-selection")
                button.button(slot="trigger")
                  span {{ labels.scout }}
                  b-icon(icon="menu-down")
                b-dropdown-item(aria-role="scout-selection-item" v-for="_scout in scouts" has-link) 
                  a(@click="setScout(_scout)") {{ _scout.first }} {{ _scout.last }}
                b-dropdown-item(aria-role="scout-selection-item" separator)
                b-dropdown-item(aria-role="scout-selection-item" has-link)
                  a(@click="showScoutModal()")
                    b-icon(icon="account-plus")
                    |&nbsp;New Scout
          b-field(label="District")
            .control
              b-dropdown(aria-role="district-selection")
                button.button(slot="trigger")
                  span {{ labels.district }}
                  b-icon(icon="menu-down")
                b-dropdown-item(aria-role="district-selection-item" v-for="district in districts" @click="setDistrict(district)") {{ district.code }} - {{ district.name }}
          b-field(label="Event")
            .control
              b-dropdown(aria-role="scout-selection")
                button.button(slot="trigger")
                  span {{ labels.event }}
                  b-icon(icon="menu-down")
                b-dropdown-item(aria-role="scout-selection-item" v-for="event in events" @click="setEvent(event)") {{ event.code }} - {{ event.name }}
          b-field(label="Team")
            .control
              b-dropdown(aria-role="scout-selection")
                button.button(slot="trigger")
                  span {{ labels.team }}
                  b-icon(icon="menu-down")
                b-dropdown-item(aria-role="scout-selection-item")
          b-field
            p.control
              button.button.is-primary(@click="createReport()") Create Report
    .column
  b-modal(:active.sync="apiModalActive" has-modal-card trap-focus aria-role="dialog" aria-modal)
    .modal-card(style="width: auto")
      header.modal-card-head
        p.modal-card-title API Authorization
      section.modal-card-body
        b-field(label="API Username")
          b-input(type="text" placeholder="sampleuser" v-model="forms.api.username")
        b-field(label="API Authorization Key")
          b-input(type="text" placeholder="7eaa6338-a097-4221-ac04-b6120fcc4d49" v-model="forms.api.auth_key")
      footer.modal-card-foot
        b-button.is-primary(@click="saveAPI()") Save Details
        b-button.is-info(:disabled="!syncable" @click="syncAll()") Sync Now

  b-modal(:active.sync="scoutModalActive" has-modal-card trap-focus aria-role="dialog" aria-modal)
    .modal-card(style="width: auto")
      header.modal-card-head
        p.modal-card-title Add New Scout
      section.modal-card-body
        b-field(label="First Name")
          b-input(type="text" v-model="forms.scout.first")
        b-field(label="Last Name")
          b-input(type="text" v-model="forms.scout.last")
      footer.modal-card-foot
        b-button.is-primary(@click="addScout()") Save Scout
        a(@click="closeScoutModal()") Cancel
</template>

<style lang="scss">
.form-height {
  height: 80vh;
}
</style>

<script>

export default {
  data() {
    return {
      apiModalActive: false,
      scoutModalActive: false,
      forms: {
        scout: {
          first: "",
          last: ""
        },
        api: {
          username: "",
          auth_key: ""
        }
      }
    };
  },
  computed: {
    labels() {
      return {
        scout: this.$store.state.record.scout ? `${this.$store.state.record.scout.first} ${this.$store.state.record.scout.last}`:'Select a Scout',
        district: this.$store.state.record.district ? `${this.$store.state.record.district.code} - ${this.$store.state.record.district.name}`:'Select a District',
        event: this.$store.state.record.district ? `${this.$store.state.record.event.code} - ${this.$store.state.record.event.name}`:'Select an Event',
        team: 'Select a Team'
      }
    },
    scouts() {
      return this.$store.state.scouts;
    },
    districts() {
      return this.$store.state.districts;
    },
    events() {
      return this.$store.state.events;
    },
    teams() {
      return this.$store.state.teams;
    },
    syncable() {
      return this.$store.state.sync;
    }
  },
  methods: {
    //Scout Functions
    setScout(scout) {
      this.$store.dispatch('SET_SCOUT', scout);
    },
    addScout() {
      this.$store.dispatch('ADD_SCOUT', this.forms.scout);
      this.forms.scout = {
        first: "",
        last: "",
      };
      this.closeScoutModal();
    },
    setDistrict(district) {
      this.$store.dispatch('SET_DISTRICT', district);
    },
    setEvent(event) {
      this.$store.dispatch('SET_EVENT', event);
    },
    setTeam(team) {
      this.$store.dispatch('SET_TEAM', team);
    },


    saveAPI() {
      this.$store.dispatch('SET_API_CONFIG', this.forms.api);
    },
    syncAll() {
      this.$store.dispatch('SYNC_ALL');
    },

    //GUI Functions
    showAPIModal() {
      this.forms.api.username = this.$store.state.api.username;
      this.forms.api.auth_key = this.$store.state.api.auth_key;
      this.apiModalActive = true;
    },
    closeAPIModal() {
      this.apiModalActive = false;
    },
    showScoutModal() {
      this.scoutModalActive = true;
    },
    closeScoutModal() {
      this.scoutModalActive = false;
    },
    createReport() {
      this.$router.push({ path: '/report' });
    },
    closeWindow() {
      console.log('Figure out how to close the window!');
    }
  },
  mounted() {}
}
</script>