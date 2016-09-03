# React Isomorphic Demo

See blog posts for details on implementations.

* [Post 1](https://medium.com/@jacobp/progressive-enhancement-techniques-for-react-part-1-7a551966e4bf#.4wjw0grw2)
* [Post 2](https://medium.com/@jacobp/progressive-enhancement-techniques-for-react-part-2-5cb21bf308e5#.ugemu980s)
* [Post 3](https://medium.com/@jacobp/progressive-enhancement-techniques-for-react-part-3-117e8d191b33#.nhrqqjxyu)

Open an issue if you need something clarifying.

## Changes from Blog Post

### Form Handling

In post 1, we put a separate form handlers for action creators inside the reducers. The concept of splitting the main action creator from the form validation remains the same. However, [the form handling has now been moved to formDispatcher](https://github.com/jacobp100/react-isomophic-demo/commit/09009b73070aaf3f0adfb32f63600f24cfdf8114); and there is a new reducer for forms, which contains schema errors, submission errors, and whether a form is being submitted.

This centralised the form handling, and made it so that every form would always get relevant errors and submission state without any extra work. I highly recommend you follow this new way if using the form techniques discussed.

## Running

This comprises of a client, server, and a quick API for demonstrational purposes.

To build the client, server, and api, run `gulp`. Gulp will put the client files in `/dist`, and the server and api files in `/build` (since dist is a public folder and we don't want to expose the server or api).

When the server and api are built, they can be run with `node build/server` and `node build/api`, respectively.

When the server is running, you can head to `localhost:8080` in your browser. Try running this project with and without JavaScript---in Safari, this can be toggled in the
*Developer* menu!
