# Tug of War
 
 Web game version of well-known sports. Rules are simple: you have to tug the rope with left or right arrow keys as fast as you can to bring your team to victory. Note that if you'll tug the rope in the wrong direction your team will lose automatically.
 ![Image alt](https://github.com/harukakiota/tug-of-war/master/image.jpg)

## Deployment

To run this game firstly install this things on your machine:
```
Node.js
npm
```
Then copy the files and run
```
npm install
```
in both 'core' and 'services' directories to install required packages. Then run
```
node servise.js
```
in 'services' directory. Then in separed terminal run
```
node gateway.js
```
in 'core' directory. Thus the game is set and you can go to localhost:5676 in your web browser and try the game.

## Stack of technologies

* Node.js - JavaScript runtime environment
* Express- Node.js framework
* Socket.IO - Realtime communication library
