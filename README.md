# NestJS DDD Playground

> A NestJS app to experiment with Domain Driven Design, beyond the usual "Todo App" scenario

To try and improve my understanding of Domain Driven Design in a more real-world style example, this repository builds an imaginary "expense management platform" for submitting expense claims, reviewing them, approving them, or escalating them.

* An **Expense Claim** consists of one or more **Expense Line Items**.
* Each **Expense Line Item** includes details like a description, amount, currency, and potentially an expense category or type.
* **Expense Approvers** review submitted **Expense Claims**. For each **Expense Line Item**, they will decide to either **Approve** it or **Escalate** it for further review.
* The review process is all-or-nothing: **Expense Approvers** must make a decision for every Expense Line Item on the **Expense Claim** before they can **Submit the Approval**. There's no partial submission or draft state for this stage.
* Once an **Expense Claim** review is submitted, the system automatically creates an **Escalated Line Item** task for each **Expense Line Item** that was marked for escalation. If all items are approved, no such tasks are created.
* A secondary group of users, such as **Finance Reviewers**, will then review these **Escalated Line Items** and make a final decision on them.
* All users involved (**Expense Approvers** and **Finance Reviewers**) can add notes. These notes can be at the overall **Expense Claim** level, or specific to an **Expense Line Item** when it's being Escalated (this would be an **Escalation Reason**).