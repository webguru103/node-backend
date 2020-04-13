#/bin/sh

eval $(aws ecr get-login --no-include-email --region us-east-1 | sed 's|https://||')
docker build -f Dockerfile.IM7.base -t 723857269861.dkr.ecr.us-east-1.amazonaws.com/imagemagick:7.0.8-24 .
docker push 723857269861.dkr.ecr.us-east-1.amazonaws.com/imagemagick:7.0.8-24
