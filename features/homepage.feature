Feature: Homepage
  Everything a visitor reads comes from the YAML content layer in
  src/content, so these scenarios assert the page against the same files
  the site renders from — if content and page ever disagree, they fail.

  Scenario: The hero introduces Andrew from the content files
    Given I open the homepage
    Then the page title contains "Andrew Galvin"
    And the hero shows the name and eyebrow from the content files
    And the hero stats finish counting to their configured values

  Scenario: Identity appears consistently everywhere it is published
    Given I open the homepage
    Then the contact email on the page matches site.yaml
    And the structured data matches the identity in site.yaml
    And every resume link on the page points at the same PDF from site.yaml

  Scenario: Visitors who prefer reduced motion get final values immediately
    Given I prefer reduced motion
    When I open the homepage
    Then the hero stats show their final values without animating
