if [[ ! -v AWS_KEY ]]; then
  echo "AWS_KEY is required"
  exit 1
fi

if [[ ! -v AWS_SECRET ]]; then
  echo "AWS_SECRET is required"
  exit 1
fi

if [[ ! -v AWS_BUCKET ]]; then
  echo "AWS_BUCKET is required"
  exit 1
fi

aws s3 sync ./build $AWS_BUCKET --delete
