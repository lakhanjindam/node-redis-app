# Node Redis App
- Libraries used: Express, redis, express-handlebars, body-parser, method-override, nodemon.
- app.js is the entrypoint for the application.
- views contains the various pages like search, add and update user page.
- views/layout has main.handlebars which is the root page or a base page above which will all other pages will render on top of it.
- .handlebars is the default extension and it can be changed to any extension you want which is short and convenient.
- express-handlebars is the backend templating engine which runs on server-side.
- body-parser is used to parse the json objects.
- method-override to override a http request, like POST to DELETE.
Using the query in URL that is to be fired. First define the _method in app.js like below.
app.use(MethodOverride('_method'));
Eg. <form method="POST" action="/user/delete/{{user.id}}?_method=DELETE"> 

# Note: If performing the project on windows system
- You need to install redis-server from the below link:
    https://github.com/MicrosoftArchive/redis/releases
- You will be encountered with the following error if not installed:
error:Redis connection to 127.0.0.1:6379 failed – connect ECONNREFUSED
It is because redis still has not full support for windows system, ubuntu system need not required above steps.
- After then you will be redirected to the downloads page where you can download a .zip file, .msi installer file.
- After downloading the file extract the file in the folder according to your convenience and then run redis-server.exe to make server up and running.
- Then run redis-cli.exe and you will see redis running on port 6379, you can manually add key: value using redis-cli command line interface.
- Use redis scan command to the data in redis. Eg. scan 0 which is index number of data in redis.
- hgetall to get all users with that id or key, hmset/hset to add the user or update the user, del to delete the user if exists.