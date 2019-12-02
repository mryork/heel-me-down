## Heel Me Down (Backend)

### Running the Backend Locally
The Heel Me Down backend will automatically assume that the frontend is available at `../frontend/`. If it is not, the /api/ requests will still work. Since our website uses Google Accounts for authentication, you will need to set yourself up using Google Cloud to be able to login/register. In addition, you will need a `.env` file, defined below, to be able to connect to the database used for this backend. After this is done, simply run `npm run start` to start up the server on port 80 of your machine.

### `.env` Format
```
MONGODB_URL: [insert mongodb url with login here]
PRIVATEKEY: [define a private key for encryption]
```
