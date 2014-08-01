import logging as log
import os

from google.appengine.ext import webapp
import jinja2
from google.appengine.api import urlfetch


JINJA_ENVIRONMENT = jinja2.Environment(
	loader=jinja2.FileSystemLoader(os.path.join(os.path.dirname(__file__), "..", "templates")),
	extensions=['jinja2.ext.autoescape'],
	autoescape=True)


class IndexHandler(webapp.RequestHandler):
	def get(self):
		template = JINJA_ENVIRONMENT.get_template('index.html')
		self.response.write(template.render())
