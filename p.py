#!/usr/bin/python
import urllib2
import base64
post_data =""" {
  "tokens":[
    "DEV-a1d258d1-277e-4e84-8512-0274ff5a711b"
  ],
  "notification":{
    "alert":"Hello World!",
    "android":{
      "collapseKey":"foo",
      "delayWhileIdle":true,
      "timeToLive":300,
      "payload":{
        "key1":"value",
        "key2":"value"
      }
    }
  }
}"""
app_id = "c56bf5ad"
private_key = "e323add6f3d57ace7837d585d1916bfc2c7d72f3adbc8572"
url = "https://push.ionic.io/api/v1/push"
req = urllib2.Request(url, data=post_data)
req.add_header("Content-Type", "application/json")
req.add_header("X-Ionic-Application-Id", app_id)
b64 = base64.encodestring('%s:' % private_key).replace('\n', '')
req.add_header("Authorization", "Basic %s" % b64)
resp = urllib2.urlopen(req)
print(resp)
