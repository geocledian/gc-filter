/*
 Vue.js Geocledian filter component
 created:     2020-01-23, jsommer
 last update: 2020-10-10, jsommer
 version: 0.6.5
*/
"use strict";

//language strings
const gcFilterLocales = {
  "en": {
    "options": {
      "title": "Filter"
    },
    "fields": {
      "crop": "Crop",
      "entity": "Entity",
      "name": "Name",
      "promotion": "Promotion",
      "planting": "Planting date after",
      "harvest": "Harvest date before",
      "date_format_hint": "YYYY-MM-DD",
    },
    "buttons": {
      "applyFilter": {
        "title": "Apply Filter"
      },
      "removeFilter": {
        "title": "Remove Filter"
      }
    }
  },
  "de": {
    "options": {
      "title": "Filter"
    },
    "fields": {
      "crop": "Fruchtart",
      "entity": "Entität",
      "name": "Name",
      "promotion": "Demo",
      "planting": "Pflanzdatum nach",
      "harvest": "Erntedatum vor",
      "date_format_hint": "JJJJ-MM-TT",
    },
    "buttons": {
      "applyFilter": {
        "title": "Filter anwenden"
      },
      "removeFilter": {
        "title": "Filter entfernen"
      }
    }
  },
  "lt": {
    "options": {
      "title": "Filtruoti laukus"
    },
    "fields": {
      "crop": "Pasėlis",
      "entity": "Subjektas",
      "name": "Pavadinimas",
      "promotion": "Promotion",
      "planting": "Planting date after",
      "harvest": "Harvest date before",
      "date_format_hint": "YYYY-MM-DD",
    },
    "buttons": {
      "applyFilter": {
        "title": "Filtruoti"
      },
      "removeFilter": {
        "title": "Atšaukti filtravimą"
      }
    }
  },
}

Vue.component('gc-filter', {
  props: {
    gcWidgetId: {
      type: String,
      default: 'filter1',
      required: true
    },
    gcApikey: {
      type: String,
      default: '39553fb7-7f6f-4945-9b84-a4c8745bdbec'
    },
    gcHost: {
      type: String,
      default: 'geocledian.com'
    },
    gcProxy: {
      type: String,
      default: undefined
    },
    gcApiBaseUrl: {
      type: String,
      default: "/agknow/api/v4"
    },
    gcApiSecure: {
      type: Boolean,
      default: true
    },
    gcLimit: {
      type: Number,
      default: 250
    },
    gcOffset: {
      type: Number,
      default: 0
    },
    gcLayout: {
      type: String,
      default: 'vertical' // or horizontal
    },
    gcAvailableFields: {
      type: String,
      default: 'crop,name,entity,planting,harvest,userdata,promotion'
    },
    gcAvailableOptions: {
      type: String,
      default: 'widgetTitle'
    },
    gcWidgetCollapsed: {
      type: Boolean,
      default: false // or false
    },
    gcLanguage: {
      type: String,
      default: 'en' // 'en' | 'de' | 'lt'
    }
  },
  template: `<div :id="this.gcWidgetId" class="is-inline gc-filter">

                <p :class="['gc-options-title', 'is-size-6', gcWidgetCollapsed ? 'gc-is-tertiary' : 'gc-is-primary']" 
                  style="cursor: pointer; margin-bottom: 0.5em;"    
                  v-on:click="toggleFilter" 
                  v-show="availableOptions.includes('widgetTitle')">
                    <!--i class="fas fa-filter fa-sm"></i --> {{ $t('options.title') }}
                    <i :class="[!gcWidgetCollapsed ? '': 'is-active', 'fas', 'fa-angle-down', 'fa-sm']"></i>
                </p>

                <!-- filter container -->
                <div :class="[!gcWidgetCollapsed ? '': 'is-hidden']" style="width: 100%;">
                  <div :id="this.gcWidgetId + 'div'" :class="layoutCSSMap['alignment'][gcLayout]">
                    <div class="gc-field" v-show="availableFields.includes('crop')">
                      <label class="label is-small gc-is-tertiary">{{$t('fields.crop')}}</label>
                      <div class="control">
                        <input type="text" class="input is-small" :placeholder="$t('fields.crop')" v-model="crop">
                      </div>
                    </div>
                    <div class="gc-field" v-show="availableFields.includes('entity')">
                      <label class="label is-small gc-is-tertiary">{{$t('fields.entity')}}</label>
                      <div class="control">
                        <input type="text" class="input is-small" :placeholder="$t('fields.entity')" v-model="entity">
                      </div>
                    </div>
                    <div class="gc-field" v-show="availableFields.includes('name')">
                      <label class="label is-small gc-is-tertiary">{{$t('fields.name')}}</label>
                      <div class="control">
                        <input type="text" class="input is-small" :placeholder="$t('fields.name')" v-model="name">
                      </div>
                    </div>
                    <div class="gc-field" v-show="availableFields.includes('planting')">
                      <label class="label is-small gc-is-tertiary">{{$t('fields.planting')}}</label>
                      <div class="control">
                        <input :id="'inpstartdate_' + gcWidgetId" type="text" class="input is-small" :placeholder="$t('fields.date_format_hint')" v-model="planting">
                      </div>
                    </div>
                    <div class="gc-field" v-show="availableFields.includes('harvest')">
                      <label class="label is-small gc-is-tertiary">{{$t('fields.harvest')}}</label>
                      <div class="control">
                        <input :id="'inpenddate_' + gcWidgetId" type="text" class="input is-small" :placeholder="$t('fields.date_format_hint')" v-model="harvest">
                      </div>
                    </div>
                    <div class="gc-field" v-show="availableFields.includes('promotion')">
                      <label class="label is-small gc-is-tertiary">{{$t('fields.promotion')}}</label>
                      <div class="control">
                        <input type="checkbox" class="content" v-model="promotion">
                      </div>
                    </div>
                    <div class="gc-field">
                      <div class="control" :style="gcLayout === 'vertical' ? 'padding-bottom: 1.2em;': 'margin-top: 1.2em;'">
                        <button :id="this.gcWidgetId + '_btnApplyFilter'" class="button is-small is-light gc-is-primary" v-on:click="applyFilter">
                            <i class="fas fa-filter fa-sm"></i><span class="content">{{$t('buttons.applyFilter.title')}}</span>
                        </button>
                        <button :id="this.gcWidgetId + '_btnRemoveFilter'" class="button is-small is-light gc-is-primary" v-on:click="removeFilter">
                            <i class="fas fa-times-circle fa-sm"></i><span class="content">{{$t('buttons.removeFilter.title')}}</span>
                        </button>
                      </div>
                    </div>
                  </div>  
                </div> <!-- filter container -->              

                <!-- pagination -->
                <!-- div class="field is-centered" style="padding-top: 10px;">
                  <nav class="pagination is-small is-centered" role="navigation" aria-label="pagination">
                    <button class="button pagination-previous is-light gc-is-primary" v-on:click="setParcelPageStart();" title="Start">
                      <i class="fas fa-fast-backward"></i>
                    </button>
                    <button id="btnPagePrev" class="button pagination-previous is-light gc-is-primary" v-on:click="setParcelPageOffset(-pagingStep);" title="Previous 250">
                      <i class="fas fa-step-backward"></i>
                    </button>
                    <button id="btnPageNext" class="button pagination-next is-light gc-is-primary" v-on:click="setParcelPageOffset(pagingStep);" title="Next 250">
                      <i class="fas fa-step-forward"></i>
                    </button>
                    <button class="button pagination-next is-light gc-is-primary" v-on:click="setParcelPageEnd();" title="End">
                      <i class="fas fa-fast-forward"></i>
                    </button>
                    <ul v-if="(total_parcel_count - offset) < pagingStep" id="parcel_paging" 
                        style="flex-wrap: nowrap !important; -ms-flex-wrap: nowrap !important" 
                        class="button pagination-list has-text-grey is-small">
                      <li><span class="">{{offset}}&nbsp;</span></li>
                      <li><span class=""> - </span></li>
                      <li><span class="">&nbsp;{{total_parcel_count}}&nbsp;</span></li>
                      <li><span class=""> of {{total_parcel_count}}</span></li>
                    </ul>
                    <ul v-else id="parcel_paging" 
                        style="flex-wrap: nowrap !important; -ms-flex-wrap: nowrap !important" 
                        class="button pagination-list has-text-grey is-small">
                      <li><span class="">{{offset}}&nbsp;</span></li>
                      <li><span class=""> - </span></li>
                      <li><span class="">&nbsp;{{(offset + pagingStep)}}&nbsp;</span></li>
                      <li><span class=""> of {{total_parcel_count}}</span></li>
                    </ul>
                </nav>
              </div -->  <!-- pagination -->

            </div><!-- gcWidgetId -->`,
  data: function () {
    console.debug("filter! - data()");
    return {
      parcels: [],
      total_parcel_count: 0,
      promotion: undefined,
      limit: 250,
      crop: "",
      entity: "",
      name: "",
      planting: "",
      harvest: "",
      currentParcel: undefined,
      selectedParcelId: -1,
      layoutCSSMap: {
        "alignment": {
          "vertical": "is-inline-block",
          "horizontal": "is-flex"
        }
      },
      apiSecure: true,
      startdateCalendar: undefined,
      enddateCalendar: undefined,
    }
  },
  //init internationalization
  i18n: {
    locale: this.currentLanguage,
    messages: gcFilterLocales
  },
  created: function () {
    console.debug("gc-filter - created()");
    this.changeLanguage();
  },
  /* when vue component is mounted (ready) on DOM node */
  mounted: function () {

    //initial loading data
    console.debug("filter! - mounted()");
    // trigger update of map
    //this.applyFilter();

    // init date pickers
    this.initDatePickers();

  },
  computed: {
    apiKey: {
      get: function () {
        return this.gcApikey;
      }
    },
    apiHost: {
      get: function () {
        return this.gcHost;
      }
    },
    apiBaseUrl: {
      get: function () {
        return this.gcApiBaseUrl;
      }
    },
    apiSecure: {
      get: function () {
        return this.gcApiSecure;
      }
    },
    apiMajorVersion: {
      get() {
        if (this.apiBaseUrl === "/agknow/api/v3") {
          return 3
        }
        if (this.apiBaseUrl === "/agknow/api/v4") {
          return 4
        }
      }
    },
    // promotion: {
    //   get() {
    //     return this.availableFields.includes('promotion');
    //   }
    // },
    filterString: {
      get: function () {
        // TODO offset + limit + paging
        let filterStr = "&crop=" + this.crop +
          "&entity=" + this.entity +
          "&name=" + this.name;
        if (this.apiMajorVersion === 3) {
          if (this.promotion) {
            filterStr += "&promotion=" + JSON.parse(this.promotion);
          }
        }
        if (this.apiMajorVersion === 4) {
          if (this.promotion) {
            filterStr += "&extended=" + JSON.parse(this.promotion);
            filterStr += "&promotion=" + JSON.parse(this.promotion);
          }
          if (this.planting.length > 0) {
            filterStr += "&planting=" + this.planting;
          }
          if (this.harvest.length > 0) {
            filterStr += "&harvest=" + this.harvest;
          }
        }
        return filterStr;
      }
    },
    // parcelIds: {
    //   get: function () { 
    //     if (this.parcels.length > 0) {
    //       return this.parcels.map(p => p.parcel_id); 
    //     }
    //     else {
    //         return [];
    //     }
    //   },
    // },
    // limit: {
    //   get: function() {
    //     // will always reflect prop's value 
    //     return this.gcLimit;
    //   },
    //   set: function (newValue) {       
    //     //notify root - through props it will change this.gcLimit
    //     this.$root.$emit('limitChange', newValue);
    //   }
    // },
    // pagingStep: {
    //   get: function() {
    //     // will always reflect prop's value 
    //     return this.limit;
    //   },
    // },
    offset: {
      get: function () {
        // will always reflect prop's value 
        return this.gcOffset;
      },
      set: function (newValue) {
        //notify root - through props it will change this.gcOffset
        this.$root.$emit('offsetChange', newValue);
      }
    },
    availableFields: {
      get: function () {
        return this.gcAvailableFields.split(",");
      }
    },
    availableOptions: {
      get: function () {
        return (this.gcAvailableOptions.split(","));
      }
    },
    currentLanguage: {
      get: function () {
        // will always reflect prop's value 
        return this.gcLanguage;
      },
    }
  },
  watch: {
    // parcelIds: function(newValue, oldValue) {
    //   //propagate local parcel ids to root instance
    //   //this.$root.selectedParcelIds = this.parcelIds;
    // },
    // parcels: function(newValue, oldValue) {
    //   console.debug("parcels changed!");
    //   //console.debug(oldValue);
    //   //console.debug(newValue);

    //   this.$root.$emit('parcelsChange', newValue);

    //   // set first parcel as current parcel
    //   this.currentParcel = this.parcels[0];

    // },
    filterString: function (newValue, oldValue) {

      console.debug("gc-filter - filterString");

      // would fire on any keyup event
      // this.$root.$emit('filterStringChange', newValue);
    },
    // offset: function (newValue, oldValue) {

    //   console.debug("gc-filter - offsetChange");

    //   // trigger per change of filter to other listening components
    //   // this.applyFilter();
    // },
    currentLanguage(newValue, oldValue) {
      this.changeLanguage();
      this.initDatePickers();
    }
  },
  methods: {
    getApiUrl: function (endpoint) {
      /* handles requests directly against  geocledian endpoints with API keys
          or (if gcProxy is set)
        also requests against the URL of gcProxy prop without API-Key; then
        the proxy or that URL has to add the api key to the requests against geocledian endpoints
      */
      let protocol = 'http';

      if (this.apiSecure) {
        protocol += 's';
      }

      // if (this.apiEncodeParams) {
      //   endpoint = encodeURIComponent(endpoint);
      // }

      // with or without apikey depending on gcProxy property
      return (this.gcProxy ?
        protocol + '://' + this.gcProxy + this.apiBaseUrl + endpoint :
        protocol + '://' + this.gcHost + this.apiBaseUrl + endpoint + "?key=" + this.apiKey);
    },
    getParcelTotalCount: function (filterString) {
      /* unused currently */
      const endpoint = "/parcels";
      let params;

      if (filterString) {
        params = filterString +
          "&count=True";
      } else {
        params = "&count=True";
      }
      let xmlHttp = new XMLHttpRequest();
      let async = true;

      //Show requests on the DEBUG console for developers
      console.debug("getParcelTotalCount()");
      console.debug("GET " + this.getApiUrl(endpoint) + params);

      xmlHttp.onreadystatechange = function () {
        if (xmlHttp.readyState == 4) {
          var tmp = JSON.parse(xmlHttp.responseText);

          if ("count" in tmp) {

            this.total_parcel_count = tmp.count;

            // minimum of 250
            if (this.total_parcel_count < this.pagingStep) {
              this.pagingStep = this.total_parcel_count;
            } else {
              this.pagingStep = 250;
            }

            if (this.total_parcel_count == 0) {
              return;

            } else {
              // now get all parcels
              this.getAllParcels(this.offset, filterString);
            }
          }
        }
      }.bind(this);
      xmlHttp.open("GET", this.getApiUrl(endpoint) + params, async);
      xmlHttp.send();
    },
    getAllParcels: function (offset, filterString) {
      /* unused currently */

      //download in chunks of n parcels
      let limit = this.limit;

      const endpoint = "/parcels";
      let params = "&limit=" + limit; //set limit to maximum (default 1000)

      if (offset) {
        params = params + "&offset=" + offset;
      }
      if (filterString) {
        params = params + filterString;
      }

      let xmlHttp = new XMLHttpRequest();
      let async = true;

      //Show requests on the DEBUG console for developers
      console.debug("getAllParcels()");
      console.debug("GET " + this.getApiUrl(endpoint) + params);

      xmlHttp.onreadystatechange = function () {
        if (xmlHttp.readyState == 4) {
          var tmp = JSON.parse(xmlHttp.responseText);

          if (tmp.content == "key is not authorized") {
            return;
          }

          this.parcels = [];

          if (tmp.content.length == 0) {
            //clear details and map
            return;
          }

          for (var i = 0; i < tmp.content.length; i++) {
            var item = tmp.content[i];
            this.parcels.push(item);
          }
        }
      }.bind(this);
      xmlHttp.open("GET", this.getApiUrl(endpoint) + params, async);
      xmlHttp.send();
    },
    toggleFilter: function () {
      this.gcWidgetCollapsed = !this.gcWidgetCollapsed;
    },
    applyFilter: function () {

      console.debug("applyFilter()");
      document.getElementById(this.gcWidgetId + "_btnApplyFilter").classList.add("is-active");

      // this.getParcelTotalCount(this.filterString);

      // update the paging & data
      this.$root.$emit('filterStringChange', this.filterString);

    },
    removeFilter: function () {

      this.crop = "";
      this.entity = "";
      this.name = "";
      this.promotion = undefined;
      this.planting = "";
      this.harvest = "";
      this.offset = 0;

      this.pagingStep = this.limit;

      this.applyFilter();

      document.getElementById(this.gcWidgetId + "_btnApplyFilter").classList.remove("is-active");
    },
    setParcelPageOffset: function (offset) {

      console.debug("setParcelPageOffset() - change: " + offset);
      console.debug("setParcelPageOffset() - current val: " + this.offset);

      let newOffset = this.offset + offset;
      if (newOffset >= 0) {
        console.debug("new offset: " + newOffset);

        if (newOffset <= this.total_parcel_count) {
          console.debug("setting offset");
          this.offset += offset;
        } else {
          console.debug("total_parcel_count reached!")
          console.debug("total: " + this.total_parcel_count);
          console.debug("offset: " + this.offset);
        }
      } else {
        console.debug("Min_offset reached!")
        this.offset = 0;
        console.debug(this.offset);
      }
    },
    initDatePickers() {

      if (this.startdateCalendar) {
        this.startdateCalendar.destroy();
      }
      this.startdateCalendar = new bulmaCalendar(document.getElementById('inpstartdate_' + this.gcWidgetId), {
        startDate: new Date(), // Date selected by default
        dateFormat: 'yyyy-mm-dd', // the date format `field` value
        lang: this.currentLanguage, // internationalization
        overlay: false,
        closeOnOverlayClick: true,
        closeOnSelect: true,
        // callback functions
        onSelect: function (e) {
          // hack +1 day
          var a = new Date(e.valueOf() + 1000 * 3600 * 24);
          this.planting = a.toISOString().split("T")[0]; //ISO String splits at T between date and time
        }.bind(this),
      });
      if (this.enddateCalendar) {
        this.enddateCalendar.destroy();
      }
      this.enddateCalendar = new bulmaCalendar(document.getElementById('inpenddate_' + this.gcWidgetId), {
        startDate: new Date(), // Date selected by default
        dateFormat: 'yyyy-mm-dd', // the date format `field` value
        lang: this.currentLanguage, // internationalization
        overlay: false,
        closeOnOverlayClick: true,
        closeOnSelect: true,
        // callback functions
        onSelect: function (e) {
          // hack +1 day
          var a = new Date(e.valueOf() + 1000 * 3600 * 24);
          this.harvest = a.toISOString().split("T")[0]; //ISO String splits at T between date and time
        }.bind(this),
      });
    },
    /* helper functions */
    formatDecimal: function (decimal, numberOfDecimals) {
      /* Helper function for formatting numbers to given number of decimals */

      var factor = 100;

      if (isNaN(parseFloat(decimal))) {
        return NaN;
      }
      if (numberOfDecimals == 1) {
        factor = 10;
      }
      if (numberOfDecimals == 2) {
        factor = 100;
      }
      if (numberOfDecimals == 3) {
        factor = 1000;
      }
      if (numberOfDecimals == 4) {
        factor = 10000;
      }
      if (numberOfDecimals == 5) {
        factor = 100000;
      }
      return Math.ceil(decimal * factor) / factor;
    },
    changeLanguage() {
      this.$i18n.locale = this.currentLanguage;
    }
  }
});