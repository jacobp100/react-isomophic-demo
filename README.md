# React Isomorphic Demo

See blog posts for details on implementations.

Open an issue if you need something clarifying.

# Running

This comprises of a client, server, and a quick API for demonstrational purposes.

You'll need to have the API running for this project, which can be done with `node api`.

To build the client and the server, it's `gulp`. Gulp will put the client files in `/dist`, and the
server files in `/build` (since dist is a public folder and we don't want to expose the server).

When the server is built, in can be run with `node build/server`.

Try running this project with and without JavaScript---in Safari, this can be toggled in the
*Developer* menu
