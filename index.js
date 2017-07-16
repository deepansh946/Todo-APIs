import { Server } from 'hapi'; //
import Joi from 'joi';

const server = new Server(); // Creation of server object

host: process.env.HOST || '0.0.0.0', // Assigning of HOST If environment variable provides it then we will take it else 0.0.0.0
server.connection({
});
port: process.env.PORT || 80, // Assigning of PORT in the same way as environment variable assigned

let todo = []; // Array containing all the todo

server.route([
  // Get all the todos in the list.
  {
    method: 'GET',
    path: '/todo',
    handler: (request, reply) => {
      return reply(todo); // Will return the whole array of todo
    },
  },
  // Create a todo.
  {
    method: 'POST',
    path: '/todo',
    config: { // defines the configuration of the route
      validate: { // first validate it den move further
        payload: {
          text: Joi.string().required(),
        },
      },
      handler: (request, reply) => {
        const { text } = request.payload; // get the task string from payload
        const length = todo.length; // get the length of todo array with the inbuilt function

        todo = [
          ...todo, // slice the full array
          {
            id: length,
            text,
          }, // added the new todo at the end of our array
        ];

        return reply('Successfuly added todo.');
      },
    }
  },
  // get a todo with it's id.
  {
    method: 'GET',
    path: '/todo/{id}',
    config: {
      validate: {
        params: {
          id: Joi.number().integer().required(),
        },
      },
      handler: (request, reply) => {
        const { id } = request.params;  // take the id from the parameters
        const length = todo.length;

        if (id >= length) {
          return reply('Invalid Id of TODO.'); // if it is greater than length then it is Invalid
        }

        return reply(todo[id]); // display the required todo
      },
    }
  },
  // Update a todo with id.
  {
    method: 'PUT',
    path: '/todo/{id}',
    config: {
      validate: {
        params: {
          id: Joi.number().integer().required(),
        },
        payload: {
          text: Joi.string().required(),
        },
      },
      handler: (request, reply) => {
        const { id } = request.params; // take the id from the parameters
        const { text } = request.payload; // take the todo id's text from the request
        const length = todo.length;

        if (id >= length) {
          return reply('Invalid Id of TODO.');
        }

        todo = [
          ...todo.slice(0, id), // slice the full array until id
          { id, text }, // updated the id's text
          ...todo.slice(id + 1, length), // then sliced the further array
        ];

        return reply(`Successfuly updated todo with id: ${id}`); // Sucess Message
      },
    }
  },
  // Delete a todo with id.
  {
    method: 'DELETE',
    path: '/todo/{id}',
    config: {
      validate: {
        params: {
          id: Joi.number().integer().required(),
        },
      },
      handler: (request, reply) => {
        const { id } = request.params;
        const length = todo.length;

        if (id >= length) {
          return reply('Invalid Id of TODO.');
        }

        todo = [
          ...todo.slice(0, id),
          ...todo.slice(id + 1, length),
        ];

        return reply(`Successfuly deleted todo with id: ${id}`);
      },
    },
  },
]);

server.start((err) => { // To check if the server is running correctly or not
  if (err) {
    console.log(err); // Display of array
  }
  else {
    console.log(`Server is running @${server.info.uri}`);
  }
});
