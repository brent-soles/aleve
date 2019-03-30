# aleve

## so as to aleveiate your development burden with static assets and/or make development painless :D

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

## Command

In order to start serving static assets, all you need to do is invoke the command and the filepath with which you want to serve files from, like so:

```javascript
commandprompt$> aleve -d ./path/to/file
```

The `.` syntax is also supported: 
```javascript
commandprompt$> aleve -d .
```

And if you're already in the directory you want, simply write:

```javascript
commandprompt$> aleve
```

## Options

The default options you can pass to the command are:

* -p or --port, default is port 5000
* -d or --directory, default is '.'


### Example

```javascript
commandprompt$> aleve -p 2500
// Will listen on directory . and port 2500

commandprompt$> aleve -d path/files
// Will listen on directory ./path/files and port 5000

commandprompt$> aleve -d path/files -p 2500
// Will listen on directory ./path/files and port 2500
```

# Contributing:

If you wish to contribute, please subit a PR with any type of improvement. Currently, some of the desired features are:

* Have a Non-dependence on Socket.io, or any other socket library (would be nice to have aleve dependency-free).
* Implement the streaming of files, rather than bulk reads.

# Issues

Please submit any issues you have to github repo issues: https://github.com/brent-soles/aleve