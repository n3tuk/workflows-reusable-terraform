# n3tuk Reusable Workflows for Terraform

This repository contains reusable GitHub Action Workflows related to Terraform
testing of [Modules][modules] and [Terraform configurations][configuration]
repositories.

[modules]: https://github.com/n3tuk/template-terraform-module
[configuration]: https://github.com/n3tuk/template-terraform-configuration

## Workflows

The following workflows are currently defined:

### `terraform-checks`

The [`terraform-checks`][terraform-checks] Workflow provides a simple pre-baked
set of common validation and analysis to perform against Terraform code,
including:

[terraform-checks]: https://github.com/n3tuk/workflows-reusable-terraform/blob/master/.github/workflows/terraform-checks.yaml

- `terraform init` (without connecting to a backend);
- `terraform fmt` to check formatting;
- `terraform validate` to check the syntax;
- `tflint` to perform linting against the Terraform configuration and/or module;
- `terraform-docs` to check the `README.md` is up-to-date with the current
  configuration and/or module;
- `tfsec` to perform static and security analysis of the configuration and/or
  module;

#### Workflow Parameters for `terraform-checks`

| Variable            | Description                                                                                                                                                                                                                                                                                                                                | Required | Default            |
| ------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ | -------- | ------------------ |
| `workflow-branch`   | `workflow-branch` is used to choose the correct workflow repository branch, usually for testing when anything other than `main` is required                                                                                                                                                                                                | `false`  | `main`             |
| `name`              | Defines the name to be used as part of each GitHub Workflow Job to make it easier in to see which Jobs relates to which aspect of the Terraform code being processed (otherwise all jobs will be called the same thing as the parent calling jobs are not included in the name other than in the Pull Request itself) and must be provided | `true`   | (must be provided) |
| `type`              | Defines the "type" of Terraform code being tested - "configuration", "example", "module", or "submodule" - and must be provided                                                                                                                                                                                                            | `true`   | (must be provided) |
| `working-directory` | This is the location of the `configuration`, `example`, `module`, or `submodule`, being checked, and must be provided                                                                                                                                                                                                                      | `true`   | (must be provided) |

#### Workflow Secrets for `terraform-checks`

| Secret            | Description                                                                                                                                               |
| ----------------- | --------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `WORKFLOWS_TOKEN` | A custom GitHub PAT Token used to access this reusable workflow repository if `GITHUB_TOKEN` cannot access; falls back to `GITHUB_TOKEN` if not provided. |
| `GITHUB_TOKEN`    | The standard GitHub PAT Token needed to interact with the GitHub Repository being checked.                                                                |

### `terraform-tests`

The [`terraform-tests`][terraform-tests] Workflow provides a reusable Workflow
to execute TerraTest tests. Includes options for authenticating against
providers, such as AWS. The [JUnit][terratest-output] report files are also
provided to GitHub Actions to show the outputs of the TerraTest tests.

[terraform-tests]: https://github.com/n3tuk/workflows-reusable-terraform/blob/master/.github/workflows/terraform-tests.yaml
[terratest-output]: https://terratest.gruntwork.io/docs/testing-best-practices/debugging-interleaved-test-output/

#### Workflow Parameters for `terraform-tests`

| Variable           | Description                                                                                                                                                                                                 | Required | Default                                                          |
| ------------------ | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | -------- | ---------------------------------------------------------------- |
| `workflow-branch`  | `workflow-branch` is used to choose the correct workflow repository branch, usually for testing when anything other than `main` is required                                                                 | `false`  | `main`                                                           |
| `enable-aws`       | This will allow the [`configure-aws-credentials`][configure-aws-credentials] GitHub Action to run which will fetch and provide the AWS credentails needed to run TerraTest                                  | `false`  | `false`                                                          |
| `aws-iam-role-arn` | This is the ARN of the AWS IAM Role which should be used to provide access into the TerraTest Shared Sandbox, with the general Role set by default (override if you require a specific IAM Role for access) | `false`  | `arn:aws:iam::516425859983:role/gha/gha-infra-terratest-general` |

[configure-aws-credentials]: https://github.com/aws-actions/configure-aws-credentials

#### Workflow Secrets for `terraform-tests`

| Secret            | Description                                                                                                                                               |
| ----------------- | --------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `WORKFLOWS_TOKEN` | A custom GitHub PAT Token used to access this reusable workflow repository if `GITHUB_TOKEN` cannot access; falls back to `GITHUB_TOKEN` if not provided. |
| `GITHUB_TOKEN`    | The standard GitHub PAT Token needed to interact with the local GitHub Repository being tested.                                                           |
