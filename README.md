# Balls

A CI build radiator that radiates Balls worth looking at.

### Setup without server side config

	1. lein ring server
	2. launch browser at <hostname>:3000
	3. Setup config right there.

	Different teams can have their Balls pointing to their own CI server via browser config.

### Setup with server side config

	1. Copy config.json.sample to config.json under resources/config.
	2. Set url, include/exclude regex.
	2. lein ring server
	3. launch browser at <hostname>:3000

	Note: You can still do custom include/exclude from browser.
	All teams using will have their Balls pointing to the same CI server.

### Sounds

Its understandable that you want your own sounds for your Balls.

	1. Copy your audio file(s) in resources/sounds folder. No need to restart Balls server.
	2. Reload page.
	3. Select audio in UI controls.

### Ball Colors

1. Green Ball is a healthy Ball.
2. Yellow Ball is trying to go back to being healthy.
3. Red Ball is a broken Ball.
4. Orange Ball is trying to go back to being healthy after being broken.

### UI Controls

1. Sound selection for Balls breaking.
2. Sound selection for Balls becoming healthy after breaking.
2. Toggle text rotation.
3. Attraction/Repulsion for all the green Balls.

### Supported CI Servers

1. GO

### Known issues

1. If webgl is not supported by browser/machine, it will not work.
   Use [nevergreen](https://github.com/build-canaries/nevergreen).
   You just won't have any Balls.
2. Balls requires some place to be stored. Browser local storage must be available.
3. Balls prefers Chrome.

### License

Distributed under the Eclipse Public License.

### One more thing

I don't know anything about licenses.
You clone it, you own it, they become your Balls.
I am not responsible.

![Green balls](docs/all-green-balls.png)
![Building balls](docs/balls-building.png)
