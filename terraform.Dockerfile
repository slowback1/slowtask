FROM zenika/terraform-aws-cli
ADD lambdas/infrastructure .

ENV AWS_ACCESS_KEY_ID=some_value
ENV AWS_SECRET_ACCESS_KEY=some_other_value
ENV AWS_DEFAULT_REGION=some_other_other_value
RUN ls

RUN chmod +x ./sync-terraform.sh

RUN ./sync-terraform.sh