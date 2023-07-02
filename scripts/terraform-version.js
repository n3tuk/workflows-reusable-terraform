const fs = require('fs')

module.exports = ({core, src}) => {
  const version_re = new RegExp(/^\d+\.\d+\.\d+$/)
  const version_file = `${src}/.terraform-version`
  core.info('Looking for Terraform version file at' + version_file)

  try {
    var version = fs.readFileSync(version_file,'utf8').toString().trim()
  } catch (e) {
    core.setFailed('The .terraform-version file does not exist. Cannot set version.')
    return
  }

  if (!version_re.test(version)) {
    core.setFailed('The .terraform-version file does not contain a valid value: ' + version)
    return
  }

  core.info('Terraform version set to v' + version)
  core.setOutput('version', version)
}
