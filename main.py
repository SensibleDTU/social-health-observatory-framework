from google.appengine.ext import webapp
from google.appengine.ext.webapp.util import run_wsgi_app
from views.views import IndexHandler, TestPageHandler, SensibleDtuProxyHandler

application = webapp.WSGIApplication([('/', IndexHandler)], debug=True)

def main():
    run_wsgi_app(application)

if __name__ == "__main__":
    main()
