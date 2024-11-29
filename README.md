# Images API

API de ejemplo para subida y obtención de archivos utilizando Express y TypeScript.

Es recomendable usarlo en con varios contenedores de docker y un volumen nfs compartido :eyes:

Programa realizado para la materia de Sistemas Distribuidos.

## Creación de un volúmen NFS en Docker

```bash
docker volume create \
--driver local \
--opt type=nfs \
--opt o=addr=10.15.0.1,rw,nfsvers=4 \
--opt device=:/srv/nfs/docker \
nfs_share
```

>[!NOTE]
>Es importante ejecutar primero `npm build` y luego copiar los contenidos de `dist` y el directorio `node_modules` a la raíz del volumen compartido.

## Creación de la red

```bash
docker network create --subnet 10.15.0.0/24 --gateway 10.15.0.1 br01
```

## Uso en contenedor de docker

```bash
docker run -it --rm --ip 10.15.0.50 --network br01 -v nfs_share:/srv/nfs/docker -w /srv/nfs/docker --name container01 node:23-alpine index.js
```

