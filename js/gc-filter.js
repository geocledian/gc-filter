/*
 Vue.js Geocledian filter component
 created:     2020-01-23, jsommer
 last update: 2020-05-15, jsommer
 version: 0.6.3
*/
"use strict";

//language strings
const gcFilterLocales = {
  "en": {
    "options": { "title": "Filter" },
    "fields": { 
      "crop": "Crop",
      "entity": "Entity",
      "name": "Name",
      "promotion": "Promotion"
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
    "options": { "title": "Filter" },
    "fields": { 
      "crop": "Fruchtart",
      "entity": "Entität",
      "name": "Name",
      "promotion": "Demo"
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
      default: 'crop,name,entity,promotion'
    },
    gcAvailableOptions: {
      type: String,
      default: 'widgetTitle'
    },
    gcWidgetCollapsed: {
      type: String,
      default: 'true' // or false
    },
    gcLanguage: {
      type: String,
      default: 'en' // 'en' | 'de' | 'lt'
    }
  },
  template: `<div :id="this.gcWidgetId" class="is-inline">

                <p class="gc-options-title is-size-6 is-inline-block is-orange" 
                  style="cursor: pointer; margin-bottom: 1em;"    
                  v-on:click="toggleFilter" 
                  v-show="availableOptions.includes('widgetTitle')">
                    <!--i class="fas fa-filter fa-sm"></i --> {{ $t('options.title')}}
                    <i :class="[JSON.parse(gcWidgetCollapsed) ? '': 'is-active', 'fas', 'fa-angle-down', 'fa-sm']"></i>
                </p>

                <!-- filter container -->
                <div :class="[JSON.parse(gcWidgetCollapsed) ? '': 'is-hidden']" style="width: 100%;">
                  <div :id="this.gcWidgetId + 'div'" :class="layoutCSSMap['alignment'][gcLayout]">
                    <div class="field is-horizontal gc-filter-field" v-show="availableFields.includes('crop')">
                      <div class="field-label is-small has-text-left"><label class="label is-grey">{{$t('fields.crop')}}</label></div>
                      <div class="field-body">
                        <input type="text" class="input is-small" :placeholder="$t('fields.crop')" v-model="crop">
                      </div>
                    </div>
                    <div class="field is-horizontal gc-filter-field" v-show="availableFields.includes('entity')">
                      <div class="field-label is-small has-text-left"><label class="label is-grey">{{$t('fields.entity')}}</label></div>
                      <div class="field-body">
                        <input type="text" class="input is-small" :placeholder="$t('fields.entity')" v-model="entity">
                      </div>
                    </div>
                    <div class="field is-horizontal gc-filter-field" v-show="availableFields.includes('name')">
                      <div class="field-label is-small has-text-left"><label class="label is-grey">{{$t('fields.name')}}</label></div>
                      <div class="field-body">
                        <input type="text" class="input is-small" :placeholder="$t('fields.name')" v-model="name">
                      </div>
                    </div>
                    <div class="field is-horizontal gc-filter-field" v-show="availableFields.includes('promotion')">
                      <div class="field-label is-small has-text-left"><label class="label is-grey">{{$t('fields.promotion')}}</label></div>
                      <div class="field-body">
                        <input type="checkbox" class="content" v-model="promotion">
                      </div>
                    </div>
                    <div class="gc-filter-field">
                        <button :id="this.gcWidgetId + '_btnApplyFilter'" class="button is-small is-light is-orange" v-on:click="applyFilter">
                            <i class="fas fa-filter fa-sm"></i><span class="content">{{$t('buttons.applyFilter.title')}}</span>
                        </button>
                        <button :id="this.gcWidgetId + '_btnRemoveFilter'" class="button is-small is-light is-orange" v-on:click="removeFilter">
                            <i class="fas fa-times-circle fa-sm"></i><span class="content">{{$t('buttons.removeFilter.title')}}</span>
                        </button>
                    </div>
                  </div>  
                </div> <!-- filter container -->              

                <!-- pagination -->
                <!-- div class="field is-centered" style="padding-top: 10px;">
                  <nav class="pagination is-small is-centered" role="navigation" aria-label="pagination">
                    <button class="button pagination-previous is-light is-orange" v-on:click="setParcelPageStart();" title="Start">
                      <i class="fas fa-fast-backward"></i>
                    </button>
                    <button id="btnPagePrev" class="button pagination-previous is-light is-orange" v-on:click="setParcelPageOffset(-pagingStep);" title="Previous 250">
                      <i class="fas fa-step-backward"></i>
                    </button>
                    <button id="btnPageNext" class="button pagination-next is-light is-orange" v-on:click="setParcelPageOffset(pagingStep);" title="Next 250">
                      <i class="fas fa-step-forward"></i>
                    </button>
                    <button class="button pagination-next is-light is-orange" v-on:click="setParcelPageEnd();" title="End">
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
        pagingStep: 250,
        promotion: undefined,
        crop: "",
        entity: "",
        name: "",
        currentParcel: undefined,
        selectedParcelId: -1,
        layoutCSSMap: { "alignment": {"vertical": "is-inline-block", "horizontal": "is-flex" }}
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
    apiUrl: {
        get: function () {
            return "https://" + this.gcHost + "/agknow/api/v3";
        }
    },
    filterString: {
        get: function () {
          // TODO offset + limit + paging
            let filterStr = "&crop="+this.crop +
                            "&entity="+ this.entity+
                            "&name="+ this.name;
            if (this.promotion) {
                filterStr += "&promotion="+ JSON.parse(this.promotion);
            }
            return filterStr;
        }
    },
    parcelIds: {
      get: function () { 
        if (this.parcels.length > 0) {
          return this.parcels.map(p => p.parcel_id); 
        }
        else {
            return [];
        }
      },
    },
    limit: {
      get: function() {
        // will always reflect prop's value 
        return this.gcLimit;
      },
      set: function (newValue) {       
        //notify root - through props it will change this.gcLimit
        this.$root.$emit('limitChange', newValue);
      }
    },
    offset: {
      get: function() {
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
      get: function() {
        return (this.gcAvailableOptions.split(","));
      }
    },
    currentLanguage: {
      get: function() {
        // will always reflect prop's value 
        return this.gcLanguage;
      },
    }
  },
  watch: {
      parcelIds: function(newValue, oldValue) {
        //propagate local parcel ids to root instance
        //this.$root.selectedParcelIds = this.parcelIds;
      },
      parcels: function(newValue, oldValue) {
        console.debug("parcels changed!");
        //console.debug(oldValue);
        //console.debug(newValue);

        this.$root.$emit('parcelsChange', newValue);

        // set first parcel as current parcel
        this.currentParcel = this.parcels[0];
        
      },
      filterString: function(newValue, oldValue) {
        console.debug("filterString changed!");
        //console.debug(oldValue);
        //console.debug(newValue);
      },
      offset: function (newValue, oldValue) {

        console.debug("event - offsetChange");

        this.$root.$emit('offsetChange',this.offset);

        // trigger per change of filter to other listening components
        this.applyFilter();
      },
      selectedParcelId: function (newValue, oldValue) {
        this.$root.$emit('selectedParcelIdChange', newValue);
      },
      currentLanguage(newValue, oldValue) {
        this.changeLanguage();
      }
  },
  methods: {
    getParcelTotalCount: function (filterString) {

      let params;

      if (filterString) {
        params = "/parcels?key=" + this.apiKey +
          filterString +
          "&count=True";
      } else {
        params = "/parcels?key=" + this.apiKey +
          "&count=True";
      }
      let xmlHttp = new XMLHttpRequest();
      let async = true;

      //Show requests on the DEBUG console for developers
      console.debug("getParcelTotalCount()");
      console.debug("GET " + this.apiUrl + params);

      xmlHttp.onreadystatechange = function () {
        if (xmlHttp.readyState == 4) {
          var tmp = JSON.parse(xmlHttp.responseText);

          if ("count" in tmp) {

            this.total_parcel_count = tmp.count;

            // minimum of 250
            if (this.total_parcel_count < this.pagingStep) {
              this.pagingStep = this.total_parcel_count;
            } /*else {
              this.pagingStep = 250;
            }*/

            if (this.total_parcel_count == 0) {
              return;

            } else {
              // now get all parcels
              this.getAllParcels(this.offset, filterString);
            }
          }
        }
      }.bind(this);
      xmlHttp.open("GET", this.apiUrl + params, async);
      xmlHttp.send();
    },
    getAllParcels: function (offset, filterString) {

        //download in chunks of n parcels
        let limit = this.pagingStep;

        let params = "/parcels?key=" + this.apiKey + "&limit=" + limit; //set limit to maximum (default 1000)

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
        console.debug("GET " + this.apiUrl + params);

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
        xmlHttp.open("GET", this.apiUrl + params, async);
        xmlHttp.send();
    },
    toggleFilter: function () {
      this.gcWidgetCollapsed = !JSON.parse(this.gcWidgetCollapsed) + "";
    },
    applyFilter: function () {

        console.debug("applyFilter()");
        document.getElementById(this.gcWidgetId + "_btnApplyFilter").classList.add("is-active");
       
        this.getParcelTotalCount(this.filterString);

        // update the paging & data
        this.$root.$emit('filterStringChange', this.filterString);

    },
    removeFilter: function () {

        this.crop = "";
        this.entity = "";
        this.name = "";
        this.promotion = undefined;

        this.pagingStep = 250;

        this.applyFilter();

        document.getElementById(this.gcWidgetId + "_btnApplyFilter").classList.remove("is-active");
    },
    setParcelPageOffset: function(offset) {

      console.debug("setParcelPageOffset() - change: "+ offset);
      console.debug("setParcelPageOffset() - current val: "+this.offset);

      let newOffset = this.offset + offset;
      if (newOffset >= 0) {
          console.debug("new offset: "+ newOffset);
          
          if (newOffset <= this.total_parcel_count) {
              console.debug("setting offset");
              this.offset += offset;
          }
          else {
              console.debug("total_parcel_count reached!")
              console.debug("total: "+this.total_parcel_count);
              console.debug("offset: "+this.offset);
          }
      }
      else {
          console.debug("Min_offset reached!")
          this.offset = 0;
          console.debug(this.offset);
      }
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
