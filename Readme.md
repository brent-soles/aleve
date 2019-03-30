# aleve

## so as to aleveiate your development burden with static assets and/or makd development painless :D

# To download

Either:

```javascript
  npm i -g aleve
```

~or~

```javascript
  yarn global add aleve
```

# To use

In order to start serving static assets, all you need to do is invoke the command and the filepath with which you want to serve files from, like so:

```javascript
commandprompt$> aleve ./path/to/file
```

The `.` syntax is also supported: 
```javascript
aleve .
```

# Contributing:

If you wish to contribute, please subit a PR with any type of improvement. Currently, some of the desired features are:

* Have a Non-dependence on Socket.io, or any other socket library (would be nice to have aleve dependency-free).
* Implement the streaming of files, rather than bulk reads.
* Implement single file reloads, without having to refresh page.

# Issues

Please submit any issues you have to 