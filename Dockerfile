FROM 723857269861.dkr.ecr.us-east-1.amazonaws.com/imagemagick:7.0.8-24

# ARGS
ARG PORT="3000"
ARG NODE_ENV="production"
ARG HK_DB_HOST="localhost"
ARG HK_DB_USERNAME="postgres"
ARG HK_DB_PASSWORD=""
ARG KH_DB_NAME=""
ARG HK_DB_SSL="true"
ARG REDIS_URL="redis://localhost:6379"
ARG JWT_SECRET=""
ARG AWS_S3_BUCKET_NAME="production"
ARG AWS_ACCESS_KEY_ID=""
ARG AWS_SECRET_ACCESS_KEY=""

# ENV
ENV NODE_ENV ${NODE_ENV}
ENV PORT ${PORT}
ENV HK_DB_HOST ${HK_DB_HOST}
ENV HK_DB_NAME ${KH_DB_NAME}
ENV HK_DB_USERNAME ${HK_DB_USERNAME}
ENV HK_DB_PASSWORD ${HK_DB_PASSWORD}
ENV REDIS_URL ${REDIS_URL}
ENV JWT_SECRET ${JWT_SECRET}
ENV AWS_S3_BUCKET_NAME ${AWS_S3_BUCKET_NAME}
ENV AWS_ACCESS_KEY_ID ${AWS_ACCESS_KEY_ID}
ENV AWS_SECRET_ACCESS_KEY ${AWS_SECRET_ACCESS_KEY}
ENV DEBIAN_FRONTEND=noninteractive

WORKDIR /app

COPY package*.json ./
COPY app/ app/
COPY constants/ constants/

RUN curl -sL https://deb.nodesource.com/setup_10.x | bash -
RUN apt-get update && apt-get install -y nodejs
RUN npm install -g n
RUN n 10
RUN npm update

RUN apt-get update && apt-get install -y python-six

RUN identify -version
RUN npm install
RUN npm install -g sequelize-cli@5.1
RUN npm install -g @babel/core @babel/cli
RUN npm run build

COPY . .

EXPOSE 80

CMD ["npm", "start"]
