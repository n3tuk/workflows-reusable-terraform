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
- `snyk` to perform static and security analysis of the configuration and/or
  module;

#### Workflow Parameters for `terraform-checks`

| Variable            | Description                                                                                                                                                                                                           | Required | Default            |
| ------------------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | -------- | ------------------ |
| `workflow-branch`   | Use to choose the correct workflow repository branch                                                                                                                                                                  | `false`  | `master`           |
| `name`              | `name` defines the name of the GitHub Workflow Job to make it easier in the User Interface to see which Check relates to which aspect of the Module (as by default all 3+ checks are called the same thing otherwise) | `true`   | (must be provided) |
| `type`              | Defined the "type" of Terraform code being tested (should be one of `configuration`, `example`, `module`, or `submodule` only)                                                                                        | `true`   | (must be provided) |
| `working-directory` | This is the location of the `configuration`, `example`, `module`, or `submodule`, being checked                                                                                                                       | `true`   | (must be provided) |

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
| `workflow-branch`  | Use to choose the correct workflow repository branch                                                                                                                                                        | `false`  | `master`                                                         |
| `enable-aws`       | This will allow the [`configure-aws-credentials`][configure-aws-credentials] GitHub Action to run which will fetch and provide the AWS credentails needed to run TerraTest                                  | `false`  | `false`                                                          |
| `aws-iam-role-arn` | This is the ARN of the AWS IAM Role which should be used to provide access into the TerraTest Shared Sandbox, with the general Role set by default (override if you require a specific IAM Role for access) | `false`  | `arn:aws:iam::516425859983:role/gha/gha-infra-terratest-general` |

[configure-aws-credentials]: https://github.com/aws-actions/configure-aws-credentials

#### Workflow Secrets for `terraform-tests`

| Secret             | Description                                                                                                                                               |
| ------------------ | --------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `WORKFLOWS_TOKEN`  | A custom GitHub PAT Token used to access this reusable workflow repository if `GITHUB_TOKEN` cannot access; falls back to `GITHUB_TOKEN` if not provided. |
| `GITHUB_TOKEN`     | The standard GitHub PAT Token needed to interact with the local GitHub Repository being tested.                                                           |
