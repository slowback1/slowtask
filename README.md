# SlowTask

## Running the Project

* `npm install`
* `npm start`

## Set up a database to sync data

1. Create a supabase account and project (https://supabase.com)
2. Create a Table with the following columns:
    3. key (VARCHAR, PK)
    4. created_at (timestamptz, default now)
    5. task_data (json, not null)
6. Set up an API key / auth token with supabase, and store your API url to the database you created along with the keys
   in a safe place
7. in the `static` directory, create a file named `api_config.json` and fill out the json with the keys that you
   stored (see `api_config.example.json` for an example of the structure)