# UKHSA Standards Template Repository

Welcome to the UKHSA standards template repository.
This is a template repository that can be used by teams at UKHSA to create their own standards documentation and have
them published on the [UKHSA Engineering Standards website][1].

## Purpose

The purpose of this repository is to provide a template teams can use to define their own technical standards related to
their area of work.
This repository is pre-configured with tools, configurations, and workflows to check that the documentation conforms to
the necessary standards to be published.

## Using this repository

1. Navigate to [this repository][2] on GitHub
1. Click the *"Use this template"* button to create a new repository.

Or, when creating a new repository on GitHub, choose this repository in the dropdown box next to the
*"Start with a repository"* option.

Once you have created a new repository from this template, you can then start adding documentation to the `docs/`
directory.

### Repository Setup

After creating a new repository based on this template, please undertake the following steps:

1. Replace the template specific parts of this readme file with suitable readme documentation for your new repository.
1. Rename `docs/your-standards.11tydata.json`, replacing the `your-standards` part with the name to be used when
   published.
1. Run `npm install` from the root of this repository to install the dev dependencies.
1. Update the `CONTRIBUTING.md` guidelines to meet your expectations for contributors. This file is currently written
   for the audience of the template repository so will need to changed.

### Creating your documentation

All your documentation should be written in Markdown in the `docs/` directory.
The documentation is published using [Eleventy][3] along with the [UK Gov Eleventy Plugin][4] for styling.

A basic `index.md` is provided which can be modified to provide the index page for your documentation.
At present, the `your-standards.11tydata.json` file is also provided which sets some common [front matter][5] for the pages
of documentation so that they are displayed in a [sub-navigation layout][6].
Of course if you want to use a different layout, you can.

### Committing your documentation

When committing your documentation, assuming you have successfully run `npm install` from the repository setup steps,
you will be provided with a commit message template with instructions on how to commit correctly.
If your commit message doesn't conform to the expectations described in the template your commit will be flagged as
having failed a build step by a commit linting GitHub action which runs whenever a commit is pushed to GitHub.
Please fix any failing commits!

Additionally on commit, a `pre-commit` hook runs to check that the documentation in the `docs/` directory conforms to
our predefined markdown formatting standards.
If it doesn't, then the commit will fail meaning you will need to fix the issues before creating the commit.
The output of the `pre-commit` hook will tell you what is wrong so you can manually fix issues, however, you can also
use the same tool which provides this linting to fix the issues:

```bash
# this is the pre-commit hook which runs to check if your markdown conforms
npm run lint:md

# if you have issues you can run this command to fix the problems automatically
npm run fmt:md
```

### Publishing your documentation

Ultimately, your documentation will be published to [the UKHSA engineering standards site][1].
Once configured correctly, this publishing is managed automatically through a GitHub action and the [standards-org][7]
repository.

To set up automatically publishing:

1. Contact a member of the [Org Standards Admins][8] team, and they will add your repository to the repo.

   *OR*

   Create a pull request on the repo yourself, and then a member of the [Org Standards Admins][8] team will review and
   merge.
1. Get your repository configured for access to the following org-level secrets so that they can be used in the
   publishing workflow:
   - `UKHSA_STANDARDS_PUBLISH_DISPATCH_APP_CLIENT_ID`
   - `UKHSA_STANDARDS_PUBLISH_DISPATCH_APP_PRIVATE_KEY`
   - `UKHSA_STANDARDS_PUBLISH_DISPATCH_SHARED_HMAC_KEY`

After these two things are configured, you can publish by merging changes to the `main` branch in your docs repository.
Upon new commits being added to `main`, the [publishing workflow][9] will run, triggering the publishing workflow on the
standards-org repository to build and publish the changes.
At present, this standards-org publishing workflow requires manual sign off before it will complete.
This is to ensure changes made while this new process is bedded in are correct and valid, but we may remove it in the
future to allow teams to publish automatically without any manual intervention.

## Local Publishing

To see how your docs look locally before publishing them you can use this handy script:

```bash
npm run serve
```

This uses docker to host your docs under the hood.
After running this script you can view your docs by going to [http://localhost:8080/your-standards/][10], replacing
`your-standards` with the path you specified previously.
This script will automatically work out the path based on the 11ty data config file in `docs/`.

While this script is running it will notice when files change and update them so you can see how they look live.

## Contributing

We welcome contributions to improve these guidelines. Please read our [Contributing Guidelines][11] for
details on how to get involved.

## Licence

Unless stated otherwise, the codebase is released under [the MIT License][12].
This covers both the codebase and any sample code in the documentation.

The documentation is [© Crown copyright][13] and available under the terms
of the [Open Government 3.0][14] licence.

## Contact

TODO

[1]: https://ukhsa-collaboration.github.io/standards-org/
[2]: https://github.com/ukhsa-collaboration/standards-template
[3]: https://www.11ty.dev
[4]: https://github.com/x-govuk/govuk-eleventy-plugin
[5]: https://www.11ty.dev/docs/data-frontmatter/
[6]: https://x-govuk.github.io/govuk-eleventy-plugin/layouts/sub-navigation/
[7]: https://github.com/ukhsa-collaboration/standards-org
[8]: https://github.com/orgs/ukhsa-collaboration/teams/org-standards-admins
[9]: .github/workflows/publish-guidelines.yml
[10]: http://localhost:8080/your-standards/
[11]: CONTRIBUTING.md
[12]: LICENCE
[13]: https://www.nationalarchives.gov.uk/information-management/re-using-public-sector-information/uk-government-licensing-framework/crown-copyright/
[14]: https://www.nationalarchives.gov.uk/doc/open-government-licence/version/3/
