# Configuration Instruction:

**Before you start, make sure you have created an account and MongoDB cluster on the [Atlas MongoDB](https://www.mongodb.com/cloud/atlas/efficiency).**

Create a `.env` file

In the `.env` file, add in something like the following scheme:

```plaintext
MONGODB_URI=mongodb+srv://<username>:<password>@<cluster-address>/<database-name>?<options>
```

You could find your URI that is required above from MongoDB Atlas through the following steps:
  1. Visit the **Database Deployments** page in the Atlas dashboard.
  2. Click on the **Connect** button.
  3. Choose **Drivers** connection.
  4. Select **view full code sample**
  5. Your URI can be found in the code sample (line 2 in the code).

After setting up the `.env` file, run `npm install` to install all the dependencies and you are done with the configuration!