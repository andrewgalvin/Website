Feature: Projects from content files
  Adding or removing a project is a YAML edit in src/content/projects.yaml.
  The page must follow the file — every entry, in both the featured list
  and the archive, with safe external links.

  Scenario: Every featured project in projects.yaml is on the page
    Given I open the homepage with animations off
    Then each featured project from projects.yaml appears with its title and tags

  Scenario: The archive renders every earlier project
    Given I open the homepage with animations off
    Then each archive entry from projects.yaml appears with its link or badge

  Scenario: Outbound project links open safely in a new tab
    Given I open the homepage with animations off
    Then every external link in the projects section opens a new tab without leaking the opener
