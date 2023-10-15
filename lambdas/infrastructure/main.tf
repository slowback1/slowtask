terraform {
  required_providers {
    aws = {
      source  = "hashicorp/aws"
      version = "~>4.4.0"
    }
  }

  required_version = "~> 1.2"

  backend "s3" {
    key = "state"
  }
}

provider "aws" {
  region = var.aws_region
}