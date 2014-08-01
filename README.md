social-health-observatory-framework
===================================
Social Health Observatories are platforms that integrate and display region-specific information with the goal of aiding analysis and offering a new perspective of the society. Data that would be integrated into such systems should originate from diverse sources, in order to provide a general overview, and could give insights or measurements about the ``health'' of the society related to domains such as economy (e.g poverty index, business activity, average income), public interest (e.g. transportation, crime rates), wellness (e.g. physical activity, health evaluations), social life (e.g. interaction rates, social diversity, online interactions) and others. As examples, government officials, corporate planners, banks etc. could benefit from the visualizations to make better decisions about where to allocate resources or to give loans and individuals could be aided in choosing better locations for living or for spending their leisure time.

The Social Health Observatory Framework is a generic framework that can be used for a quick integration of various data sources and implemention of visualisations for geospatial data, with the  purpose of aiding decision making and data analysis. The framework was developed as a platform that can be easily extended, customized and in which domain-specific data and visualisation techniques can be integrated. The framework can be used as a base for building ``social health observatories'', which integrate local data and allow interested stakeholders to analyse and obtain new perspectives of medium-to-large geographical areas through domain-specific visualisations and would aid the decision-making process for interested parties.

Based on the core platform, a proof-of-concept implementation focused on some municipalities in and around Copenhagen was built in order showcase its functionality. Data was integrated from a multitude of sources and a set of visualisations were developed and present in the source files.

The platform was developed for GoogleAppEngine and usually writing code for Google AppEngine is not fully compatible with Django, due to the simplicity of our back-end implementation, the framework can be deployed on a Django web-server without significant changes.

The MIT License (MIT)
=====================
Permission is hereby granted, free of charge, to any person obtaining a copy of this software and associated documentation files (the "Software"), to deal in the Software without restriction,  including without limitation the rights to use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of the Software, and to permit persons to whom the Software is furnished to do so, subject to the following conditions: 

The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
