cam.js
=====

cam.js is a web based client for Foscam IP cameras (and possibly others). It renders a grid of 3 cameras per row and allows you to click on any one camera to make it go full screen.

Dependencies
=====
 - Bootstrap >= 2.2
 - jQuery >= 1.7
 - font-awesome >= 3.0

Running
=====

 - git clone git://github.com/thatjuan/camjs.git /your/web/folder/cameras
 - cd /your/web/folder/cameras && cp sample.html index.html

Edit index.html to add your cameras:

  		new $.camJS($('section[name="camera_view"]'),{
				cameras: [{
		                'url': "http://192.168.0.10",
		                'stream_route': "/videostream.cgi;",
		                'control_route': "/decoder_control.cgi",
		                'name': 'Yard'
		            },{
		                'url': "http://192.168.0.11",
		                'stream_route': "/videostream.cgi;",
		                'control_route': "/decoder_control.cgi",
		                'name': 'Garage'
		        }]
			});

Then load the page on your browser.

Known issues
=====

Since you're accessing each camera directly, and they likely require authentication, your browser will start prompting for passwords.
If you have many cameras, that will become annoying really quick, so I've found a work around:

Running IP Cameras behind an nginx proxy (bonus: https)
=====

Foscam IP cameras (and others) generally don't support https which means accessing your camera from a public network could expose your password to third parties easily.
To get around that, I've set up an nginx proxy in my home network which listens to the outside world on https and forwards the request internally to the cameras over http. In this scenario, my communication with the camera is secure, keeping my password (and video feed) private from third parties.

This set up, however, does require some sort of home web server that can run nginx. Maybe a <a href="http://www.raspberrypi.org/">Raspberry Pi</a>?

Instructions on installing nginx don't belong here, but here is the server configuration I am using for the camera proxy:

		server {

			listen 443;
			server_name cameras.example.com;


			root /web/cameras;


		 	ssl on;
		    ssl_certificate /web/cameras/cameras.crt;
		    ssl_certificate_key /web/cameras/cameras.key;


			proxy_set_header X-Real-IP $remote_addr;
			proxy_set_header X-Forwarded-For $remote_addr;
			proxy_set_header Host $http_host;


			# local ips require no password
			auth_basic "Private Network";
			auth_basic_user_file /web/cameras/.htpasswd;
			satisfy any;
			allow  192.168.0.0/16;
			deny   all;


			location /cam1/ {
				proxy_pass http://192.168.0.11/;
				proxy_set_header Authorization "Basic ABC123=";
			}	

			location /cam1/stream {
				proxy_pass http://192.168.0.11/videostream.cgi;
				proxy_set_header Authorization "Basic ABC123=";
			}	

			location /cam2/ {
				proxy_pass http://192.168.0.12/;
				proxy_set_header Authorization "Basic ABC123=";
			}	

			location /cam2/stream {
				proxy_pass http://192.168.0.12/videostream.cgi;
				proxy_set_header Authorization "Basic ABC123=";
			}	

			location /cam3/ {
				proxy_pass http://192.168.0.13/;
				proxy_set_header Authorization "Basic ABC123=";
			}	

			location /cam3/stream {
				proxy_pass http://192.168.0.13/videostream.cgi;
				proxy_set_header Authorization "Basic ABC123=";
			}

		}


Note that each camera route adds the authorization header for the specific camera, which is basically "username:password" base64-encoded.

To summarize, your camera's password is only flowing unencrypted between nginx (in your private network) to the camera. The password that gets sent to nginx when you're accessing it from the outside world will give you access to all of the cameras automatically and will be protected if you set it up with https.

After you set up your nginx proxy, the cameras array changes slightly:

    	new $.camJS($('section[name="camera_view"]'),{
				cameras: [{
		                'url': "https://cameras.example.com/cam1",
		                'stream_route': "/stream",
		                'control_route': "/decoder_control.cgi",
		                'name': 'Yard'
		            },{
		                'url': "https://cameras.example.com/cam2",
		                'stream_route': "/stream",
		                'control_route': "/decoder_control.cgi",
		                'name': 'Garage'
		        }]
			});
