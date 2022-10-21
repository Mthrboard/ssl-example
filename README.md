# Install

`npm install`

---

## Things to add

- Create a `.env` file in config folder and add the following as `key = value`
  - PORT = 2121 (can be any port example: 3000)
  - SSL_PORT = 443 (can be any port except PORT defined above, recommended 443)
  - DB_STRING = `your database URI`
  - CLOUD_NAME = `your cloudinary cloud name`
  - API_KEY = `your cloudinary api key`
  - API_SECRET = `your cloudinary api secret`

- Obtain a valid SSL certificate from the CA of your choice, add the .crt and
.key files to `config/ssl` as `domain.crt` and `domain.key` (or give them your
own name and update `server.js` lines 62/63 with the updated filenames)

---

## Notes

This template will automatically run both an HTTP and HTTPS servers on the ports
you specify in `config/.env` (or use the default ports 80 and 443 if you omit
the ports in the config). It has https-redirect enabled by default, which will
redirect all HTTP request to the HTTPS server. You can disable this by adding
`NODE_ENV=development` to the `config/.env` file.

---

## Run

`npm start`
