FROM node:16.17.0 as frontend-builder

WORKDIR /app

RUN apt update && apt install -y git
RUN mkdir /root/.ssh/

COPY id_rsa /root/.ssh/id_rsa
RUN chmod 600 /root/.ssh/id_rsa

RUN touch /root/.ssh/known_hosts

RUN ssh-keyscan github.com >> /root/.ssh/known_hosts

RUN git clone git@github.com:MikeyDN/ecommerce-project.git /app

WORKDIR /app/frontend

RUN ["npm", "install"]
RUN ["npm", "run", "build"]

WORKDIR /app

FROM python:3.11-buster

#Copy NVM (Node version manager)

#Install NodeJS
ENV NODE_VERSION 16.17.0
RUN curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.38.0/install.sh | bash \
    && . ~/.nvm/nvm.sh \
    && nvm install $NODE_VERSION \
    && nvm use $NODE_VERSION \
    && nvm alias default $NODE_VERSION
ENV PATH /root/.nvm/versions/node/v$NODE_VERSION/bin:$PATH

RUN apt update && apt install -y supervisor
RUN pip install django==4.1.5 djangorestframework==3.12.0 django-cors-headers==3.10.0 django-extensions==3.1.3 drf_yasg==1.21.4 Pillow==9.3.0 -U

COPY supervisord.conf /etc/supervisor/conf.d/supervisord.conf
COPY --from=frontend-builder /app /app
COPY ./backend/db.sqlite3 /app/backend/db.sqlite3
COPY ./frontend/.env.local /app/frontend/.env.local

RUN ["python", "/app/backend/manage.py", "makemigrations"]
RUN ["python", "/app/backend/manage.py", "migrate"]

CMD ["supervisord", "-c", "/etc/supervisor/conf.d/supervisord.conf"]
EXPOSE 80 8000