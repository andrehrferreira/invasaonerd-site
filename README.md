Invasão Nerd - API

## Host / Proxy

Para evitar problemas de CORS entre API e Aplicação será necessário criação de um
Host e configuração do Nginx.

```
$ sudo nano /etc/hosts
```

```
127.0.0.1       invasaonerd 
```

Instalação NGINX

```
sudo apt update
sudo apt install nginx
```

Agora a configuração do Nginx

```
$ sudo nano /etc/nginx/sites-enabled/default
```

```
server {
    listen 80 default_server;

    server_name invasaonerd;

    location /api {
        proxy_pass http://localhost:5555;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
    }

    location / {
        proxy_pass http://localhost:3000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
    }

    access_log /var/log/nginx/invasaonerd-access.log;
    error_log /var/log/nginx/invasaonerd-error.log;
}
```


## Dev Mode

Para iniciar a aplicação em modo dev utilize os seguintes comandos:

Faça um fork do repositório principal e faça clone dele

```bash
$ npm i -g @dekproject/cli
$ npm install ; cd public ; npm install; cd ..
```

Crie o arquivo .env
```bash
MONGO_HOST = 127.0.0.1
MONGO_PORT = 27017
MONGO_DB = skynet
REDIS_HOST = 127.0.0.1
REDIS_PORT = 6379
SESSION_SECRET = 
BASE_URL = http://invasaonerd/api
PROXY_URL = http://invasaonerd
AWS_ACCESS_KEY_ID=
AWS_SECRET_ACCESS_KEY=
BUCKET_NAME=

THUMBOR_ACCESS_KEY = 
THUMBOR_SERVER_HOST = 

```

Para executar em modo desenvolvimento primeiro inicie a API
```bash
$ npm run dev
```

Abra outra instância do terminal e inicie a aplicação
```bash
cd public
$ npm run dev
```

