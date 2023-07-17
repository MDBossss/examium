<br/>
<p align="center">
  <a href="https://github.com/MDBossss/examium">
    <img src="client/public/logo-small.png" alt="Logo" width="80" height="80">
  </a>

  <h3 align="center">Examium</h3>

  <p align="center">
    Collaborative quiz maker app built with React.js, Express.js, Prisma and MySQL.
    <br/>
    <br/>
    <a href="https://github.com/MDBossss/examium/issues">Report Bug</a>
    .
    <a href="https://github.com/MDBossss/examium/issues">Request Feature</a>
  </p>
</p>

![Contributors](https://img.shields.io/github/contributors/MDBossss/examium?color=dark-green) ![Issues](https://img.shields.io/github/issues/MDBossss/examium) ![License](https://img.shields.io/github/license/MDBossss/examium) 

---

![Screen Shot](client/public/showcase-create.png)
![Screen Shot](client/public/showcase-collaborate.png)
![Screen Shot](client/public/showcase-results.png)

This is a work in progress project I started as a way to introduce myself to Prisma and using it with a Express.js backend. Currently the essential features are implemented, CRUD of the tests with the db, collaborating with other users, user auth... 

Feel free to contribute to the project as this is just a beginning, and has plenty of room for improvements, and of course, if you like the project, leave a star :)

## Technologies

### Frontend
* React + Vite
* Tailwind
* TypeScript
* Clerk
* Supabase

### Backend
* Node.js
* Express.js
* Prisma
* MySQL
* Supabase


## Setting up environmental variables

To run the project, you will need to set up environmental variables. Follow the instructions below:


### server
Create a `.env` file inside the server directory and define the following variables:
```
DATABASE_URL=your_mysql_database_url
PORT=3000
```

### client
Create a `.env` file inside the client directory and define the following variables:
```
VITE_SUPABASE_URL=your_supabase_url
VITE_SUPABASE_KEY=your_supabase_key
VITE_SUPABASE_BUCKET_LINK=your_supabase_bucket_link
VITE_CLERK_PUBLISHABLE_KEY=your_clerk_publishable_key
VITE_API_BASE_URL=http://localhost:3000/api
```

## Installation
To get started with HotelHub, follow these steps:
1. Clone the repository
2. Install the dependencies for both the server and the client by running `yarn install` in their respective directories.
3. Configure the environmental variables as described in the previous section.
4. Generate the Prisma Client by running `yarn generate` or `npx prisma generate` inside the `server` directory.
5. Run the migrations with `yarn migrate` or `npx prisma migrate dev` inside the `server` directory.
6. Start the server by running `yarn run dev` in the server directory.
7. Start the client by running `yarn run dev` in the client directory.

## Contributing

Contributions are what make the open source community such an amazing place to be learn, inspire, and create. Any contributions you make are **greatly appreciated**.
* If you have suggestions for adding or removing projects, feel free to [open an issue](https://github.com/MDBossss/examium/issues/new) to discuss it, or directly create a pull request after you edit the *README.md* file with necessary changes.
* Please make sure you check your spelling and grammar.
* Create individual PR for each suggestion.

### Creating A Pull Request

1. Fork the Project
2. Create your Feature Branch (`git checkout -b feature/AmazingFeature`)
3. Commit your Changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the Branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## License

Distributed under the MIT License. See [LICENSE](https://github.com/MDBossss/examium/blob/main/LICENSE.md) for more information.

