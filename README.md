# Balls

A 3D build radiator worth looking at.

Build radiators needs to be fun. Anyone can develop plain old html/css grid based view.
That stuff is like flash, old and needs to be replaced.

Put this on your TV, and you will never go back to any other build radiator.

A word of caution: You may find this radiator hard to look away from.

### Screenshots - That do not do justice

![Green balls](docs/all-green-balls.png)
![Building balls](docs/balls-building.png)

### Setup without server side config

	1. lein ring server
	2. launch browser at <hostname>:3000
	3. Setup config right there.

	Since the config is UI based, different teams have full control over their configuration.

### Setup with server side config

	1. Copy config.json.sample to config.json under resources/config.
	2. Set url, include/exclude regex.
	2. lein ring server
	3. launch browser at <hostname>:3000

	You cannot override cctray url. You can still do custom include/exclude from browser.

### Sounds

Sounds are played on 2 different events.

	1. When the build breaks.
	2. When the build succeeds after it breaks.

To have your custom sounds available:

	1. Copy your audio file(s) in resources/sounds folder. No need to restart the server.
	2. Reload the page.
	3. Select audio in controls.

You always have the ability to switch on/off either or both sounds.

### Ball Colors

1. Green is healthy.
2. Yellow is building.
3. Red is broken.
4. Orange is building after being Red.

### Events
People sometimes prefer to have sounds switched off.
These events are meant to attract your attention to broken builds visually.

1. Glitch effect (if 3 or more broken builds).
2. Red alert (if 5 or more broken builds).

### UI Controls

1. Sound selection when build goes Red.
2. Sound selection when build goes from Orange to Green.
3. Toggle text rotation.
4. Attraction/Repulsion for all the green balls.
5. Toggle Pulsating Balls (to be implemented)
6. Thresholds for events (to be implemented).
7. Custom colors. (to be implemented).
8. Custom Shapes (Hmm... then I may have to rename repo.)

### Coming soon

In the order in which they came to my mind.

	1. Greater CI Server support (needs to be done, but not really interested atm).
	2. Flame thrower/Ember effect/smoke/snow/rain (maybe, depends on performance)
	3. Blame animations. (to be switched off by default)
	4. Remove local storage dependency. (may move down on priority)
	5. Webcam/Mic input. (I have a cunning plan)
	6. Interactive balls. (low on priority, its a radiator first)
	7. Statistics (Eg. who broke the most builds. If your team member, takes this personally, then .... switch if off.)
	8. Highlight inactive builds. (and not just by making them gray).
	9. Display FPS (this is easy, should have done it from the start).
	10. Special animations for when A Build breaks way too many times.(Can build on this for other scenarios.)
	11. Konami code. (Again, I have a cunning plan, and not just flipping the colors).

Rewrite the entire thing in clojurescript.

### Supported CI Servers

1. GO

### Known issues

1. If webgl is not supported by browser/machine, it will not work.
   Use [nevergreen](https://github.com/build-canaries/nevergreen).

2. Local storage is required to save your config and UI controls.

### License

Distributed under the Eclipse Public License.