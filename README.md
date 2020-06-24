# gc-filter widget
## Description
gc-filter is an JavaScript/HTML widget for filtering the ag|knowledge REST API from [geocledian](https://www.geocledian.com).
It is built as a reusable [Vue.js](https://www.vuejs.org) component which allows the integration in [Vue.js](https://www.vuejs.org) applications smoothly. 
You may but you don't have to build the rest of the container application with [Vue.js](https://www.vuejs.org).

## Purpose
With this widget you have an UI for the filter capability of the REST API of ag|knowledge from geocledian.com.
> **Please note** that the widget contains a DEMO API Key. If you want to visualize your data it has to be registered first in the REST API of ag|knowledge from geocledian.com. <br> Contact us for getting an API Key and registering your data.

## Configuration
This widget is customizeable via HTML attributes and supports the setting of the following attributes.

### Basic options
- gc-apikey: API Key from geocledian, e.g. "39553fb7-7f6f-4945-9b84-a4c8745bdbec"; default: '39553fb7-7f6f-4945-9b84-a4c8745bdbec'
- gc-host: base host, e.g. "geocledian.com"; default: 'geocledian.com'
- gc-language: initial locale language for translation, e.g. "en" for english; default: "en"

### UI options
- gc-layout: layout of the content of the widget, e.g. "horizontal" or "vertical"; default: "vertical"
- gc-available-fields: limit the fields of the widget, e.g. "crop,name"; default: "crop,name,entity,promotion"
- gc-available-options: limit the available options, e.g. "" for not title at all; default: "widgetTitle"
- gc-widget-collapsed: start the widget with title only; content is hidden; default: "false"

### Advanced options
#### Proxy mode / URL options
- gc-proxy: string which defines an alternative URL for sending the requests made by the widget instead of gc-host, e.g. "someproxy.someserver.com/app"; default: undefined

> __Note__: in proxy mode both gc-host and gc-api-key attributes are ignored and will not be sent to the given gc-proxy URL! It is assumed, that the Proxy will add the key parameter to the URL and sends the modified URL to the agknowledge service.

- gc-api-base-url: string for changing the base API URL for the agknowledge service; default: "/agknow/api/v3"
- gc-api-secure: boolean for specifying if HTTPS or HTTP shall be used sending the requests made by the widget;  default: true

> __Note__: As there are defaults you will only have to set an attribute to change the default internal value.

## Integration
For the integration of the widget you'll have to follow these steps.

You have to add some dependencies in the head tag of the container website. 
>Please ensure, that you load Vue.js (v.2.6.x) before loading the component first!
Also note that <a href="www.bulma.org">bulma.css</a> and <a href="www.fontawesome.org">Font awesome</a> wll be loaded through gc-filter.css.

> __Embedded mode:__ This widget expects a root Vue instance which controls it. It is is designed not be embedded by another Vue application, so there is no init script which loads dependent libraries and the root Vue instance. __You'll have to load at least Vue create the root Vue instance which controls the child by yourself.__ 


```html
<html>
  <head>

    <!--GC component begin -->

    <!-- loads also dependent css files via @import -->
    <link href="css/gc-filter.css" rel="stylesheet">
    <!-- init script for components -->
    <script src="js/gc-filter.js"></script> 

    <!--GC component end -->
  </head>
```

Then you may create the widget(s) with custom HTML tags anywhere in the body section of the website. Make sure to use an unique identifier for each component.

```html
<div id="gc-app">

    <gc-filter 
      gc-widget-id="filter1"
      gc-apikey="SOME_API_KEY" 
      gc-layout="horizontal">
    </gc-filter>
</div>
```

## Support
Please contact [us](mailto:info@geocledian.com) from geocledian.com if you have troubles using the widget!

## Used Libraries
- [Vue.js](https://www.vuejs.org)
- [Vue I18n](https://kazupon.github.io/vue-i18n/)
- [axios.js](https://cdnjs.cloudflare.com/ajax/libs/axios/0.19.2/axios.min.js)

## Legal: Terms of use from third party data providers
- You have to add the copyright information of the used data. At the time of writing the following text has to be visible for [Landsat](https://www.usgs.gov/information-policies-and-instructions/crediting-usgs) and [Sentinel](https://scihub.copernicus.eu/twiki/pub/SciHubWebPortal/TermsConditions/TC_Sentinel_Data_31072014.pdf) data:

```html
 contains Copernicus data 2020.
 U.S. Geological Service Landsat 8 used in compiling this information.
```

**geocledian is not responsible for illegal use of third party services.**