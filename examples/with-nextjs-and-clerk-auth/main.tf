terraform {
  required_providers {
    aws = {
      source  = "hashicorp/aws"
      version = "~> 4.16"
    }
  }

  required_version = ">= 1.2.0"
}

provider "aws" {
  #  access_key = "<access_key>" # use `AWS_ACCESS_KEY_ID` env var
  #  secret_key = "<secret_key>" # use `AWS_SECRET_ACCESS_KEY` env var
  region = var.aws_region
}

variable "aws_region" {
  description = "AWS region on which we will setup the swarm cluster"
  # Use `TF_VAR_aws_region` env var to override
}

variable "aws_route53_zone_app_domain" {
  description = "AWS Route53 domain name, eg: my-app.example.com"
  # Use `TF_VAR_aws_route53_zone_app_domain` env var to override
  default = ""
}

variable "aws_route53_zone_app_domain_cname_record" {
  description = "AWS Route53 `CNAME` record for the my-app.example.com; Example: 353aa.2.workspaces.codesphere.com ⚠️ Use either `CNAME` or `A` record"
  # Use `TF_VAR_aws_route53_zone_app_domain_cname_record` env var to override
  default = ""
}

variable "aws_route53_zone_app_domain_a_record" {
  description = "AWS Route53 `A` record for the my-app.example.com; Example: 11.22.33.44 ⚠️ Use either `CNAME` or `A` record"
  # Use `TF_VAR_aws_route53_zone_app_domain_a_record` env var to override
  default = ""
}

variable "aws_route53_zone_name" {
  description = "AWS Route53 zone name"
  # Use `TF_VAR_aws_route53_zone_name` env var to override
}

variable "clerk_domainkey_name" {
  description = "CNAME for dkim1.*, dkim2.* and mail.*; Example: iojsx82sa2z9.clerk.services"
  # Use `TF_VAR_clerk_domainkey_name` env var to override
}

data "aws_route53_zone" "selected" {
  name         = var.aws_route53_zone_name
  private_zone = false
}

resource "aws_route53_record" "aws_route53_app_domain_cname_record" {
  count   = var.aws_route53_zone_app_domain_cname_record != "" ? 1 : 0
  name    = var.aws_route53_zone_app_domain
  zone_id = data.aws_route53_zone.selected.zone_id
  type    = "CNAME"
  ttl     = "300"
  records = [var.aws_route53_zone_app_domain_cname_record]
}

resource "aws_route53_record" "aws_route53_app_domain_a_record" {
  count   = var.aws_route53_zone_app_domain_a_record != "" ? 1 : 0
  name    = var.aws_route53_zone_app_domain
  zone_id = data.aws_route53_zone.selected.zone_id
  type    = "CNAME"
  ttl     = "300"
  records = [var.aws_route53_zone_app_domain_a_record]
}

resource "aws_route53_record" "clerk_frontend_api" {
  name    = "clerk.${data.aws_route53_zone.selected.name}"
  zone_id = data.aws_route53_zone.selected.zone_id
  type    = "CNAME"
  ttl     = "300"
  records = ["frontend-api.clerk.services"]
}

resource "aws_route53_record" "clerk_accounts" {
  name    = "accounts.${data.aws_route53_zone.selected.name}"
  zone_id = data.aws_route53_zone.selected.zone_id
  type    = "CNAME"
  ttl     = "300"
  records = ["accounts.clerk.services"]
}

resource "aws_route53_record" "clerk_domain_clk" {
  name    = "clk._domainkey.${data.aws_route53_zone.selected.name}"
  zone_id = data.aws_route53_zone.selected.zone_id
  type    = "CNAME"
  ttl     = "300"
  records = ["dkim1.${var.clerk_domainkey_name}"]
}

resource "aws_route53_record" "clerk_domain_clk2" {
  name    = "clk2._domainkey.${data.aws_route53_zone.selected.name}"
  zone_id = data.aws_route53_zone.selected.zone_id
  type    = "CNAME"
  ttl     = "300"
  records = ["dkim2.${var.clerk_domainkey_name}"]
}

resource "aws_route53_record" "clerk_domain_clkmail" {
  name    = "clkmail.${data.aws_route53_zone.selected.name}"
  zone_id = data.aws_route53_zone.selected.zone_id
  type    = "CNAME"
  ttl     = "300"
  records = ["mail.${var.clerk_domainkey_name}"]
}
