# Balls

A build radiator that radiates balls worth looking at.

### Setup without server side config

	1. lein ring server
	2. launch browser at port 3000
	3. Setup config right there.

	You just need one server running.
	Different teams can have their Balls pointing to their own CI server.

### Setup with server side config

	1. Copy config.json.sample to config.json under resources/config.
	2. Set url, include/exclude regex.
	2. lein ring server
	3. launch browser at port 3000.

	Note: You can still do custom include/exclude from browser.
	Just cannot override ci url.

### Balls Colors

1. Green is good.
2. Yellow is building.
3. Red is broken.
4. Orange is building what was broken.

### UI Controls

1. Toggle sound when build breaks.
2. Toggle text rotation.
3. Attraction/Repulsion for all green balls.

### Supported CI Servers

1. GO

### Known issues

1. If webgl is not supported by browser/machine, it will not work. Well, Balls!!!

### License

Distributed under the Eclipse Public License.

### One more thing

I don't know anything about licenses.
You clone it, you own it, they become your Balls.
I am not responsible.

![Green balls](docs/all-green-balls.png)
![Building balls](docs/balls-building.png)
