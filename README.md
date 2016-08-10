# React Isomorphic Demo

See blog posts for details on implementations.

* [Post 1](https://medium.com/@jacobp/progressive-enhancement-techniques-for-react-part-1-7a551966e4bf#.4wjw0grw2)
* [Post 2](https://medium.com/@jacobp/progressive-enhancement-techniques-for-react-part-2-5cb21bf308e5#.ugemu980s)

Open an issue if you need something clarifying.

## Running

This comprises of a client, server, and a quick API for demonstrational purposes.

You'll need to have the API running for this project, which can be done with `node api` (see note).

To build the client and the server, it's `gulp`. Gulp will put the client files in `/dist`, and the
server files in `/build` (since dist is a public folder and we don't want to expose the server).

When the server is built, in can be run with `node build/server`.

Try running this project with and without JavaScript---in Safari, this can be toggled in the
*Developer* menu

Note: For the moment, the api only runs natively in node >= 6. If you need to run in an older version, `npm install -g babel-cli` and then run `babel-node` api instead.
