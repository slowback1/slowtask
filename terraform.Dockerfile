FROM zenika/terraform-aws-cli
ADD ./lambdas/infrastructure .

RUN sync-terraform.sh