const fs = require("fs");

module.exports = ({ github, context, core, inputs }) => {
  // Put out notices based the state of the valiate and format jobs
  if (inputs.validate == "failure" || inputs.fmt == "failure") {
    message =
      "### Terraform Status Report\n\n" +
      "GitHub Actions has run the [`terraform-checks`][terraform-checks] Workflow " +
      "against your pull request, and, after a successful [`init`][init] step, it " +
      "has **failed** when running ";

    if (inputs.validate == "failure") {
      message +=
        "[`terraform validate`][validate] ";
    }

    if (inputs.fmt == "failure") {
      if (inputs.validate == "failure") {
        message += "and ";
      }
      message +=
        "[`terraform fmt`][fmt] ";
    }

    message += "against the " + inputs.type + " **" + inputs.name + "**. " +
      "Expand on the following ";

    if (inputs.validate == "failure" && inputs.fmt == "failure") {
      message += "summaries ";
    } else {
      message += "summary";
    }

    message += "to see the results from ";

    if (inputs.validate == "failure" && inputs.fmt == "failure") {
      message += "these commands:\n\n";
    } else {
      message += "this command:\n\n";
    }

    if (inputs.validate == "failure") {
      message +=
        "<details>\n" +
        "<summary><code>terraform validate</code> Output</summary>\n\n" +
        "```hcl\n" +
        fs.readFileSync("/tmp/terraform.validate.log", "utf8").toString() +
        "\n" +
        "```\n" +
        "</details>\n\n";
    }

    if (inputs.fmt == "failure") {
      message +=
        "<details>\n" +
        "<summary><code>terraform fmt</code> Output</summary>\n\n" +
        "```diff\n" +
        fs.readFileSync("/tmp/terraform.fmt.log", "utf8").toString() +
        "\n" +
        "```\n" +
        "</details>\n\n";
    }

    message += "" +
      "[init]: https://www.terraform.io/cli/commands/init\n";
      "[fmt]: https://www.terraform.io/cli/commands/fmt\n";
      "[validate]: https://www.terraform.io/cli/commands/validate\n";
      "[checks]: https://github.com/n3tuk/workflows-reusable-terraform/blob/.github/workflows/terraform-checks.yaml\n\n";

    // Add HTML comment to allow the comment to be hidden if the Action is
    // re-run so that only the latest comment can be shown, but we retain the
    // history of all the runs for this Pull Request
    message += "<!-- terraform-status-report -->";

    github.rest.issues.createComment({
      owner: context.repo.owner,
      repo: context.repo.repo,
      issue_number: context.issue.number,
      body: message,
    });
  }

  // Add notices to the action output as well
  if (inputs.validate == "failure") {
    core.setFailed("terraform validate Failed. Stopping further processing.");
  } else if (inputs.validate != "success") {
    core.info("terraform validate Step outcome was " + inputs.validate);
  }

  if (inputs.fmt == "failure") {
    core.setFailed("terraform fmt Failed. Stopping further processing.");
  } else if (inputs.fmt != "success") {
    core.info("terraform fmt Step output was " + inputs.fmt);
  }
};
