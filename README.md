# hobbnb

WCS Project

## Deploy

```bash
git clone git@github.com:WildCodeSchool/laloupe_hobbnb.git
cd laloupe_hobbnb
cp config/database.js.sample config/database.js
cp config/secretToken.js.sample config/secretToken.js
cp config/mail.js.sample config/mail.js
npm i --production
node server.js
```

## Dev install

```bash
sudo npm i -g nodemon
git clone git@github.com:WildCodeSchool/laloupe_hobbnb.git
cd laloupe_hobbnb
cp config/database.js.sample config/database.js
cp config/secretToken.js.sample config/secretToken.js
cp config/mail.js config/mails.js.sample
npm i
nodemon server.js
# then, on another terminal
grunt server
```
