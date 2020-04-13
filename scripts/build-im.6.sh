#/bin/sh

eval $(aws ecr get-login --no-include-email --region us-east-1 | sed 's|https://||')
docker build -f Dockerfile.IM6.base -t 723857269861.dkr.ecr.us-east-1.amazonaws.com/imagemagick:6.9.10-24 .
docker push 723857269861.dkr.ecr.us-east-1.amazonaws.com/imagemagick:6.9.10-24
