FROM python:3.5.2-slim

WORKDIR /src

COPY ./src/ /src/

RUN pip install --upgrade --trusted-host pypi.python.org -r requirements.txt \
    && apt-get update \
    && apt-get install make

ENV PYTHONPATH /