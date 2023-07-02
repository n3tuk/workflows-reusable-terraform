const fs = require("fs");

module.exports = ({ github, context, core, inputs }) => {
  // Put out notices based the state of the init job
  if (inputs.init != "success") {
    if (inputs.init == "failure") {
      var log = fs.readFileSync("/tmp/terraform.init.log", "utf8").toString();

      message =
        "## Terraform Status Report\n\n" +
        "GitHub Actions has run the [`terraform-checks`][terraform-checks] Workflow " +
        "against your pull request, but has **failed** to run [`terraform init " +
        "-backend=false`][init] against the " + inputs.type + " **" + inputs.name + "**. " +
        "Expand on the following summary to see the results from this command:\n\n" +
        "<details>\n" +
        "<summary><code>terraform init</code> Log</summary>\n\n" +
        "```\n" +
        log +
        "\n" +
        "```\n" +
        "</details>\n\n" +
        "[init]: https://www.terraform.io/cli/commands/init\n";
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

      core.setFailed("terraform init Failed. Stopping further processing.");
    } else {
      core.info("terraform init Step outcome was " + inputs.init);
    }
  }
};
