FROM node:16.17.0 as frontend-builder

WORKDIR /app

RUN apt update && apt install -y git
RUN mkdir /root/.ssh/

ADD id_rsa /root/.ssh/id_rsa
RUN chmod 600 /root/.ssh/id_rsa

RUN touch /root/.ssh/known_hosts

RUN ssh-keyscan github.com >> /root/.ssh/known_hosts

RUN git clone git@github.com:MikeyDN/first-ecommerce.git /app

WORKDIR /app/frontend

RUN ["npm", "install"]
RUN ["npm", "run", "build"]

WORKDIR /app

RUN apt-get install python3=3.9.2
RUN pip install django=4.1.5
RUN pip install djangorestframework=3.13.2
RUN pip install django-cors-headers=3.10.0
RUN pip install django-extensions=3.1.3
RUN pip install drf_yasg=1.20.0

COPY supervisord.conf /etc/supervisor/conf.d/supervisord.conf

CMD ["supervisord", "-c", "/etc/supervisor/conf.d/supervisord.conf"]
EXPOSE 80