Feature: Navigation
  The header carries visitors to each section, and the mobile menu keeps
  the accessibility contract it advertises: truthful aria-expanded, Escape
  to close, and focus that never gets lost.

  Scenario: Jumping to a section from the header
    Given I open the homepage
    When I click the "Contact" link in the header
    Then the contact section is scrolled into view
    And the "Contact" nav link is highlighted as active

  Scenario: The mobile menu honors its accessibility contract
    Given I open the homepage on a phone-sized screen
    When I open the menu
    Then the menu button reads "Close" and reports expanded
    And focus moves to the first link in the menu
    When I press Escape
    Then the menu closes and focus returns to the menu button

  Scenario: Choosing a destination closes the mobile menu
    Given I open the homepage on a phone-sized screen
    When I open the menu
    And I click the "About" link in the menu
    Then the menu is closed
    And the about section is scrolled into view
