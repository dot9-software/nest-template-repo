What's included:

- NestJS
  - With Swagger and TypeORM
- Testing Suite
  - Script to spin up a temporary database for the unit tests (scripts/init-test-db.sh)
  - Jest, Supertest, and TypeORM-Fixtures for seeding the test database
- GH Workflow for CI
  - Runs the unit tests
  - Runs the linter
  - Runs a test build

## Package scripts

- `db:diagram` generates an UML diagram based on the TYPEORM entities
