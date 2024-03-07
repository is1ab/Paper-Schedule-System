FROM ubuntu:22.04

RUN rm /bin/sh && ln -s /bin/bash /bin/sh
RUN sed 's@archive.ubuntu.com@free.nchc.org.tw@' -i /etc/apt/sources.list
RUN apt-get update && apt-get install -y ssh python3 python3-pip git

RUN mkdir /opt/pss
COPY . /opt/pss

WORKDIR /etc/opt
RUN pip install -r requirements.txt

WORKDIR /etc/opt/