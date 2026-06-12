Feature: Contact form
  The form posts to Netlify Forms. Validation happens in the browser,
  delivery is platform-side, and no failure may ever strand a visitor
  without a way to reach Andrew directly.

  Background:
    Given I open the homepage with animations off

  Scenario: Submitting an empty form points at the first problem
    When I submit the contact form without filling anything
    Then I see the form message "Please fill in your name."
    And the name field is marked invalid and focused

  Scenario: Fixing a field clears its error as the visitor types
    When I submit the contact form without filling anything
    And I start typing my name
    Then the name field is no longer marked invalid

  Scenario: A mistyped email is caught before anything is sent
    When I fill the form but mistype the email address
    And I submit the contact form
    Then I see the form message "Please enter a valid email."
    And no submission was sent

  Scenario: A successful submission thanks the visitor
    Given the form endpoint will accept the submission
    When I fill in a valid message and submit
    Then I see a thank-you confirmation
    And the submission was posted with the registered field names

  Scenario: A failed submission still gives the visitor a way to reach Andrew
    Given the form endpoint is unavailable
    When I fill in a valid message and submit
    Then I see an apology that includes Andrew's direct email address

  Scenario: A bot that fills the hidden honeypot field is quietly ignored
    When a bot fills every field including the hidden one and submits immediately
    Then the form pretends the message was sent
    And no submission was sent
